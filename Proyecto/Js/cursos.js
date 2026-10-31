/* ===== LISTADO DE CURSOS ===== */
 
const COLUMNAS = 7;
 
// Cada pestaña es solo un filtro sobre la misma lista guardada en localStorage
const FILTROS_PESTANA = {
    todos: function () { return true; },
    pendientes: function (curso) { return ESTADOS_PENDIENTES.includes(curso.estado); },
    produccion: function (curso) { return curso.estado === 'En producción'; },
    inactivos: function (curso) { return curso.estado === 'Inactivo'; }
};
 
const AYUDA_PESTANA = {
    todos: 'Todos los cursos registrados.',
    pendientes: 'Cursos aún sin ejecutar: ' + ESTADOS_PENDIENTES.join(', ') + '.',
    produccion: 'Cursos que ya se están ejecutando.',
    inactivos: 'Cursos detenidos o dados de baja.'
};
 
let pestanaActiva = 'todos';
const detallesAbiertos = new Set();
let temporizadorAviso = null;
 
const campoBuscador = document.getElementById('buscador');
const cuerpoTabla = document.getElementById('cuerpo_tabla');
 
function aviso(texto, tipo) {
    const caja = document.getElementById('aviso');
    caja.textContent = texto;
    caja.className = 'aviso ' + tipo;
 
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(function () {
        caja.className = 'aviso oculto';
    }, 5000);
}
 
function claseEstado(estado) {
    return 'estado_' + normalizar(estado).replace(/\s+/g, '-');
}
 
function dato(titulo, valor) {
    const contenido = (valor === undefined || valor === null || valor === '') ? '—' : valor;
    return '<div><dt>' + titulo + '</dt><dd>' + contenido + '</dd></div>';
}
 
function nombreCertificacion(codigo, certificaciones) {
    if (!codigo || codigo === 'NO_APLICA') {
        return 'No aplica';
    }
    return esc(nombreDe(certificaciones, codigo) || codigo);
}
 
function filaDetalle(curso, catalogos) {
    const metodologias = (curso.metodologias || []).map(function (codigo) {
        return esc(nombreDe(catalogos.metodologias, codigo) || codigo);
    }).join(', ');
 
    const adjuntos = (curso.adjuntos || []).map(function (archivo) {
        return esc(archivo.nombre);
    }).join(', ');
 
    return '<tr class="fila_detalle"><td colspan="' + COLUMNAS + '"><dl class="detalle_lista">' +
        dato('Nombre Power Campus', esc(curso.nombrePowerCampus)) +
        dato('Modalidad', esc(curso.modalidad)) +
        dato('Nivel de complejidad', esc(curso.nivel)) +
        dato('Créditos', esc(curso.creditos)) +
        dato('Horas', esc(curso.horas)) +
        dato('Moneda', esc(curso.moneda)) +
        dato('Certificación', nombreCertificacion(curso.certificacion, catalogos.certificaciones)) +
        dato('Área SFIA', esc(nombreDe(catalogos.areas, curso.areaSfia))) +
        dato('Metodologías', metodologias) +
        dato('Descripción corta', esc(curso.descripcionCorta)) +
        dato('Meta descripción', esc(curso.metaDescripcion)) +
        dato('Requisitos', esc(curso.requisitos)) +
        dato('Competencias', esc(curso.competencias)) +
        dato('Capacidades', esc(curso.capacidades)) +
        dato('Perfiles', esc(curso.perfiles)) +
        dato('Metadatos', esc(curso.metadatos)) +
        dato('Adjuntos', adjuntos) +
        '</dl></td></tr>';
}
 
function filaCurso(curso, catalogos) {
    const abierto = detallesAbiertos.has(curso.id);
 
    const codigo = curso.generarCodigo
        ? '<span class="pendiente_codigo">Por generar (Desarrollo Curricular)</span>'
        : esc(curso.codigo);
 
    const escuela = nombreDe(catalogos.escuelas, curso.escuela) || (curso.escuela + ' (no encontrada)');
    const carrera = nombreDe(catalogos.carreras, curso.carrera) || '—';
    const tematica = nombreDe(catalogos.tematicas, curso.tematica) || '—';
 
    let html = '<tr>' +
        '<td class="codigo">' + codigo + '</td>' +
        '<td>' + esc(curso.nombre) + '</td>' +
        '<td>' + esc(escuela) + '</td>' +
        '<td>' + esc(carrera) + '</td>' +
        '<td>' + esc(tematica) + '</td>' +
        '<td><span class="estado ' + claseEstado(curso.estado) + '">' + esc(curso.estado) + '</span></td>' +
        '<td><button type="button" class="btn_tabla" data-id="' + esc(curso.id) + '" aria-expanded="' + abierto + '">' +
            (abierto ? 'OCULTAR' : 'VER') +
        '</button></td>' +
    '</tr>';
 
    if (abierto) {
        html += filaDetalle(curso, catalogos);
    }
    return html;
}
 
function textoBusqueda(curso, catalogos) {
    return normalizar([
        curso.codigo,
        curso.generarCodigo ? 'por generar' : '',
        curso.nombre,
        curso.nombrePowerCampus,
        nombreDe(catalogos.escuelas, curso.escuela),
        nombreDe(catalogos.carreras, curso.carrera),
        nombreDe(catalogos.tematicas, curso.tematica),
        curso.estado
    ].join(' '));
}
 
function listar() {
    const cursos = leerLista(CLAVE_CURSOS);
    const catalogos = {
        escuelas: leerLista('escuelas'),
        carreras: leerLista('carreras'),
        tematicas: leerLista('tematica'),
        areas: leerLista('area_sfia'),
        metodologias: leerLista('lista_metodologias'),
        certificaciones: leerLista('certificaciones')
    };
 
    // Contador de cada pestaña
    Object.keys(FILTROS_PESTANA).forEach(function (clave) {
        document.getElementById('cont_' + clave).textContent =
            cursos.filter(FILTROS_PESTANA[clave]).length;
    });
    document.getElementById('ayuda_pestana').textContent = AYUDA_PESTANA[pestanaActiva];
 
    const enPestana = cursos.filter(FILTROS_PESTANA[pestanaActiva]);
    const filtro = normalizar(campoBuscador.value.trim());
 
    const visibles = enPestana.filter(function (curso) {
        return filtro === '' || textoBusqueda(curso, catalogos).includes(filtro);
    });
 
    if (visibles.length === 0) {
        let mensaje = 'No hay cursos en esta categoría.';
        if (cursos.length === 0) {
            mensaje = 'Aún no hay cursos registrados. Use el botón REGISTRAR para crear el primero.';
        } else if (filtro !== '') {
            mensaje = 'No se encontraron cursos con esa búsqueda.';
        }
        cuerpoTabla.innerHTML = '<tr><td class="vacio" colspan="' + COLUMNAS + '">' + mensaje + '</td></tr>';
    } else {
        cuerpoTabla.innerHTML = visibles.map(function (curso) {
            return filaCurso(curso, catalogos);
        }).join('');
    }
 
    document.getElementById('conteo').textContent =
        'Mostrando ' + visibles.length + ' de ' + enPestana.length + ' cursos';
}
 
function cambiarPestana(clave) {
    pestanaActiva = clave;
    document.querySelectorAll('.pestana').forEach(function (boton) {
        const activa = boton.getAttribute('data-pestana') === clave;
        boton.classList.toggle('activa', activa);
        boton.setAttribute('aria-selected', activa ? 'true' : 'false');
    });
    listar();
}
 
function mostrarAvisoDeRegistro() {
    const parametros = new URLSearchParams(window.location.search);
    if (parametros.get('registrado') === '1') {
        aviso('Curso registrado correctamente.', 'exito');
        try {
            window.history.replaceState(null, '', window.location.pathname);
        } catch (error) {
            /* Algunos navegadores no permiten cambiar la URL al abrir archivos locales */
        }
    }
}
 
// Eventos
campoBuscador.addEventListener('input', listar);
 
document.querySelectorAll('.pestana').forEach(function (boton) {
    boton.addEventListener('click', function () {
        cambiarPestana(boton.getAttribute('data-pestana'));
    });
});
 
cuerpoTabla.addEventListener('click', function (evento) {
    const boton = evento.target.closest('.btn_tabla');
    if (!boton) {
        return;
    }
    const id = boton.getAttribute('data-id');
    if (detallesAbiertos.has(id)) {
        detallesAbiertos.delete(id);
    } else {
        detallesAbiertos.add(id);
    }
    listar();
});
 
mostrarAvisoDeRegistro();
listar();
 