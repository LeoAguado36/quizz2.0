// Variables para mantener el estado actual del cuestionario y almacenar datos
let currentQuestionIndex = 0; // Índice de la pregunta actual
let quizData = []; // Datos del cuestionario
const answersGiven = []; // Respuestas dadas por el usuario

// Elementos del DOM para interactuar con la interfaz
const quizContainer = document.getElementById('quiz'); // Contenedor del cuestionario
const resultsContainer = document.getElementById('results'); // Contenedor de los resultados
const feedbackContainer = document.getElementById('feedback'); // Contenedor de la retroalimentación
const nextButton = document.getElementById('next');// Botón "Siguiente"
const submitButton = document.getElementById('submit'); // Botón "Enviar"
const modal = document.getElementById('results-modal'); // Modal de resultados
const span = document.getElementsByClassName('close')[0]; // Botón para cerrar el modal
const restartButton = document.getElementById('restart'); // Botón para reiniciar el cuestionario
const menuButton = document.getElementById('menu'); // Botón para volver al menú

// Función para cargar el cuestionario desde un API según la materia seleccionada
function loadQuiz(subject) {
    fetch(`http://localhost/quiz-app/api.php?subject=${subject}`)
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            quizData = data; // Guardar los datos del cuestionario
            document.querySelector('.menu-container').style.display = 'none'; // Ocultar el menú
            document.querySelector('.quiz-container').style.display = 'block'; // Mostrar el cuestionario
            showQuestion(currentQuestionIndex); // Mostrar la primera pregunta
        })
        .catch(error => console.error('Error fetching questions:', error)); // Manejo de errores
}

// Función para mostrar una pregunta del cuestionario
function showQuestion(questionIndex) {
    feedbackContainer.style.display = 'none'; // Ocultar el contenedor de retroalimentación
    const currentQuestion = quizData[questionIndex]; // Obtener la pregunta actual
    const answers = [currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4].map(option => `
        <label>
            <input type="radio" name="question${questionIndex}" value="${option}">
            ${option}
        </label>
    `).join(''); // Generar opciones de respuesta
    quizContainer.innerHTML = `
        <h2>${currentQuestion.question}</h2>
        <img src="${currentQuestion.image}" class="question-image" alt="Imagen relacionada con la pregunta">
        <div class="answers">${answers}</div>
    `;// Mostrar la pregunta y las opciones
    updateButtons(); // Actualizar los botones
    const answerInputs = document.querySelectorAll(`input[name="question${questionIndex}"]`);
    answerInputs.forEach(input => input.addEventListener('change', () => {
        nextButton.disabled = false; // Habilitar el botón "Siguiente" al seleccionar una respuesta
    }));
}

// Función para mostrar los resultados del cuestionario
function showResults() {
    let numCorrect = 0; // Contador de respuestas correctas
    quizData.forEach((currentQuestion, questionNumber) => {
        if (answersGiven[questionNumber] === currentQuestion.correct) {
            numCorrect++;
        }
    }); // Comparar respuestas dadas con las correctas
    const score = (numCorrect / quizData.length) * 100;  // Calcular el puntaje
    resultsContainer.innerHTML = `Tu puntaje es: ${score.toFixed(2)} de 100`; // Mostrar el puntaje
    modal.style.display = "flex"; // Mostrar el modal de resultados
}

// Función para actualizar la visibilidad de los botones
function updateButtons() {
    nextButton.style.display = currentQuestionIndex < quizData.length - 1 ? 'inline-block' : 'none';
    submitButton.style.display = currentQuestionIndex === quizData.length - 1 ? 'inline-block' : 'none';
    nextButton.disabled = true; // Deshabilitar el botón "Siguiente" por defecto
}

// Evento click para el botón "Siguiente"
nextButton.addEventListener('click', () => {
    const selectedAnswer = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
    if (selectedAnswer) {
        answersGiven[currentQuestionIndex] = selectedAnswer.value; // Guardar la respuesta seleccionada
        const isCorrect = selectedAnswer.value === quizData[currentQuestionIndex].correct; // Verificar si la respuesta es correcta
        feedbackContainer.textContent = isCorrect ? '¡Correcto!' : 'Incorrecto'; // Mostrar retroalimentación
        feedbackContainer.style.color = isCorrect ? 'green' : 'red'; // Cambiar el color del texto de retroalimentación
        feedbackContainer.style.display = 'block'; // Mostrar el contenedor de retroalimentación
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                showQuestion(currentQuestionIndex); // Mostrar la siguiente pregunta
            } else {
                showResults(); // Mostrar los resultados si no hay más preguntas
            }
        }, 1000); // Espera 1 segundo antes de mostrar la siguiente pregunta
    }
});

// Evento click para el botón "Enviar"
submitButton.addEventListener('click', () => {
    const selectedAnswer = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
    if (selectedAnswer) {
        answersGiven[currentQuestionIndex] = selectedAnswer.value; // Guardar la última respuesta seleccionada
    }
    showResults(); // Mostrar los resultados
});

// Evento para cerrar el modal al hacer clic en la "x"
span.onclick = function() {
    modal.style.display = "none";
    currentQuestionIndex = 0; // Reiniciar el índice de preguntas
}

// Evento para cerrar el modal al hacer clic fuera de él
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Asegúrate de ocultar el modal al cargar la página
window.onload = function() {
    modal.style.display = "none";
}

// Reiniciar el quiz
restartButton.onclick = function() {
    modal.style.display = "none"; // Ocultar el modal
    currentQuestionIndex = 0; // Reiniciar el índice de preguntas
    answersGiven.length = 0; // Limpiar las respuestas dadas
    showQuestion(currentQuestionIndex); // Mostrar la primera pregunta
} 

// Redirigir al menú
menuButton.onclick = function() {
    document.querySelector('.quiz-container').style.display = 'none'; // Ocultar el contenedor del cuestionario
    document.querySelector('.menu-container').style.display = 'block'; // Mostrar el menú
}

// Mostrar la primera pregunta al cargar la página
showQuestion(currentQuestionIndex);