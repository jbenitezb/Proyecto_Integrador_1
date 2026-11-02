
/* ===== CATÁLOGO DE MONEDAS ===== */

const monedas = JSON.parse(localStorage.getItem('moneda')) || [];

function normalizar(texto) {
    return String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function listar() {
    const filtro = normalizar(document.getElementById('buscador').value.trim());
    let html = '';
    let mostradas = 0;

    for (let i = 0; i < monedas.length; i++) {
        const moneda = monedas[i];
        if (filtro !== '' && !normalizar(moneda.nombre + ' ' + moneda.simbolo).includes(filtro)) { continue; }
        mostradas++;
        html += '<tr><td>' + moneda.nombre + '</td><td>' + moneda.simbolo + '</td></tr>';
    }

    if (mostradas === 0) {
        html = '<tr><td class="vacio" colspan="2">No se encontraron monedas.</td></tr>';
    }

    document.getElementById('cuerpo_tabla').innerHTML = html;
    document.getElementById('conteo').textContent = 'Mostrando ' + mostradas + ' de ' + monedas.length + ' monedas';
}

document.getElementById('buscador').addEventListener('input', listar);

listar();
