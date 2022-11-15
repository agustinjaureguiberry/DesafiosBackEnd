const express = require('express')
const {Router} = express
const handlebars = require('express-handlebars')
const Swal = require('sweetalert2')
const api = express()
const port = 8080



class Productos {
    constructor(productos) {
        this.productos = productos
    }

     save(objet) {
        let id = 1;
        this.productos.forEach((e) => {
            if (e.id >= id) {
                id = e.id + 1
            }
        })
        objet.id = id
        this.productos.push(objet) 
        return id
    }

     getById(id) {
        let prod = this.productos.find((e) => e.id == id)
        return prod
    }

     getAll() {
        return this.productos
    }

     deleteById(id) {
        this.productos.forEach((e,i) => {
            if (e.id == id) {
                this.productos.splice(i, 1)
            }
        })
    }

     replaceById(id, newProd) {
        let index = -1
        this.productos.forEach((e,i) => {
            if (e.id == id) {
                index = i
            }
        })
        if (index != -1) {
            this.productos[index] = {...newProd, id}
        } else {
            console.log('no se encontro producto pa reemplazar')
        }        
    }
}

// Definicion de variables
const productos = new Productos([])
const rutaProductos = Router()

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

// Definicion de Routes

rutaProductos.get('/productos', (peticion, respuesta) => {
    respuesta.render('productos', {titulo: 'Productos', productos: productos.getAll()})
})
productos.lenght

rutaProductos.post('/productos',  (peticion, respuesta) => {
    productos.save(peticion.body)
    respuesta.render('formulario', {titulo: 'Formulario'})
})

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
// rutaProductos.get('/api/productos/:id', (peticion, respuesta) => {
//     respuesta.send('ok')
// })

api.set('views', './views')
api.set('view engine', 'hbs')
api.get('/', (peticion, respuesta) => {
    respuesta.render('formulario', {titulo: 'Formulario'})
})
api.get('/productos', (peticion, respuesta) => {
    respuesta.render('productos')
})



const servidor = api.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${servidor.address().port}`)
})

servidor.on('error', error => console.log(`Ha ocurrido un error: ${error}`))

