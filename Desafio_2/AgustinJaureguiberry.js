class Contenedor {
    constructor(archivo) {
        this.archivo = archivo;
        this.format = "utf-8"
    }

    async save(obj) {
        let array = []
        let id = 1
        let data = {}
        try {
            array = JSON.parse(await fs.promises.readFile(this.archivo, this.format))
            const [ultimoProd] = array.slice(-1)
            id = ultimoProd.id + 1
            data = { ...obj, id }
            array.push(data)
            await fs.promises.writeFile(this.archivo, JSON.stringify(array))
            return id
        } catch {
            data = { ...obj, id }
            array.push(data)
            await fs.promises.writeFile(this.archivo, JSON.stringify(array))
            return id
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
            console.log("No hay productos aun cargados.")
        }

    }

    async getAll() {
        let array = []
        try {
            array = JSON.parse(await fs.promises.readFile(this.archivo, this.format))
            return array
        } catch {
            console.log("Error, no hay productos aun")
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

const fs = require('fs')

const productos = new Contenedor("./productos.txt", fs)









//Prueba de desafio

let auto1 = {
    marca: "Ford",
    precio: 4000,
}

let auto2 = {
    marca: "Chevrolet",
    precio: 5000,
}

let auto3 = {
    marca: "Renault",
    precio: 3000,
}

let auto4 = {
    marca: "VolksWagen",
    precio: 4000,
}



const funcion = async () => {

    //LLAMADO A FUNCION PARA CARGAR PRODUCTOS

    await productos.save(auto1)
        .then((e) => {
            console.log(`Producto con ID: ${e}`)
        })

    await productos.save(auto2)
        .then((e) => {
            console.log(`Producto con ID: ${e}`)
        })
    await productos.save(auto3)
        .then((e) => {
            console.log(`Producto con ID: ${e}`)
        })

    await productos.save(auto4)
        .then((e) => {
            console.log(`Producto con ID: ${e}`)
        })


    //LLAMADO A FUNCION PARA MOSTRAR PRODUCTO ENCONTRADO
    await productos.getById(2)
        .then((e) => {
            if (e !== null) {
                console.log("Producto encontrado")
                console.log(e)
            } else {
                console.log("Producto no encontrado")
            }
        })


    //LLAMADO A FUNCION PARA MOSTRAR TODOS LOS PRODUCTOS
    await productos.getAll()
        .then((e) => {
            console.log("Productos cargados:")
            e.forEach((el) => {
                console.log(el)
            })
        }
        )

    //LLAMADO A FUNCION PARA BORRAR PRODUCTO POR ID
    await productos.DeleteById(3)
        .then(console.log("Producto eliminado con exito"))


    //LLAMADO A FUNCION PARA BORRAR TODOS LOS PRODUCTOS
    await productos.deleteAll()
        .then(console.log("Todos los productos eliminados"))

}


funcion()

