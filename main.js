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

function renderProductos(lista) {
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";
    
    lista.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${prod.nombre}</h3>
            <p class="precio">RD$ ${prod.precio}</p>
            <button class="btn-agregar">
                + Agregar al Pedido
            </button>
        `;
        contenedor.appendChild(card);
    });

    function filtrarProductos(categoria) {
    document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (categoria === 'todos') {
        renderProductos(productos);
    } else {
        const filtrados = productos.filter(p => p.cat === categoria);
        renderProductos(filtrados);
    }
}
}