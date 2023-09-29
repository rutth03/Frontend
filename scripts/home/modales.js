const botonAgregarCanal=document.getElementById("agregar-canal-boton");
const botonAgregarServidor=document.getElementById("agregar-servidor")
const modalAgregarCanal=document.getElementById("modal-canal");
const modalAgregarServidor=document.getElementById("modal-servidor")
const modal=document.querySelector(".modal")
const cerrarModalcanal=document.getElementById("cerrar-modal-canal")
const cerrarModalservidor=document.getElementById("cerrar-modal-servidor")
const agregarCanalModal=document.querySelector("#crear-canal")
const agregarServidorModal=document.querySelector("#crear-servidor")
const contenedorDeCanales=document.querySelector(".canales")
const inputModal=modal.getElementsByTagName("input")[0]
const textAreaDescripcionCanal=document.getElementById("canal-descripcion-textarea")
const contenedorSubirImagen=modalAgregarServidor.querySelector(".subir-imagen-servidor");
const inputFileSubirImagen=document.getElementById("input-img-servidor");
const inputNombreServidorModal=document.getElementById("servidor-nombre")
const contenedorImagenServidor=document.getElementById("imagen-servidor")
const descripcionServidorTextarea=document.getElementById("servidor-descripcion")
const mensajeErrorServidor=document.querySelector("#msj-advertencia-servidor")
const mensajeErrorCanal=document.querySelector("#msj-advertencia-canal")
const componenteSiNoExistenCanales=document.querySelector(".sin-canales-ni-servidor")

botonAgregarCanal.addEventListener("click",(e)=>{
    e.preventDefault()    
    mensajeErrorCanal.style.display="none"    
    nombreDinamicoModalCanal()
    modalAgregarCanal.classList.add("modal-mostrar")
})

botonAgregarServidor.addEventListener("click",(e)=>{
    e.preventDefault()
    mensajeErrorServidor.style.display="none"
    modalAgregarServidor.classList.add("modal-mostrar")
})

cerrarModalcanal.addEventListener("click",(e)=>{
    e.preventDefault()
    modalAgregarCanal.classList.remove("modal-mostrar")
})

cerrarModalservidor.addEventListener("click",(e)=>{
    modalAgregarServidor.classList.remove("modal-mostrar")
    contenedorImagenServidor.src="../assets/iconos/subir_imagen.png"
})

contenedorSubirImagen.addEventListener("click",(e)=>{
    inputFileSubirImagen.click();
})

inputFileSubirImagen.addEventListener('change', (e)=> {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        contenedorImagenServidor.setAttribute("src",e.target.result)
      }
      reader.readAsDataURL(selectedFile);
    }
});
agregarCanalModal.addEventListener("click",()=>{    
    const valorInput=inputModal.value
    const valorTextAreaDescripcion=textAreaDescripcionCanal.value
    if(valorInput.trim() !== ""){
       const apiRaizURL="http://127.0.0.1:5000"
       const id_servidor=getServidorSeleccionado()
       canalObjeto={nombre:valorInput,
                    descripcion:valorTextAreaDescripcion,
                    id_servidor: id_servidor} 
       const requestOption={
                            method:"POST",
                            body: JSON.stringify(canalObjeto),
                            headers: {
                                "Content-type":"application/json"
                            }
       }
       fetch(`${apiRaizURL}/canal/`,requestOption)
       .then(response=>{
            if(response.status===201){
                return response.json()
            }
            throw Error("Ocurrio un error al crear el canal")
       })
       .then(data=>{
            const id_canal=data.canal.id_canal
            const canalContenedor=canalComponenteAPI(valorInput,valorTextAreaDescripcion,id_canal);
            contenedorDeCanales.appendChild(canalContenedor);
            modal.classList.remove("modal-mostrar")
            inputModal.value=""
            textAreaDescripcionCanal.value=""
            componenteSiNoExistenCanales.style.display="none"
       })
       .catch(error=>console.log("ERROR",error))
    }
    else{
        mensajeErrorCanal.style.display="block"
    }
})

agregarServidorModal.addEventListener("click",()=>{
    const inputNombre=inputNombreServidorModal.value;
    const imagenServidor=contenedorImagenServidor.src;
    const descripcionServidor=descripcionServidorTextarea.value
    const imagenServidorInput=inputFileSubirImagen.files[0]
    console.log(imagenServidorInput)
    if(imagenServidor !== "" && inputNombre.trim() !== "" ){
        const formularioDatosServidor=new FormData()            
        formularioDatosServidor.append("imagen",imagenServidorInput)
        formularioDatosServidor.append("nombre",inputNombre)
        formularioDatosServidor.append("descripcion",descripcionServidor)
        const apiRaizURL="http://127.0.0.1:5000"
        const requestOption={
                            method:"POST",
                            body: formularioDatosServidor,                
                            }
        fetch(`${apiRaizURL}/servidor/`,requestOption)
        .then(response=>{
            if(response.status===201){
                return response.json()
            }
            throw Error("ocurrio un error al intentar crear el servidor")
        })
        .then(data=>{
            return data.servidor.id_servidor
        })
        .then(id_servidor=>{
            const id_usuario=document.querySelector(".perfil-usuario").id
            const jsonDataServidorUsuario={id_servidor:id_servidor,id_usuario:id_usuario}
            const requestOption={
                method:"POST",
                headers: {"Content-type":"application/json"},
                body:JSON.stringify(jsonDataServidorUsuario)
            }
            return fetch(`${apiRaizURL}/usuario_servidor/`,requestOption)
        }).then(response_u_s=>{
            if(response_u_s.status===201){
                return response_u_s.json()
            }
            throw Error("No se pudo crear usuario_servidor")
        }).then(data_usuario_servidor=>{
            return data_usuario_servidor.usuario_servidor.id_usuario_servidor
        }).then(id_usuario_servidor=>{
            const requestOption={
                method:"GET",
                headers: {"Content-type":"application/json"}
            }
            return fetch(`${apiRaizURL}/usuario_servidor/${id_usuario_servidor}`,requestOption)
        }).then(response_g_u_s=>{
            if(response_g_u_s.status===200){
                return response_g_u_s.json()
            }
            throw Error("NO SE PUDO OBTENER INFO DE USUARIO SERVIDOR")
        }).then(data_usuario_servidor=>{
                const rutaRaizImagenes="http://127.0.0.1:5500/static_folder/servidor_imagenes/"
                const id_usuario_servidor=data_usuario_servidor.id_usuario_servidor
                const servidor=data_usuario_servidor.servidor
                const rutaCompletaImagen=rutaRaizImagenes+servidor.imagen
                const servidorCreado=servidorComponenteAPI(servidor.nombre,rutaCompletaImagen,
                            servidor.descripcion,servidor.id_servidor,id_usuario_servidor)      

                modalAgregarServidor.classList.remove("modal-mostrar")
                alternarMensajesSinCanales_Servidores_Modales()
                servidorCreado.click()
        }).catch(error=>console.log("ERROR",error))
    }
    else{
        mensajeErrorServidor.style.display="block"
    }
    inputNombreServidorModal.value=""
    contenedorImagenServidor.src="../assets/iconos/subir_imagen.png"
    contenedorImagenServidor.alt=""
    descripcionServidorTextarea.value=""
})
function nombreDinamicoModalCanal(){
    const servidorActual=document.querySelector(".servidor-seleccionado")
    const nombreServidor=servidorActual.querySelector("span").textContent
    modalAgregarCanal.querySelector("p").textContent="en "+nombreServidor
}
function getServidorSeleccionado(){
    const servidorSeleccionado=document.querySelector(".servidor-seleccionado")
    if(servidorSeleccionado!==null){
        return servidorSeleccionado.id
    }
    return null
}
function elCanaltieneDescripcion(descripcion){
    if(descripcion.trim() !== ""){
        return descripcion
    }
    else{
        return "El canal no posee descripción"
    }
}

/* NO se puede exportar asi que repito la funcion */
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

function alternarMensajesSinCanales_Servidores_Modales(){
    const servidoresUsuario=document.querySelector(".servidores-del-usuario")
    const imagenInfoUsuario=document.querySelector(".accion-requerida-imagen").children[0];
    const descripcionInfoUsuario=document.querySelector(".accion-requerida-descripcion")
    if(servidoresUsuario.childElementCount===0){
        imagenInfoUsuario.setAttribute("src","imagenes/seleccionar-servidor.png")
        descripcionInfoUsuario.textContent="Seleccione un Servidor para comenzar"
    }
    else{
        imagenInfoUsuario.setAttribute("src","imagenes/user-interface-0.png")
        descripcionInfoUsuario.textContent="Selecciona un canal para comenzar a chatear"
    }
}
