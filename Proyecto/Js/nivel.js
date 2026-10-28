/* ===== CATÁLOGO DE NIVELES ===== */

var niveles = [
    "Básico",
    "Intermedio",
    "Avanzado",
    "Certificación"
];

function normalizar(texto) {
    return String(texto)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function listar() {
    var filtro = normalizar(
        document.getElementById('buscador').value.trim()
    );

    var html = '';
    var mostrados = 0;

    for (var i = 0; i < niveles.length; i++) {
        var nombre = niveles[i];

        if (filtro !== '' && !normalizar(nombre).includes(filtro)) {
            continue;
        }

        mostrados++;

        html += '<tr>' +
            '<td>' + nombre.toUpperCase() + '</td>' +
        '</tr>';
    }

    if (mostrados === 0) {
        var mensaje = filtro === ''
            ? 'No hay niveles para mostrar.'
            : 'No se encontraron niveles con esa búsqueda.';

        html = '<tr><td class="vacio" colspan="1">' +
            mensaje +
        '</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;

    document.getElementById('conteo').textContent =
        'Mostrando ' + mostrados + ' de ' + niveles.length + ' niveles';
}

document.getElementById('buscador').addEventListener('input', listar);

listar();