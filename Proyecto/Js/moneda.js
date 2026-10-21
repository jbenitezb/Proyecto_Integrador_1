
/* ===== CATÁLOGO DE MONEDAS ===== */

var monedas = [
    { nombre: 'DOLARES', simbolo: '$' },
    { nombre: 'COLONES', simbolo: '₡' }
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

    var filas = document.querySelectorAll('.tabla tbody tr');
    var mostradas = 0;

    filas.forEach(function(fila) {
        var nombre = normalizar(fila.cells[0].textContent);
        var simbolo = normalizar(fila.cells[1].textContent);

        var coincide =
            nombre.includes(filtro) ||
            simbolo.includes(filtro);

        fila.style.display = coincide ? '' : 'none';

        if (coincide) {
            mostradas++;
        }
    });

    document.getElementById('conteo').textContent =
        'Mostrando ' + mostradas + ' de ' + filas.length + ' monedas';
}

document.getElementById('buscador')
    .addEventListener('input', listar);

listar();
