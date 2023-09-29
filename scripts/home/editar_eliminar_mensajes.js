const contenedorPadreMensaje=document.querySelector(".mensajes")
console.log(contenedorPadreMensaje)

contenedorPadreMensaje.addEventListener("click",(e)=>{
  const eliminarMensaje = e.target.closest(".eliminar-mensaje");
  const editarMensaje= e.target.closest(".editar-mensaje")
  if(eliminarMensaje){
    const contenedorMensaje = eliminarMensaje.closest(".contenedor-mensaje");
    const mensaje=contenedorMensaje.querySelector(".mensaje").textContent
    const modalEliminarMensaje=modalComponenteConfirmacion("Eliminar comentario","Estas seguro que desea eliminar?: ","rgb(85,26,46)","../assets/imagenes/basura.png",mensaje)
    mostarModal(modalEliminarMensaje)
    respuestaModalEliminacion(modalEliminarMensaje,contenedorMensaje)
  }
  if(editarMensaje){
    const id_mensaje=editarMensaje.closest(".contenedor-mensaje").id
    const cont_mensaje = editarMensaje.closest(".mensaje-con-foto-perfil");
    const mensaje= cont_mensaje.querySelector(".mensaje")
    const textArea=document.createElement("textarea");
    textArea.classList.add("editar-texto-textarea")
    textArea.value=mensaje.textContent.replace(/\s+/g, ' ');
    textArea.style.height= (mensaje.offsetHeight + 10) +  "px";
    mensaje.remove();
    cont_mensaje.appendChild(textArea);
    
    editarMensajeTextarea(textArea,mensaje,cont_mensaje,id_mensaje);
  }
})
contenedorPadreMensaje.addEventListener("mouseover",(e)=>{
     const mensaje = e.target.closest(".contenedor-mensaje");
     if (mensaje) {
        const idUsuarioActual= document.querySelector(".perfil-usuario").id
        const idUsuarioMensaje= mensaje.querySelector(".mensaje-info").querySelector("span").id
        console.log(idUsuarioActual,idUsuarioMensaje)
        if(idUsuarioActual===idUsuarioMensaje){
            const acciones = mensaje.querySelector(".mensaje-acciones");
            acciones.style.display = "flex";
        }       
     }
})
contenedorPadreMensaje.addEventListener("mouseout",(e)=>{
     const mensaje = e.target.closest(".contenedor-mensaje");
     if (mensaje) {
       const acciones=mensaje.querySelector(".mensaje-acciones")
       acciones.style.display="none";
     }
})

function editarMensajeTextarea(textArea,contenedorMensaje,contendorMensajeAreemplazar,id_mensaje){
    textArea.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        e.preventDefault()  
        if(textArea.value.trim() !== ""){
            const modalEditarMensaje=modalComponenteConfirmacion("Modificar comentario","Estas seguro que desea modificar?: ","rgb(18,77,101)","../assets/imagenes/edit.png",contenedorMensaje.textContent)
            mostarModal(modalEditarMensaje)
            respuestaModalModificacion(modalEditarMensaje,textArea,contenedorMensaje,contendorMensajeAreemplazar,id_mensaje)
        }
        else{
            /* console.log(textArea) */
            const modalEliminarMensaje=modalComponenteConfirmacion("Eliminar comentario","Estas seguro que desea eliminar?: ","rgb(85,26,46)","../assets/imagenes/basura.png",contenedorMensaje.textContent)
            mostarModal(modalEliminarMensaje)
            const contenedorPadreTextarea=textArea.parentNode.parentNode;
            respuestaModalEliminacion(modalEliminarMensaje,contenedorPadreTextarea)
        }
    //Siempre se va a eliminar la textarea
    
    }
})
}

function respuestaModalEliminacion(modal,contenedorAEliminar){
    modal.addEventListener("click",(e)=>{
        const confirmar=e.target.closest(".boton-confirmar")
        const cancelar=e.target.closest(".boton-cancelar")
        if(confirmar){
            const id_mensaje=contenedorAEliminar.id
            modal.remove()
            const apiRaizURL="http://127.0.0.1:5000"
            fetch(`${apiRaizURL}/mensaje/${id_mensaje}`,{method:"DELETE"})
            .then(response=>{
                if(response.status===204){
                    contenedorAEliminar.remove()
                }
                else{
                    throw Error("No se pudo eliminar el mensaje")
                }
            }).catch(error=>console.log("ERROR",error))
            
        }
        if(cancelar){
            modal.remove()
        }
    })
}
function respuestaModalModificacion(modal,textArea,contenedorMensaje,contendorMensajeAreemplazar,id_mensaje){
    modal.addEventListener("click",(e)=>{
        const confirmar=e.target.closest(".boton-confirmar")
        const cancelar=e.target.closest(".boton-cancelar")
        if(confirmar){
            modal.remove()
            const contenidoTextareaMSJ=textArea.value
            const apiRaizURL="http://127.0.0.1:5000"
            const requestOption={
                                method : "PUT",
                                headers : {
                                    'Content-Type': 'application/json'
                                },
                                body : JSON.stringify({contenido: contenidoTextareaMSJ}) 
            }
            fetch(`${apiRaizURL}/mensaje/${id_mensaje}`,requestOption)
            .then(response=>{
                if(response.status===200){
                    textArea.remove()
                    contenedorMensaje.textContent=contenidoTextareaMSJ;                    
                    contendorMensajeAreemplazar.appendChild(contenedorMensaje)
                }
                else{                    
                    throw Error("Ocurrio un error al actualizar el mensaje")
                }
            }).catch(error=>console.log("ERROR",error))
            
        }
        if(cancelar){
            modal.remove()
        }
    })
}


/* TUVE QUE REPETIR CODIGO PORQUE NO SE PUEDEN IMPORTAR FUNCIONES */
function modalComponenteConfirmacion(titulo,titulo_info,color_fondo,imagenURL,contenidoAModificar){
    const modalContendorPrincipal=document.createElement("section")
    modalContendorPrincipal.classList.add("modal")
    modalContendorPrincipal.classList.add("agregar-canal")
    modalContendorPrincipal.classList.add("modal-mostrar")
    const modal=document.createElement("div");
    modal.style.backgroundColor=color_fondo
    modal.className="modal-container"        
    modalContendorPrincipal.appendChild(modal)
    const tituloModal=document.createElement("h1")
    tituloModal.className="modal-titulo"
    tituloModal.textContent=titulo
    modal.appendChild(tituloModal)
    const cuerpoModal=document.createElement("div")
    cuerpoModal.className="cuerpo-modal-advertencias"
    modal.appendChild(cuerpoModal)
    const contenedorImagen=document.createElement("div")
    contenedorImagen.className="imagen-cuerpo-modal"
    cuerpoModal.appendChild(contenedorImagen)
    const imagenAdvertencia=document.createElement("img")
    imagenAdvertencia.src=imagenURL
    contenedorImagen.appendChild(imagenAdvertencia)
    const contenedorInfo=document.createElement("div")
    contenedorInfo.className="info-cuerpo-modal"
    cuerpoModal.appendChild(contenedorInfo)
    const tituloInfo=document.createElement("h3")
    tituloInfo.textContent=titulo_info
    contenedorInfo.appendChild(tituloInfo)
    const textoInfo=document.createElement("p")
    textoInfo.textContent=contenidoAModificar
    contenedorInfo.appendChild(textoInfo)
    const contenedorBotones=document.createElement("div")
    contenedorBotones.className="seccion-botones-confirmacion"
    modal.appendChild(contenedorBotones)
    const botonCancelar=document.createElement("button")
    botonCancelar.textContent="Cancelar"
    botonCancelar.classList.add("boton-cancelar")
    const botonConfirmar=document.createElement("button")
    botonConfirmar.textContent="Confirmar"    
    botonConfirmar.classList.add("boton-confirmar")
    contenedorBotones.appendChild(botonCancelar)
    contenedorBotones.appendChild(botonConfirmar)    
    
    return modalContendorPrincipal
}

function mostarModal(modal){
    const cuerpoDocumento=document.body
    cuerpoDocumento.appendChild(modal)
}
