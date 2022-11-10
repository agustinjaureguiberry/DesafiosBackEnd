
class Usuario {
    constructor(nombre, apellido) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = [];
        this.mascotas = [];
    }


    getFullName() {
        return (`Usuario: ${this.apellido} ${this.nombre}`)
    }

    addMascota(nuevaMasc) {
        this.mascotas.push(nuevaMasc)
    }
    countMascota() {
        return this.mascotas.length
    }
    addBook(nombre, autor) {
        this.libros.push({
            nombre: nombre,
            autor: autor,
        })
    }

    getBookName() {
        let nombres = this.libros.map((e) => e.nombre)
        // this.libros.forEach((e) => {
        //     nombres.push(parseInt(e.nombre))
        // })
        return nombres

    }
}


const usuario1 = new Usuario("Agustin", "Jaureguiberry")

usuario1.addMascota("Bonie")
usuario1.addMascota("Procer")


usuario1.addBook("1984", "George Orwell")
usuario1.addBook("Cien años de soledad", "Gabriel Garcia Marquez")
usuario1.addBook("Diario de Ana Frank", "Ana Frank")



console.log(usuario1.getFullName())
console.log(usuario1.countMascota())
console.log(usuario1.getBookName())