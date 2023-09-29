const botonBuscar=document.getElementById("buscar-servidor")
const apiRaizURL="http://127.0.0.1:5000"
const rutaRaizImagenes="http://127.0.0.1:5500/static_folder/servidor_imagenes/"
const volverAlInicio=document.querySelector(".volver-home")
let requestOption={
    methods:"GET",
    headers:{
        "Accept":"application/json"
    }
}
botonBuscar.addEventListener("click",(e)=>{
    limpiarServidoresResultado()
    const contenidoInputBusqueda=document.getElementById("servidor-input-busqueda").value    
    if(contenidoInputBusqueda.trim()!==""){
        fetch(`${apiRaizURL}/servidor?nombre=${encodeURIComponent(contenidoInputBusqueda)}`,requestOption)
        .then(response=>{
            if(response.status===200){
                return response.json()
            }
            throw Error("Ocurrio un error al buscar el servidor")
        })
        .then(data=>{
            cargarComponenteServidorResultado(data)
        })
        .catch(error=>console.log("ERROR",error))
    }
    else{
        alert("El input esta vacio")
    }
    
})
volverAlInicio.addEventListener("click",()=>{
    window.location.href="home.html"
})

function cargarComponenteServidorResultado(json_servidores){
    const listado_servidor=json_servidores.servidores
    listado_servidor.forEach(servidor=>{
        let ruta=rutaRaizImagenes+servidor.imagen
        servidorResultadoComponente(servidor.id_servidor,servidor.nombre,servidor.descripcion,ruta)
    })
}
function limpiarServidoresResultado(){
    const contenedorServidoresResultado=document.querySelector(".resultado-servidores")
    while (contenedorServidoresResultado.firstChild) {
        contenedorServidoresResultado.removeChild(contenedorServidoresResultado.firstChild);
    }
}
function servidorResultadoComponente(id_servidor,nombre,descripcion,imagen){
    const contenedorServidoresResultado=document.querySelector(".resultado-servidores")
    const contenedorServidorEncontrado=document.createElement("div")
    contenedorServidorEncontrado.className="servidor-encontrado"
    contenedorServidorEncontrado.id=id_servidor
    contenedorServidoresResultado.appendChild(contenedorServidorEncontrado)
    const servidorImagenContenedor=document.createElement("div")
    servidorImagenContenedor.className="servidor-imagen"
    contenedorServidorEncontrado.appendChild(servidorImagenContenedor)
    const imagenServidor=document.createElement("img")
    imagenServidor.src=imagen
    servidorImagenContenedor.appendChild(imagenServidor)
    const contInfoServidor=document.createElement("div")
    contInfoServidor.className="info-servidor"
    contenedorServidorEncontrado.appendChild(contInfoServidor)
    const tituloServidor=document.createElement("h2")
    tituloServidor.textContent=nombre
    contInfoServidor.appendChild(tituloServidor)
    const descripcionServidor=document.createElement("div")
    descripcionServidor.className="descripcion-servidor"
    descripcionServidor.textContent=descripcion
    contInfoServidor.appendChild(descripcionServidor)
    const boton=document.createElement("button")
    boton.className="boton-ingresar-servidor"
    boton.textContent="Ingresar"
    contenedorServidorEncontrado.appendChild(boton)
    return contenedorServidorEncontrado
}