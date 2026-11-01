/* ===== CATÁLOGO DE NIVELES ===== */

var niveles = JSON.parse(localStorage.getItem('nivel')) || [];
var editando = null;

// Guardar niveles
function guardar() {
    localStorage.setItem('nivel', JSON.stringify(niveles));
}

// Escapar texto para mostrarlo en la tabla
function esc(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Normalizar texto para buscar
function normalizar(texto) {
    return String(texto)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// Mostrar avisos
function aviso(texto, tipo) {
    var caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

// Listar y buscar niveles
function listar() {
    var filtro = normalizar(
        document.getElementById('buscador').value.trim()
    );

    var html = '';
    var mostrados = 0;

    for (var i = 0; i < niveles.length; i++) {
        var nivel = niveles[i];

        var texto = normalizar(
            nivel.codigo + ' ' + nivel.nombre
        );

        if (filtro !== '' && !texto.includes(filtro)) {
            continue;
        }

        mostrados++;

        html += '<tr>' +
            '<td class="codigo">' + esc(nivel.codigo) + '</td>' +
            '<td>' + esc(nivel.nombre) + '</td>' +
            '<td>' + esc(nivel.descripcion) + '</td>' +
            '<td>' + esc(nivel.nivel) + '</td>' +
            '<td>' +
                '<button type="button" class="btn_tabla" data-accion="editar" data-indice="' + i + '">EDITAR</button>' +
            '</td>' +
        '</tr>';
    }

    if (mostrados === 0) {
        var mensaje = niveles.length === 0
            ? 'No hay niveles para mostrar.'
            : 'No se encontraron niveles con esa búsqueda.';

        html = '<tr><td class="vacio" colspan="5">' +
            mensaje +
        '</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;

    document.getElementById('conteo').textContent =
        'Mostrando ' + mostrados + ' de ' +
        niveles.length + ' niveles';
}

// Abrir formulario para registrar
function abrirFormulario() {
    editando = null;

    document.getElementById('formulario').reset();
    document.getElementById('titulo_formulario').textContent = 'Registrar nivel';
    document.querySelector('#formulario button[type="submit"]').textContent = 'REGISTRAR';

    limpiarErrores();

    document.getElementById('aviso').className = 'aviso oculto';

    document.getElementById('panel_formulario')
        .classList.remove('oculto');

    document.getElementById('codigo').focus();
}

// Abrir formulario para editar
function editarNivel(indice) {
    editando = indice;

    var nivel = niveles[indice];

    document.getElementById('codigo').value = nivel.codigo;
    document.getElementById('nombre').value = nivel.nombre;
    document.getElementById('descripcion').value = nivel.descripcion;
    document.getElementById('nivel_complejidad').value = nivel.nivel;

    document.getElementById('titulo_formulario').textContent = 'Editar nivel';
    document.querySelector('#formulario button[type="submit"]').textContent = 'ACTUALIZAR';

    limpiarErrores();

    document.getElementById('aviso').className = 'aviso oculto';

    document.getElementById('panel_formulario')
        .classList.remove('oculto');

    document.getElementById('codigo').focus();
}

// Limpiar mensajes de error
function limpiarErrores() {
    document.getElementById('error_codigo').textContent = '';
    document.getElementById('error_nombre').textContent = '';
    document.getElementById('error_descripcion').textContent = '';
    document.getElementById('error_nivel').textContent = '';
}

// Cerrar formulario
function cerrarFormulario() {
    document.getElementById('panel_formulario')
        .classList.add('oculto');

    document.getElementById('formulario').reset();

    limpiarErrores();

    editando = null;
}

// Registrar o actualizar un nivel
function guardarNivel(evento) {
    evento.preventDefault();

    var codigo = document.getElementById('codigo').value.trim();
    var nombre = document.getElementById('nombre').value.trim();
    var descripcion = document.getElementById('descripcion').value.trim();
    var nivel = document.getElementById('nivel_complejidad').value;

    var errorCodigo = document.getElementById('error_codigo');
    var errorNombre = document.getElementById('error_nombre');
    var errorDescripcion = document.getElementById('error_descripcion');
    var errorNivel = document.getElementById('error_nivel');

    limpiarErrores();

    if (codigo === '' || !/^\d+$/.test(codigo)) {
        errorCodigo.textContent = 'Ingrese un código numérico válido.';
        return;
    }

    if (nombre === '') {
        errorNombre.textContent = 'Ingrese el nombre del nivel.';
        return;
    }

    if (descripcion === '') {
        errorDescripcion.textContent = 'Ingrese la descripción del nivel.';
        return;
    }

    if (nivel === '') {
        errorNivel.textContent = 'Seleccione un nivel de complejidad.';
        return;
    }

    // Evitar códigos duplicados
    for (var i = 0; i < niveles.length; i++) {
        if (String(niveles[i].codigo) === codigo && i !== editando) {
            errorCodigo.textContent = 'Ya existe un nivel con este código.';
            return;
        }
    }

    var nuevoNivel = {
        codigo: Number(codigo),
        nombre: nombre,
        descripcion: descripcion,
        nivel: nivel
    };

    if (editando === null) {
        niveles.push(nuevoNivel);
        aviso('Nivel registrado correctamente.', 'exito');
    } else {
        niveles[editando] = nuevoNivel;
        aviso('Nivel actualizado correctamente.', 'exito');
    }

    guardar();
    listar();
    cerrarFormulario();

    // Volver a mostrar el aviso después de cerrar el formulario
    aviso(
        editando === null ? 'Nivel registrado correctamente.' : 'Nivel actualizado correctamente.',
        'exito'
    );
}

// Eventos
document.getElementById('btn_registrar')
    .addEventListener('click', abrirFormulario);

document.getElementById('btn_cancelar')
    .addEventListener('click', cerrarFormulario);

document.getElementById('formulario')
    .addEventListener('submit', guardarNivel);

document.getElementById('buscador')
    .addEventListener('input', listar);

// Evento para editar desde la tabla
document.getElementById('cuerpo_tabla')
    .addEventListener('click', function(evento) {
        var boton = evento.target.closest('[data-accion="editar"]');

        if (boton) {
            editarNivel(Number(boton.dataset.indice));
        }
    });

// Inicializar catálogo
listar();