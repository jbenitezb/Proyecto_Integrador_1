/* ===== DATOS Y UTILIDADES COMPARTIDAS: cursos.html y formulario_curso.html ===== */
 
const CLAVE_CURSOS = 'cursos';
 
// "Pendientes de ejecución": cursos que todavía no están en producción ni inactivos (nombres según el catálogo de estados).
const ESTADOS_PENDIENTES = ['Borrador', 'Desarrollo', 'Aprobado'];
const ESTADO_PRODUCCION = 'Producción';
const ESTADO_INACTIVO = 'Inactivo';

function leerLista(clave) {
    try {
        const datos = JSON.parse(localStorage.getItem(clave));
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}
 
function guardarLista(clave, lista) {
    localStorage.setItem(clave, JSON.stringify(lista));
}
 
function esc(texto) {
    return String(texto === undefined || texto === null ? '' : texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
 
function normalizar(texto) {
    return String(texto === undefined || texto === null ? '' : texto)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}
 
// Devuelve el nombre de un registro de catálogo a partir de su código
function nombreDe(lista, codigo) {
    const elemento = lista.find(function (item) {
        return String(item.codigo) === String(codigo);
    });
    return elemento ? elemento.nombre : '';
}
 
// Lee todos los catálogos desde localStorage (siempre datos frescos, nada quemado)
function leerCatalogos() {
    const escuelas = leerLista('escuelas');
    const carreras = leerLista('carreras');
    const estados = leerLista('estado_curso');
    const modalidades = leerLista('modalidad');
    const niveles = leerLista('nivel');
    const monedas = leerLista('moneda');
    const certificaciones = leerLista('certificaciones');
    const tematicas = leerLista('tematica');
    const areas = leerLista('area_sfia');
    const metodologias = leerLista('lista_metodologias');
    return { escuelas: escuelas, carreras: carreras, estados: estados, modalidades: modalidades, niveles: niveles, monedas: monedas, certificaciones: certificaciones, tematicas: tematicas, areas: areas, metodologias: metodologias };
}

// Texto de una moneda: "COLONES (₡)"
function etiquetaMoneda(nombreMoneda, monedas) {
    const moneda = monedas.find(item => item.nombre === nombreMoneda);
    return moneda ? moneda.nombre + ' (' + moneda.simbolo + ')' : nombreMoneda;
}
