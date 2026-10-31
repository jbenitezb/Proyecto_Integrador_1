function cerrarSesion() {
    sessionStorage.removeItem('sesion');
    window.location.replace('iniciar_session.html');
}

document.addEventListener('DOMContentLoaded', function () {
    var boton = document.querySelector('.btn_salir');
    if (boton) {
        boton.addEventListener('click', cerrarSesion);
    }
});
