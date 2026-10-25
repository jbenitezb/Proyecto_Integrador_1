document.addEventListener('DOMContentLoaded', () => {
    
    let certificaciones = JSON.parse(localStorage.getItem('lista_certificaciones')) || [];
    let editandoCodigo = null;
    
    const formulario = document.getElementById('formulario');
    const inputCodigo = document.getElementById('codigo');
    const inputNombre = document.getElementById('nombre');
    const inputDescripcion = document.getElementById('descripcion');
    const inputArchivo = document.getElementById('archivoExcel');
    const tituloFormulario = document.getElementById('titulo_formulario');
    const panelFormulario = document.getElementById('panel_formulario');
    const btnRegistrar = document.getElementById('btn_registrar');
    const btnCancelar = document.querySelector('.btn_cancelar');
    const divMensajeError = document.getElementById('formulario_mensaje');
    const mensajeExito = document.getElementById('formulario_mensaje-exito');
    
    // Hu-61 listado y contador
    const tablaBody = document.getElementById('tablaCertificacionesBody');
    const elementoConteo = document.getElementById('conteo');

    const guardarEnStorage = () => {
        localStorage.setItem('lista_certificaciones', JSON.stringify(certificaciones));
    };

    const prepararEdicion = (codigo) => {
        const certAEditar = certificaciones.find(c => c.codigo === codigo);
        if (!certAEditar) return;

        // Activamos el modo edición guardando el código actual
        editandoCodigo = codigo;

        // Cambiar el título del formulario visualmente
        if (tituloFormulario) tituloFormulario.textContent = 'Modificar Casa Certificadora o Certificación';
        
        // Cargar los datos actuales en los inputs
        if (inputCodigo) {
            inputCodigo.value = certAEditar.codigo;
            inputCodigo.disabled = false; // Bloquear el código para que no se modifique la llave primaria
        }
        if (inputNombre) inputNombre.value = certAEditar.nombre;
        if (inputDescripcion) inputDescripcion.value = certAEditar.descripcion || '';

        ocultarMensajes();
        if (panelFormulario) panelFormulario.classList.remove('oculto');
        if (inputNombre) inputNombre.focus();
    };

    // Hu-61 renderizar dinámicamente la tabla y actualizar el contador
    const mostrarCertificaciones = (lista) => {
        if (!tablaBody) return; 
        tablaBody.innerHTML = ''; 
        
        // Hu-61 Si la lista está vacía, muestra un mensaje en la tabla
        if (lista.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="4" class="tabla_vacia">No hay casas certificadoras o certificaciones registradas.</td>
                </tr>
            `;
            if (elementoConteo) elementoConteo.textContent = 'Mostrando 0 registros';
            return;
        }

        // Hu-61 recorre la lista para crear y llenar la fila 
        lista.forEach(cert => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${cert.codigo}</td>
                <td>${cert.nombre}</td>
                <td>${cert.descripcion || '-'}</td>
                <td class="columna_acciones"></td>
            `;

            // Hu-62 agrega el botón de editar a cada fila
            const celdaAcciones = fila.querySelector('.columna_acciones');
            const btnEditar = document.createElement('button');
            btnEditar.type = 'button';
            btnEditar.className = 'btn_editar';
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', () => prepararEdicion(cert.codigo));
            celdaAcciones.appendChild(btnEditar);

            tablaBody.appendChild(fila);
        });

        // Hu-61 actualiza contador 
        if (elementoConteo) {
            elementoConteo.textContent = `Mostrando ${lista.length} de ${certificaciones.length} registro(s)`;
        }
    };

    const mostrarError = (mensaje) => {
        if (divMensajeError) {
            divMensajeError.style.display = 'block';
            divMensajeError.querySelector('p').innerHTML = `<b>ERROR:</b> ${mensaje}`;
        }
        if (mensajeExito) mensajeExito.style.display = 'none';
    };

    const ocultarMensajes = () => {
        if (divMensajeError) divMensajeError.style.display = 'none';
        if (mensajeExito) mensajeExito.style.display = 'none';
    };

    // Control de apertura y cierre del panel de registro
    const abrirFormulario = () => {
        // HU-62 restablece el estado de edición
        editandoCodigo = null;
        if (inputCodigo) inputCodigo.disabled = false;
        if (tituloFormulario) tituloFormulario.textContent = 'Registrar Casa Certificadora o Certificación';
        if (formulario) formulario.reset();
        ocultarMensajes();
        if (panelFormulario) panelFormulario.classList.remove('oculto');
        if (inputCodigo) inputCodigo.focus();
    };

    const cerrarFormulario = () => {

        // HU-62 Al cerrar se limpia la variable
        editandoCodigo = null;
        if (inputCodigo) inputCodigo.disabled = false;
        if (panelFormulario) panelFormulario.classList.add('oculto');
        ocultarMensajes();
    };

    // Procesamiento de Carga Masiva csv
    const procesarCargaMasiva = (archivo) => {
        const lector = new FileReader();

        lector.onload = (e) => {
            const lineas = e.target.result.split(/\r\n|\n/);
            let agregados = 0;

            lineas.forEach((linea, index) => {
                const cols = linea.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
                
                // Omite la fila de cabecera si contiene la palabra código
                if (index === 0 && cols[0].toLowerCase().includes('codigo')) return;

                if (cols.length >= 2) {
                    const [codigo, nombre, descripcion = ''] = cols;
                    if (codigo && nombre && !certificaciones.some(c => c.codigo === codigo)) {
                        certificaciones.push({ codigo, nombre, descripcion });
                        agregados++;
                    }
                }
            });

            guardarEnStorage();
            // Hu-61 refrescar automáticamente la tabla despues de la importación masiva
            mostrarCertificaciones(certificaciones);

            if (agregados > 0) {
                if (mensajeExito) {
                    mensajeExito.textContent = `¡Se importaro ${agregados} registros correctamente!`;
                    mensajeExito.style.display = 'block';
                }
                setTimeout(() => {
                    cerrarFormulario();
                }, 1500);
            } else {
                mostrarError('Seleccione un archivo CSV o excel válido con la estructura requerida.');
            }
        };

        lector.onerror = () => {
            mostrarError('Seleccione un archivo CSV o excel válido con la estructura requerida.');
        };

        lector.readAsText(archivo);
    };

    // guardado manual o masivo
    const guardarCertificacion = (evento) => {
        evento.preventDefault();
        ocultarMensajes();

        // Validar si se seleccionó un archivo para carga masiva
        if (inputArchivo && inputArchivo.files && inputArchivo.files[0]) {
            const archivo = inputArchivo.files[0];
            const nombreArchivo = archivo.name.toLowerCase();
            
            if (!nombreArchivo.endsWith('.csv') && !nombreArchivo.endsWith('.xlsx') && !nombreArchivo.endsWith('.xls')) {
                mostrarError('Seleccione un archivo CSV o excel válido con la estructura requerida.');
                return;
            }
            procesarCargaMasiva(archivo);
            return;
        }

        // HU-62 actualiza el registro modificado en la lista
        if (editandoCodigo !== null) {
            const nombre = inputNombre.value.trim();
            const descripcion = inputDescripcion.value.trim();

            if (nombre === '' || nombre.length < 3) {
                mostrarError('Ingrese un nombre válido (mínimo 3 caracteres).');
                return;
            }

            const index = certificaciones.findIndex(c => c.codigo === editandoCodigo);
            if (index !== -1) {
                certificaciones[index].nombre = nombre;
                certificaciones[index].descripcion = descripcion;
            }

            guardarEnStorage();
            mostrarCertificaciones(certificaciones);

            if (mensajeExito) {
                mensajeExito.textContent = '¡Registro modificado satisfactoriamente!';
                mensajeExito.style.display = 'block';
            }

            setTimeout(() => {
                cerrarFormulario();
            }, 1500);
            return; 
        }

        // Validación de campos obligatorios para registro manual
        const codigo = inputCodigo.value.trim();
        const nombre = inputNombre.value.trim();
        const descripcion = inputDescripcion.value.trim();

        if (codigo === '') {
            mostrarError('Ingrese un código válido.');
            return;
        }

        if (nombre === '' || nombre.length < 3) {
            mostrarError('Ingrese un nombre válido (mínimo 3 caracteres).');
            return;
        }

        // Validar que el código no esté duplicado
        const codigoDuplicado = certificaciones.some(c => c.codigo === codigo);
        if (codigoDuplicado) {
            mostrarError('El código ingresado ya está en uso por otro registro.');
            return;
        }

        // Registrar nuevo elemento
        const nuevoItem = { codigo, nombre, descripcion };
        certificaciones.push(nuevoItem);
        guardarEnStorage();
        // Hu-61 Refrescar automáticamente la tabla despues de completar el registro manual
        mostrarCertificaciones(certificaciones);

        if (mensajeExito) {
            mensajeExito.textContent = '¡Registro guardado satisfactoriamente!';
            mensajeExito.style.display = 'block';
        }

        setTimeout(() => {
            cerrarFormulario();
        }, 1500);
    };

    if (btnRegistrar) btnRegistrar.addEventListener('click', abrirFormulario);
    if (btnCancelar) btnCancelar.addEventListener('click', cerrarFormulario);
    if (formulario) formulario.addEventListener('submit', guardarCertificacion);
    mostrarCertificaciones(certificaciones);
});