const contendorResultadoServidor=document.querySelector(".resultado-servidores")

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
    const main=document.querySelector("main")
    main.id=data.id_usuario
}).catch(error=>console.log("Error",error))

contendorResultadoServidor.addEventListener("click",(e)=>{
    const botonApretado=e.target.closest(".boton-ingresar-servidor")
    if(botonApretado){
        const id_servidor=botonApretado.parentNode.id
        const id_usuario=document.querySelector("main").id
        const requestOption={
            methods:"GET",
            headers:{
                "Accept":"application/json"
            }
        }        
        const queryString = "id_usuario=" + id_usuario +"&id_servidor=" + id_servidor
        console.log(queryString)
        fetch(`${apiRaizURL}/usuario_servidor/usuario_existe?${queryString}`,requestOption)
        .then(response=>{
            if(response.status===200){
                return response.json()
            }
            throw Error("No se pudo obtener el estado del usuario")
        })
        .then(data=>{
            if(!data.estado){
                ingresarAServidor(id_usuario,id_servidor)
            }
            else{
                alert("El usuario ya se encuentra en el servidor indicado")
            }
        }).catch(error=>console.log("ERROR",error))/* 

        
        alert("se apreto el boton con el servidor id"+id_servidor.id) */
    }
})
function ingresarAServidor(id_usuario,id_servidor){
    const json_request={id_usuario:id_usuario,
                        id_servidor:id_servidor}
    const requestOption={
                    method:"POST",
                    body: JSON.stringify(json_request),
                    headers: {
                        "Content-type":"application/json"
                    }
                }
    fetch(`${apiRaizURL}/usuario_servidor/`,requestOption)
    .then(response=>{
        if(response.status===201){
            alert("Ingreso con exito al servidor")
        }
        else{
            throw Error("Ocurrio un error al ingresar al servidor")
        }
    }).catch(error=>console.log("ERROR",error))

}