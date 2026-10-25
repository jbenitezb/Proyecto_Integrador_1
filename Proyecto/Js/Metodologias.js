document.addEventListener('DOMContentLoaded', () => {
    
    let metodologias = JSON.parse(localStorage.getItem('lista_metodologias')) || [];
    let editando = null;

    const formulario = document.getElementById('formulario');
    const inputCodigo = document.getElementById('codigo');
    const inputNombre = document.getElementById('nombre');
    const inputDescripcion = document.getElementById('descripcion');
    const buscadorInput = document.getElementById('buscador');
     const cuerpoTabla = document.getElementById('cuerpo_tabla');
    const conteoEl = document.getElementById('conteo');
    const tituloFormulario = document.getElementById('titulo_formulario');
    const panelFormulario = document.getElementById('panel_formulario');
    const avisoCaja = document.getElementById('aviso');
    const btnRegistrar = document.getElementById('btn_registrar');
    const btnCancelar = document.getElementById('btn_cancelar');

    const guardarEnStorage = () => {
        localStorage.setItem('lista_metodologias', JSON.stringify(metodologias));
    };

    const esc = (texto) => {
        if (!texto) return '';
        return String(texto)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    const normalizar = (texto) => {
        return String(texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const mostrarAviso = (mensaje, tipo) => {
        if (avisoCaja) {
            avisoCaja.textContent = mensaje;
            avisoCaja.className = `aviso ${tipo}`;
        }
    };

    const ocultarAviso = () => {
        if (avisoCaja) avisoCaja.className = 'aviso oculto';
    };

    // Busqueda
    const listarMetodologias = () => {
        const filtro = normalizar(buscadorInput ? buscadorInput.value.trim() : '');
        let html = '';
        let mostradas = 0;

        metodologias.forEach((m, index) => {
            const textoCompleto = normalizar(`${m.codigo || ''} ${m.nombre || ''} ${m.descripcion || ''}`);

            if (filtro === '' || textoCompleto.includes(filtro)) {
                mostradas++;
                html += `
                    <tr>
                        <td style="border: 1px solid #ccc; padding: 10px;" class="codigo">${esc(m.codigo)}</td>
                        <td style="border: 1px solid #ccc; padding: 10px;">${esc(m.nombre)}</td>
                        <td style="border: 1px solid #ccc; padding: 10px;">${esc(m.descripcion)}</td>
                        <td style="border: 1px solid #ccc; padding: 10px; text-align: center;" class="acciones">
                            <button type="button" class="btn_tabla" data-indice="${index}">EDITAR</button>
                        </td>
                    </tr>
                `;
            }
        });

        if (mostradas === 0) {
            const mensajeVacio = metodologias.length === 0 
                ? 'No hay metodologías para mostrar.' 
                : 'No se encontraron metodologías con esa búsqueda.';
            html = `<tr><td colspan="4" style="text-align: center; padding: 15px; border: 1px solid #ccc; color: #666;">${mensajeVacio}</td></tr>`;
        }

        if (cuerpoTabla) cuerpoTabla.innerHTML = html;
        if (conteoEl) conteoEl.textContent = `Mostrando ${mostradas} de ${metodologias.length} metodologías`;
    };

    // coontrola el formulario
    const abrirFormulario = () => {
        editando = null;
        if (tituloFormulario) tituloFormulario.textContent = 'Registrar Nueva Metodología';
        if (formulario) formulario.reset();
        if (inputCodigo) inputCodigo.readOnly = false;
        
        ocultarAviso();
        if (panelFormulario) panelFormulario.classList.remove('oculto');
        if (inputCodigo) inputCodigo.focus();
    };

    const cerrarFormulario = () => {
        editando = null;
        if (panelFormulario) panelFormulario.classList.add('oculto');
        ocultarAviso();
    };

    const editarMetodologia = (index) => {
        if (index < 0 || index >= metodologias.length) return;

        abrirFormulario();
        editando = index;

        if (tituloFormulario) tituloFormulario.textContent = 'Modificar Metodología';

        inputCodigo.value = metodologias[index].codigo || '';
        inputNombre.value = metodologias[index].nombre || '';
        inputDescripcion.value = metodologias[index].descripcion || '';
        
        // se perimite editar el código
        inputCodigo.readOnly = false; 
        inputNombre.focus();
    };

    // Validaciones
    const guardarMetodologia = (evento) => {
        evento.preventDefault();

        const codigo = inputCodigo.value.trim().toUpperCase();
        const nombre = inputNombre.value.trim();
        const descripcion = inputDescripcion.value.trim();

        // Validaciones dinámicas
        if (codigo === '') {
            mostrarAviso('El código es obligatorio.', 'error');
            return;
        }

        if (nombre === '') {
            mostrarAviso('El nombre es obligatorio.', 'error');
            return;
        }

        if (nombre.length < 3) {
            mostrarAviso('El nombre de la metodología debe tener al menos 3 caracteres.', 'error');
            return;
        }

        if (descripcion === '') {
            mostrarAviso('La descripción es obligatoria.', 'error');
            return;
        }

        // Validar códigos duplicados
        const codigoExiste = metodologias.some((m, idx) => m.codigo === codigo && idx !== editando);
        if (codigoExiste) {
            mostrarAviso('Ya existe una metodología con este código.', 'error');
            return;
        }

        const nuevaMetodologia = { codigo, nombre, descripcion };

        if (editando === null) {
            metodologias.push(nuevaMetodologia);
            mostrarAviso('Metodología registrada correctamente.', 'exito');
        } else {
            metodologias[editando] = nuevaMetodologia;
            mostrarAviso('Metodología modificada correctamente.', 'exito');
        }

        guardarEnStorage();
        listarMetodologias();
        cerrarFormulario();
    };

    // Eventos
    if (btnRegistrar) btnRegistrar.addEventListener('click', abrirFormulario);
    if (btnCancelar) btnCancelar.addEventListener('click', cerrarFormulario);
    if (formulario) formulario.addEventListener('submit', guardarMetodologia);
    if (buscadorInput) buscadorInput.addEventListener('input', listarMetodologias);

    if (cuerpoTabla) {
        cuerpoTabla.addEventListener('click', (evento) => {
            const boton = evento.target.closest('.btn_tabla');
            if (boton) {
                const index = parseInt(boton.getAttribute('data-indice'), 10);
                editarMetodologia(index);
            }
        });
    }

    listarMetodologias();
});