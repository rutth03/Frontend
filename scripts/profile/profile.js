window.addEventListener('load',function(){
    getProfile();
});
const in_nickname = document.getElementById('input_nickname');

const in_nombre = document.getElementById('input_nombre');

const in_apellido = document.getElementById('input_apellido');

const in_fecha = document.getElementById('input_fecha');

const in_email = document.getElementById('input_email');

const in_contra = document.getElementById('input_contrasenia');

const in_contra_nueva = document.getElementById('input_contrasenia_nueva');

const in_contra_nueva2 = document.getElementById('input_contrasenia_conf');

const in_imagen = document.getElementById('input_imagen');


function getProfile() {
    const url = "http://127.0.0.1:5000/usuario/profile";
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                in_nickname.value = data.nickname;

                in_nombre.value = data.nombre;
                
                in_apellido.value = data.apellido;

                let fecha = new Date(data.fecha_nac);
                let fecha_format = fecha.toJSON().slice(0,10)
                in_fecha.value = fecha_format;

                in_email.value = data.email;

                in_imagen.value = data.avatar;
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

function cerrarSesion(){
    const url = "http://127.0.0.1:5000/usuario/logout";
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            return response.json().then(data => {
                console.log(data);
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