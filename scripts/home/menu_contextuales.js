const cuerpoDocumento=document.querySelector("body")
const canalesContenedor=document.querySelector(".canales")
let menuAbierto=false;
const perfilUsuario=document.querySelector(".perfil-usuario")
const servidoresContenedor=document.querySelector(".servidores-del-usuario")
const mensajeSiNoHayCanales=document.querySelector(".sin-canales-ni-servidor")

function menuContextualComponente(opciones){  
  const contenedorMenuContextual=document.createElement("div");
  contenedorMenuContextual.className="menu-contextual"
  const menuContextual=document.createElement("ul")
  contenedorMenuContextual.appendChild(menuContextual);
  opciones.forEach(opcion => {
    const item=document.createElement("li");
    item.textContent=opcion
    menuContextual.appendChild(item);
  });
  return contenedorMenuContextual
}
function cerrarMenusContextualesActivos(){
  const menuContextuales=document.querySelectorAll(".menu-contextual");
  menuContextuales.forEach(menu=>{
    menu.remove();
  })
}
function mostrarMenuContextual(items,e){
  const menuContextual=menuContextualComponente(items)
  cuerpoDocumento.appendChild(menuContextual)
  const posX = e.clientX;
  const posY = e.clientY;
  menuContextual.style.left= posX+"px"
  menuContextual.style.top= posY+"px"
  menuContextual.style.display = "block";
  
  const menuHeight = menuContextual.clientHeight;
  const ventanaHeight = window.innerHeight;
  
  if (posY + menuHeight > ventanaHeight) {
    const adjustarTop = ventanaHeight - menuHeight;
    menuContextual.style.top = `${adjustarTop}px`;
  } else {
    menuContextual.style.top = `${posY}px`;
  }  
  // Ajustar la posición horizontal
  menuContextual.style.left = `${posX}px`;
  // Retorno el componente para operarlo al activar uno de sus opciones
  return menuContextual
}
perfilUsuario.addEventListener("contextmenu",(e)=>{
  e.preventDefault();
  /* cerrarMenusContextualesActivos() */
  console.log(menuAbierto)
  if(menuAbierto){
    cerrarMenusContextualesActivos()
  }
  const menuUsuario=mostrarMenuContextual(["Ver perfil","Editar perfil","Cerrar Sesión"],e)
  console.log(menuUsuario)
  accionesUsuario(menuUsuario)
  menuAbierto=true 
})
function accionesUsuario(accionesMenuUsuario){
  const lista_acciones=Array.from(accionesMenuUsuario.querySelector("ul").children)
  console.log(lista_acciones)
  lista_acciones.forEach((opcion,indice)=>{
    opcion.addEventListener("click",()=>{
      if(indice===0){
        window.location.href="profile.html"
      }
      else if(indice===1){
        console.log("EDITAR PERFIL")
      }
      else{
        cerrarSesion()
      }
    })
  })
}
function cerrarSesion(){
  const apiRaizURL="http://127.0.0.1:5000"
  fetch(`${apiRaizURL}/usuario/logout`,{method:"GET"})
  .then(response=>{
    if(response.status===200){
      window.location.href="login.html"
    }
    else{
      throw Error("No se pudo cerrar la sesion")
    }
  })
  .catch(error=>console.log("ERROR",error))
}
/* Sacar comentario cuando arregle los errores JS */
canalesContenedor.addEventListener("contextmenu",(e)=>{
    e.preventDefault();
    const canal=e.target.closest(".canal");
    
    if(menuAbierto){
      cerrarMenusContextualesActivos()
    }    
    if(canal){
      const menuContextual=mostrarMenuContextual(["Eliminar"],e) 
      console.log(menuContextual)
      const opciones=menuContextual.querySelector("li")
      console.log(opciones)
      opciones.addEventListener("click",()=>{
        const nombreCanal=canal.querySelector("span").textContent
        const modalEliminarCanal=modalComponenteConfirmacion("Eliminar Canal","Estas seguro que deseas eliminar el canal?:","rgb(85,26,46)","../assets/imagenes/eliminar-canal.png",nombreCanal)
        mostarModalMenuContextuales(modalEliminarCanal)
        respuestaModalMenuContextuales(modalEliminarCanal,canal,mostrarMensajeSiNoHayCanales,mensajeIndicandoSeleccionCanal,fetchEliminarCanal)

      })
      menuAbierto=true
    }
    else{
        menuAbierto=false
    }
})

servidoresContenedor.addEventListener("contextmenu",(e)=>{
  e.preventDefault();
  const servidor=e.target.closest(".servidores");
  if(menuAbierto){
    cerrarMenusContextualesActivos()
  }
  if(servidor){    
    const menuContextualServidores=mostrarMenuContextual(["Abandonar Servidor"],e) 
    const abandonarServidorOpcion=menuContextualServidores.querySelector("li")
    abandonarServidorOpcion.addEventListener("click",()=>{
      const nombreServidor=servidor.querySelector("img").getAttribute("alt")
      const modalAbandonarServidor=modalComponenteConfirmacion("Abandonar Servidor","Estas seguro que desea abandonar el servidor?:","rgb(29,14,90)","../assets/imagenes/abandonar-servidor.png",nombreServidor)
      mostarModalMenuContextuales(modalAbandonarServidor)
      respuestaModalMenuContextuales(modalAbandonarServidor,servidor,mostrarMensajeSiNoHayServidores,seEliminoServidorSeleccionado,fetchAbandonarServidor)
    })
    menuAbierto=true
  }
  else{
    menuAbierto=false
  }
})

document.addEventListener("click", (e) => {
  if(menuAbierto){
    cerrarMenusContextualesActivos();
    menuAbierto=false
  }

});
function fetchEliminarCanal(canal){
    const apiRaizURL="http://127.0.0.1:5000"
    const id_canal=canal.id
    console.log("CANAL ID",id_canal)
    return fetch(`${apiRaizURL}/canal/${id_canal}`,{method:"DELETE"})
}
function fetchAbandonarServidor(servidor){
    const apiRaizURL="http://127.0.0.1:5000"
    const id_usuario_servidor=servidor.querySelector("span").id
    console.log("SERVIDOR ID",id_usuario_servidor)
    return fetch(`${apiRaizURL}/usuario_servidor/${id_usuario_servidor}`,{method:"DELETE"})
}
function respuestaModalMenuContextuales(modal,componente,callbackComprobarExistencia,callbackMensajeAyuda,fetchEliminarCallback){
    modal.addEventListener("click",(e)=>{
        const confirmar=e.target.closest(".boton-confirmar")
        const cancelar=e.target.closest(".boton-cancelar")
        if(confirmar){
            modal.remove()
            fetchEliminarCallback(componente).then((response)=>{
              if(response.status===204){
                callbackMensajeAyuda(componente)
                componente.remove()
                callbackComprobarExistencia()
              }
              else{
                throw Error("Error al eliminar el recurso")
              }              
            })  
            .catch(error=>console.log("ERROR",error))
            
            
            
        }
        if(cancelar){
            modal.remove()
        }
    })
}
function elCanaleEstaSeleccionado(canal){
  return canal.classList.contains("canal-seleccionado")
}
function seleccionaServidorMensaje(){
  const mensajesUsuarioContenedor=document.querySelector(".mensajes-usuarios");
  const cajaMensaje=document.querySelector(".caja-mensajes")
  mensajesUsuarioContenedor.style.display="none"
  cajaMensaje.style.display="none"
}
function seEliminoServidorSeleccionado(servidorComponente){
  if(servidorComponente.classList.contains("servidor-seleccionado")){
    mensajeSiNoHayServidores("../assets/imagenes/seleccionar-servidor.png","Seleccione un Servidor para comenzar")
  }
}
function comprobarSiExistenCanales(){
  const contenedorCanales=document.querySelector(".canales")
  return contenedorCanales.children.length>0
}
function mostrarMensajeSiNoHayCanales(){
  if(!comprobarSiExistenCanales()){
    mensajeSiNoHayCanales.style.display="flex"
  }
}

function comprobarSiExistenServidores(){
  const contenedorServidores=document.querySelector(".servidores-del-usuario")
  console.log(contenedorServidores.childElementCount)
  return contenedorServidores.childElementCount>0
}
function mostrarMensajeSiNoHayServidores(){
  console.log(comprobarSiExistenServidores())
  if(!comprobarSiExistenServidores()){
    mensajeSiNoHayServidores("../assets/imagenes/explorar-servidores.png","Explore servidores para comunicarse con otras personas")
  }
}
function mensajeSiNoHayServidores(imagen,mensaje){
    const imagenInfoUsuario=document.querySelector(".accion-requerida-imagen").children[0];
    const descripcionInfoUsuario=document.querySelector(".accion-requerida-descripcion")
    imagenInfoUsuario.setAttribute("src",imagen)
    descripcionInfoUsuario.textContent= mensaje
    eliminarComponentesCanalesSinServidores()
    mensajeSiNoHayCanales.style.display="flex"
}
function mensajeSiNoSeSeleccionoUnCanal(){
  /* Se oculta la caja de mensajes y mensajes */
  const mensajesUsuarioContenedor=document.querySelector(".mensajes-usuarios");
  const cajaMensaje=document.querySelector(".caja-mensajes")
  mensajesUsuarioContenedor.style.display="none"
  cajaMensaje.style.display="none"
  /* Se carga el mensaje indicando que no hay canales seleccionado */
  const imagenInfoUsuario=document.querySelector(".accion-requerida-imagen").children[0];
  const descripcionInfoUsuario=document.querySelector(".accion-requerida-descripcion")
  imagenInfoUsuario.setAttribute("src","../assets/imagenes/user-interface-0.png")
  descripcionInfoUsuario.textContent="Selecciona un canal para comenzar a chatear"
}
function mensajeIndicandoSeleccionCanal(canal){
  if(elCanaleEstaSeleccionado(canal)){
    mensajeSiNoSeSeleccionoUnCanal()
  }
}
/* TUVE QUE REPETIR CODIGO PORQUE NO SE PUEDEN IMPORTAR FUNCIONES */
function eliminarComponentesCanalesSinServidores(){
    const listadoCanalesComponente=document.querySelector(".listado-canales")
    let listadoHijosCanalesComponente=Array.from(listadoCanalesComponente.children)
    console.log(listadoHijosCanalesComponente)

    listadoHijosCanalesComponente.slice(0,listadoHijosCanalesComponente.length-1).forEach(hijos=>{
        hijos.style.display="none"
    }
    )
}

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
function mostarModalMenuContextuales(modal){
    const cuerpoDocumento=document.body
    cuerpoDocumento.appendChild(modal)
}


