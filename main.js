// Base de datos expandida de productos
const productosIniciales = [
    // Frías y Bebidas
    { id: 1, nombre: "Cerveza Grande (Fría)", precio: 200, cat: "frias" },
    { id: 2, nombre: "Rum / Botella 750ml", precio: 550, cat: "frias" },
    { id: 3, nombre: "Refresco 2 Litros", precio: 100, cat: "frias" },
    { id: 4, nombre: "Jugo de Naranja 1L", precio: 120, cat: "frias" },
    { id: 5, nombre: "Fundita de Hielo", precio: 50, cat: "frias" },

    // Víveres y Víveres Frescos
    { id: 6, nombre: "Plátanos Verdes (Unidad)", precio: 25, cat: "viveres" },
    { id: 7, nombre: "Salami Induveca (1lb)", precio: 160, cat: "viveres" },
    { id: 8, nombre: "Queso de Freír (1lb)", precio: 220, cat: "viveres" },
    { id: 9, nombre: "Huevos (Cartón 30 uds)", precio: 250, cat: "viveres" },
    { id: 10, nombre: "Yuca (1lb)", precio: 35, cat: "viveres" },

    // Provisiones y Despensa
    { id: 11, nombre: "Arroz Selecto (2lb)", precio: 90, cat: "provisiones" },
    { id: 12, nombre: "Aceite Crisol (Medio Litro)", precio: 110, cat: "provisiones" },
    { id: 13, nombre: "Habichuelas Rojas (1lb)", precio: 75, cat: "provisiones" },
    { id: 14, nombre: "Lata de Guisantes / Maíz", precio: 65, cat: "provisiones" },
    { id: 15, nombre: "Café Molido (Saco Pequeño)", precio: 130, cat: "provisiones" },
    { id: 16, nombre: "Pan de Agua (Bolsa 6 uds)", precio: 50, cat: "provisiones" }
];

// Estado de la Aplicación
let productos = JSON.parse(localStorage.getItem("rodriguez_productos")) || productosIniciales;
let usuarios = JSON.parse(localStorage.getItem("rodriguez_usuarios")) || [
    { nombre: "Administrador", user: "admin", pass: "1234", rol: "admin" }
];
let usuarioActivo = JSON.parse(localStorage.getItem("rodriguez_sesion")) || null;
let esAdmin = usuarioActivo?.rol === "admin";
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
    actualizarEstadoSesion();
    renderProductos(productos);
});

// Renderizar Productos
function renderProductos(lista) {
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";
    
    lista.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card";
        
        let htmlContent = `
            <h3>${prod.nombre}</h3>
            <p class="precio">RD$ ${prod.precio}</p>
            <button class="btn-agregar" onclick="agregarAlCarrito(${prod.id})">
                + Agregar al Pedido
            </button>
        `;

        if (esAdmin) {
            htmlContent += `
                <div class="admin-actions">
                    <button class="btn-delete" onclick="eliminarProductoAdmin(${prod.id})">🗑️ Eliminar Producto</button>
                </div>
            `;
        }

        card.innerHTML = htmlContent;
        contenedor.appendChild(card);
    });
}

// Filtros
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

// Carrito de Compras
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

    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    cartCount.innerText = totalItems;

    itemsCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const div = document.createElement("div");
        div.className = "item-carrito";
        div.innerHTML = `
            <div>
                <strong>${item.nombre}</strong><br>
                RD$ ${item.precio} x ${item.cantidad}
            </div>
            <div>
                <strong>RD$ ${subtotal}</strong>
                <button onclick="eliminarDelCarrito(${item.id})" style="color:red; margin-left:8px; border:none; background:none; cursor:pointer;">❌</button>
            </div>
        `;
        itemsCarrito.appendChild(div);
    });

    totalPrecio.innerText = `RD$ ${total}`;
    calcularDevuelta();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarritoUI();
}

// Controles de Entrega y Cajero
function toggleDelivery(esDelivery) {
    const secDireccion = document.getElementById("sec-direccion");
    const inputDireccion = document.getElementById("direccion");
    
    if (esDelivery) {
        secDireccion.style.display = "block";
        inputDireccion.required = true;
    } else {
        secDireccion.style.display = "none";
        inputDireccion.required = false;
    }
}

function cambiarMetodoPago(metodo) {
    const secEfectivo = document.getElementById("sec-efectivo");
    const secTarjeta = document.getElementById("sec-tarjeta");
    const inputNum = document.getElementById("num-tarjeta");
    const inputExp = document.getElementById("exp-tarjeta");
    const inputCvc = document.getElementById("cvc-tarjeta");

    if (metodo === "Efectivo") {
        secEfectivo.style.display = "block";
        secTarjeta.style.display = "none";
        inputNum.required = inputExp.required = inputCvc.required = false;
    } else if (metodo === "Tarjeta") {
        secEfectivo.style.display = "none";
        secTarjeta.style.display = "block";
        inputNum.required = inputExp.required = inputCvc.required = true;
    } else { // Transferencia
        secEfectivo.style.display = "none";
        secTarjeta.style.display = "none";
        inputNum.required = inputExp.required = inputCvc.required = false;
    }
}

function calcularDevuelta() {
    const monto = parseFloat(document.getElementById("monto-pago").value) || 0;
    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const devuelta = monto - total;
    const txtDevuelta = document.getElementById("info-devuelta");

    if (devuelta >= 0 && monto > 0) {
        txtDevuelta.innerHTML = `Devuelta: <strong style="color: #28a745;">RD$ ${devuelta}</strong>`;
    } else if (monto > 0) {
        txtDevuelta.innerHTML = `<strong style="color: #dc3545;">Faltan RD$ ${Math.abs(devuelta)}</strong>`;
    } else {
        txtDevuelta.innerHTML = `Devuelta: <strong>RD$ 0</strong>`;
    }
}

// Enviar Pedido por WhatsApp
function enviarWhatsApp(e) {
    e.preventDefault();
    if (carrito.length === 0) return alert("El carrito está vacío.");

    const nombre = document.getElementById("nombre").value;
    const tipoEntrega = document.querySelector('input[name="tipo_entrega"]:checked').value;
    const direccion = document.getElementById("direccion").value;
    const metodoPago = document.querySelector('input[name="metodo_pago"]:checked').value;
    const montoPago = parseFloat(document.getElementById("monto-pago").value) || 0;
    
    const telefonoColmado = "18090000000"; // ⚠️ Reemplaza por el número real del colmado

    let total = 0;
    let mensaje = `👋 ¡Hola! Tengo un pedido para Colmado Rodríguez:\n\n`;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `• ${item.cantidad}x ${item.nombre} = RD$ ${subtotal}\n`;
    });

    mensaje += `\n💵 *Total a Pagar: RD$ ${total}*\n`;
    mensaje += `-----------------------------\n`;
    mensaje += `👤 *Cliente:* ${nombre}\n`;
    mensaje += `🛵 *Modalidad:* ${tipoEntrega}\n`;
    
    if (tipoEntrega === "Delivery") {
        mensaje += `📍 *Dirección:* ${direccion}\n`;
    }

    mensaje += `💳 *Método de Pago:* ${metodoPago}\n`;

    if (metodoPago === "Efectivo") {
        if (montoPago > 0) {
            const devuelta = montoPago - total;
            mensaje += `💰 *Paga con:* RD$ ${montoPago}\n`;
            mensaje += `🪙 *Llevar devuelta de:* RD$ ${devuelta > 0 ? devuelta : 0}\n`;
        } else {
            mensaje += `💰 *Paga con:* Efectivo exacto\n`;
        }
    } else if (metodoPago === "Tarjeta") {
        const numTarjeta = document.getElementById("num-tarjeta").value;
        const ultimosDigitos = numTarjeta.slice(-4) || "****";
        mensaje += `🔒 *Tarjeta terminada en:* **** ${ultimosDigitos}\n`;
    }

    mensaje += `\n¿Me lo confirman? 🚀`;

    window.open(`https://wa.me/${telefonoColmado}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

// Autenticación & Usuarios
function mostrarTab(tab) {
    const formLogin = document.getElementById("form-login");
    const formRegistro = document.getElementById("form-registro");
    const tabLoginBtn = document.getElementById("tab-login-btn");
    const tabRegistroBtn = document.getElementById("tab-registro-btn");

    if (tab === 'login') {
        formLogin.style.display = "flex";
        formRegistro.style.display = "none";
        tabLoginBtn.classList.add("active");
        tabRegistroBtn.classList.remove("active");
    } else {
        formLogin.style.display = "none";
        formRegistro.style.display = "flex";
        tabRegistroBtn.classList.add("active");
        tabLoginBtn.classList.remove("active");
    }
}

function procesarRegistro(e) {
    e.preventDefault();
    const nombre = document.getElementById("reg-nombre").value;
    const user = document.getElementById("reg-user").value.trim().toLowerCase();
    const pass = document.getElementById("reg-pass").value;
    const regError = document.getElementById("reg-error");

    const existe = usuarios.find(u => u.user === user);
    if (existe) {
        regError.style.display = "block";
        return;
    }

    const nuevoUsuario = { nombre, user, pass, rol: "cliente" };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("rodriguez_usuarios", JSON.stringify(usuarios));

    iniciarSesion(nuevoUsuario);
    document.getElementById("form-registro").reset();
    regError.style.display = "none";
    cerrarModalLogin();
}

function procesarLogin(e) {
    e.preventDefault();
    const userInput = document.getElementById("login-user").value.trim().toLowerCase();
    const passInput = document.getElementById("login-pass").value;
    const loginError = document.getElementById("login-error");

    const usuarioEncontrado = usuarios.find(u => u.user === userInput && u.pass === passInput);

    if (usuarioEncontrado) {
        iniciarSesion(usuarioEncontrado);
        document.getElementById("form-login").reset();
        loginError.style.display = "none";
        cerrarModalLogin();
    } else {
        loginError.style.display = "block";
    }
}

function iniciarSesion(usuario) {
    usuarioActivo = usuario;
    esAdmin = usuario.rol === "admin";
    localStorage.setItem("rodriguez_sesion", JSON.stringify(usuario));
    
    const inputNombreCarrito = document.getElementById("nombre");
    if (inputNombreCarrito) inputNombreCarrito.value = usuario.nombre;

    actualizarEstadoSesion();
    renderProductos(productos);
}

function cerrarSesion() {
    usuarioActivo = null;
    esAdmin = false;
    localStorage.removeItem("rodriguez_sesion");
    actualizarEstadoSesion();
    renderProductos(productos);
}

function actualizarEstadoSesion() {
    const panelAdmin = document.getElementById("panel-admin");
    const btnTrigger = document.getElementById("btn-login-trigger");
    const btnLogout = document.getElementById("btn-logout");
    const userGreeting = document.getElementById("user-greeting");

    if (usuarioActivo) {
        btnTrigger.style.display = "none";
        btnLogout.style.display = "inline-block";
        userGreeting.style.display = "inline-block";
        userGreeting.innerText = `👋 Hola, ${usuarioActivo.nombre.split(' ')[0]}`;

        if (esAdmin) {
            panelAdmin.style.display = "block";
        } else {
            panelAdmin.style.display = "none";
        }
    } else {
        panelAdmin.style.display = "none";
        btnTrigger.style.display = "inline-block";
        btnLogout.style.display = "none";
        userGreeting.style.display = "none";
    }
}

// Gestión de Inventario (Admin)
function agregarProductoAdmin(e) {
    e.preventDefault();
    const nombre = document.getElementById("admin-nombre").value;
    const precio = parseFloat(document.getElementById("admin-precio").value);
    const cat = document.getElementById("admin-cat").value;

    const nuevoProd = { id: Date.now(), nombre, precio, cat };
    productos.push(nuevoProd);
    guardarYRenderizar();
    document.getElementById("form-nuevo-producto").reset();
}

function eliminarProductoAdmin(id) {
    if (confirm("¿Seguro que quieres eliminar este producto de Colmado Rodríguez?")) {
        productos = productos.filter(p => p.id !== id);
        guardarYRenderizar();
    }
}

function guardarYRenderizar() {
    localStorage.setItem("rodriguez_productos", JSON.stringify(productos));
    renderProductos(productos);
}

// Modales
const modalCarrito = document.getElementById("modal-carrito");
const modalLogin = document.getElementById("modal-login");

document.getElementById("btn-carrito").onclick = () => modalCarrito.style.display = "flex";
function cerrarModalCarrito() { modalCarrito.style.display = "none"; }
function abrirModalLogin() { modalLogin.style.display = "flex"; }
function cerrarModalLogin() { modalLogin.style.display = "none"; }