// El array almacena objetos reales instanciados desde la clase ArticuloCompra
let carrito = [];

const FORMULARIO = document.getElementById("form-ingreso");
const INPUT_PROD = document.getElementById("producto-input");
const INPUT_CANT = document.getElementById("cantidad-input");
const INPUT_PRECIO = document.getElementById("precio-input");

const LISTA = document.getElementById("lista-compras");
const PRODUCTOS = document.getElementById("num-prod");
const MENSAJE = document.getElementById("mensaje");

const BTN_ELIMINAR_POS = document.getElementById("btn-eliminar-pos");
const BTN_CALCULAR = document.getElementById("btn-calcular");
const BTN_VACIAR = document.getElementById("btn-vaciar");

const guardarEnLocalStorage = () => {
    
    const arrayPlano = carrito.map(item => item.toData());
    localStorage.setItem("lista_compras_premium_oo", JSON.stringify(arrayPlano));
};

const renderizarLista = () => {
    LISTA.innerHTML = ""; 

    carrito.forEach((item, posicion) => {
        
        const subtotal = item.obtenerSubtotal().toFixed(2);
        
        const nuevoElemento = `<li id="pos-${posicion}" class="text-slate-800 py-1.5 border-b border-slate-100 flex justify-between items-center text-xs sm:text-sm">
            <span>
                <span class="text-slate-400 font-mono text-xs mr-1">[Pos ${posicion}]</span> 
                <span class="font-black text-slate-900">${item.producto}</span>
            </span>
            <span class="text-slate-500 font-medium">
                ${item.cantidad} x ${item.precio.toFixed(2)}€ = <span class="font-bold text-slate-800">${subtotal}€</span>
            </span>
        </li>`;
        LISTA.insertAdjacentHTML("beforeend", nuevoElemento);
    });

    PRODUCTOS.textContent = carrito.length;
};

const agregarObjeto = (evento) => {
    evento.preventDefault(); 

    const nombreProducto = INPUT_PROD.value.trim().toUpperCase();
    const cantidadProducto = parseInt(INPUT_CANT.value) || 1;
    const precioProducto = parseFloat(INPUT_PRECIO.value) || 0.0;

    let encontrado = false;
    let i = 0;
    while (i < carrito.length && !encontrado) {
        if (carrito[i].producto === nombreProducto) {
            encontrado = true; 
        }
        i++;
    }

    if (encontrado) {
        MENSAJE.textContent = `Error: El artículo "${nombreProducto}" ya está en la lista. No se permiten duplicados.`;
        return; 
    }

    const nuevoArticulo = new ArticuloCompra(nombreProducto, cantidadProducto, precioProducto);

    carrito.push(nuevoArticulo);
    guardarEnLocalStorage(); 
    
    MENSAJE.textContent = ` Agregado con éxito: ${nombreProducto}`;
    FORMULARIO.reset(); 
    
    renderizarLista(); 
};

const eliminarPorPosicion = () => {
    if (carrito.length === 0) {
        MENSAJE.textContent = "⚠️ La lista está vacía, no hay nada que eliminar.";
        return;
    }

    const entrada = prompt(`Introduce la posición del objeto a eliminar (Rango de 0 a ${carrito.length - 1}):`);
    if (entrada === null) return; 

    const posicion = parseInt(entrada);

    if (isNaN(posicion) || posicion < 0 || posicion >= carrito.length) {
        MENSAJE.textContent = "❌ Error: La posición introducida está fuera de rango o es inválida.";
        return;
    }

    const articuloEliminado = carrito[posicion];

    
    carrito = carrito.slice(0, posicion).concat(carrito.slice(posicion + 1));
    guardarEnLocalStorage(); 
    
    MENSAJE.textContent = `🗑️ Se eliminó "${articuloEliminado.producto}" de la posición ${posicion}.`;
    renderizarLista(); 
};


const calcularPresupuestoTotal = () => {
    if (carrito.length === 0) {
        MENSAJE.textContent = "💰 El estimado total a gastar es: 0.00 € (La lista está vacía).";
        return;
    }

    let totalAcumulado = 0;
    carrito.forEach(item => {
        totalAcumulado += item.obtenerSubtotal(); 
    });

    MENSAJE.textContent = `💰 ESTIMADO TOTAL A GASTAR: El costo total para comprar todos los artículos es de ${totalAcumulado.toFixed(2)} €`;
};

const vaciarCarrito = () => {
    if (carrito.length === 0) {
        MENSAJE.textContent = "⚠️ La lista ya se encuentra completamente vacía.";
        return;
    }

    const confirmar = confirm("¿Estás seguro de que deseas vaciar toda la lista de compras avanzada?");
    if (confirmar) {
        carrito = [];
        
        localStorage.removeItem("lista_compras_premium_oo");
        
        MENSAJE.textContent = "🧹 Toda la lista de compras y su memoria en el LocalStorage han sido eliminadas.";
        renderizarLista(); 
    }
};

const cargarAlmacenamientoInicial = () => {
    const datosMemoria = localStorage.getItem("lista_compras_premium_oo");
    
    if (datosMemoria) {
        const arrayPlano = JSON.parse(datosMemoria);
        
        carrito = arrayPlano.map(item => new ArticuloCompra(item.producto, item.cantidad, item.precio));
        MENSAJE.textContent = "Se han cargado tus artículos.";
    } else {
        carrito = [];
        MENSAJE.textContent = "🍅 Bienvenido!: Inicia tu lista de compras agregando tu primer producto.";
    }
};

const conectarEventos = () => {
    FORMULARIO.addEventListener("submit", agregarObjeto);
    BTN_ELIMINAR_POS.addEventListener("click", eliminarPorPosicion);
    BTN_CALCULAR.addEventListener("click", calcularPresupuestoTotal);
    BTN_VACIAR.addEventListener("click", vaciarCarrito);
};

// Disparador del inicio del ciclo de vida seguro del DOM
document.addEventListener("DOMContentLoaded", () => {
    cargarAlmacenamientoInicial(); 
    conectarEventos();
    renderizarLista(); 
});

