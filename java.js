// ESTRELLAS

let calificaciones = [
    "calificacion-comida",
    "calificacion-local",
    "calificacion-atencion",
    "calificacion-general"
];

calificaciones.forEach(function(id) {

    let espacio = document.getElementById(id);

    for (let i = 1; i <= 5; i++) {

        let estrella = document.createElement("button");

        estrella.textContent = "☆";
        estrella.type = "button";
        estrella.style.fontSize = "30px";
        estrella.style.border = "none";
        estrella.style.background = "none";
        estrella.style.cursor = "pointer";
        estrella.style.color = "#999999";

        estrella.onclick = function() {

            espacio.dataset.valor = i;

            let todasLasEstrellas = espacio.querySelectorAll("button");

            todasLasEstrellas.forEach(function(estrella, posicion) {

                if (posicion < i) {
                    estrella.textContent = "★";
                    estrella.style.color = "#FFD700";
                } else {
                    estrella.textContent = "☆";
                    estrella.style.color = "#999999";
                }

            });
        };

        espacio.appendChild(estrella);
    } // <- El bucle for termina aquí
});



// NPS (PORCENTAJE CON BARRA DESLIZANTE)

let sliderNps = document.getElementById("nps-range");
let valorNps = document.getElementById("nps-valor");

sliderNps.oninput = function() {
    valorNps.textContent = this.value + "%";
};

// ENVIAR ENCUESTA

// ENVIAR ENCUESTA Y GUARDAR RESPUESTAS

let formulario = document.querySelector("form");

formulario.onsubmit = function(event) {
    event.preventDefault();

    // Reemplaza esta sección en java.js:

const URL_BASE_DATOS = "PEGA_AQUI_TU_URL_DE_GOOGLE"; 

let formulario = document.querySelector("form");

formulario.onsubmit = function(event) {
    event.preventDefault();

    let nuevaRespuesta = {
        nombre: document.getElementById("nombre").value || "Anónimo",
        fechaVisita: document.getElementById("fecha").value || "No especificada",
        comida: document.getElementById("calificacion-comida").dataset.valor || "0",
        local: document.getElementById("calificacion-local").dataset.valor || "0",
        atencion: document.getElementById("calificacion-atencion").dataset.valor || "0",
        general: document.getElementById("calificacion-general").dataset.valor || "0",
        nps: document.getElementById("nps-range").value + "%",
        comentario: document.getElementById("comentario").value || "Sin comentario",
        fechaRegistro: new Date().toLocaleDateString("es-ES")
    };

    // 1. Guardar de inmediato en el navegador
    let respuestasLocales = JSON.parse(localStorage.getItem("respuestasEncuesta")) || [];
    respuestasLocales.push(nuevaRespuesta);
    localStorage.setItem("respuestasEncuesta", JSON.stringify(respuestasLocales));

    // 2. Enviar a Google Sheets si hay enlace configurado
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

    alert("¡Gracias por responder la encuesta!  Tu opinión ha sido registrada.");
    formulario.reset();
    document.getElementById("nps-valor").textContent = "50%";
};

    // 2. Obtener las respuestas guardadas anteriormente (o iniciar lista vacía)
    let respuestasGuardadas = JSON.parse(localStorage.getItem("respuestasEncuesta")) || [];

    // 3. Agregar la nueva respuesta
    respuestasGuardadas.push(nuevaRespuesta);

    // 4. Guardar en la base de datos del navegador
    localStorage.setItem("respuestasEncuesta", JSON.stringify(respuestasGuardadas));

    alert("¡Gracias por responder la encuesta! Tu opinión ha sido registrada.");
    
    // Limpiar el formulario
    formulario.reset();
    document.getElementById("nps-valor").textContent = "50%";
};

// ESPAÑOL

botonEspanol.onclick = function() {

    document.getElementById("titulo-encuesta").textContent =
        "Cuéntanos sobre tu experiencia";

    document.getElementById("titulo-visita").textContent =
        "Sobre tu visita";

    document.getElementById("label-nombre").textContent =
        "Nombre (opcional)";

    document.getElementById("label-fecha").textContent =
        "Fecha de visita";

    document.getElementById("titulo-comida").textContent =
        "La comida";

    document.getElementById("pregunta-comida").textContent =
        "¿Cómo calificarías la calidad de nuestros productos?";

    document.getElementById("titulo-local").textContent =
        "El local";

    document.getElementById("pregunta-local").textContent =
        "¿Cómo calificarías el ambiente, la limpieza y la comodidad?";

    document.getElementById("titulo-atencion").textContent =
        "Atención al cliente";

    document.getElementById("pregunta-atencion").textContent =
        "¿Cómo calificarías la amabilidad y rapidez de nuestra atención?";

    document.getElementById("titulo-general").textContent =
        "Experiencia general";

    document.getElementById("pregunta-general").textContent =
        "En general, ¿cómo fue tu experiencia en Liva Fresas?";

    document.getElementById("titulo-nps").textContent =
        "Recomendación";

    document.getElementById("pregunta-nps").textContent =
        "¿Qué tan probable es que recomiendes Liva Fresas a otra persona?";

    document.getElementById("titulo-comentario").textContent =
        "Cuéntanos más";

    document.getElementById("label-comentario").textContent =
        "¿Hay algo que quieras contarnos?";

    document.getElementById("texto-privacidad").textContent =
        "Acepto que mi respuesta sea almacenada para fines de evaluación y mejora del servicio.";

    document.getElementById("enviar").textContent =
        "Enviar opinión ";
};


// INGLÉS

botonIngles.onclick = function() {

    document.getElementById("titulo-encuesta").textContent =
        "Tell us about your experience";

    document.getElementById("titulo-visita").textContent =
        "About your visit";

    document.getElementById("label-nombre").textContent =
        "Name (optional)";

    document.getElementById("label-fecha").textContent =
        "Visit date";

    document.getElementById("titulo-comida").textContent =
        "Food";

    document.getElementById("pregunta-comida").textContent =
        "How would you rate the quality of our products?";

    document.getElementById("titulo-local").textContent =
        "Our place";

    document.getElementById("pregunta-local").textContent =
        "How would you rate the atmosphere, cleanliness, and comfort?";

    document.getElementById("titulo-atencion").textContent =
        "Customer service";

    document.getElementById("pregunta-atencion").textContent =
        "How would you rate the friendliness and speed of our service?";

    document.getElementById("titulo-general").textContent =
        "Overall experience";

    document.getElementById("pregunta-general").textContent =
        "Overall, how was your experience at Liva Fresas?";

    document.getElementById("titulo-nps").textContent =
        "Recommendation";

    document.getElementById("pregunta-nps").textContent =
        "How likely are you to recommend Liva Fresas to someone else?";

    document.getElementById("titulo-comentario").textContent =
        "Tell us more";

    document.getElementById("label-comentario").textContent =
        "Is there anything else you would like to tell us?";

    document.getElementById("texto-privacidad").textContent =
        "I agree that my response may be stored for evaluation and service improvement purposes.";

    document.getElementById("enviar").textContent =
        "Submit feedback ";
};