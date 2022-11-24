const socket = io.connect();

const renderMsj = (mensajes) => {
    const fecha = new Date(Date.now()).toLocaleString()
    const html = mensajes.map((e, i) => {
        return (`<div class='mensaje'>
        <strong>${e.usuario}</strong> (${fecha}): <i>${e.texto}</i>
        </div>`)
    }).join(' ')
    document.getElementById('mensajes').innerHTML = html
}


const renderProductos = (productos) => {
    const producto = productos.map((e) => {
        return (`
        <tr>
        <th scope="row">${e.id}</th>
        <td>${e.Title}</td>
        <td>${e.Price}</td>
        <td><img src="${e.Thumbnail}" alt="Img de producto"></td>
        </tr>
        `)
    }).join(' ')
    document.getElementById('productos').innerHTML = producto
}

const renderMsjUnico = (mensaje) => {
    const fecha = new Date(Date.now()).toLocaleString()
    const html = document.createElement('div')
    html.className = "mensaje"
    html.innerHTML = `<strong>${mensaje.usuario}</strong> (${fecha}): <i>${mensaje.texto}</i>`
    document.getElementById('mensajes').appendChild(html)
}

const renderProductoUnico = (producto) => {
    const html = document.createElement('tr')
    html.innerHTML=`<th scope="row">${producto.id}</th>
        <td>${producto.Title}</td>
        <td>${producto.Price}</td>
        <td><img src="${producto.Thumbnail}" alt="Img de producto"></td>`
    console.log(html)
    document.getElementById('productos').appendChild(html)
}

socket.on('Nueva-conexion', (productos, mensajes) => {
    renderProductos(productos)
    renderMsj(mensajes)
})

socket.on('nuevoMensaje', (mensaje) => {
    renderMsjUnico(mensaje)
})

socket.on('nuevoProducto', (producto) => {
    renderProductoUnico(producto)
})


const addMensajes = (e) =>{
    const usuario = document.getElementById('email').value
    if (usuario) {
        const mensaje = {
            usuario,
            texto: document.getElementById('msj').value
        }
        socket.emit('nuevoMensaje', mensaje)
        document.getElementById('msj').value = ''
        return false
    }
    else {
        alert('Debe ingresar un email correcto')
        return false
    }

}

const addProductos = (e) =>{
    const producto = {
        Title: document.getElementById('Title').value,
        Price: document.getElementById('price').value,
        Thumbnail: document.getElementById('Thumbnail').value
    }
    socket.emit('nuevoProducto', producto)
    return false
}