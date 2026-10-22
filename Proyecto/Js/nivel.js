/* ===== ÁREA SFIA ===== */
var areas = JSON.parse(localStorage.getItem('area_sfia')) || [];
var editando = null; // null = registrando; número = editando esa posición

function guardar() {
    localStorage.setItem('area_sfia', JSON.stringify(areas));
}

function esc(texto) {
    return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Minúsculas y sin tildes, para que "area" encuentre "ÁREA"
function normalizar(texto) {
    return String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function aviso(texto, tipo) {
    var caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

function listar() {
    var filtro = normalizar(document.getElementById('buscador').value.trim());
    var html = '';
    var mostradas = 0;

    for (var i = 0; i < areas.length; i++) {
        var a = areas[i];
        var texto = normalizar(a.codigo + ' ' + a.nombre + ' ' + a.descripcion);

        if (filtro !== '' && texto.indexOf(filtro) === -1) {
            continue;
        }

        mostradas++;
        html += '<tr>' +
            '<td class="codigo">' + esc(a.codigo) + '</td>' +
            '<td>' + esc(a.nombre) + '</td>' +
            '<td>' + esc(a.descripcion) + '</td>' +
            '<td class="acciones"><button type="button" class="btn_tabla" data-indice="' + i + '">EDITAR</button></td>' +
            '</tr>';
    }

    if (mostradas === 0) {
        var msg = areas.length === 0 ? 'No hay áreas para mostrar.' : 'No se encontraron áreas con esa búsqueda.';
        html = '<tr><td class="vacio" colspan="4">' + msg + '</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;
    document.getElementById('conteo').textContent = 'Mostrando ' + mostradas + ' de ' + areas.length + ' áreas';
}

function abrirFormulario() {
    editando = null;
    document.getElementById('titulo_formulario').textContent = 'Registrar área SFIA';
    document.getElementById('formulario').reset();
    document.getElementById('codigo').readOnly = false;
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';
    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('codigo').focus();
}

function editar(i) {
    abrirFormulario();
    editando = i;
    document.getElementById('titulo_formulario').textContent = 'Modificar área SFIA';
    document.getElementById('codigo').value = areas[i].codigo;
    document.getElementById('nombre').value = areas[i].nombre;
    document.getElementById('descripcion').value = areas[i].descripcion;
    document.getElementById('codigo').readOnly = true;
    document.getElementById('nombre').focus();
}

function cerrarFormulario() {
    editando = null;
    document.getElementById('panel_formulario').classList.add('oculto');
}

function guardarArea(evento) {
    evento.preventDefault();

    var codigo = document.getElementById('codigo').value.trim().toUpperCase();
    var nombre = document.getElementById('nombre').value.trim();
    var descripcion = document.getElementById('descripcion').value.trim();
    var error = document.getElementById('error_formulario');

    if (codigo === '' && nombre === '' && descripcion === '') {
    error.textContent = 'El código, el nombre y la descripción son obligatorios.';
    return;
    }

    if (codigo === '' && nombre === '') {
        error.textContent = 'El código y el nombre son obligatorios.';
        return;
    }

    if (codigo === '' && descripcion === '') {
        error.textContent = 'El código y la descripción son obligatorios.';
        return;
    }

    if (nombre === '' && descripcion === '') {
        error.textContent = 'El nombre y la descripción son obligatorios.';
        return;
    }

    if (codigo === '') {
        error.textContent = 'El código es obligatorio.';
        return;
    }

    if (nombre === '') {
        error.textContent = 'El nombre es obligatorio.';
        return;
    }

    if (descripcion === '') {
        error.textContent = 'La descripción es obligatoria.';
        return;
    }

    for (var i = 0; i < areas.length; i++) {
        if (areas[i].codigo === codigo && i !== editando) {
            error.textContent = 'Ya existe un área con este código.';
            return;
        }
    }

    var area = { codigo: codigo, nombre: nombre, descripcion: descripcion };

    if (editando === null) {
        areas.push(area);
        aviso('Área registrada correctamente.', 'exito');
    } else {
        areas[editando] = area;
        aviso('Área modificada correctamente.', 'exito');
    }

    guardar();
    listar();
    cerrarFormulario();
}

// Eventos (sin onclick/onsubmit dentro del HTML)
document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);
document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('formulario').addEventListener('submit', guardarArea);
document.getElementById('buscador').addEventListener('input', listar);
document.getElementById('cuerpo_tabla').addEventListener('click', function (evento) {
    var boton = evento.target.closest('.btn_tabla');
    if (boton) {
        editar(parseInt(boton.getAttribute('data-indice'), 10));
    }
});

listar();
