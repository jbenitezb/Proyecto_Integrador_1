document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const inputCodigo = document.getElementById('codigo');
    const inputNombre = document.getElementById('nombre');
    const divMensajeError = document.getElementById('formulario_mensaje');
    const mensajeExito = document.getElementById('formulario_mensaje-exito');
    const btnCancelar = document.querySelector('.btn_cancelar');
    cargarEstados();

    if (formulario) {
        formulario.addEventListener('submit', (e) => {
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

            // Validar Nombre del Estado que es obligatorio
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
                // Guardar en localStorage de forma independiente para Estado del Curso
                let estadosGuardados = JSON.parse(localStorage.getItem('lista_estados_curso')) || [];

                const nuevoEstado = {
                    codigo: valorCodigo,
                    nombre: valorNombre,
                    fechaRegistro: new Date().toISOString()
                };

                estadosGuardados.push(nuevoEstado);
                localStorage.setItem('lista_estados_curso', JSON.stringify(estadosGuardados));

                // Mostrar mensaje de éxito
                if (mensajeExito) {
                    mensajeExito.textContent = '¡Estado del curso registrado con éxito!';
                    mensajeExito.style.display = 'block';
                }

                if (divMensajeError) divMensajeError.style.display = 'none';
                cargarEstados();

                // Limpiar el formulario tras 2 segundos
                setTimeout(() => {
                    formulario.reset();
                    inputCodigo.style.borderColor = '#ccc';
                    inputNombre.style.borderColor = '#ccc';
                    if (mensajeExito) mensajeExito.style.display = 'none';
                }, 2000);
            }
        });
    }

    // Funcionalidad del botón Cancelar
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            formulario.reset();
            if (inputCodigo) inputCodigo.style.borderColor = '#ccc';
            if (inputNombre) inputNombre.style.borderColor = '#ccc';
            if (divMensajeError) divMensajeError.style.display = 'none';
            if (mensajeExito) mensajeExito.style.display = 'none';
        });
    }
    // carga la lista de estados en la tabla
  
});
  const cargarEstados = () => {
        const tablaBody = document.getElementById('tablaEstadosBody');
        if (!tablaBody) return;

        tablaBody.innerHTML = '';
        const estadosGuardados = JSON.parse(localStorage.getItem('lista_estados_curso')) || [];

        estadosGuardados.forEach(estado => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td style="padding: 12px; border: 1px solid #ccc;">${estado.codigo}</td>
                <td style="padding: 12px; border: 1px solid #ccc;">${estado.nombre}</td>
            `;
            tablaBody.appendChild(fila);
        });
        
        
    };
    