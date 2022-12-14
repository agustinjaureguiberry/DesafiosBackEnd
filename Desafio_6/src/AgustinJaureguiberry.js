// Importa librerias
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const {Router} = express
const handlebars = require('express-handlebars')
const api = express()
const port = 8080
const fs = require('fs')

class Productos {
    constructor(archivo) {
        this.archivo = archivo;
        this.format = "utf-8"
    }

    async save(obj) {
        let array = []
        let id = 1
        let data = {}
        try {
            if (fs.existsSync(this.archivo)) {
                array = JSON.parse(await fs.promises.readFile(this.archivo, this.format))
                const [ultimoProd] = array.slice(-1)
                id = ultimoProd.id + 1,
                data = { ...obj, id },
                array.push(data),
                await fs.promises.writeFile(this.archivo, JSON.stringify(array))
            } else {
            data = { ...obj, id },
            array.push(data),
            await fs.promises.writeFile(this.archivo, JSON.stringify(array))
            } 
            return id
        } catch {
            console.log("Algo salio mal")
        }
    }



    async getById(num) {
        let array = []
        try {
            array = JSON.parse(await fs.promises.readFile(this.archivo, this.format))
            const prod = array.find((e) => e.id === num)
            if (prod) {
                return prod
            } else {
                return null
            }
        } catch {
            return null
        }

    }

    async getAll() {
        let array = []
        try {
            array = JSON.parse(await fs.promises.readFile(this.archivo, this.format))
            return array
        } catch {
            return array
        }
    }

    async DeleteById(id) {
        let array = []
        try {
            array = JSON.parse(await fs.promises.readFile(this.archivo, this.format))
            let newArray = array.filter((e) => e.id !== id)
            await fs.promises.writeFile(this.archivo, JSON.stringify(newArray))
        } catch {
            console.log("Error, no se encontro el producto")
        }
    }

    async deleteAll() {
        let array = []
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify(array))
        } catch {
            console.log("Error, no se encontro archivo")
        }
    }

}

class Mensajes {
    constructor(archivo) {
        this.archivo = archivo;
        this.format = "utf-8"
    }

    async save(obj) {
        let array = []
        let data = {}
        try {
            if (fs.existsSync(this.archivo)) {
                array = JSON.parse(await fs.promises.readFile(this.archivo, this.format))
                const [ultimoMen] = array.slice(-1)
                data = { ...obj },
                array.push(data),
                await fs.promises.writeFile(this.archivo, JSON.stringify(array))
            } else {
            data = { ...obj},
            array.push(data),
            await fs.promises.writeFile(this.archivo, JSON.stringify(array))
            } 
            return data
        } catch {
            console.log("Algo salio mal")
        }
    }

    async getAll() {
        let array = []
        try {
            array = JSON.parse(await fs.promises.readFile(this.archivo, this.format))
            return array
        } catch {
            return array
        }
    }
}


// Definicion de variables

const productos = new Productos("./db/productos.txt", fs)
const rutaProductos = Router()
const mensajes = new Mensajes("./db/mensajes.txt", fs)

// Lineas de utilizacion de json e index.html

api.use(express.json())
api.use(express.urlencoded({ extended: true }))
api.use(express.static(__dirname + '/views'))
api.use('/', rutaProductos)
api.engine('hbs', handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views'
}))

// Configuracion de servidor
const httpServer = new HttpServer(api)
const io = new IOServer(httpServer)


// Definicion de Routes

rutaProductos.get('/:id', (peticion, respuesta) => {
    const id = parseInt(peticion.params.id)
    const prod = productos.getById(id)
    if (prod) {
        respuesta.json(prod)
    } else {
        respuesta.json({error: 'producto no encontrado'})
    }

})

rutaProductos.put('/:id', (peticion, respuesta) => {
    const id = parseInt(peticion.params.id)
    const newProd = peticion.body
    productos.replaceById(id, newProd)
    respuesta.send(`Producto con id ${id} modificado con exito.`)
})

rutaProductos.delete('/:id', (peticion, respuesta) => {
    const id = parseInt(peticion.params.id)
    productos.deleteById(id)
    respuesta.json(productos.getAll())
})

api.set('views', __dirname + '/views')
api.set('view engine', 'hbs')

api.get('/', (peticion, respuesta) => {
    respuesta.render('formulario', {titulo: 'Formulario', productos: productos.getAll()})
})

api.get('/productos', (peticion, respuesta) => {
    respuesta.render('productos')
})



//Levanta servidor

httpServer.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${httpServer.address().port}`)
} )

//Definicion de sockets
io.on('connection', async socket => {
    console.log('Un cliente se ha conectado')

    //Envio mensajes anteriores a nueva conexion

    socket.emit('Nueva-conexion', await productos.getAll(), await mensajes.getAll());


    //Recibo nuevo mensaje
    socket.on('nuevoMensaje',async mensaje =>{
        await mensajes.save(mensaje)
        .then((m) => {
            io.sockets.emit('nuevoMensaje', mensaje)
        })
    })

    socket.on('nuevoProducto', async producto =>{
        await productos.save(producto)
            .then((id) => {
            io.sockets.emit('nuevoProducto', { id , ...producto })})
        })
})

