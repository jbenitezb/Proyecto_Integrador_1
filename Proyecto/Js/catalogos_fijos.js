/* ===== CATÁLOGOS FIJOS (estado, modalidad y moneda): se guardan en localStorage una sola vez ===== */

function sembrarCatalogo(clave, listaInicial) {
    const listaGuardada = JSON.parse(localStorage.getItem(clave));
    if (Array.isArray(listaGuardada) && listaGuardada.length > 0) { return; }
    localStorage.setItem(clave, JSON.stringify(listaInicial));
}

const nombresEstadosIniciales = ['Desarrollo', 'Producción', 'Inactivo', 'Borrador', 'Aprobado'];
const nombresModalidadesIniciales = ['Virtual', 'Presencial', 'Híbrida'];
const monedasIniciales = [{ nombre: 'DOLARES', simbolo: '$' }, { nombre: 'COLONES', simbolo: '₡' }];

sembrarCatalogo('estado_curso', nombresEstadosIniciales.map(nombre => ({ nombre: nombre })));
sembrarCatalogo('modalidad', nombresModalidadesIniciales.map(nombre => ({ nombre: nombre })));
sembrarCatalogo('moneda', monedasIniciales);
