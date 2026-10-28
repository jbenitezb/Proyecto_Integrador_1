document.addEventListener('DOMContentLoaded', () => {
    let usuarios = JSON.parse(localStorage.getItem('lista_usuarios')) || [];
    //Hu-10
    const formulario = document.getElementById('formulario_registro');
    const inputNombre = document.getElementById('nombre');
    const inputApellidos = document.getElementById('apellidos');
    const inputIdentificacion = document.getElementById('identificacion');
    const inputCorreo = document.getElementById('correo');
    const inputContrasena = document.getElementById('contrasena');
    const mensajeExito = document.getElementById('formulario_mensaje-exito');

    const togglePassword = document.getElementById('togglePassword');
    
    // Hu-10 error 
    const errorFormulario = document.getElementById('error_formulario') || document.getElementById('formulario_mensaje');

    // Ocultar mensajes al cargar
    if (errorFormulario) errorFormulario.textContent = '';
    if (mensajeExito) mensajeExito.style.display = 'none';

    const guardarEnStorage = () => {
        localStorage.setItem('lista_usuarios', JSON.stringify(usuarios));
    };

    const mostrarError = (mensaje) => {
    if (errorFormulario) {
        errorFormulario.className = 'error campo_completo'; 
        errorFormulario.textContent = mensaje;
    }
};

    const mostrarExitoGlobal = (mensaje) => {
        if (errorFormulario) errorFormulario.textContent = '';
        if (mensajeExito) {
            mensajeExito.style.display = 'block';
            mensajeExito.textContent = mensaje;
        }
    };
 // Evento para alternar entre mostrar y ocultar contraseña con el ojito
    if (togglePassword && inputContrasena) {
        togglePassword.addEventListener('click', () => {
            const esPassword = inputContrasena.type === 'password';
            
            // Cambia el tipo de input
            inputContrasena.type = esPassword ? 'text' : 'password';

            // Cambia las clases de Boxicons de forma limpia
            if (esPassword) {
                togglePassword.classList.replace('bx-show', 'bx-hide');
            } else {
                togglePassword.classList.replace('bx-hide', 'bx-show');
            }
        });
    }

    // Validaciones al enviar el formulario
    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const nombre = inputNombre.value.trim();
            const apellidos = inputApellidos.value.trim();
            const identificacion = inputIdentificacion.value.trim();
            const correo = inputCorreo.value.trim();
            const contrasena = inputContrasena.value.trim();

            // Hu-10 Validar campos vacíos
            if (nombre === '' || apellidos === '' || identificacion === '' || correo === '' || contrasena === '') {
                mostrarError('Todos los campos son obligatorios.');
                return;
            }

            // Hu-10 validar Nombre son mínimo 3 caracteres
            if (nombre.length < 3) {
                mostrarError('El nombre debe tener al menos 3 caracteres.');
                inputNombre.focus();
                return;
            }

            // Hu-10Validar Apellidos  son mínimo 3 caracteres
            if (apellidos.length < 3) {
                mostrarError('Los apellidos deben tener al menos 3 caracteres.');
                inputApellidos.focus();
                return;
            }

            // Hu-10 validar Identificación "numérico"
            const regexIdentificacion = /^\d+$/;
            if (!regexIdentificacion.test(identificacion)) {
                mostrarError('La identificación debe contener únicamente números.');
                inputIdentificacion.focus();
                return;
            }

            // Hu-10 validar Correo Electrónico
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexCorreo.test(correo)) {
                mostrarError('Ingrese un formato de correo electrónico válido.');
                inputCorreo.focus();
                return;
            }

            // Hu- 10 validar Contraseña 8 a 16 caracteres, una minúscula, una mayúscula, un número
            const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
            if (!regexContrasena.test(contrasena)) {
                mostrarError('La contraseña debe tener de 8 a 16 caracteres, incluir una mayúscula, una minúscula y un número.');
                inputContrasena.focus();
                return;
            }

            // Hu-10 Validar duplicados de identificación o correo en el Storage
            const usuarioExiste = usuarios.some(u => u.identificacion === identificacion || u.correo === correo);
            if (usuarioExiste) {
                mostrarError('Ya existe una cuenta registrada con esta identificación o correo.');
                return;
            }
            //Hu-10
            const nuevoUsuario = { nombre, apellidos, identificacion, correo, contrasena };
            usuarios.push(nuevoUsuario);
            guardarEnStorage();

            mostrarExitoGlobal('¡Su cuenta fue creada con éxito!');
            
            formulario.reset();
            if (errorFormulario) errorFormulario.textContent = '';

            setTimeout(() => {
                window.location.href = 'usuarios.html';
            }, 2000);
        });
    }
});