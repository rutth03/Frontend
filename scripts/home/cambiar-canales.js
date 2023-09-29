const canalesContenedorElemento=document.querySelector(".canales");
let existeMensajeBienvenida=false
canalesContenedorElemento.addEventListener("click",(e)=>{
    const canalSeleccionado=e.target.closest(".canal")
    const apiRaizURL="http://127.0.0.1:5000"
    const requestOption={
        methods:"GET",
        headers:{            
            "Accept":"application/json"
        }
    }
    if(canalSeleccionado){
        console.log(existeMensajeBienvenida)
        if(existeMensajeBienvenida){            
            const mensajeBienvenida=document.querySelector(".mensaje-bienvenida")
            /* console.log(mensajeBienvenida) */
            mensajeBienvenida.remove()
        }
        const nombreCanal=canalSeleccionado.querySelector("span").textContent
        const descripcionCanal=canalSeleccionado.querySelector(".canal-descripcion").textContent
        const id_canal=canalSeleccionado.id
        mensajeBienvenidaComponente(nombreCanal,descripcionCanal)
        activarContenedorMensajesInput()
        existeMensajeBienvenida=true

        fetch(`${apiRaizURL}/mensaje/canal/${id_canal}`,requestOption)
        .then(response=>{
            if(response.status===200){
                return response.json()
            }
            else{
                throw Error("Ocurrio un error en la solicitud")
            }
        })
        .then(data=>{
            limpiarPantallaMensajes()
            if(data.mensajes.length===0){
                const mensaje="El canal " + nombreCanal + " no posee mensajes" 
                alert(mensaje)
            }
            else{                
                mensajeJsonAComponente(data)
            }
        })
        .catch(error=>console.log("ERROR",error))
    }
})
function mensajeJsonAComponente(data){
    const lista_mensajes=data.mensajes
    lista_mensajes.forEach(mensaje=>{
        let usuario=mensaje.usuario
        componenteMensajeAenviarAPI(usuario.nickname,
                                    mensaje.contenido,
                                    mensaje.fecha_hora,
                                    mensaje.id_mensaje,
                                    usuario.id_usuario)
    })
}
function limpiarPantallaMensajes(){
    const contenedorDeMensajes= document.querySelector(".mensajes");
    const listadoMensajes= Array.from(contenedorDeMensajes.children)
    console.log(listadoMensajes)
    if(listadoMensajes.length !== 0){
        listadoMensajes.forEach(mensaje =>{
            mensaje.remove()
        })
    }
}
function activarContenedorMensajesInput(){
    const mensajesUsuarioContenedor=document.querySelector(".mensajes-usuarios");
    const cajaMensaje=document.querySelector(".caja-mensajes")
    mensajesUsuarioContenedor.style.display="flex"
    cajaMensaje.style.display="flex"
}
function mensajeBienvenidaComponente(nombreCanal,descripcionCanal){
    const contenedorDeMensajes=document.querySelector(".mensajes-usuarios")
    const mensajeBienvenida=document.createElement("div")
    mensajeBienvenida.className="mensaje-bienvenida"
    contenedorDeMensajes.appendChild(mensajeBienvenida)
    const logoHashtag=document.createElement("div")
    logoHashtag.className="hastag-logo"
    mensajeBienvenida.appendChild(logoHashtag)
    const imagenLogo=document.createElement("img")
    imagenLogo.src="../assets/iconos/Hashtag.png"
    logoHashtag.appendChild(imagenLogo)
    const tituloMensaje=document.createElement("h1")
    tituloMensaje.textContent= `¡Te damos la bienvenida a ${nombreCanal}!`
    mensajeBienvenida.appendChild(tituloMensaje)
    const parrafoBienvenida=document.createElement("p")
    parrafoBienvenida.textContent=descripcionCanal
    mensajeBienvenida.appendChild(parrafoBienvenida)
}
function formatearFecha(fecha_json){
    const fecha = new Date(fecha_json);

    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const diaSemana = diasSemana[fecha.getUTCDay()];
    const dia = fecha.getUTCDate();
    const mes = meses[fecha.getUTCMonth()];
    const anio = fecha.getUTCFullYear();
    const hora = fecha.getUTCHours();
    const minutos = fecha.getUTCMinutes();
    const fechaFormateada = `${diaSemana}, ${dia} ${mes} ${anio} ${hora}:${minutos}`;

    console.log(fechaFormateada)
    return fechaFormateada
}
function componenteMensajeAenviarAPI(nombreUsuario,contenidoMensaje,fechaYhora,id_mensaje,id_usuario){
  const contenedorDeMensajes= document.querySelector(".mensajes");
  const contenedorEstructuraMensajes=document.createElement("div");
  contenedorEstructuraMensajes.className="contenedor-mensaje";
  contenedorEstructuraMensajes.id=id_mensaje.toString()
  const contenedorImgPerfil=document.createElement("div");
  contenedorImgPerfil.className="mensaje-perfil-img";
  const contenedorImg=document.createElement("img");
  contenedorImg.className="img-perfil";
  /* Direccion de la imagen */
  contenedorImg.src="../assets/avatares/imagen1.jpg";
  contenedorImg.alt="Foto de perfil";
  contenedorImgPerfil.appendChild(contenedorImg);
  contenedorEstructuraMensajes.appendChild(contenedorImgPerfil)
  const contenedorMensajesFotoPerfil=document.createElement("div");
  contenedorMensajesFotoPerfil.className="mensaje-con-foto-perfil";
  contenedorEstructuraMensajes.appendChild(contenedorMensajesFotoPerfil);      
  const contenedorMensajeInfo= document.createElement("div");
  contenedorMensajeInfo.className="mensaje-info";
  contenedorMensajesFotoPerfil.appendChild(contenedorMensajeInfo);
  const spanIdUsuario=document.createElement("span")
  spanIdUsuario.id=id_usuario.toString()
  contenedorMensajeInfo.appendChild(spanIdUsuario)
  const contenedorNombreRemitente=document.createElement("div");
  contenedorNombreRemitente.className="mensaje-nombre-remitente"
  /* Nombre Usuario */
  contenedorNombreRemitente.textContent=nombreUsuario;
  contenedorMensajeInfo.appendChild(contenedorNombreRemitente);
  const contenedorFechaHoraEnvio=document.createElement("div");
  contenedorFechaHoraEnvio.className="mensaje-fecha"
  /* Hora Envio */
  contenedorFechaHoraEnvio.textContent=formatearFecha(fechaYhora);
  contenedorMensajeInfo.appendChild(contenedorFechaHoraEnvio);
  const contenedorAcciones=document.createElement("div");
  contenedorAcciones.className="mensaje-acciones";
  contenedorMensajeInfo.appendChild(contenedorAcciones);
  const contenedorEditarMensaje=document.createElement("div");
  contenedorEditarMensaje.className="editar-mensaje";
  contenedorAcciones.appendChild(contenedorEditarMensaje);
  const iconoEditar=document.createElement("i");
  iconoEditar.className="fa-solid fa-pen-to-square";
  contenedorEditarMensaje.appendChild(iconoEditar);
  const contenedorEliminarMensaje=document.createElement("div");   
  contenedorEliminarMensaje.className="eliminar-mensaje";
  contenedorAcciones.appendChild(contenedorEliminarMensaje);
  const iconoEliminar=document.createElement("i");
  iconoEliminar.className="fa-solid fa-trash"; 
  contenedorEliminarMensaje.appendChild(iconoEliminar);             
  const contenedorContenidoMensaje=document.createElement("div");
  contenedorContenidoMensaje.className="mensaje";
  /* Contenido del mensaje */
  contenedorContenidoMensaje.textContent=contenidoMensaje
  contenedorMensajesFotoPerfil.appendChild(contenedorContenidoMensaje);
  contenedorDeMensajes.appendChild(contenedorEstructuraMensajes)
}