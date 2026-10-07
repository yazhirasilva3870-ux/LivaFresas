// URL de tu Google Apps Script (si la tienes, pégala aquí)
const URL_BASE_DATOS = "PEGA_AQUI_TU_URL_DE_GOOGLE";

let idiomaActual = "es";
let respuestasGlobales = [];

// Diccionario de traducción para la página y las tarjetas de opinión
const textos = {
    es: {
        titulo: "Opiniones de nuestros clientes 🍓",
        subtitulo: "Aquí puedes ver lo que las personas opinan sobre su experiencia en Liva Fresas.",
        btnVolver: "📋 Volver a la encuesta",
        sinOpiniones: "Aún no hay opiniones registradas. ¡Sé la primera persona en enviar una! 🍓",
        cargando: "Cargando opiniones... 🍓",
        error: "No se pudieron cargar las opiniones de internet, pero mostramos las guardadas en tu equipo.",
        anonimo: "Anónimo",
        fechaVisita: "Fecha de visita",
        comida: "Comida",
        local: "El local",
        atencion: "Atención",
        general: "General",
        recomendacion: "Recomendación",
        registradoEl: "Registrado el",
        sinComentario: "Sin comentario"
    },
    en: {
        titulo: "Customer Feedback 🍓",
        subtitulo: "Here you can see what people think about their experience at Liva Fresas.",
        btnVolver: "📋 Back to survey",
        sinOpiniones: "No opinions registered yet. Be the first one to leave feedback! 🍓",
        cargando: "Loading feedback... 🍓",
        error: "Could not load online feedback, showing local records instead.",
        anonimo: "Anonymous",
        fechaVisita: "Visit date",
        comida: "Food",
        local: "Our place",
        atencion: "Customer service",
        general: "Overall",
        recomendacion: "Recommendation",
        registradoEl: "Registered on",
        sinComentario: "No comment"
    }
};

// Transforma números en estrellas (ej. 4 -> "★★★★☆")
function convertirEstrellas(valor) {
    let num = parseInt(valor) || 0;
    let estrellas = "";
    for (let i = 1; i <= 5; i++) {
        estrellas += (i <= num) ? "★" : "☆";
    }
    return estrellas;
}

// Dibuja las tarjetas en pantalla aplicando el idioma seleccionado
function renderizarPagina() {
    let t = textos[idiomaActual];
    let contenedor = document.getElementById("contenedor-opiniones");

    // 1. Traducir textos principales del encabezado
    let elemTitulo = document.getElementById("titulo-opiniones-pagina");
    let elemSubtitulo = document.getElementById("subtitulo-opiniones-pagina");
    let elemBtnVolver = document.getElementById("btn-comentarios");

    if (elemTitulo) elemTitulo.textContent = t.titulo;
    if (elemSubtitulo) elemSubtitulo.textContent = t.subtitulo;
    if (elemBtnVolver) elemBtnVolver.textContent = t.btnVolver;

    contenedor.innerHTML = "";

    // 2. Si no hay comentarios registrados
    if (!respuestasGlobales || respuestasGlobales.length === 0) {
        contenedor.innerHTML = `
            <div class="tarjeta-vacia">
                <p id="texto-sin-opiniones">${t.sinOpiniones}</p>
            </div>
        `;
        return;
    }

    // 3. Crear tarjetas traducidas (de la más reciente a la más antigua)
    respuestasGlobales.slice().reverse().forEach(function(r) {
        let tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-opinion";

        let nombreFinal = (r.nombre && r.nombre.trim() !== "" && r.nombre !== "Anónimo" && r.nombre !== "Anonymous") 
            ? r.nombre 
            : t.anonimo;

        let comentarioFinal = (r.comentario && r.comentario.trim() !== "" && r.comentario !== "Sin comentario" && r.comentario !== "No comment")
            ? r.comentario
            : t.sinComentario;

        tarjeta.innerHTML = `
            <div class="header-tarjeta">
                <span class="nombre-cliente">👤 ${nombreFinal}</span>
                <span class="fecha-visita">📅 ${t.fechaVisita}: ${r.fechaVisita || "N/A"}</span>
            </div>

            <div class="detalles-calificacion">
                <p><strong>${t.comida}:</strong> <span class="estrellas-doradas">${convertirEstrellas(r.comida)}</span></p>
                <p><strong>${t.local}:</strong> <span class="estrellas-doradas">${convertirEstrellas(r.local)}</span></p>
                <p><strong>${t.atencion}:</strong> <span class="estrellas-doradas">${convertirEstrellas(r.atencion)}</span></p>
                <p><strong>${t.general}:</strong> <span class="estrellas-doradas">${convertirEstrellas(r.general)}</span></p>
                <p><strong>${t.recomendacion}:</strong> <span class="porcentaje-badge">${r.nps || "50%"}</span></p>
            </div>

            <div class="comentario-cliente">
                <p>"${comentarioFinal}"</p>
            </div>

            <div class="footer-tarjeta">
                <span>${t.registradoEl} ${r.fechaRegistro || ""}</span>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });
}

// Cargar opiniones desde Google Sheets o desde la memoria del navegador
function cargarOpiniones() {
    let contenedor = document.getElementById("contenedor-opiniones");
    let t = textos[idiomaActual];

    contenedor.innerHTML = `<div class="tarjeta-vacia"><p>${t.cargando}</p></div>`;

    // Intentar leer de Google Sheets
    if (URL_BASE_DATOS && URL_BASE_DATOS !== "PEGA_AQUI_TU_URL_DE_GOOGLE" && URL_BASE_DATOS.startsWith("http")) {
        fetch(URL_BASE_DATOS)
            .then(res => res.json())
            .then(data => {
                respuestasGlobales = Array.isArray(data) ? data : [];
                renderizarPagina();
            })
            .catch(() => {
                // Si falla Google Sheets, lee de la memoria local
                respuestasGlobales = JSON.parse(localStorage.getItem("respuestasEncuesta")) || [];
                renderizarPagina();
            });
    } else {
        // Si aún no han puesto la URL, usa directamente la memoria local
        respuestasGlobales = JSON.parse(localStorage.getItem("respuestasEncuesta")) || [];
        renderizarPagina();
    }
}

// Escuchar los botones de Español e Inglés
document.addEventListener("DOMContentLoaded", function() {
    let btnEs = document.getElementById("espanol");
    let btnEn = document.getElementById("ingles");

    if (btnEs) {
        btnEs.onclick = function() {
            idiomaActual = "es";
            renderizarPagina();
        };
    }

    if (btnEn) {
        btnEn.onclick = function() {
            idiomaActual = "en";
            renderizarPagina();
        };
    }

    cargarOpiniones();
});