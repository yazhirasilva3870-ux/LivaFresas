// 1. URL DE TU GOOGLE APPS SCRIPT
// Pega aquí la URL que termina en /exec
const URL_BASE_DATOS = "PEGA_AQUI_TU_URL_DE_GOOGLE"; 

// 2. DICCIONARIO DE TRADUCCIÓN PARA INDEX.HTML
const traducciones = {
    es: {
        titulo: "Encuesta de Satisfacción 🍓",
        subtitulo: "Tu opinión nos ayuda a mejorar la experiencia en Liva Fresas.",
        lblNombre: "Nombre:",
        lblFecha: "Fecha de visita:",
        lblComida: "¿Qué tal la comida / producto?",
        lblLocal: "¿Qué tal el local / ambiente?",
        lblAtencion: "¿Qué tal la atención al cliente?",
        lblGeneral: "Calificación general:",
        lblNps: "¿Qué tan probable es que nos recomiendes?",
        lblComentario: "Déjanos tu comentario u opinión:",
        phNombre: "Escribe tu nombre...",
        phComentario: "Escribe tu opinión aquí...",
        btnEnviar: "Enviar opinión 🍓",
        btnVerComentarios: "💬 Ver Opiniones",
        alertaExito: "¡Gracias por responder la encuesta! 🍓 Tu opinión ha sido registrada."
    },
    en: {
        titulo: "Customer Satisfaction Survey 🍓",
        subtitulo: "Your feedback helps us improve your experience at Liva Fresas.",
        lblNombre: "Name:",
        lblFecha: "Visit Date:",
        lblComida: "How was the food / product?",
        lblLocal: "How was the place / atmosphere?",
        lblAtencion: "How was the customer service?",
        lblGeneral: "Overall rating:",
        lblNps: "How likely are you to recommend us?",
        lblComentario: "Leave us your comment or opinion:",
        phNombre: "Type your name...",
        phComentario: "Type your feedback here...",
        btnEnviar: "Submit Feedback 🍓",
        btnVerComentarios: "💬 View Feedback",
        alertaExito: "Thank you for filling out the survey! 🍓 Your feedback has been recorded."
    }
};

let idiomaActual = "es";

// Función para cambiar de idioma
function cambiarIdioma(lang) {
    idiomaActual = lang;
    let t = traducciones[lang];

    let elemTitulo = document.querySelector("main h2, #titulo-encuesta");
    let elemSubtitulo = document.querySelector(".subtitulo-encuesta, #subtitulo-encuesta");
    let elemBtnVer = document.getElementById("btn-comentarios");
    let elemBtnEnviar = document.querySelector("button[type='submit'], #btn-enviar");

    if (elemTitulo) elemTitulo.textContent = t.titulo;
    if (elemSubtitulo) elemSubtitulo.textContent = t.subtitulo;
    if (elemBtnVer) elemBtnVer.textContent = t.btnVerComentarios;
    if (elemBtnEnviar) elemBtnEnviar.textContent = t.btnEnviar;

    let inputNombre = document.getElementById("nombre");
    let inputComentario = document.getElementById("comentario");
    if (inputNombre) inputNombre.placeholder = t.phNombre;
    if (inputComentario) inputComentario.placeholder = t.phComentario;

    // Cambiar etiquetas si existen por ID o posición
    let labels = document.querySelectorAll("label");
    labels.forEach(label => {
        let forAttr = label.getAttribute("for");
        if (forAttr === "nombre") label.textContent = t.lblNombre;
        if (forAttr === "fecha") label.textContent = t.lblFecha;
        if (forAttr === "comentario") label.textContent = t.lblComentario;
    });
}

document.addEventListener("DOMContentLoaded", function() {

    // 3. FUNCIONAMIENTO INTERACTIVO DE LAS ESTRELLAS
    let contenedoresEstrellas = document.querySelectorAll(".estrellas, .calificacion-estrellas, [id^='calificacion-']");

    contenedoresEstrellas.forEach(contenedor => {
        let estrellas = contenedor.querySelectorAll("span, i, button");

        estrellas.forEach((estrella, index) => {
            estrella.style.cursor = "pointer";
            
            estrella.addEventListener("click", function() {
                let valor = index + 1;
                contenedor.dataset.valor = valor;

                estrellas.forEach((e, i) => {
                    if (i < valor) {
                        e.classList.add("activa");
                        e.textContent = "★";
                    } else {
                        e.classList.remove("activa");
                        e.textContent = "☆";
                    }
                });
            });
        });
    });

    // 4. FUNCIONAMIENTO DEL SLIDER NPS
    let sliderNps = document.getElementById("nps-range");
    let valorNps = document.getElementById("nps-valor");
    if (sliderNps && valorNps) {
        sliderNps.oninput = function() {
            valorNps.textContent = this.value + "%";
        };
    }

    // 5. BOTONES DE IDIOMA
    let btnEs = document.getElementById("espanol");
    let btnEn = document.getElementById("ingles");

    if (btnEs) btnEs.onclick = () => cambiarIdioma("es");
    if (btnEn) btnEn.onclick = () => cambiarIdioma("en");

    // 6. CAPTURA Y ENVÍO DEL FORMULARIO
    let formulario = document.querySelector("form");

    if (formulario) {
        formulario.onsubmit = function(event) {
            event.preventDefault();

            let nuevaRespuesta = {
                nombre: document.getElementById("nombre")?.value || (idiomaActual === "es" ? "Anónimo" : "Anonymous"),
                fechaVisita: document.getElementById("fecha")?.value || "N/A",
                comida: document.getElementById("calificacion-comida")?.dataset.valor || "0",
                local: document.getElementById("calificacion-local")?.dataset.valor || "0",
                atencion: document.getElementById("calificacion-atencion")?.dataset.valor || "0",
                general: document.getElementById("calificacion-general")?.dataset.valor || "0",
                nps: (document.getElementById("nps-range")?.value || "50") + "%",
                comentario: document.getElementById("comentario")?.value || (idiomaActual === "es" ? "Sin comentario" : "No comment"),
                fechaRegistro: new Date().toLocaleDateString("es-ES")
            };

            // Guardar localmente para ver en vivo
            let respuestasLocales = JSON.parse(localStorage.getItem("respuestasEncuesta")) || [];
            respuestasLocales.push(nuevaRespuesta);
            localStorage.setItem("respuestasEncuesta", JSON.stringify(respuestasLocales));

            // Enviar a Google Sheets
            if (URL_BASE_DATOS && URL_BASE_DATOS !== "PEGA_AQUI_TU_URL_DE_GOOGLE" && URL_BASE_DATOS.startsWith("http")) {
                fetch(URL_BASE_DATOS, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },
                    body: JSON.stringify(nuevaRespuesta)
                });
            }

            alert(traducciones[idiomaActual].alertaExito);
            formulario.reset();

            // Reiniciar estrellas visuales
            document.querySelectorAll("[data-valor]").forEach(c => c.dataset.valor = "0");
            document.querySelectorAll(".estrellas span, .calificacion-estrellas span, [id^='calificacion-'] span").forEach(e => e.textContent = "☆");
            
            if (valorNps) valorNps.textContent = "50%";
        };
    }
});
