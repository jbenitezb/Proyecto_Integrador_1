document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const inputCodigo = document.getElementById('codigo');
    const inputNombre = document.getElementById('nombre');
    const inputDescripcion = document.getElementById('descripcion');
    
    const grupoNombre = document.getElementById('grupo_nombre');
    const divMensajeError = document.getElementById('formulario_mensaje');
    const mensajeExito = document.getElementById('formulario_mensaje-exito');

    // HU-51: Elementos de la tabla y buscador
    const tablaMetodologiasBody = document.getElementById('tablaMetodologiasBody');
    const buscadorMetodologias = document.getElementById('buscadorMetodologias');

    // Generar código automático consecutivo basado en los registros almacenados (LocalStorage)
    function generarCodigoAutomatico() {
        let metodologiasGuardadas = JSON.parse(localStorage.getItem('lista_metodologias')) || [];
        let siguienteNumero = metodologiasGuardadas.length + 1;
        // Formato estandarizado de código (ej: MET-001, MET-002)
        return 'MET-' + String(siguienteNumero).padStart(3, '0');
    }

    if (inputCodigo) {
        inputCodigo.value = generarCodigoAutomatico();
    }

    // HU-51: Cargar y mostrar datos en la tabla
    function cargarTablaMetodologias(filtro = '') {
        if (!tablaMetodologiasBody) return;

        let metodologiasGuardadas = JSON.parse(localStorage.getItem('lista_metodologias')) || [];
        tablaMetodologiasBody.innerHTML = '';

        // Filtrado seguro para evitar errores si hay datos vacíos
        let metodologiasFiltradas = metodologiasGuardadas.filter(m => {
            const codigo = (m.codigo || '').toLowerCase();
            const nombre = (m.nombre || '').toLowerCase();
            return codigo.includes(filtro.toLowerCase()) || nombre.includes(filtro.toLowerCase());
        });

        if (metodologiasFiltradas.length === 0) {
            tablaMetodologiasBody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 15px; color: #666;">No hay metodologías registradas.</td></tr>`;
            return;
        }

        // Pintar las filas en la tabla dinámicamente
        metodologiasFiltradas.forEach((metodologia) => {
            let tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${metodologia.codigo || ''}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${metodologia.nombre || ''}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${metodologia.descripcion || ''}</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center;"></td>
            `;
            tablaMetodologiasBody.appendChild(tr);
        });
    }

    // Cargar la tabla al abrir la página
    cargarTablaMetodologias();

    // HU-51: Buscador de los datos en la tabla cargados del local store
    if (buscadorMetodologias) {
        buscadorMetodologias.addEventListener('input', (e) => {
            cargarTablaMetodologias(e.target.value);
        });
    }

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        let formIsValid = true;

        // Ocultar mensajes previos
        if (divMensajeError) divMensajeError.style.display = 'none';
        if (mensajeExito) mensajeExito.style.display = 'none'; 
    
         // validarción de nombre (obligatorio, mínimo 3 caracteres.)
        const valorNombre = inputNombre.value.trim();
        const errorNombreP = grupoNombre ? grupoNombre.querySelector('.formulario_input-error') : null;

        if (valorNombre === '' || valorNombre.length < 3) {
            formIsValid = false;
            inputNombre.style.borderColor = '#DC2626'; 
            if (errorNombreP) errorNombreP.style.display = 'block';
        } else {
            inputNombre.style.borderColor = '#16A34A'; 
            if (errorNombreP) errorNombreP.style.display = 'none';
        }

        // Validación de la descripcion como obligatorio
        const valorDescripcion = inputDescripcion.value.trim();
        if (valorDescripcion === '') {
            formIsValid = false;
            inputDescripcion.style.borderColor = '#DC2626';
        } else {
            inputDescripcion.style.borderColor = '#16A34A';
        }

        // validación al enviar metodología
        if (!formIsValid) {
            if (divMensajeError) divMensajeError.style.display = 'block'; 
        } else {
            // Se guarda en LocalStorage
            const nuevaMetodologia = {
                codigo: inputCodigo.value,
                nombre: valorNombre,
                descripcion: valorDescripcion,
                fechaRegistro: new Date().toISOString()
            };
        
            let guardadas = JSON.parse(localStorage.getItem('lista_metodologias')) || [];
            guardadas.push(nuevaMetodologia);
            localStorage.setItem('lista_metodologias', JSON.stringify(guardadas));

            if (mensajeExito) mensajeExito.style.display = 'block';
            if (divMensajeError) divMensajeError.style.display = 'none';

                // Actualiza la tabla de inmediato con el nuevo registro
            cargarTablaMetodologias();

            // Se limpia  el formulario y actualiza.
            setTimeout(() => {
                formulario.reset();
                inputCodigo.value = generarCodigoAutomatico();
                inputNombre.style.borderColor = '#ccc';
                inputDescripcion.style.borderColor = '#ccc';
                if (mensajeExito) mensajeExito.style.display = 'none';
            }, 2000);
        }
    });
});  
        
        
