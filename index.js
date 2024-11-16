const camisetas = [
    { id: 1, nombre: "Rosario Central", img: "./img/rosariocentral.png", precio: 150000, stock: 500 },
    { id: 2, nombre: "River", img: "./img/river.png", precio: 60000, stock: 5600 },
    { id: 3, nombre: "Boca", img: "./img/boca.png", precio: 5000, stock: 2 },
    { id: 4, nombre: "Belgrano", img: "./img/belgrano.png", precio: 45000, stock: 300 },
    { id: 5, nombre: "Estudiante", img: "./img/estudiante.png", precio: 25000, stock: 250 },
    { id: 6, nombre: "Independiente", img: "./img/independiente.png", precio: 75000, stock: 450 }
];

const contenedorDeTarjetas = document.getElementById("productos-container");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function mostrarProductos() {
    contenedorDeTarjetas.innerHTML = "";
    camisetas.forEach(producto => {
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
                <p>Stock: ${producto.stock}</p>
                <div class="btn">
                <button class="boton" onclick="agregarCarrito(${producto.id})">Agregar</button>
                </div>
                </div>`;
        contenedorDeTarjetas.appendChild(nuevaCamiseta);
    });
}
function agregarCarrito(id) {
    const producto = camisetas.find(item => item.id === id);
    const productoEnCarrito = carrito.find(item => item.id === id);

    if (producto.stock > 0) {
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        producto.stock--;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        localStorage.setItem("camisetas", JSON.stringify(camisetas));
        actualizarCarrito();
        mostrarProductos(camisetas);
    } else {
        alert("No hay más stock disponible para este producto.");
    }
}
function actualizarCarrito() {
    const cuentaCarritoElement = document.getElementById("cuenta-carrito");
    const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    cuentaCarritoElement.innerText = totalUnidades;
}
mostrarProductos();
actualizarCarrito();
