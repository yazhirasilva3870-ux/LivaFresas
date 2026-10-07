// ==========================================
// 1. ENLACE CON TU EXCEL (GOOGLE SHEETS)
// ==========================================
// Cambia lo que está entre comillas por tu URL de Google Apps Script (la que termina en /exec)
const URL_BASE_DATOS = "Phttps://docs.google.com/spreadsheets/d/1GtN8n9kzQMeCzieY9twGAXInFRF5z1N2HRmjK_zEgDw/edit?gid=0#gid=0";


// ==========================================
// 2. FUNCIONAMIENTO DE LAS ESTRELLAS Y SLIDER
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // Activar clic en las estrellas para seleccionarlas
    let contenedoresEstrellas = document.querySelectorAll(".calificacion-estrellas, [id^='calificacion-']");

    contenedoresEstrellas.forEach(contenedor => {
        let estrellas = contenedor.querySelectorAll("span, i, button");

        estrellas.forEach((estrella, index) => {
            estrella.addEventListener("click", function() {
                let valor = index + 1;
                contenedor.dataset.valor = valor; // Guarda el valor (1 al 5)

                // Pinta las estrellas de dorado
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

    // Actualizar el número % cuando mueven la barra NPS
    let sliderNps = document.getElementById("nps-range");
    let valorNps = document.getElementById("nps-valor");
    if (sliderNps && valorNps) {
        sliderNps.oninput = function() {
            valorNps.textContent = this.value + "%";
        };
    }
});


// ==========================================
// 3. CAPTURA Y ENVÍO DEL FORMULARIO
// ==========================================
let formulario = document.querySelector("form");

if (formulario) {
    formulario.onsubmit = function(event) {
        event.preventDefault();

        // Toma los valores seleccionados (incluyendo las estrellas)
        let nuevaRespuesta = {
            nombre: document.getElementById("nombre")?.value || "Anónimo",
            fechaVisita: document.getElementById("fecha")?.value || "No especificada",
            comida: document.getElementById("calificacion-comida")?.dataset.valor || "0",
            local: document.getElementById("calificacion-local")?.dataset.valor || "0",
            atencion: document.getElementById("calificacion-atencion")?.dataset.valor || "0",
            general: document.getElementById("calificacion-general")?.dataset.valor || "0",
            nps: (document.getElementById("nps-range")?.value || "50") + "%",
            comentario: document.getElementById("comentario")?.value || "Sin comentario",
            fechaRegistro: new Date().toLocaleDateString("es-ES")
        };

        // 1. Guarda de inmediato en el navegador para mostrarlo en comentarios.html
        let respuestasLocales = JSON.parse(localStorage.getItem("respuestasEncuesta")) || [];
        respuestasLocales.push(nuevaRespuesta);
        localStorage.setItem("respuestasEncuesta", JSON.stringify(respuestasLocales));

        // 2. Envía la información a tu hoja de Google Sheets
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

        alert("¡Gracias por responder la encuesta! 🍓 Tu opinión ha sido registrada.");
        formulario.reset();

        // Reiniciar las estrellas visualmente tras enviar
        document.querySelectorAll("[data-valor]").forEach(c => c.dataset.valor = "0");
        document.querySelectorAll(".calificacion-estrellas span").forEach(e => e.textContent = "☆");
        
        let npsTexto = document.getElementById("nps-valor");
        if (npsTexto) npsTexto.textContent = "50%";
    };
}
