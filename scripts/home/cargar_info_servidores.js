const servidores=document.querySelector(".servidores-del-usuario")

servidores.addEventListener("click",(e)=>{
    const apiRaizURL="http://127.0.0.1:5000"
    const requestOption={
        methods:"GET",
        headers:{
            "Accept":"application/json"
        }
    }
    const servidorClickeado=e.target.closest(".servidores")

    if(servidorClickeado){
        const id_servidor=servidorClickeado.id
 
        ocultarChatCajaMensajes()
        mensajeServidorClickeado(servidorClickeado)
        limpiarListaCanales()
        fetch(`${apiRaizURL}/canal/servidor/${id_servidor}`,requestOption)
        .then(response=>{
            if(response.status===200){
                return response.json()
            }
            else{
                throw Error("Se produjo un error al consumir el canal")
            }
        })
        .then(data=>{
            canalJSONaComponente(data)
            reestablecerCanales()
        })        
        
    }
})
function canalJSONaComponente(json){
    const lista_canales=json.canales
    const contenedorDeCanales=document.querySelector(".canales")
    lista_canales.forEach(canal=>{
        let canalComponente=canalComponenteAPI(canal.nombre,canal.descripcion,canal.id_canal)
        contenedorDeCanales.appendChild(canalComponente)
    })
}
function canalComponenteAPI(nombre,descripcion,id_canal){
    const canalContenedor = document.createElement("div");
    canalContenedor.className = "canal";
    canalContenedor.id=id_canal.toString()
    const iconoSharp = document.createElement("i");
    iconoSharp.className = "fa-solid fa-hashtag hashtag-canales";
    canalContenedor.appendChild(iconoSharp);

    /* Contenedor para el nombre del canal */
    const nombreCanal = document.createElement("span");
    nombreCanal.textContent = nombre;
    canalContenedor.appendChild(nombreCanal);
    /*Contenedor para la descripcion del canal */
    const descripcionCanal= document.createElement("div");
    descripcionCanal.className="canal-descripcion"
    descripcionCanal.textContent=elCanaltieneDescripcion(descripcion)
    canalContenedor.appendChild(descripcionCanal)
    return canalContenedor;
}

function limpiarListaCanales(){
    const contenedorDeCanales=document.querySelector(".canales")
    const canales=Array.from(contenedorDeCanales.children)
    canales.forEach(canal=>{
        console.log(canal)
        canal.remove()        
    })
}


function reestablecerCanales(){
    const canalesCantidad=document.querySelector(".canales")
    const mensajeSinCanalesDisponibles=document.querySelector(".sin-canales-ni-servidor")
    mostrarFuncionalidadesCanales()
    if(canalesCantidad.childElementCount===0){
        console.log("hola")
        mensajeSinCanalesDisponibles.style.display="flex"
    }
    else{
        mensajeSinCanalesDisponibles.style.display="none"
    }
 
}
function mostrarFuncionalidadesCanales(){
    const listadoCanalesComponente=document.querySelector(".listado-canales")
    let listadoHijosCanalesComponente=Array.from(listadoCanalesComponente.children)
    const ultimoElemento=listadoHijosCanalesComponente.length-1
    listadoHijosCanalesComponente.slice(0,ultimoElemento).forEach(hijos=>{
        hijos.style.display="flex"
    })
}
function descripcionCanalSeleccionado(servidorClickeado){
    const contenidoDescripcionServidor=servidorClickeado.querySelector(".servidor-descripcion")    
    return contenidoDescripcionServidor.textContent
}
function ocultarChatCajaMensajes(){
  /* Se oculta la caja de mensajes y mensajes */
  const mensajesUsuarioContenedor=document.querySelector(".mensajes-usuarios");
  const cajaMensaje=document.querySelector(".caja-mensajes")
  mensajesUsuarioContenedor.style.display="none"
  cajaMensaje.style.display="none"
}
/* CODIGO REPETIDO POR QUE NO ME DEJA EXPORTAR */

function mensajeServidorClickeado(servidorClickeado){  
  const descripcionServidor=descripcionCanalSeleccionado(servidorClickeado)  
  /* Se carga el mensaje indicando que no hay canales seleccionado */
  const imagenInfoUsuario=document.querySelector(".accion-requerida-imagen").children[0];
  const descripcionInfoUsuario=document.querySelector(".accion-requerida-descripcion")
  imagenInfoUsuario.setAttribute("src","../assets/imagenes/user-interface-0.png")
  descripcionInfoUsuario.textContent=elCanalPoseeDescripcion(descripcionServidor)
}
function elCanalPoseeDescripcion(texto){
    if(texto.trim()!==""){
        return "Descripcion del servidor: " + texto
    }
    else{
        return "El servidor no posee descripción"
    }
}
