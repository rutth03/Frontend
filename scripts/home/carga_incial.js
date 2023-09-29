const apiRaizURL="http://127.0.0.1:5000"
const rutaRaizImagenes="http://127.0.0.1:5500/static_folder/"
const explorarServidores=document.getElementById("explorar-servidores")
cambiarChatXMensajeInformacion() 
eliminarComponentesCanales()
const requestOption={
    methods:"GET",
    headers:{
        "Accept":"application/json"
    }
}
    fetch(`${apiRaizURL}/usuario/profile`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json()
        }
        throw Error("Ocurrio un error al obtener el usuario ")
        })
    .then(data=>{
        cargarInfoUsuario(data)
        cargarServidoresDelUsuario()
    }).catch(error=>console.log("Error",error))
explorarServidores.addEventListener("click",()=>{
    window.location.href="explorar_servidores.html"
})
function cargarServidoresDelUsuario(){
    const id_usuario=document.querySelector(".perfil-usuario").id
    fetch(`${apiRaizURL}/usuario_servidor/usuario/${id_usuario}`)
    .then(response=>{
        if(response.status===200){
            return response.json()
        }
        else{
            throw Error("OCURRIO UN ERROR EN LA SOLICITUD")
        }
    })
    .then(data=>{
        procesarJsonServidorAComponente(data)        
        alternarMensajesSinCanales_Servidores()
    } )
    .catch(error=> console.log("ERROR",error))
}


function procesarJsonServidorAComponente(json_servidores){
    const listado_servidores=json_servidores.servidores_usuario
    listado_servidores.forEach(propiedad_servidor_usuario=>{
        const id_usuario_servidor=propiedad_servidor_usuario.id_usuario_servidor
        const servidor=propiedad_servidor_usuario.servidor
        const rutaCompletaImagen=rutaRaizImagenes+ "servidor_imagenes/" + servidor.imagen
        servidorComponenteAPI(servidor.nombre,rutaCompletaImagen,
                            servidor.descripcion,servidor.id_servidor,id_usuario_servidor)
    })
    
}
function cargarInfoUsuario(json_usuario){
    const id_usuario=json_usuario.id_usuario
    const nickname=json_usuario.nickname
    const nombre_apellido=json_usuario.nombre + " " + json_usuario.apellido
    const avatar=json_usuario.avatar
    const contenedorUsuarioHome=document.querySelector(".perfil-usuario")
    contenedorUsuarioHome.id=id_usuario
    const componenteImagen=contenedorUsuarioHome.querySelector(".imagen")
    const componenteInfo=contenedorUsuarioHome.querySelector(".info-usuario")
    /* Cambiar cuando este implementado el guardado de imagenes */
    componenteImagen.querySelector("img").src= rutaRaizImagenes + "perfil_imagenes/" + avatar
    componenteInfo.querySelector(".nombre-usuario").textContent=nombre_apellido
    componenteInfo.querySelector(".alias-usuario").textContent="#"+nickname
}
function servidorComponenteAPI(nombre,imagen,descripcion,id_servidor,id_usuario_servidor){
    const contenedorServidoresUsuario=document.querySelector(".servidores-del-usuario")
    const servidorComponente=document.createElement("div")
    servidorComponente.className="servidores";
    servidorComponente.id=id_servidor.toString()
    /* ESTE SPAN SIRVE PARA ABANDONAR UN SERVIDOR TOMANDO EL id_usuario_servidor DE LA BD */
    const spanIdUsuarioServidor=document.createElement("span")
    spanIdUsuarioServidor.textContent=nombre
    spanIdUsuarioServidor.id=id_usuario_servidor.toString()
    servidorComponente.appendChild(spanIdUsuarioServidor)
    const imagenServidor=document.createElement("img")
    imagenServidor.setAttribute("src",imagen)
    imagenServidor.setAttribute("alt",nombre)
    const descripcionServidor=document.createElement("div")
    descripcionServidor.className="servidor-descripcion"
    descripcionServidor.textContent=descripcion
    servidorComponente.appendChild(imagenServidor);
    servidorComponente.appendChild(descripcionServidor)
    contenedorServidoresUsuario.appendChild(servidorComponente);
    return servidorComponente
}
    
function eliminarComponentesCanales(){
    const listadoCanalesComponente=document.querySelector(".listado-canales")
    let listadoHijosCanalesComponente=Array.from(listadoCanalesComponente.children)
    console.log(listadoHijosCanalesComponente)

    listadoHijosCanalesComponente.slice(0,listadoHijosCanalesComponente.length-1).forEach(hijos=>{
        hijos.style.display="none"
    }
    )
}
function cambiarChatXMensajeInformacion(){
    const mensajesUsuarioContenedor=document.querySelector(".mensajes-usuarios");
    const cajaMensaje=document.querySelector(".caja-mensajes")
    mensajesUsuarioContenedor.style.display="none"
    cajaMensaje.style.display="none"

}
