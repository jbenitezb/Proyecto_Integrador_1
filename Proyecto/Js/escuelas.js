
/* ===== CATÁLOGO DE ESCUELAS ===== */

var escuelas = JSON.parse(localStorage.getItem('escuelas')) || [];
var editando = null; // null = registrando; número = editando

function guardar() {
    localStorage.setItem('escuelas', JSON.stringify(escuelas));
}

function esc(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function normalizar(texto) {
    return String(texto)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function aviso(texto, tipo) {
    var caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
}

function listar() {
    var filtro = normalizar(
        document.getElementById('buscador').value.trim()
    );

    var html = '';
    var mostradas = 0;

    for (var i = 0; i < escuelas.length; i++) {
        var escuela = escuelas[i];

        var texto = normalizar(
            escuela.codigo + ' ' +
            escuela.nombre + ' ' +
            escuela.director
        );

        if (filtro !== '' && texto.indexOf(filtro) === -1) {
            continue;
        }

        mostradas++;

        html += '<tr>' +
            '<td class="codigo">' + esc(escuela.codigo) + '</td>' +
            '<td>' + esc(escuela.nombre) + '</td>' +
            '<td>' + esc(escuela.director) + '</td>' +
            '<td class="acciones">' +
                '<button type="button" class="btn_tabla" data-indice="' + i + '">' +
                    'EDITAR' +
                '</button>' +
            '</td>' +
        '</tr>';
    }

    if (mostradas === 0) {
        var mensaje = escuelas.length === 0
            ? 'No hay escuelas para mostrar.'
            : 'No se encontraron escuelas con esa búsqueda.';

        html = '<tr><td class="vacio" colspan="4">' +
            mensaje +
        '</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;

    document.getElementById('conteo').textContent =
        'Mostrando ' + mostradas + ' de ' + escuelas.length + ' escuelas';
}

function abrirFormulario() {
    editando = null;

    document.getElementById('titulo_formulario').textContent =
        'Registrar escuela';

    document.getElementById('formulario').reset();
    document.getElementById('codigo').readOnly = false;
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';

    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('codigo').focus();
}

function editar(i) {
    if (i < 0 || i >= escuelas.length) {
        return;
    }

    abrirFormulario();

    editando = i;

    document.getElementById('titulo_formulario').textContent =
        'Modificar escuela';

    document.getElementById('codigo').value = escuelas[i].codigo;
    document.getElementById('nombre').value = escuelas[i].nombre;
    document.getElementById('director').value = escuelas[i].director;

    // El código no se puede cambiar al editar
    document.getElementById('codigo').readOnly = true;

    document.getElementById('nombre').focus();
}

function cerrarFormulario() {
    editando = null;

    document.getElementById('panel_formulario').classList.add('oculto');
    document.getElementById('error_formulario').textContent = '';
}

function guardarEscuela(evento) {
    evento.preventDefault();

    var formulario = document.getElementById('formulario');
    formulario.noValidate = true;

    var codigo = document.getElementById('codigo').value.trim().toUpperCase();
    var nombre = document.getElementById('nombre').value.trim();
    var director = document.getElementById('director').value;
    var error = document.getElementById('error_formulario');

    error.textContent = '';

    if (codigo === '') {
        error.textContent = 'Ingrese un código válido.';
        return;
    }

    if (nombre === '' || nombre.length < 3) {
        error.textContent = 'Ingrese el nombre de la escuela (mínimo 3 caracteres).';
        return;
    }

    if (director === '') {
        error.textContent = 'Debe seleccionar un director.';
        return;
    }
}

//accion
document.getElementById('btn_registrar')
    .addEventListener('click', abrirFormulario);

document.getElementById('btn_cancelar')
    .addEventListener('click', cerrarFormulario);

document.getElementById('formulario')
    .addEventListener('submit', guardarEscuela);

document.getElementById('buscador')
    .addEventListener('input', listar);

document.getElementById('cuerpo_tabla')
    .addEventListener('click', function (evento) {
        var boton = evento.target.closest('.btn_tabla');

        if (boton) {
            editar(parseInt(boton.getAttribute('data-indice'), 10));
        }
    });

listar();
