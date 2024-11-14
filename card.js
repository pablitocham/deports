const contenedorDeTarjetas = document.getElementById("productos-container");
const precioElement = document.getElementById("precio-f");
const cantidadElement = document.getElementById("unidades");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let camisetas = JSON.parse(localStorage.getItem("camisetas")) || [];

function mostrarProductos() {
    contenedorDeTarjetas.innerHTML = "";
    if (carrito.length > 0) {
        carrito.forEach(producto => {
            const precioFormateado = new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS'
            }).format(producto.precio);
            const nuevaCamiseta = document.createElement("div");
            nuevaCamiseta.classList.add("tarjeta-productos");
            nuevaCamiseta.innerHTML = `
                <div>
                    <h2>${producto.nombre}</h2>
                    <img src="${producto.img}" alt="${producto.nombre}" />
                    <p>${precioFormateado}</p> <!-- Mostrar el precio formateado -->
                    <p>Cantidad: ${producto.cantidad}</p>
                    <button class="boton" onclick="modificarCantidad(${producto.id}, 1)">Agregar</button>
                    <button class="boton" onclick="modificarCantidad(${producto.id}, -1)">Restar</button>
                </div>`;
            contenedorDeTarjetas.appendChild(nuevaCamiseta);
        });
    } else {
        contenedorDeTarjetas.innerHTML = "<p>No hay productos en el carrito</p>";
    }
    actualizarTotales();
}
function modificarCantidad(id, cambio) {
    const producto = carrito.find(item => item.id === id);
    const productoOriginal = camisetas.find(item => item.id === id);
    if (producto && productoOriginal) {
        producto.cantidad += cambio;
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(item => item.id !== id);
        } else {
            productoOriginal.stock -= cambio;
        }
        actualizarLocalStorage();
        mostrarProductos();
        actualizarCarrito();
    } else {
        alert("No hay más stock disponible para este producto.");
    }
}
document.getElementById("confirmar").addEventListener("click", () => {
    if (carrito.length > 0) {
        Swal.fire({
            title: `Gracias por su compra`,
            icon: `success`
        }).then(() => {
            carrito = [];
            actualizarLocalStorage();
            mostrarProductos();
            actualizarCarrito();
            window.location.href = "index.html"
        })
    } else {
        Swal.fire({
            title: "Para comprar debes agregar Productos",
            icon: `warning`
        })
    }
});

document.getElementById("reiniciar").addEventListener("click", () => {
    if (carrito.length > 0) {
        Swal.fire({
            title: `¿Estas seguro de reiniciar compra?`,
            showCancelButton: true,
            confirmButtonText: `Sí, deseo reiniciar`,
            cancelButtonText: `No reiniciar`,
        }).then((result) => {
            if (result.isConfirmed) {
                carrito.forEach(producto => {
                    const productoOriginal = camisetas.find(item => item.id === producto.id);
                    productoOriginal.stock += producto.cantidad;
                });
                carrito = [];
                actualizarLocalStorage();
                mostrarProductos();
                actualizarCarrito();
                Swal.fire({
                    title: `Compra reiniciada`,
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: `Reinicio de compra Cancelado`
                })
            }
        })
    } else {
        Swal.fire({
            title: `Carrito, Vacio`,
            text: `No hay productos para reiniciar`,
        })
    }
});

function actualizarTotales() {
    const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const totalPrecio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const precioFormateado = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(totalPrecio);
    cantidadElement.innerText = totalUnidades;
    precioElement.innerText = precioFormateado; 
}

function actualizarCarrito() {
    const cuentaCarritoElement = document.getElementById("cuenta-carrito");
    const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    cuentaCarritoElement.innerText = totalUnidades;
}

function actualizarLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("camisetas", JSON.stringify(camisetas));
}

mostrarProductos();
actualizarCarrito();
