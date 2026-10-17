var areas = JSON.parse(localStorage.getItem('area_sfia')) || [];

function esc(texto) {
    return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function listar() {
    var html = '';
    var total = 0;

    for (var i = 0; i < areas.length; i++) {
        var a = areas[i];
        total++;
        html += '<tr>' +
            '<td class="codigo">' + esc(a.codigo) + '</td>' +
            '<td>' + esc(a.nombre) + '</td>' +
            '<td>' + esc(a.descripcion) + '</td>' +
            '</tr>';
    }

    if (total === 0) {
        html = '<tr><td class="vacio" colspan="3">No hay áreas para mostrar.</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;
    document.getElementById('conteo').textContent = 'Total: ' + areas.length + ' áreas';
}

listar();
