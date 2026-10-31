/* ===== FORMULARIO DE REGISTRO DE CURSO ===== */
 
const MAX_ARCHIVO_MB = 5;
const MAX_ARCHIVO_BYTES = MAX_ARCHIVO_MB * 1024 * 1024;
 
const formulario = document.getElementById('formulario_curso');
const casillaGenerar = document.getElementById('generar_codigo');
const campoCodigo = document.getElementById('codigo');
const selectEscuela = document.getElementById('escuela');
const selectCarrera = document.getElementById('carrera');
 
// Campos que tienen un <span class="error" id="error_..."> a su lado
const CAMPOS_CON_ERROR = [
    'escuela', 'carrera', 'codigo', 'nombre', 'estado', 'nombre_pc',
    'desc_corta', 'meta_desc', 'modalidad', 'nivel', 'creditos', 'horas',
    'requisitos', 'moneda', 'certificacion', 'tematica', 'area_sfia',
    'metodologias', 'metadatos', 'competencias', 'capacidades', 'perfiles',
    'adjuntos'
];
 
// Catálogos que otras páginas guardan en localStorage
const catalogos = {
    escuelas: leerLista('escuelas'),
    carreras: leerLista('carreras'),
    tematicas: leerLista('tematica'),
    areas: leerLista('area_sfia'),
    metodologias: leerLista('lista_metodologias'),
    certificaciones: leerLista('certificaciones')
};
 
/* ---------- Carga de listas desplegables ---------- */
 
function agregarOpcion(select, valor, texto) {
    const opcion = document.createElement('option');
    opcion.value = valor;
    opcion.textContent = texto;
    select.appendChild(opcion);
}
 
// opciones: lista de { valor, texto }
function llenarSelect(id, opciones, textoVacio) {
    const select = document.getElementById(id);
    select.innerHTML = '';
    if (textoVacio !== null) {
        agregarOpcion(select, '', textoVacio);
    }
    opciones.forEach(function (opcion) {
        agregarOpcion(select, opcion.valor, opcion.texto);
    });
}
 
function opcionesSimples(lista) {
    return lista.map(function (texto) {
        return { valor: texto, texto: texto };
    });
}
 
function opcionesCatalogo(lista) {
    return lista.map(function (item) {
        return { valor: item.codigo, texto: item.nombre };
    });
}
 
function actualizarCarreras() {
    const codigoEscuela = selectEscuela.value;
    selectCarrera.innerHTML = '';
 
    if (codigoEscuela === '') {
        agregarOpcion(selectCarrera, '', 'Seleccione primero una escuela');
        selectCarrera.disabled = true;
        return;
    }
 
    const delaEscuela = catalogos.carreras.filter(function (carrera) {
        return carrera.escuela === codigoEscuela;
    });
 
    if (delaEscuela.length === 0) {
        agregarOpcion(selectCarrera, '', 'Esta escuela no tiene carreras registradas');
        selectCarrera.disabled = true;
        return;
    }
 
    selectCarrera.disabled = false;
    agregarOpcion(selectCarrera, '', 'Sin carrera asociada');
    delaEscuela.forEach(function (carrera) {
        agregarOpcion(selectCarrera, carrera.codigo, carrera.nombre);
    });
}
 
function cargarMetodologias() {
    const contenedor = document.getElementById('lista_metodologias');
    contenedor.innerHTML = '';
 
    if (catalogos.metodologias.length === 0) {
        const mensaje = document.createElement('span');
        mensaje.className = 'sin_datos';
        mensaje.textContent = 'No hay metodologías registradas.';
        contenedor.appendChild(mensaje);
        return;
    }
 
    catalogos.metodologias.forEach(function (metodologia, indice) {
        const idCasilla = 'metodologia_' + indice;
 
        const etiqueta = document.createElement('label');
        etiqueta.className = 'check_linea';
        etiqueta.setAttribute('for', idCasilla);
 
        const casilla = document.createElement('input');
        casilla.type = 'checkbox';
        casilla.id = idCasilla;
        casilla.value = metodologia.codigo;
 
        etiqueta.appendChild(casilla);
        etiqueta.appendChild(document.createTextNode(metodologia.nombre));
        contenedor.appendChild(etiqueta);
    });
}
 
function avisarCatalogosVacios() {
    const vacios = [];
    if (catalogos.escuelas.length === 0) { vacios.push('Escuelas'); }
    if (catalogos.carreras.length === 0) { vacios.push('Carreras'); }
    if (catalogos.tematicas.length === 0) { vacios.push('Temáticas'); }
    if (catalogos.areas.length === 0) { vacios.push('Áreas SFIA'); }
    if (catalogos.metodologias.length === 0) { vacios.push('Metodologías'); }
    if (catalogos.certificaciones.length === 0) { vacios.push('Certificaciones'); }
 
    if (vacios.length === 0) {
        return;
    }
 
    const caja = document.getElementById('aviso_catalogos');
    caja.innerHTML = 'Aún no hay registros en: ' + vacios.join(', ') + '. ' +
        'Regístrelos en <a href="inicio_para_catalogos.html">Catálogos</a> para poder seleccionarlos.' +
        (catalogos.escuelas.length === 0 ? ' La escuela es obligatoria para guardar un curso.' : '');
    caja.classList.remove('oculto');
}
 
function cargarListas() {
    llenarSelect('escuela', opcionesCatalogo(catalogos.escuelas), 'Seleccione una escuela');
    actualizarCarreras();
    llenarSelect('estado', opcionesSimples(ESTADOS), null);
    llenarSelect('modalidad', opcionesSimples(MODALIDADES), 'Seleccione una modalidad');
    llenarSelect('nivel', opcionesSimples(NIVELES), 'Seleccione un nivel');
    llenarSelect('moneda', opcionesSimples(MONEDAS), 'Seleccione una moneda');
 
    const certificaciones = [{ valor: 'NO_APLICA', texto: 'No aplica' }]
        .concat(opcionesCatalogo(catalogos.certificaciones));
    llenarSelect('certificacion', certificaciones, null);
 
    llenarSelect('tematica', opcionesCatalogo(catalogos.tematicas), 'Seleccione una temática');
    llenarSelect('area_sfia', opcionesCatalogo(catalogos.areas), 'Sin área SFIA');
    cargarMetodologias();
    avisarCatalogosVacios();
}
 
/* ---------- Contadores de caracteres ---------- */
 
function activarContador(idCampo, idContador, maximo) {
    const campo = document.getElementById(idCampo);
    const contador = document.getElementById(idContador);
 
    function actualizar() {
        const cantidad = campo.value.length;
        contador.textContent = cantidad + ' / ' + maximo;
        contador.classList.toggle('limite', cantidad >= maximo);
    }
 
    campo.addEventListener('input', actualizar);
    actualizar();
}
 
/* ---------- Errores por campo ---------- */
 
function limpiarError(id) {
    const mensaje = document.getElementById('error_' + id);
    const campo = document.getElementById(id);
    if (mensaje) { mensaje.textContent = ''; }
    if (campo) { campo.classList.remove('invalida'); }
}
 
function limpiarErrores() {
    CAMPOS_CON_ERROR.forEach(limpiarError);
    document.getElementById('error_formulario').textContent = '';
}
 
function mostrarErrores(errores) {
    errores.forEach(function (error) {
        const mensaje = document.getElementById('error_' + error.id);
        const campo = document.getElementById(error.id);
        if (mensaje) { mensaje.textContent = error.mensaje; }
        if (campo) { campo.classList.add('invalida'); }
    });
 
    document.getElementById('error_formulario').textContent =
        'Revise los campos marcados antes de guardar el curso.';
 
    const primero = document.getElementById(errores[0].id);
    if (primero) { primero.focus(); }
}
 
/* ---------- Lectura y validación ---------- */
 
function leerDatos() {
    function valor(id) {
        return document.getElementById(id).value.trim();
    }
 
    const metodologias = Array.from(
        document.querySelectorAll('#lista_metodologias input:checked')
    ).map(function (casilla) {
        return casilla.value;
    });
 
    return {
        escuela: valor('escuela'),
        carrera: valor('carrera'),
        codigo: valor('codigo').toUpperCase(),
        generarCodigo: casillaGenerar.checked,
        nombre: valor('nombre'),
        estado: valor('estado'),
        nombrePowerCampus: valor('nombre_pc'),
        descripcionCorta: valor('desc_corta'),
        metaDescripcion: valor('meta_desc'),
        modalidad: valor('modalidad'),
        nivel: valor('nivel'),
        creditos: valor('creditos'),
        horas: valor('horas'),
        requisitos: valor('requisitos'),
        moneda: valor('moneda'),
        certificacion: valor('certificacion'),
        tematica: valor('tematica'),
        areaSfia: valor('area_sfia'),
        metodologias: metodologias,
        metadatos: valor('metadatos'),
        competencias: valor('competencias'),
        capacidades: valor('capacidades'),
        perfiles: valor('perfiles')
    };
}
 
function enteroEnRango(texto, minimo, maximo) {
    if (!/^\d+$/.test(texto)) {
        return false;
    }
    const numero = Number(texto);
    return numero >= minimo && numero <= maximo;
}
 
function validar(datos, archivos) {
    const errores = [];
    const cursos = leerLista(CLAVE_CURSOS);
 
    if (datos.escuela === '') {
        errores.push({
            id: 'escuela',
            mensaje: catalogos.escuelas.length === 0
                ? 'No hay escuelas registradas. Regístrelas primero en Catálogos.'
                : 'Seleccione la escuela del curso.'
        });
    }
 
    if (!datos.generarCodigo) {
        if (datos.codigo === '') {
            errores.push({ id: 'codigo', mensaje: 'Ingrese el código del curso o solicite su generación a Desarrollo Curricular.' });
        } else if (!/^[A-Z0-9][A-Z0-9_-]{1,19}$/.test(datos.codigo)) {
            errores.push({ id: 'codigo', mensaje: 'El código debe tener de 2 a 20 caracteres: letras, números, guion o guion bajo, sin espacios.' });
        } else {
            const repetido = cursos.some(function (curso) {
                return !curso.generarCodigo && String(curso.codigo).toUpperCase() === datos.codigo;
            });
            if (repetido) {
                errores.push({ id: 'codigo', mensaje: 'Ya existe un curso con este código.' });
            }
        }
    }
 
    if (datos.nombre === '') {
        errores.push({ id: 'nombre', mensaje: 'Ingrese el nombre del curso.' });
    } else if (datos.nombre.length < 3) {
        errores.push({ id: 'nombre', mensaje: 'El nombre debe tener al menos 3 caracteres.' });
    }
 
    if (!ESTADOS.includes(datos.estado)) {
        errores.push({ id: 'estado', mensaje: 'Seleccione un estado válido.' });
    }
 
    if (datos.nombrePowerCampus.length > 40) {
        errores.push({ id: 'nombre_pc', mensaje: 'El nombre en Power Campus admite máximo 40 caracteres.' });
    }
 
    if (datos.descripcionCorta.length > 250) {
        errores.push({ id: 'desc_corta', mensaje: 'La descripción corta admite máximo 250 caracteres.' });
    }
 
    if (datos.metaDescripcion.length > 155) {
        errores.push({ id: 'meta_desc', mensaje: 'La meta descripción admite máximo 155 caracteres.' });
    }
 
    if (datos.creditos !== '' && !enteroEnRango(datos.creditos, 1, 30)) {
        errores.push({ id: 'creditos', mensaje: 'Los créditos deben ser un número entero entre 1 y 30.' });
    }
 
    if (datos.horas !== '' && !enteroEnRango(datos.horas, 1, 1000)) {
        errores.push({ id: 'horas', mensaje: 'Las horas deben ser un número entero entre 1 y 1000.' });
    }
 
    return errores;
}
 
/* ---------- Guardado ---------- */
 
function crearCurso(datos, archivos) {
    return {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        escuela: datos.escuela,
        carrera: datos.carrera,
        codigo: datos.generarCodigo ? '' : datos.codigo,
        generarCodigo: datos.generarCodigo,
        nombre: datos.nombre,
        estado: datos.estado,
        nombrePowerCampus: datos.nombrePowerCampus,
        descripcionCorta: datos.descripcionCorta,
        metaDescripcion: datos.metaDescripcion,
        modalidad: datos.modalidad,
        nivel: datos.nivel,
        creditos: datos.creditos === '' ? '' : Number(datos.creditos),
        horas: datos.horas === '' ? '' : Number(datos.horas),
        requisitos: datos.requisitos,
        moneda: datos.moneda,
        certificacion: datos.certificacion,
        tematica: datos.tematica,
        areaSfia: datos.areaSfia,
        metodologias: datos.metodologias,
        metadatos: datos.metadatos,
        competencias: datos.competencias,
        capacidades: datos.capacidades,
        perfiles: datos.perfiles,
        // localStorage no admite archivos: se guarda solo el nombre y el tamaño
        adjuntos: Array.from(archivos).map(function (archivo) {
            return { nombre: archivo.name, tamano: archivo.size };
        }),
        fechaRegistro: new Date().toISOString()
    };
}
 
function guardarCurso(evento) {
    evento.preventDefault();
    limpiarErrores();
 
    const datos = leerDatos();
    const archivos = document.getElementById('adjuntos').files;
    const errores = validar(datos, archivos);
 
    if (errores.length > 0) {
        mostrarErrores(errores);
        return;
    }
 
    try {
        const cursos = leerLista(CLAVE_CURSOS);
        cursos.push(crearCurso(datos, archivos));
        guardarLista(CLAVE_CURSOS, cursos);
    } catch (error) {
        document.getElementById('error_formulario').textContent =
            'No se pudo guardar el curso porque el almacenamiento del navegador está lleno.';
        return;
    }
 
    window.location.href = 'cursos.html?registrado=1';
}
 
/* ---------- Eventos ---------- */
 
casillaGenerar.addEventListener('change', function () {
    campoCodigo.disabled = casillaGenerar.checked;
    if (casillaGenerar.checked) {
        campoCodigo.value = '';
    }
    limpiarError('codigo');
});
 
selectEscuela.addEventListener('change', actualizarCarreras);
 
// Al corregir un campo se quita su mensaje de error
formulario.addEventListener('input', function (evento) {
    if (evento.target.id) { limpiarError(evento.target.id); }
});
formulario.addEventListener('change', function (evento) {
    if (evento.target.id) { limpiarError(evento.target.id); }
});
 
formulario.addEventListener('submit', guardarCurso);
 
cargarListas();
activarContador('nombre_pc', 'contador_nombre_pc', 40);
activarContador('desc_corta', 'contador_desc_corta', 250);
activarContador('meta_desc', 'contador_meta_desc', 155);
