const canalesManejador = document.getElementById("desplegar-canales");
const angularAbierto = document.getElementById("canal-desplegado");
const angularCerrado = document.getElementById("canal-no-desplegado");
const contenedorCanales= document.querySelector(".canales");
let estadoAngular = true;

canalesManejador.addEventListener("click", (e) => {
    estadoAngular = !estadoAngular;
    /* Obtengo el contenedor de los canales */
    const contenedorCanales=e.target.nextElementSibling
    const canales= contenedorCanales.querySelectorAll(".canal");
    canales.forEach(canal =>{    
       if(!estadoAngular){
        canal.classList.add("no-mostrar") 
       }
       else{
        canal.classList.remove("no-mostrar")
       }     
       if(canal.classList.contains("canal-seleccionado")){
        canal.classList.remove("no-mostrar"); 
       }
    })
    cambiarEstadoAngular(estadoAngular)
});

function cambiarEstadoAngular(estadoAngular){
    if (estadoAngular) {
        angularCerrado.style.display = "none";
        angularAbierto.style.display = "block";
             
    } else {
        angularAbierto.style.display = "none";
        angularCerrado.style.display = "block";
    }
}
/* Resaltar canal al clicker */
contenedorCanales.addEventListener("click",(e)=>{
    const canal=e.target.closest(".canal")
    if(canal){
       const restoCanales= contenedorCanales.querySelectorAll(".canal")
       restoCanales.forEach(canal=>canal.classList.remove('canal-seleccionado'));
       canal.classList.add("canal-seleccionado");
    }    
})
