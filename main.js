const productosIniciales = [
    { id: 1, nombre: "Cerveza Grande (Fría)", precio: 200, cat: "frias" },
    { id: 2, nombre: "Rum / Botella 750ml", precio: 550, cat: "frias" },
    { id: 3, nombre: "Plátanos Verdes (Unidad)", precio: 25, cat: "viveres" },
    { id: 4, nombre: "Salami Induveca (1lb)", precio: 160, cat: "viveres" },
    { id: 5, nombre: "Arroz Selecto (2lb)", precio: 90, cat: "provisiones" }
];

let productos = productosIniciales;

document.addEventListener("DOMContentLoaded", () => {
    renderProductos(productos);
});

let carrito = [];

function renderProductos(lista) {
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";
    
    lista.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${prod.nombre}</h3>
            <p class="precio">RD$ ${prod.precio}</p>
            <button class="btn-agregar" onclick="agregarAlCarrito(${prod.id})">
                + Agregar al Pedido
            </button>
        `;
        contenedor.appendChild(card);
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const existe = carrito.find(item => item.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const cartCount = document.getElementById("cart-count");
    const itemsCarrito = document.getElementById("items-carrito");
    const totalPrecio = document.getElementById("total-precio");

    cartCount.innerText = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    itemsCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const div = document.createElement("div");
        div.className = "item-carrito";
        div.innerHTML = `
            <div><strong>${item.nombre}</strong> (x${item.cantidad})</div>
            <div>RD$ ${subtotal} <button onclick="eliminarDelCarrito(${item.id})">❌</button></div>
        `;
        itemsCarrito.appendChild(div);
    });

    totalPrecio.innerText = `RD$ ${total}`;
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarritoUI();
}

const modalCarrito = document.getElementById("modal-carrito");
document.getElementById("btn-carrito").onclick = () => modalCarrito.style.display = "flex";
function cerrarModalCarrito() { modalCarrito.style.display = "none"; }