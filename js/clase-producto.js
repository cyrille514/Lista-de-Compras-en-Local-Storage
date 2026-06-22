//  MOLDE CONSTRUCTOR DEL OBJETO PRODUCTO (MÓDULO LÓGICO)

class ArticuloCompra {
    constructor(nombre, cantidad, precio) {
       
        this.producto = nombre.trim().toUpperCase();
        this.cantidad = parseInt(cantidad) || 1;
        this.precio = parseFloat(precio) || 0.0;
    }

    obtenerSubtotal = () => {
        return this.cantidad * this.precio;
    };

    
    toData = () => {
        return {
            producto: this.producto,
            cantidad: this.cantidad,
            precio: this.precio
        };
    };
}
