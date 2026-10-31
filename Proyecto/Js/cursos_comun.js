/* ===== DATOS Y UTILIDADES COMPARTIDAS: cursos.html y formulario_curso.html ===== */
 
const CLAVE_CURSOS = 'cursos';
 
// Estado único del curso (flujo: Borrador → En desarrollo → Aprobado → En producción)
const ESTADOS = ['Borrador', 'En desarrollo', 'Aprobado', 'En producción', 'Inactivo'];
 
// "Pendientes de ejecución": cursos que todavía no están en producción ni inactivos.
// Si el equipo decide otra definición, solo se cambia esta lista.
const ESTADOS_PENDIENTES = ['Borrador', 'En desarrollo', 'Aprobado'];
 
const MODALIDADES = ['Virtual', 'Presencial', 'En vivo', 'Híbrida'];
const NIVELES = ['Básico', 'Intermedio', 'Avanzado', 'Certificación', 'Variable'];
const MONEDAS = ['Colones (₡)', 'Dólares ($)'];
 
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
        return item.codigo === codigo;
    });
    return elemento ? elemento.nombre : '';
}
 