document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const inputCodigo = document.getElementById('codigo');
    const inputNombre = document.getElementById('nombre');
    const inputDescripcion = document.getElementById('descripcion');
    
    const grupoNombre = document.getElementById('grupo_nombre');
    const divMensajeError = document.getElementById('formulario_mensaje');
    const mensajeExito = document.getElementById('formulario_mensaje-exito');

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
        
        
