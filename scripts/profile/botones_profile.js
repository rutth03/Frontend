const btn_guardar_perfil =document.getElementById("btn_guardar_perfil");
const btn_editar_perfil =document.getElementById("btn_editar_perfil");
const btn_cancelar_perfil =document.getElementById("btn_cancelar_perfil");
const form_perfil = document.forms["form-perfil"];

const btn_guardar_seguridad =document.getElementById("btn_guardar_seg");
const btn_editar_seguridad =document.getElementById("btn_editar_seg");
const btn_cancelar_seguridad =document.getElementById("btn_cancelar_seg");
const form_seguridad = document.forms["form-seguridad"];


btn_editar_perfil.addEventListener("click",(e)=>{
    e.preventDefault();
    activarEdicion(form_perfil);
    btn_guardar_perfil.style = "display:inline-block";
    btn_cancelar_perfil.style = "display:inline-block";
    btn_editar_perfil.style.display = "none";
})

btn_cancelar_perfil.addEventListener("click",(e)=>{
    e.preventDefault();
    btn_guardar_perfil.style.display = "none";
    btn_cancelar_perfil.style.display = "none";
    btn_editar_perfil.style.display = "inline-block";
    desactivarEdicion(form_perfil);
    reloadForms();
    let message_error = document.getElementById("message_error_perfil");
    message_error.innerText = "";
})

btn_guardar_perfil.addEventListener("click",(e)=>{
    e.preventDefault();
    if(validarFormulario(form_perfil)){
        btn_guardar_perfil.style.display = "none";
        btn_cancelar_perfil.style.display = "none";
        btn_editar_perfil.style.display = "inline-block";
        guardarPerfil();
        desactivarEdicion(form_perfil)
    }else{
        let message_error = document.getElementById("message_error_perfil");
        message_error.innerText = "Verifique que los campos no esten vacios."
    }
    
})

function activarEdicion(formulario){
    for(let elemento of formulario){
        if (elemento.type != "submit"){
            elemento.removeAttribute('readonly',false);
        }
    }  
}

function desactivarEdicion(formulario){
    for(let elemento of formulario){
        if (elemento.type != "submit"){
            elemento.setAttribute('readonly',true);
        }
    }
}

function guardarPerfil(){
    let datosLogin = new FormData(document.getElementById("form-perfil"));
    const datos = {
        nombre : datosLogin.get("input_nombre"), 
        apellido : datosLogin.get("input_apellido"), 
        fecha_nac : datosLogin.get("input_fecha"), 
        nickname : datosLogin.get("input_nickname"),
    };
    console.log(datos);
    const url = "http://127.0.0.1:5000/usuario/update";
    fetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(datos),
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            // Redirect to profile page if login is successful
            return response.json().then(res => {
                /* reloadForms(); */
                window.location.reload();
            });
        } else {
            return response.json().then(res => {
                document.getElementById("message").innerHTML = res.error.description;
            });
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "An error occurred.";
    });
}

btn_editar_seguridad.addEventListener("click",(e)=>{
    e.preventDefault();
    activarEdicion(form_seguridad);
    btn_guardar_seguridad.style = "display:inline-block";
    btn_cancelar_seguridad.style = "display:inline-block";
    btn_editar_seguridad.style.display = "none";
})

btn_cancelar_seguridad.addEventListener("click",(e)=>{
    e.preventDefault();
    btn_guardar_seguridad.style.display = "none";
    btn_cancelar_seguridad.style.display = "none";
    btn_editar_seguridad.style.display = "inline-block";
    desactivarEdicion(form_seguridad);
    reloadForms();
})

btn_guardar_seguridad.addEventListener("click",(e)=>{
    e.preventDefault();
    if (validarFormulario(form_seguridad)){
        updateSeguridad();
    }else{
        document.getElementById("message_error_seg").innerHTML = "Los campos no deben estar vacios";
    }
    
})

const reloadForms = () => {
    const url = "http://127.0.0.1:5000/usuario/profile";
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                form_perfil[0] = data.nickname;
                form_perfil[1] = data.nombre;
                form_perfil[2] = data.apellido;
                form_perfil[3] = data.fecha_nac;
                form_seguridad[0] = data.email;
            });
        }else{
            return response.json().then(data => {
                console.log(data.error.description);
            });
        }
    })
    .catch(error => {
        console.log("An error occurred.");
    });
}

const cerrarSession = ()=>{
    const url = "http://127.0.0.1:5000/usuario/logout";
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                console.log(data);
                window.location.href = 'login.html'
            });
        }else{
            return response.json().then(data => {
                console.log(data.error.description);
            });
        }
    })
    .catch(error => {
        console.log("An error occurred.");
    });
}


function validarFormulario(formulario){
    for(let elemento of formulario){
        if (elemento.type != "submit"){
            if (elemento.value == ""){
                return false;
            }
        }
    }
    return true;
}

function cambiarSeguridad(){
    let datosLogin = new FormData(document.getElementById("form-seguridad"));
    const datos = {
        email : datosLogin.get("input_email"), 
        contrasenia : datosLogin.get("input_contrasenia_nueva"), 
    };
    console.log(datos);
    const url = "http://127.0.0.1:5000/usuario/update";
    fetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            // Redirect to profile page if login is successful
            return response.json().then(res => {
                cerrarSession();
            });
        } else {
            return response.json().then(res => {
                document.getElementById("message_error_seg").innerHTML = res.error.description;
            });
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "An error occurred.";
    });
}

function updateSeguridad(){
    const url = "http://127.0.0.1:5000/usuario/profile";
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                if(data.contrasenia == form_seguridad[1].value){
                    if(form_seguridad[2].value === form_seguridad[3].value){
                        cambiarSeguridad();
                    }else{
                        document.getElementById("message_error_seg").innerHTML = "las contraseñas no coinciden";
                    }
                }else{
                    document.getElementById("message_error_seg").innerHTML = "Error de contrasenia";
                }
            });
        }else{
            return response.json().then(data => {
                console.log(data.error.description);
            });
        }
    })
    .catch(error => {
        console.log("An error occurred.");
    });
}

