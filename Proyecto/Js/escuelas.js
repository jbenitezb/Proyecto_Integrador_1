/* ===== ESCUELAS ===== */
var escuelas = JSON.parse(localStorage.getItem('escuelas')) || [];

function guardar() {
    localStorage.setItem('escuelas', JSON.stringify(escuelas));
}

function esc(texto) {
    return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Minúsculas y sin tildes, para que "escuela" encuentre "ESCUELA"
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

    for (var i = 0; i < escuelas.length; i++) {
        var e = escuelas[i];
        var texto = normalizar(e.codigo + ' ' + e.nombre + ' ' + e.director);

        if (filtro !== '' && texto.indexOf(filtro) === -1) {
            continue;
        }

        mostradas++;
        html += '<tr>' +
            '<td class="codigo">' + esc(e.codigo) + '</td>' +
            '<td>' + esc(e.nombre) + '</td>' +
            '<td>' + esc(e.director) + '</td>' +
            '</tr>';

        
    }

    if (mostradas === 0) {
        var msg = escuelas.length === 0 ? 'No hay escuelas para mostrar.' : 'No se encontraron escuelas con esa búsqueda.';
        html = '<tr><td class="vacio" colspan="3">' + msg + '</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;
    document.getElementById('conteo').textContent = filtro === ''
        ? 'Total: ' + escuelas.length + ' escuelas'
        : 'Mostrando ' + mostradas + ' de ' + escuelas.length + ' escuelas';
}

function abrirFormulario() {
    document.getElementById('formulario').reset();
    document.getElementById('error_formulario').textContent = '';
    document.getElementById('aviso').className = 'aviso oculto';
    document.getElementById('panel_formulario').classList.remove('oculto');
    document.getElementById('codigo').focus();
}

function cerrarFormulario() {
    document.getElementById('panel_formulario').classList.add('oculto');
}

function guardarEscuela(evento) {
    evento.preventDefault();

    var codigo = document.getElementById('codigo').value.trim().toUpperCase();
    var nombre = document.getElementById('nombre').value.trim();
    var director = document.getElementById('director').value;
    var error = document.getElementById('error_formulario');

    if (codigo === '' || nombre === '' || director === '') {
        error.textContent = 'El código, el nombre y el director son obligatorios.';
        return;
    }

    for (var i = 0; i < escuelas.length; i++) {
        if (escuelas[i].codigo === codigo) {
            error.textContent = 'Ya existe una escuela con este código.';
            return;
        }
    }

    escuelas.push({ codigo: codigo, nombre: nombre, director: director });
    aviso('Escuela registrada correctamente.', 'exito');

    guardar();
    listar();
    cerrarFormulario();
}

// Eventos
document.getElementById('btn_registrar').addEventListener('click', abrirFormulario);
document.getElementById('btn_cancelar').addEventListener('click', cerrarFormulario);
document.getElementById('formulario').addEventListener('submit', guardarEscuela);
document.getElementById('buscador').addEventListener('input', listar);

listar();
