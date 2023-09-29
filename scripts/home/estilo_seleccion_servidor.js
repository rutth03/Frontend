const contenedorServidoresEstilo=document.querySelector(".servidores-del-usuario")
contenedorServidoresEstilo.addEventListener("click",(e)=>{
    const servidor=e.target.closest(".servidores")
    if(servidor){
        quitarSeleccionado()
        servidor.classList.add("servidor-seleccionado")
    }
})
function quitarSeleccionado(){
    const contenedorServidores=Array.from(document.querySelector(".servidores-del-usuario").children)
    contenedorServidores.forEach(servidor => {
        if(servidor.classList.contains("servidor-seleccionado")){
            servidor.classList.remove("servidor-seleccionado")
        }
    });
}