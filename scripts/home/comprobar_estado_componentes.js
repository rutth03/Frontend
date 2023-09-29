function alternarMensajesSinCanales_Servidores(){
    const servidoresUsuario=document.querySelector(".servidores-del-usuario")
    const imagenInfoUsuario=document.querySelector(".accion-requerida-imagen").children[0];
    const descripcionInfoUsuario=document.querySelector(".accion-requerida-descripcion")

    if(servidoresUsuario.childElementCount===0){
        console.log("INGRESO")
        imagenInfoUsuario.setAttribute("src","../assets/imagenes/explorar-servidores.png")
        descripcionInfoUsuario.textContent="Explore servidores para comunicarse con otras personas"
    }
    else{
        if(!unServidorEstaSeleccionado()){
           imagenInfoUsuario.setAttribute("src","../assets/imagenes/seleccionar-servidor.png")
            descripcionInfoUsuario.textContent="Seleccione un Servidor para comenzar" 
        }
        else{
            imagenInfoUsuario.setAttribute("src","../assets/imagenes/user-interface-0.png")
            descripcionInfoUsuario.textContent="Selecciona un canal para comenzar a chatear"
        }
    }
}
function unServidorEstaSeleccionado(){
    const contenedorServidores=Array.from(document.querySelector(".servidores-del-usuario").children)
    const resultado=contenedorServidores.some(servidor =>servidor.classList.contains("servidor-seleccionado")) 
    return resultado
}
