const articulos = document.getElementsByTagName("article");
const article_perfil = articulos[0];
const article_seguridad = articulos[1];
const article_foto = articulos[2];
const titulo_cabecera = document.getElementById("titulo-cabecera");
const descripcion_cabecera = document.getElementById("descripcion-cabecera");

function ocultar_articles(){
    for (let articulo of articulos){
        console.log(articulo.setAttribute('style','display:none'));
    }
}

function quitar_clases_item(){
    let item_selected_actual = document.querySelector('.item-selected');
    item_selected_actual.classList.remove('item-selected');
}

function seleccionar_item(elemento){
    quitar_clases_item()
    elemento.classList.add('item-selected');
    let item = elemento.getAttribute('id');

    ocultar_articles();
    switch (item){
        case 'li_perfil':
            article_perfil.setAttribute('style','display:block;')
            titulo_cabecera.textContent = "Mi Perfil";
            descripcion_cabecera.textContent = "Modificar Informacion Básica";
            break;
        case 'li_seguridad':
            article_seguridad.setAttribute('style','display:block;')
            titulo_cabecera.textContent = "Seguridad";
            descripcion_cabecera.textContent = "Modificar Informacion de Seguridad";
            break;
        case 'li_foto':
            article_foto.setAttribute('style','display:block;')
            titulo_cabecera.textContent = "Foto avatar";
            descripcion_cabecera.textContent = "Modificar Foto Avatar";
            break;
    }
}
