const btn = document.getElementById("btn_login");
const formulario = document.getElementById("formulario");
btn.addEventListener("click",(e)=>{
            e.preventDefault();
            login()
        });
        
function login() {
    let datosLogin = new FormData(formulario);
    const data = {
        nickname: datosLogin.get("input_nickname_email"),
        email: datosLogin.get("input_nickname_email"),
        contrasenia: datosLogin.get("input_contrasenia"),
    };

    fetch("http://127.0.0.1:5000/usuario/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 200) {
            // Redirect to profile page if login is successful
            return response.json().then(data => {
                window.location.href = "profile.html";
            });
        } else {
            return response.json().then(data => {
                document.getElementById("message").innerHTML = data.error.description;
            });
        }
    })
    .catch(error => {
        document.getElementById("message").innerHTML = "An error occurred.";
    });
}