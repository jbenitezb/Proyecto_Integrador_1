document.addEventListener('DOMContentLoaded', () => {

    let estadosGuardados = JSON.parse(localStorage.getItem('lista_estados_curso')) || [];
    let editando = null; 

    const formulario = document.getElementById('formulario');
    const inputCodigo = document.getElementById('codigo');
    const inputNombre = document.getElementById('nombre');
    const divMensajeError = document.getElementById('formulario_mensaje');
    const mensajeExito = document.getElementById('formulario_mensaje-exito');
    const btnCancelar = document.querySelector('.btn_cancelar');
    const tablaBody = document.getElementById('tablaEstadosBody');
    const inputBuscar = document.getElementById('buscador');  // Guarda los datos en el localStorage
    const guardarEnStorage = () => {
        localStorage.setItem('lista_estados_curso', JSON.stringify(estadosGuardados));
    };

    // Carga y lista los estados en la tabla (HU-36 y HU-37)
    const cargarEstados = () => {
        if (!tablaBody) return;
        tablaBody.innerHTML = '';
        //Hu-39
            const textoBusqueda = inputBuscar ? inputBuscar.value.toLowerCase().trim() : '';
        //  Filtrar el arreglo según la búsqueda
            const estadosFiltrados = estadosGuardados.filter(estado => {
                const codigoCoincide = estado.codigo.toLowerCase().includes(textoBusqueda);
                const nombreCoincide = estado.nombre.toLowerCase().includes(textoBusqueda);
                
                return codigoCoincide || nombreCoincide;
            });

        estadosFiltrados.forEach((estado) => {

            const indiceOriginal = estadosGuardados.indexOf(estado);
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td style="padding: 12px; border: 1px solid #ccc;">${estado.codigo}</td>
                <td style="padding: 12px; border: 1px solid #ccc;">${estado.nombre}</td>
                <td style="padding: 12px; border: 1px solid #ccc; text-align: center;">
                    <button type="button" class="btn_editar" data-indice="${indiceOriginal}">EDITAR</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    };

    // Prepara el formulario para editar un estado que existe (HU-37)
    const editarEstado = (index) => {
        if (index < 0 || index >= estadosGuardados.length) return;

        editando = index;
        const estadoAEditar = estadosGuardados[index];

        if (inputCodigo) {
            inputCodigo.value = estadoAEditar.codigo || '';
            inputCodigo.readOnly = false; 
            inputCodigo.style.backgroundColor = '#fff';
        }
        if (inputNombre) {
            inputNombre.value = estadoAEditar.nombre || '';
        }

        if (divMensajeError) divMensajeError.style.display = 'none';
        if (mensajeExito) mensajeExito.style.display = 'none';
        if (inputNombre) inputNombre.focus();
    };

    //( HU-35 y HU-37) Validaciones y envío del formulario 
    const guardarEstado = (e) => {
        e.preventDefault();

        let formIsValid = true;

        // Ocultar mensajes
        if (divMensajeError) divMensajeError.style.display = 'none';
        if (mensajeExito) mensajeExito.style.display = 'none';

        // Validar Código
        const valorCodigo = inputCodigo.value.trim();
        if (valorCodigo === '') {
            formIsValid = false;
            inputCodigo.style.borderColor = '#DC2626';
        } else {
            inputCodigo.style.borderColor = '#16A34A';
        }

        // Validar Nombre del Estado "obligatorio"
        const valorNombre = inputNombre.value;
        if (valorNombre === '') {
            formIsValid = false;
            inputNombre.style.borderColor = '#DC2626';
        } else {
            inputNombre.style.borderColor = '#16A34A';
        }

        // Si la validación falla
        if (!formIsValid) {
            if (divMensajeError) divMensajeError.style.display = 'block';
        } else {
            if (editando === null) {
                // HU-35: Registrar nuevo estado
                const nuevoEstado = {
                    codigo: valorCodigo,
                    nombre: valorNombre,
                    fechaRegistro: new Date().toISOString()
                };

                estadosGuardados.push(nuevoEstado);

                if (mensajeExito) {
                    mensajeExito.textContent = '¡Estado del curso registrado con éxito!';
                    mensajeExito.style.display = 'block';
                }
            } else {
                //  HU-37 Modificar estado existente
                estadosGuardados[editando].codigo = valorCodigo;
                estadosGuardados[editando].nombre = valorNombre;

                if (mensajeExito) {
                    mensajeExito.textContent = '¡Estado del curso modificado con éxito!';
                    mensajeExito.style.display = 'block';
                }
            }

            guardarEnStorage();
            if (divMensajeError) divMensajeError.style.display = 'none';
            cargarEstados();

            // Limpiar el formulario tras 2 segundos
            setTimeout(() => {
                formulario.reset();
                if (inputCodigo) {
                    inputCodigo.readOnly = false;
                    inputCodigo.style.backgroundColor = '#fff';
                    inputCodigo.style.borderColor = '#ccc';
                }
                if (inputNombre) inputNombre.style.borderColor = '#ccc';
                if (mensajeExito) mensajeExito.style.display = 'none';
                editando = null;
            }, 2000);
        }
    };

    // Funcionalidad del botón Cancelar
    const cancelarEdicion = () => {
        formulario.reset();
        if (inputCodigo) {
            inputCodigo.readOnly = false;
            inputCodigo.style.backgroundColor = '#fff';
            inputCodigo.style.borderColor = '#ccc';
        }
        if (inputNombre) inputNombre.style.borderColor = '#ccc';
        if (divMensajeError) divMensajeError.style.display = 'none';
        if (mensajeExito) mensajeExito.style.display = 'none';
        editando = null;
    };

    // Eventos
    if (formulario) formulario.addEventListener('submit', guardarEstado);
    if (btnCancelar) btnCancelar.addEventListener('click', cancelarEdicion);
    if (inputBuscar) {
        inputBuscar.addEventListener('input', cargarEstados);
    }
    if (tablaBody) {
        tablaBody.addEventListener('click', (evento) => {
            const boton = evento.target.closest('.btn_editar');
            if (boton) {
                const index = parseInt(boton.getAttribute('data-indice'), 10);
                editarEstado(index);
            }
        });
    }

    cargarEstados();
});