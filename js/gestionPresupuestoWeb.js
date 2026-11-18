//import 
import * as gestionP from "./gestionPresupuesto.js";

//Funciones para mostrar datos en la web

// Función para mostrar un dato en un elemento del DOM con un id específico
function mostrarDatoEnId(idElemento , valor) {
    document.getElementById(idElemento).textContent = valor;
}

function mostrarGastoWeb(idElemento, gasto) {

    let contenedor = document.getElementById(idElemento);

    let divGasto = document.createElement("div");
    divGasto.classList.add("gasto");

    //descripción.
    let descripcion = document.createElement("div");
    descripcion.classList.add("gasto-descripcion");
    descripcion.textContent = gasto.descripcion;

    //fecha
    let fecha = document.createElement("div");
    fecha.classList.add("gasto-fecha");
    fecha.textContent =
        new Date(gasto.fecha).toLocaleDateString();

    //valor
    let valor = document.createElement("div");
    valor.classList.add("gasto-valor");
    valor.textContent = gasto.valor;

    //etiquetas

    let etiquetas = document.createElement("div");
    etiquetas.classList.add("gasto-etiquetas");

    for (let etiqueta of gasto.etiquetas) {

        let span = document.createElement("span");

        span.classList.add("gasto-etiquetas-etiqueta");
        span.textContent = etiqueta;

        let borrarEtiquetaHandle = new BorrarEtiquetasHandle();

        borrarEtiquetaHandle.gasto = gasto;
        borrarEtiquetaHandle.etiqueta = etiqueta;

        span.addEventListener("click",borrarEtiquetaHandle );

        etiquetas.append(span);
    }
        //boton editar 
    let botonEditar = document.createElement("button");

    botonEditar.type = "button";
    botonEditar.classList.add("gasto-editar");
    botonEditar.textContent = "Editar";

    let editarHandle = new EditarHandle();

    editarHandle.gasto = gasto;

    botonEditar.addEventListener( "click",editarHandle);

    //boton borrar

    let botonBorrar = document.createElement("button");

    botonBorrar.type = "button";
    botonBorrar.classList.add("gasto-borrar");
    botonBorrar.textContent = "Borrar";

    let borrarHandle = new BorrarHandle();

    borrarHandle.gasto = gasto;

    botonBorrar.addEventListener( "click", borrarHandle);
 

    // Agregar todos los elementos al div del gasto
    divGasto.append(
        descripcion,
        fecha,
        valor,
        etiquetas,
        botonEditar,
        botonBorrar,
    );

    contenedor.append(divGasto);
}

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {

    let contenedor =document.getElementById(idElemento);

    let divAgrupacion =document.createElement("div");

    divAgrupacion.classList.add("agrupacion");

    let titulo = document.createElement("h1");

    let textoPeriodo = periodo;

        if (periodo === "dia") {
        textoPeriodo = "día";
    }
    else if (periodo === "anyo") {
        textoPeriodo = "año";
    }

titulo.textContent =`Gastos agrupados por ${textoPeriodo}`;

    divAgrupacion.append(titulo);

         for (let prop in agrup) {

        let dato = document.createElement("div");
        dato.classList.add("agrupacion-dato");

        let spanClave = document.createElement("span");
        spanClave.classList.add("agrupacion-dato-clave");
        spanClave.textContent = clave;

        let spanValor = document.createElement("span");
        spanValor.classList.add("agrupacion-dato-valor");
        spanValor.textContent = valor;

        dato.append(spanClave);
        dato.append(spanValor);

        divAgrupacion.append(dato);
    }

    contenedor.append(divAgrupacion);
}

//FUNCION REPINTAR 
function repintar() {

  mostrarDatoEnId(
    "presupuesto",
    gestionP.mostrarPresupuesto()
  );

  mostrarDatoEnId(
    "gastos-totales",
    gestionP.calcularTotalGastos()
  );

  mostrarDatoEnId(
    "balance-total",
    gestionP.calcularBalance()
  );

  document.getElementById("listado-gastos-completo").innerHTML = "";

  gestionP.listarGastos().forEach(
    gasto => mostrarGastoWeb("listado-gastos-completo", gasto)
  );
}

//actualizar presupuesto 
function actualizarPresupuestoWeb() {

let presupuesto = prompt( "Introduce presupuesto");

  presupuesto = Number(presupuesto);

  gestionP.actualizarPresupuesto(presupuesto);

  repintar();
}

// evento del boton actualizar presupuesto
let botonActualizarPresupuesto = 
document.getElementById( "actualizarpresupuesto");

botonActualizarPresupuesto.addEventListener("click",
    actualizarPresupuestoWeb
);

//funcion añadir gasto mediante prompt
function nuevoGastoWeb() {

  let descripcion = prompt("Descripción");

  let valor = Number( prompt("Valor"));

  let fecha = prompt( "Fecha (yyyy-mm-dd)");

  let etiquetasTexto = prompt("Etiquetas separadas por comas");

  let etiquetas = etiquetasTexto.split(",");

  let gasto = new gestionP.CrearGasto(
    descripcion,
    valor,
    fecha,
    ...etiquetas
  );

  gestionP.anyadirGasto(gasto);

  repintar();
}
//evento del boton añadir gasto
document.getElementById("anyadirgasto").addEventListener(
      "click",
      nuevoGastoWeb
  );

  //funcion constructora handler para editar gasto mediante promt   
function EditarHandle() {}

    EditarHandle.prototype.handleEvent = function () {

    let descripcion = prompt( "Descripción",
        this.gasto.descripcion);

    let valor = prompt("Valor",
        this.gasto.valor
    );

    let fecha = prompt("Fecha",
        this.gasto.fecha
    );

    let etiquetas = prompt( "Etiquetas",
        this.gasto.etiquetas.join(",")
    );

    valor = Number(valor);

    etiquetas = etiquetas.split(",");

    this.gasto.actualizarValor(valor);

    this.gasto.actualizarDescripcion( descripcion );

    this.gasto.actualizarFecha(fecha );

    this.gasto.anyadirEtiquetas(...etiquetas);

    repintar();
};
//constructora borrarhandle para borrar gasto mediante prompt
function BorrarHandle() {}

    BorrarHandle.prototype.handleEvent = function () {

        gestionP.borrarGasto(this.gasto.id);

    repintar();
};
//constructora borrarhandle para borrar etiquetas mediante prompt
function BorrarEtiquetasHandle() {

}

BorrarEtiquetasHandle.prototype.handleEvent =function () {

    this.gasto.borrarEtiquetas(this.etiqueta);

    repintar();
};

export {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb
};

