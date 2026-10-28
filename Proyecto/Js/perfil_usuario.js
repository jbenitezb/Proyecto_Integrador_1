document.addEventListener('DOMContentLoaded', () => {
    let usuarios = JSON.parse(localStorage.getItem('lista_usuarios')) || [];
    
    // Referencias del formulario y campos de la HU-11
    const formulario = document.getElementById('formulario_perfil');
    const inputNombre = document.getElementById('nombre');
    const inputApellidos = document.getElementById('apellidos');
    const inputIdentificacion = document.getElementById('identificacion');
    const inputCorreo = document.getElementById('correo');
    const inputTelefono = document.getElementById('telefono');
    const inputFechaNacimiento = document.getElementById('fecha_nacimiento');
    const selectSexo = document.getElementById('sexo');
    const inputImagenPerfil = document.getElementById('imagen_perfil');
    const inputContrasena = document.getElementById('contrasena');
    const mensajeExito = document.getElementById('formulario_mensaje-exito');

    const togglePassword = document.getElementById('togglePassword');
    const errorFormulario = document.getElementById('error_formulario') || document.getElementById('formulario_mensaje');

    // Ocultar mensajes al cargar
    if (errorFormulario) {
        errorFormulario.textContent = '';
        errorFormulario.className = 'error campo_completo oculto';
    }
    if (mensajeExito) mensajeExito.style.display = 'none';

    const guardarEnStorage = () => {
        localStorage.setItem('lista_usuarios', JSON.stringify(usuarios));
    };

    const mostrarError = (mensaje, elementoFoco = null) => {
        if (errorFormulario) {
            errorFormulario.className = 'error campo_completo'; 
            errorFormulario.textContent = mensaje;
            errorFormulario.classList.remove('oculto');
        }
        if (mensajeExito) mensajeExito.style.display = 'none';
        if (elementoFoco) {
            elementoFoco.focus();
        }
    };

    const mostrarExitoGlobal = (mensaje) => {
        if (errorFormulario) {
            errorFormulario.textContent = '';
            errorFormulario.classList.add('oculto');
        }
        if (mensajeExito) {
            mensajeExito.style.display = 'block';
            mensajeExito.textContent = mensaje;
        }
    };

    // Evento para alternar entre mostrar y ocultar contraseña con el ojito
    if (togglePassword && inputContrasena) {
        togglePassword.addEventListener('click', () => {
            const esPassword = inputContrasena.type === 'password';
            inputContrasena.type = esPassword ? 'text' : 'password';
            if (esPassword) {
                togglePassword.classList.replace('bx-show', 'bx-hide');
            } else {
                togglePassword.classList.replace('bx-hide', 'bx-show');
            }
        });
    }

    // Validaciones al enviar el formulario de Perfil (HU-11)
    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const nombre = inputNombre ? inputNombre.value.trim() : '';
            const apellidos = inputApellidos ? inputApellidos.value.trim() : '';
            const identificacion = inputIdentificacion ? inputIdentificacion.value.trim() : '';
            const correo = inputCorreo ? inputCorreo.value.trim() : '';
            const telefono = inputTelefono ? inputTelefono.value.trim() : '';
            const fechaNacimiento = inputFechaNacimiento ? inputFechaNacimiento.value.trim() : '';
            const sexo = selectSexo ? selectSexo.value : '';
            
            // HU-17: La imagen 
            const imagenPerfil = (inputImagenPerfil && inputImagenPerfil.files[0]) ? inputImagenPerfil.files[0].name : 'avatar_default.png';
            
            const contrasena = inputContrasena ? inputContrasena.value.trim() : '';

            // Validaciones individuales en orden estricto (campo por campo)
            if (nombre === '') {
                mostrarError('Por favor, ingrese su nombre.', inputNombre);
                return;
            }
            if (nombre.length < 3) {
                mostrarError('El nombre debe tener al menos 3 caracteres.', inputNombre);
                return;
            }

            if (apellidos === '') {
                mostrarError('Por favor, ingrese sus apellidos.', inputApellidos);
                return;
            }
            if (apellidos.length < 3) {
                mostrarError('Los apellidos deben tener al menos 3 caracteres.', inputApellidos);
                return;
            }

            if (identificacion === '') {
                mostrarError('Por favor, ingrese su número de identificación.', inputIdentificacion);
                return;
            }
            const regexIdentificacion = /^\d+$/;
            if (!regexIdentificacion.test(identificacion)) {
                mostrarError('La identificación debe contener únicamente números.', inputIdentificacion);
                return;
            }

            if (correo === '') {
                mostrarError('Por favor, ingrese su correo electrónico.', inputCorreo);
                return;
            }
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexCorreo.test(correo)) {
                mostrarError('Ingrese un formato de correo electrónico válido.', inputCorreo);
                return;
            }

            if (telefono === '') {
                mostrarError('Por favor, ingrese su número de teléfono.', inputTelefono);
                return;
            }
            const regexTelefono = /^\d{8}$/;
            if (!regexTelefono.test(telefono)) {
                mostrarError('El teléfono debe contener exactamente 8 dígitos numéricos.', inputTelefono);
                return;
            }

            if (fechaNacimiento === '') {
                mostrarError('Por favor, seleccione su fecha de nacimiento.', inputFechaNacimiento);
                return;
            }
            
            const fechaSeleccionada = new Date(fechaNacimiento + 'T00:00:00'); 
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0); 

            if (isNaN(fechaSeleccionada.getTime()) || fechaSeleccionada >= hoy || fechaSeleccionada.getFullYear() < 1900) {
                mostrarError('Ingrese una fecha de nacimiento válida y no futura.', inputFechaNacimiento);
                return;
            }

            if (sexo === '') {
                mostrarError('Por favor, seleccione una opción de sexo.', selectSexo);
                return;
            }

            if (contrasena === '') {
                mostrarError('Por favor, ingrese una contraseña.', inputContrasena);
                return;
            }
            const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
            if (!regexContrasena.test(contrasena)) {
                mostrarError('La contraseña debe tener de 8 a 16 caracteres, incluir una mayúscula, una minúscula y un número.', inputContrasena);
                return;
            }

            // Validar duplicados de identificación 
            const usuarioExiste = usuarios.some(u => u.identificacion === identificacion || u.correo.toLowerCase() === correo.toLowerCase());
            if (usuarioExiste) {
                mostrarError('Ya existe una cuenta registrada con esta identificación o correo electrónico.');
                return;
            }

            // Guardar el perfil completo en el LocalStorage
            const nuevoPerfil = { 
                nombre, 
                apellidos, 
                identificacion, 
                correo, 
                telefono, 
                fechaNacimiento, 
                sexo, 
                imagenPerfil, 
                contrasena 
            };

            usuarios.push(nuevoPerfil);
            guardarEnStorage();

            mostrarExitoGlobal('¡Su perfil fue guardado con éxito!');
            
            formulario.reset();
            if (errorFormulario) {
                errorFormulario.textContent = '';
                errorFormulario.classList.add('oculto');
            }

            setTimeout(() => {
                window.location.href = 'usuarios.html';
            }, 2000);
        });
    }
});