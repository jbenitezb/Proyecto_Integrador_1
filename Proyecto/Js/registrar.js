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
  
    // Antes buscaba un input editable.
    const inputEdadCalculada = document.getElementById('edad_calculada'); // Elemento span

    // Ocultar mensajes al cargar
    if (errorFormulario) {
        errorFormulario.textContent = '';
        errorFormulario.className = 'error campo_completo oculto';
    }

    const guardarEnStorage = () => {
        localStorage.setItem('lista_usuarios', JSON.stringify(usuarios));
    };

    const mostrarErrorGlobal = (mensaje) => {
        if (errorFormulario) {
            errorFormulario.className = 'error campo_completo'; 
            errorFormulario.textContent = mensaje;
            errorFormulario.classList.remove('oculto');
        }
        if (mensajeExito) {
            mensajeExito.textContent = ''; 
            mensajeExito.style.setProperty('display', 'none', 'important'); 
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
        if (!fechaNacimientoStr) return '';
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaNac = new Date(fechaNacimientoStr + 'T00:00:00');

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

    // calcular y mostrar la edad de forma dinámica en el span
    if (inputFechaNacimiento && inputEdadCalculada) { 
        if (inputFechaNacimiento.value) {
            inputEdadCalculada.textContent = calcularEdad(inputFechaNacimiento.value);
        }

        inputFechaNacimiento.addEventListener('change', () => {
            const edadStr = calcularEdad(inputFechaNacimiento.value);
            inputEdadCalculada.textContent = edadStr ? edadStr : 'Seleccione una fecha válida';
        });
    }

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

    // Validaciones al enviar el formulario
    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const nombre = inputNombre ? inputNombre.value.trim() : '';
            const primerApellido = inputPrimerApellido ? inputPrimerApellido.value.trim() : '';
            const segundoApellido = inputSegundoApellido ? inputSegundoApellido.value.trim() : ''; 
            const identificacion = inputIdentificacion.value.trim();
            const correo = inputCorreo.value.trim();
            const telefono = inputTelefono ? inputTelefono.value.trim() : '';
            const fechaNacimiento = inputFechaNacimiento ? inputFechaNacimiento.value.trim() : '';
            
        
            // midificacion edad
            const edadCalculada = inputEdadCalculada ? inputEdadCalculada.textContent.trim() : ''; 
            
            const sexo = selectSexo ? selectSexo.value : ''; 
            const imagenPerfil = (inputImagenPerfil && inputImagenPerfil.files[0]) ? inputImagenPerfil.files[0].name : 'avatar_default.png';
            const contrasena = inputContrasena ? inputContrasena.value.trim() : '';
            
            let formularioValido = true;

            // Función auxiliar para marcar grupos visualmente sin saltarse campos
            const validarCampoGrupo = (inputElemento, esValido) => {
                if (!inputElemento) {
                    formularioValido = false;
                    return;
                }
                const grupo = inputElemento.closest('.formulario_grupo');
                if (grupo) {
                    if (esValido) {
                        grupo.classList.remove('formulario_grupo-incorrecto');
                        grupo.classList.add('formulario_grupo-correcto');
                    } else {
                        grupo.classList.remove('formulario_grupo-correcto');
                        grupo.classList.add('formulario_grupo-incorrecto');
                        formularioValido = false;
                    }
                } else {
                    formularioValido = false;
                }
            };

            // 1. Validar Nombre (mínimo 3 caracteres)
            validarCampoGrupo(inputNombre, nombre.length >= 3);

            // 2. Validar Primer Apellido (mínimo 3 caracteres)
            validarCampoGrupo(inputPrimerApellido, primerApellido.length >= 3);

            // 3. Validar Segundo Apellido (mínimo 3 caracteres)
            validarCampoGrupo(inputSegundoApellido, segundoApellido.length >= 3);

            // 4. Validar Identificación 
            const regexIdentificacion = /^\d+$/;
            validarCampoGrupo(inputIdentificacion, identificacion !== '' && regexIdentificacion.test(identificacion));

            // 5. Validar Correo Electrónico
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validarCampoGrupo(inputCorreo, correo !== '' && regexCorreo.test(correo));

            // 6. Validar Teléfono (exactamente 8 dígitos)
            const regexTelefono = /^\d{8}$/;
            validarCampoGrupo(inputTelefono, telefono !== '' && regexTelefono.test(telefono));

            // 7. Validar Fecha de Nacimiento 
            let esFechaValida = false;
            if (fechaNacimiento !== '') {
                const fechaNacimientoDate = new Date(fechaNacimiento + 'T00:00:00');
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                if (!isNaN(fechaNacimientoDate.getTime()) && fechaNacimientoDate < hoy && fechaNacimientoDate.getFullYear() >= 1900) {
                    esFechaValida = true;
                }
            }
            validarCampoGrupo(inputFechaNacimiento, esFechaValida);

            // 8. Validar Sexo (opción seleccionada)
            validarCampoGrupo(selectSexo, sexo !== '');

            // 9. Validar Contraseña (8 a 15 caracteres, mayús, minús, número)
            const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/;
            validarCampoGrupo(inputContrasena, contrasena !== '' && regexContrasena.test(contrasena));

            //Si alguna validación básica fallo, se muestra aviso global y se detiene
            if (!formularioValido) {
                console.log("¡Atención! Un campo no pasó la validación. Revisa: Nombre (>=3), Apellidos (>=3), Identificación (solo números), Correo válido, Teléfono (8 dígitos), Fecha válida, Género seleccionado y Contraseña.");
                mostrarErrorGlobal('Por favor, verifique los campos marcados en rojo en el formulario.');
                return; // <-- Aquí termina y frena si hay errores en los campos básicos
            }

            // 10. Validar duplicados de identificación o correo en el Storage
            const usuarioExiste = usuarios.some(u => u.identificacion === identificacion || u.correo.toLowerCase() === correo.toLowerCase());
            if (usuarioExiste) {
                mostrarErrorGlobal('Ya existe una cuenta registrada con esta identificación o correo.');
                if (inputIdentificacion) inputIdentificacion.closest('.formulario_grupo').classList.add('formulario_grupo-incorrecto');
                if (inputCorreo) inputCorreo.closest('.formulario_grupo').classList.add('formulario_grupo-incorrecto');
                return;
            }

            // guardar en localStorage
            const nuevoUsuario = { 
                nombre, 
                primerApellido, 
                segundoApellido, 
                identificacion, 
                correo, 
                telefono, 
                contrasena, 
                fechaNacimiento, 
                edadCalculada, 
                sexo, 
                imagenPerfil 
            };
            
            usuarios.push(nuevoUsuario);
            guardarEnStorage();

            mostrarExitoGlobal('¡Su cuenta fue creada con éxito!');
            
            formulario.reset();
            if (errorFormulario) {
                errorFormulario.textContent = ''; 
                errorFormulario.classList.add('oculto');
            }

            // Limpiar clases visuales
            document.querySelectorAll('.formulario_grupo').forEach(grupo => {
                grupo.classList.remove('formulario_grupo-correcto', 'formulario_grupo-incorrecto');
            });

            // Restablecer texto 
            if (inputEdadCalculada) {
                inputEdadCalculada.textContent = 'Seleccione su fecha de nacimiento';
            }

            setTimeout(() => {
                window.location.href = 'inicio_para_catalogos.html';
            }, 2000);
        });
    }
});