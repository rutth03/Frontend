// JavaScript
const inputMensaje = document.getElementById("input-mensaje");
const boton = document.getElementById("boton-enviar");
const imgEnviar= document.getElementById("img-enviar")
const contenedorDeMensajes= document.querySelector(".mensajes");
function enviarMensaje() {
  const id_canal=getCanalSeleccionado()
  const contenidoMensajeLimpio=inputMensaje.value.trim()
  console.log(id_canal)
  if (contenidoMensajeLimpio !== "" && id_canal !== null) {
    /* DESPUES CAMBIAR ID USUARIO DINAMICO */
    const id_usuario=document.querySelector(".perfil-usuario").id
    const apiRaizURL="http://127.0.0.1:5000"
    const mensajeObjeto={
                  contenido: contenidoMensajeLimpio,
                  usuario:{
                          id_usuario:id_usuario
                            },
                  id_canal: id_canal,
                  }
    const requestOption={
                    method:"POST",
                    headers: {
                              "Content-type":"application/json"
                              },                    
                    body: JSON.stringify(mensajeObjeto)
                        }   
    fetch(`${apiRaizURL}/mensaje/`,requestOption)
    .then(response=>{
      if(response.status===201){
        return response.json()
      }
      throw Error("Se produjo un error al crear el mensaje")
    })
    .then(data=> data.mensaje.id_mensaje)
    .then(id_mensaje=>{
      const requestOption={
                method:"GET",
                headers: {
                          "Content-type":"application/json"
                          }
                    }   
      console.log(id_mensaje)
      return fetch(`${apiRaizURL}/mensaje/${id_mensaje}`,requestOption)
      })
      .then(response=>{
          if(response.status===200){
            return response.json()
          }
          throw Error("Se produjo un error al recuperar el mensaje")
      })
      .then(mensaje_data=>{
        cargarComponenteMensaje(mensaje_data)
        // Limpiamos el input después de enviar el mensaje
        // Deshabilitamos el botón después de enviar el mensaje
        inputMensaje.value = "";
        boton.disabled = true;
        deshabilitarEnvio(true)      
      })
    }    
}
function cargarComponenteMensaje(jsonMensaje){
  const contenido=jsonMensaje.contenido
  /* DESPUES FORMATEAR */
  const fechaHora=jsonMensaje.fecha_hora
  const id_mensaje=jsonMensaje.id_mensaje
  const nickname=jsonMensaje.usuario.nickname
  const id_usuario=jsonMensaje.usuario.id_usuario
  const avatar=jsonMensaje.usuario.avatar
  componenteMensajeAenviarAPI(nickname,contenido,fechaHora,id_mensaje,id_usuario)
}
function getCanalSeleccionado(){
  const canal=document.querySelector(".canal-seleccionado")
  if(canal!== null){
    return canal.id
  }
  return null
}
function fechaYHoraActual(){
    let fechaYhora= new Date();
    let h=fechaYhora.getHours();  
    let m=fechaYhora.getMinutes();  
    let s=fechaYhora.getSeconds();  
    let dia=fechaYhora.getDate();  
    let mes=fechaYhora.getMonth()+1;  
    let anio=fechaYhora.getFullYear();  
    return `${dia}-${mes}-${anio} ${h}:${m}:${s}`
}
function deshabilitarEnvio(estaVacio){
  if(estaVacio){
    boton.style.cursor=null
    imgEnviar.style.filter="invert(93%) sepia(28%) saturate(464%) hue-rotate(170deg) brightness(113%) contrast(97%)";
  }
  else{
    boton.style.cursor="pointer"
    imgEnviar.style.filter="invert(51%) sepia(67%) saturate(3453%) hue-rotate(87deg) brightness(118%) contrast(93%)";
  }
}
function validarInput() {
  let estaVacio=inputMensaje.value.trim() === "";
  boton.disabled=estaVacio
  deshabilitarEnvio(estaVacio)
}

inputMensaje.addEventListener("input", validarInput);
inputMensaje.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    enviarMensaje();
  }
});



boton.addEventListener("click", enviarMensaje);


