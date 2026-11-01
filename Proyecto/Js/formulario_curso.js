/* ===== FORMULARIO DE CURSO (REGISTRAR Y MODIFICAR) ===== */

const formularioCurso = document.getElementById('formulario_curso');
const casillaGenerarCodigo = document.getElementById('generar_codigo');
const campoCodigo = document.getElementById('codigo');
const selectEscuela = document.getElementById('escuela');
const selectCarrera = document.getElementById('carrera');
const idCursoEditando = new URLSearchParams(window.location.search).get('editar');
let cursoEditando = null;

// Mismo orden que aparecen en la pantalla (sirve para enfocar el primer error)
const CAMPOS_CON_ERROR = ['escuela', 'carrera', 'codigo', 'nombre', 'estado', 'nombre_pc', 'desc_corta', 'meta_desc', 'modalidad', 'nivel', 'creditos', 'horas', 'requisitos', 'moneda', 'certificacion', 'tematica', 'area_sfia', 'metodologias', 'metadatos', 'competencias', 'capacidades', 'perfiles'];

// [id del campo, máximo de caracteres, texto del mensaje]
const LIMITES_TEXTO = [['nombre_pc', 40, 'El nombre en Power Campus'], ['desc_corta', 250, 'La descripción corta'], ['meta_desc', 155, 'La meta descripción'], ['requisitos', 500, 'Los requisitos'], ['metadatos', 300, 'Los metadatos'], ['competencias', 800, 'Las competencias'], ['capacidades', 800, 'Las capacidades'], ['perfiles', 800, 'Los perfiles']];

// [id del campo en pantalla, nombre de la propiedad guardada en el curso]
const CAMPOS_DEL_CURSO = [['codigo', 'codigo'], ['nombre', 'nombre'], ['estado', 'estado'], ['nombre_pc', 'nombrePowerCampus'], ['desc_corta', 'descripcionCorta'], ['meta_desc', 'metaDescripcion'], ['modalidad', 'modalidad'], ['nivel', 'nivel'], ['creditos', 'creditos'], ['horas', 'horas'], ['requisitos', 'requisitos'], ['moneda', 'moneda'], ['certificacion', 'certificacion'], ['tematica', 'tematica'], ['area_sfia', 'areaSfia'], ['metadatos', 'metadatos'], ['competencias', 'competencias'], ['capacidades', 'capacidades'], ['perfiles', 'perfiles']];

// Todo sale de los catálogos guardados en localStorage
const catalogos = leerCatalogos();

/* ---------- Carga de listas desplegables ---------- */

function agregarOpcion(select, valor, texto) {
    const opcion = document.createElement('option');
    opcion.value = valor;
    opcion.textContent = texto;
    select.appendChild(opcion);
}

function llenarSelect(id, opciones, textoVacio) {
    const select = document.getElementById(id);
    select.innerHTML = '';
    if (textoVacio !== null) { agregarOpcion(select, '', textoVacio); }
    opciones.forEach(opcion => agregarOpcion(select, opcion.valor, opcion.texto));
}

function opcionesCatalogo(lista) {
    return lista.map(item => ({ valor: item.codigo, texto: item.nombre }));
}

function opcionesPorNombre(lista) {
    return lista.map(item => ({ valor: item.nombre, texto: item.nombre }));
}

function opcionesMoneda(lista) {
    return lista.map(item => ({ valor: item.nombre, texto: item.nombre + ' (' + item.simbolo + ')' }));
}

// Igual que en Carreras: según la escuela elegida se cargan sus carreras
function actualizarCarreras() {
    const codigoEscuela = selectEscuela.value;
    selectCarrera.innerHTML = '';

    if (codigoEscuela === '') {
        agregarOpcion(selectCarrera, '', 'Seleccione primero una escuela');
        selectCarrera.disabled = true;
        return;
    }

    const carrerasDeLaEscuela = catalogos.carreras.filter(carrera => carrera.escuela === codigoEscuela);

    if (carrerasDeLaEscuela.length === 0) {
        agregarOpcion(selectCarrera, '', 'Esta escuela no tiene carreras registradas');
        selectCarrera.disabled = true;
        return;
    }

    selectCarrera.disabled = false;
    agregarOpcion(selectCarrera, '', 'Sin carrera asociada');
    carrerasDeLaEscuela.forEach(carrera => agregarOpcion(selectCarrera, carrera.codigo, carrera.nombre));
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
    const catalogosRevisados = [['Escuelas', catalogos.escuelas], ['Carreras', catalogos.carreras], ['Estados', catalogos.estados], ['Modalidades', catalogos.modalidades], ['Niveles', catalogos.niveles], ['Monedas', catalogos.monedas], ['Temáticas', catalogos.tematicas], ['Áreas SFIA', catalogos.areas], ['Metodologías', catalogos.metodologias], ['Certificaciones', catalogos.certificaciones]];
    const nombresVacios = catalogosRevisados.filter(par => par[1].length === 0).map(par => par[0]);
    if (nombresVacios.length === 0) { return; }

    const caja = document.getElementById('aviso_catalogos');
    let mensaje = 'Aún no hay registros en: ' + nombresVacios.join(', ') + '. ';
    mensaje += 'Regístrelos en <a href="inicio_para_catalogos.html">Catálogos</a> para poder seleccionarlos.';
    caja.innerHTML = mensaje;
    caja.classList.remove('oculto');
}

function cargarListas() {
    llenarSelect('escuela', opcionesCatalogo(catalogos.escuelas), 'Seleccione una escuela');
    actualizarCarreras();
    llenarSelect('estado', opcionesPorNombre(catalogos.estados), 'Seleccione un estado');
    llenarSelect('modalidad', opcionesPorNombre(catalogos.modalidades), 'Seleccione una modalidad');
    llenarSelect('nivel', opcionesCatalogo(catalogos.niveles), 'Seleccione un nivel');
    llenarSelect('moneda', opcionesMoneda(catalogos.monedas), 'Seleccione una moneda');
    llenarSelect('certificacion', opcionesCatalogo(catalogos.certificaciones), 'No aplica');
    llenarSelect('tematica', opcionesCatalogo(catalogos.tematicas), 'Seleccione una temática');
    llenarSelect('area_sfia', opcionesCatalogo(catalogos.areas), 'Sin área SFIA');
    cargarMetodologias();
    avisarCatalogosVacios();
}

/* ---------- Modo modificar ---------- */

function cargarCursoEnFormulario(curso) {
    selectEscuela.value = curso.escuela;
    actualizarCarreras();
    selectCarrera.value = curso.carrera;
    CAMPOS_DEL_CURSO.forEach(par => { document.getElementById(par[0]).value = curso[par[1]]; });
    document.querySelectorAll('#lista_metodologias input').forEach(casilla => { casilla.checked = (curso.metodologias || []).includes(casilla.value); });

    casillaGenerarCodigo.checked = curso.generarCodigo;
    campoCodigo.disabled = curso.generarCodigo;

    // Igual que en los catálogos: un código ya asignado no se puede cambiar
    if (!curso.generarCodigo) {
        campoCodigo.readOnly = true;
        casillaGenerarCodigo.disabled = true;
    }
}

function iniciarModoModificar() {
    if (idCursoEditando === null) { return; }

    cursoEditando = leerLista(CLAVE_CURSOS).find(curso => curso.id === idCursoEditando) || null;

    if (cursoEditando === null) {
        const caja = document.getElementById('aviso_edicion');
        caja.textContent = 'No se encontró el curso que desea modificar.';
        caja.classList.remove('oculto');
        formularioCurso.classList.add('oculto');
        return;
    }

    document.title = 'Modificar curso';
    document.getElementById('titulo_formulario').textContent = 'MODIFICAR CURSO';
    document.getElementById('btn_guardar').textContent = 'GUARDAR CAMBIOS';
    cargarCursoEnFormulario(cursoEditando);
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

/* ---------- Errores por campo (en rojo) ---------- */

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

    document.getElementById('error_formulario').textContent = 'Revise los campos marcados antes de guardar el curso.';
    const primerCampo = document.getElementById(errores[0].id);
    if (primerCampo) { primerCampo.focus(); }
}

/* ---------- Lectura y validación ---------- */

function leerDatos() {
    const valor = id => document.getElementById(id).value.trim();
    const metodologias = Array.from(document.querySelectorAll('#lista_metodologias input:checked')).map(casilla => casilla.value);

    return { escuela: valor('escuela'), carrera: valor('carrera'), codigo: valor('codigo').toUpperCase(), generarCodigo: casillaGenerarCodigo.checked, nombre: valor('nombre'), estado: valor('estado'), nombrePowerCampus: valor('nombre_pc'), descripcionCorta: valor('desc_corta'), metaDescripcion: valor('meta_desc'), modalidad: valor('modalidad'), nivel: valor('nivel'), creditos: valor('creditos'), horas: valor('horas'), requisitos: valor('requisitos'), moneda: valor('moneda'), certificacion: valor('certificacion'), tematica: valor('tematica'), areaSfia: valor('area_sfia'), metodologias: metodologias, metadatos: valor('metadatos'), competencias: valor('competencias'), capacidades: valor('capacidades'), perfiles: valor('perfiles') };
}

function enteroEnRango(texto, minimo, maximo) {
    if (!/^\d+$/.test(texto)) { return false; }
    const numero = Number(texto);
    return numero >= minimo && numero <= maximo;
}

function existeEn(lista, valor, propiedad) {
    return lista.some(item => String(item[propiedad]) === String(valor));
}

function validar(datos) {
    const errores = [];
    const cursos = leerLista(CLAVE_CURSOS);
    const agregarError = (id, mensaje) => errores.push({ id: id, mensaje: mensaje });

    // Valida una lista desplegable: que traiga valor y que exista en su catálogo
    function validarSeleccion(id, valor, lista, propiedad, mensajeVacio) {
        if (valor === '') { agregarError(id, mensajeVacio); return; }
        if (!existeEn(lista, valor, propiedad)) { agregarError(id, 'La opción seleccionada no es válida.'); }
    }

    if (datos.escuela === '' && catalogos.escuelas.length === 0) {
        agregarError('escuela', 'No hay escuelas registradas. Regístrelas primero en Catálogos.');
    } else {
        validarSeleccion('escuela', datos.escuela, catalogos.escuelas, 'codigo', 'Seleccione la escuela del curso.');
    }

    if (datos.carrera !== '') {
        const carreraElegida = catalogos.carreras.find(carrera => carrera.codigo === datos.carrera);
        if (!carreraElegida || carreraElegida.escuela !== datos.escuela) { agregarError('carrera', 'La carrera no pertenece a la escuela seleccionada.'); }
    }

    if (!datos.generarCodigo) {
        if (datos.codigo === '') {
            agregarError('codigo', 'Ingrese el código del curso o solicite su generación a Desarrollo Curricular.');
        } else if (!/^[A-Z0-9][A-Z0-9_-]{1,19}$/.test(datos.codigo)) {
            agregarError('codigo', 'El código debe tener de 2 a 20 caracteres: letras, números, guion o guion bajo, sin espacios.');
        } else if (cursos.some(curso => curso.id !== idCursoEditando && !curso.generarCodigo && String(curso.codigo).toUpperCase() === datos.codigo)) {
            agregarError('codigo', 'Ya existe un curso con este código.');
        }
    }

    if (datos.nombre === '') {
        agregarError('nombre', 'Ingrese el nombre del curso.');
    } else if (datos.nombre.length < 3) {
        agregarError('nombre', 'El nombre debe tener al menos 3 caracteres.');
    } else if (datos.nombre.length > 100) {
        agregarError('nombre', 'El nombre admite máximo 100 caracteres.');
    }

    validarSeleccion('estado', datos.estado, catalogos.estados, 'nombre', 'Seleccione el estado del curso.');
    validarSeleccion('modalidad', datos.modalidad, catalogos.modalidades, 'nombre', 'Seleccione la modalidad.');
    validarSeleccion('nivel', datos.nivel, catalogos.niveles, 'codigo', 'Seleccione el nivel de complejidad.');
    validarSeleccion('moneda', datos.moneda, catalogos.monedas, 'nombre', 'Seleccione la moneda.');
    validarSeleccion('tematica', datos.tematica, catalogos.tematicas, 'codigo', 'Seleccione la temática.');
    if (datos.certificacion !== '') { validarSeleccion('certificacion', datos.certificacion, catalogos.certificaciones, 'codigo', ''); }
    if (datos.areaSfia !== '') { validarSeleccion('area_sfia', datos.areaSfia, catalogos.areas, 'codigo', ''); }

    if (datos.creditos === '') {
        agregarError('creditos', 'Ingrese los créditos del curso.');
    } else if (!enteroEnRango(datos.creditos, 1, 30)) {
        agregarError('creditos', 'Los créditos deben ser un número entero entre 1 y 30.');
    }

    if (datos.horas === '') {
        agregarError('horas', 'Ingrese las horas del curso.');
    } else if (!enteroEnRango(datos.horas, 1, 1000)) {
        agregarError('horas', 'Las horas deben ser un número entero entre 1 y 1000.');
    }

    LIMITES_TEXTO.forEach(function (limite) {
        const texto = document.getElementById(limite[0]).value.trim();
        if (texto.length > limite[1]) { agregarError(limite[0], limite[2] + ' admite máximo ' + limite[1] + ' caracteres.'); }
    });

    errores.sort((primero, segundo) => CAMPOS_CON_ERROR.indexOf(primero.id) - CAMPOS_CON_ERROR.indexOf(segundo.id));
    return errores;
}

/* ---------- Guardado ---------- */

function guardarCurso(evento) {
    evento.preventDefault();
    limpiarErrores();

    const datos = leerDatos();
    const errores = validar(datos);

    if (errores.length > 0) {
        mostrarErrores(errores);
        return;
    }

    const cursos = leerLista(CLAVE_CURSOS);
    const cursoNuevo = { ...datos, codigo: datos.generarCodigo ? '' : datos.codigo, creditos: Number(datos.creditos), horas: Number(datos.horas) };

    if (cursoEditando === null) {
        const idNuevo = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
        cursos.push({ ...cursoNuevo, id: idNuevo, fechaRegistro: new Date().toISOString() });
    } else {
        const posicion = cursos.findIndex(curso => curso.id === cursoEditando.id);
        cursos[posicion] = { ...cursoEditando, ...cursoNuevo, fechaModificacion: new Date().toISOString() };
    }

    try {
        guardarLista(CLAVE_CURSOS, cursos);
    } catch (error) {
        document.getElementById('error_formulario').textContent = 'No se pudo guardar el curso porque el almacenamiento del navegador está lleno.';
        return;
    }

    window.location.href = 'cursos.html?' + (cursoEditando === null ? 'registrado=1' : 'modificado=1');
}

/* ---------- Eventos ---------- */

casillaGenerarCodigo.addEventListener('change', function () {
    campoCodigo.disabled = casillaGenerarCodigo.checked;
    if (casillaGenerarCodigo.checked) { campoCodigo.value = ''; }
    limpiarError('codigo');
});

selectEscuela.addEventListener('change', actualizarCarreras);

// Al corregir un campo se quita su mensaje de error
formularioCurso.addEventListener('input', evento => { if (evento.target.id) { limpiarError(evento.target.id); } });
formularioCurso.addEventListener('change', evento => { if (evento.target.id) { limpiarError(evento.target.id); } });
formularioCurso.addEventListener('submit', guardarCurso);

cargarListas();
iniciarModoModificar();
activarContador('nombre_pc', 'contador_nombre_pc', 40);
activarContador('desc_corta', 'contador_desc_corta', 250);
activarContador('meta_desc', 'contador_meta_desc', 155);
