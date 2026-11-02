document.addEventListener('DOMContentLoaded', () => {
    let usuarios = JSON.parse(localStorage.getItem('lista_usuarios')) || [];
    //Hu-10
    const formulario = document.getElementById('formulario_registro');
    const inputNombre = document.getElementById('nombre');
    const inputPrimerApellido = document.getElementById('primer_apellido'); 
    const inputSegundoApellido = document.getElementById('segundo_apellido'); 
    const inputIdentificacion = document.getElementById('identificacion');
    const inputCorreo = document.getElementById('correo');
    const inputTelefono = document.getElementById('telefono'); 
    const inputContrasena = document.getElementById('contrasena');
    const inputFechaNacimiento = document.getElementById('fechaNacimiento');
    const selectSexo = document.getElementById('sexo'); 
    const inputImagenPerfil = document.getElementById('imagen_perfil'); 
    const mensajeExito = document.getElementById('formulario_mensaje-exito');

    const togglePassword = document.getElementById('togglePassword');
    
    // Hu-10 error 
    const errorFormulario = document.getElementById('aviso');
    const inputEdadCalculada = document.getElementById('edad_calculada'); 

    // Ocultar mensajes al cargar
    if (errorFormulario) { // 
        errorFormulario.textContent = '';
        errorFormulario.className = 'error campo_completo oculto';
    }
    const guardarEnStorage = () => {
        localStorage.setItem('lista_usuarios', JSON.stringify(usuarios));
    };

    const mostrarError = (mensaje, elementoFoco = null) => {
    if (errorFormulario) {
        errorFormulario.className = 'error campo_completo'; 
        errorFormulario.textContent = mensaje;
        errorFormulario.classList.remove('oculto');
    }
    if (mensajeExito) mensajeExito.textContent = ''; mensajeExito.style.setProperty('display', 'none', 'important'); 
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
            mensajeExito.textContent = mensaje;
            mensajeExito.classList.remove('oculto');
            mensajeExito.style.setProperty('display', 'block', 'important');
            mensajeExito.style.setProperty('color', '#16A34A', 'important');
        }
    };

    function calcularEdad(fechaNacimientoStr) { 
        if (!fechaNacimientoStr) return 'N/D';
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaNac = new Date(fechaNacimientoStr + 'T00:00:00');

        // Evita fechas futuras o inválidas y limpia el campo
        if (isNaN(fechaNac.getTime()) || fechaNac >= hoy) {
            return ''; 
        }
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        return `${edad} años`;
    }

    // Calcular y mostrar la edad de forma dinámica 
    if (inputFechaNacimiento && inputEdadCalculada) { 
        if (inputFechaNacimiento.value) {
            inputEdadCalculada.value = calcularEdad(inputFechaNacimiento.value);
        }

        inputFechaNacimiento.addEventListener('change', () => {
            inputEdadCalculada.value = calcularEdad(inputFechaNacimiento.value);
        });
    }

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

            const nombre = inputNombre? inputNombre.value.trim() : '';
            const primerApellido = inputPrimerApellido ? inputPrimerApellido.value.trim() : '';
            const segundoApellido = inputSegundoApellido ? inputSegundoApellido.value.trim() : ''; 
            const identificacion = inputIdentificacion.value.trim();
            const correo = inputCorreo.value.trim();
            const telefono = inputTelefono ? inputTelefono.value.trim() : '';
            const fechaNacimiento = inputFechaNacimiento ? inputFechaNacimiento.value.trim() : '';
            const edadCalculada = inputEdadCalculada ? inputEdadCalculada.value.trim() : calcularEdad(fechaNacimiento); 
            const sexo = selectSexo ? selectSexo.value : ''; 
            const imagenPerfil = (inputImagenPerfil && inputImagenPerfil.files[0]) ? inputImagenPerfil.files[0].name : 'avatar_default.png';
            const contrasena = inputContrasena ? inputContrasena.value.trim() : '';
            

            // Hu-10 Validar campos vacíos
            if (nombre === '') {
                mostrarError('Todos los campos son obligatorios.');
                return;
            }
            // Hu-10 validar Nombre son mínimo 3 caracteres
            if (nombre.length < 3) {
                mostrarError('El nombre debe tener al menos 3 caracteres.');
                inputNombre.focus();
                return;
            }
            if (primerApellido === '') { 
                mostrarError('Por favor, ingrese su primer apellido.', inputPrimerApellido);
                return;
            }
            // Hu-10Validar Apellidos  son mínimo 3 caracteres
            if (primerApellido.length < 3) {
                mostrarError('El primer apellido debe tener al menos 3 caracteres', inputPrimerApellido);
                return;
            }
            if (segundoApellido === '') { 
                mostrarError('Por favor, ingrese su segundo apellido.', inputSegundoApellido);
                return;
            }
            if (segundoApellido.length < 3) { 
                mostrarError('El segundo apellido debe tener al menos 3 caracteres.', inputSegundoApellido);
                return;
            }

            if (identificacion === '') {
                mostrarError('Por favor, ingrese su número de identificación.', inputIdentificacion);
                return;
            }
            // Hu-10 validar Identificación "numérico"
            const regexIdentificacion = /^\d+$/;
            if (!regexIdentificacion.test(identificacion)) {
                mostrarError('La identificación debe contener únicamente números.', inputIdentificacion);
                return;
            }

            // Hu-10 validar Correo Electrónico
            if (correo === '') {
                mostrarError('Por favor, ingrese su correo electrónico.', inputCorreo);
                return;
            }
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexCorreo.test(correo)) {
                mostrarError('Ingrese un formato de correo electrónico válido.');
                inputCorreo.focus();
                return;
            }

            if (telefono === '') { 
                mostrarError('Por favor, ingresé su número de teléfono.', inputTelefono);
                return;
            }
            const regexTelefono = /^\d{8}$/;
            if (!regexTelefono.test(telefono)) {
                mostrarError('El teléfono debe contener exactamente 8 dígitos numéricos.', inputTelefono);
                return;
            }
            
            //  HU-15: Validar que la fecha de nacimiento no sea una fecha futura
            if (fechaNacimiento === '') {
                mostrarError('Por favor, seleccione su fecha de nacimiento.', inputFechaNacimiento);
                return;
            }
            const fechaNacimientoDate = new Date(fechaNacimiento + 'T00:00:00');
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            if (isNaN(fechaNacimientoDate) || fechaNacimientoDate >= hoy || fechaNacimientoDate.getFullYear() < 1900) {
                mostrarError('Ingrese una fecha de nacimiento válida y no futura.', inputFechaNacimiento);
                inputFechaNacimiento.focus();
                return;
            }
             // Hu- 10 validar Contraseña 8 a 16 caracteres, una minúscula, una mayúscula, un número
             if (contrasena === '') {
                mostrarError('Por favor, ingrese una contraseña.', inputContrasena);
                return;
            }
            const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/;
            if (!regexContrasena.test(contrasena)) {
                mostrarError('La contraseña debe tener de 8 a 15 caracteres, incluir una mayúscula, una minúscula y un número.', inputContrasena);
                return;
            }

            // Hu-10 Validar duplicados de identificación o correo en el Storage
            const usuarioExiste = usuarios.some(u => u.identificacion === identificacion || u.correo.toLowerCase() === correo.toLowerCase());
            if (usuarioExiste) {
                mostrarError('Ya existe una cuenta registrada con esta identificación o correo.');
                return;
            }

            if (sexo === '') { 
                mostrarError('Por favor, seleccione una opción de sexo.', selectSexo);
                return;
            }


            
            //Hu-10
            const nuevoUsuario = { nombre, primerApellido, segundoApellido, identificacion, correo, telefono, contrasena, fechaNacimiento, edadCalculada,sexo, imagenPerfil, };
            usuarios.push(nuevoUsuario);
            guardarEnStorage();

            mostrarExitoGlobal('¡Su cuenta fue creada con éxito!');
            
            formulario.reset();
            if (errorFormulario) errorFormulario.textContent = ''; errorFormulario.classList.add('oculto');

            setTimeout(() => {
                window.location.href = 'gestion_usuarios.html';
            }, 2000);
        });
    }
});