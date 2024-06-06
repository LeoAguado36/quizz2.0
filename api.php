<?php
// Establecer el tipo de contenido como JSON y permitir el acceso desde cualquier origen
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

// Configuración de la base de datos
$servername = "bfc71joubcd6fjob8gqp-mysql.services.clever-cloud.com"; // Nombre del servidor
$username = "utezpmswgrnxg2hd"; // Nombre de usuario de la base de datos
$password = "nNjEAUjDqxJrSQ9Je8nF"; // Contraseña de la base de datos
$dbname = "bfc71joubcd6fjob8gqp"; // Nombre de la base de datos

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error); // Terminar el script si la conexión falla
}

// Obtener el parámetro de la materia desde la URL
$subject = isset($_GET['subject']) ? $_GET['subject'] : ''; // Asignar el valor de 'subject' o una cadena vacía si no está presente

// Consulta para obtener las preguntas de la materia específica
$sql = "SELECT * FROM questions WHERE subject = ?"; // Consulta SQL con un parámetro
$stmt = $conn->prepare($sql); // Preparar la consulta
$stmt->bind_param("s", $subject); // Vincular el parámetro a la consulta
$stmt->execute(); // Ejecutar la consulta
$result = $stmt->get_result(); // Obtener los resultados de la consulta

// Crear un array para almacenar las preguntas
$questions = array();

// Recorrer los resultados y agregar cada fila al array
while($row = $result->fetch_assoc()) {
    $questions[] = $row; // Agregar cada fila como un elemento del array
}

// Devolver las preguntas en formato JSON
echo json_encode($questions); // Convertir el array a JSON y enviarlo como respuesta

// Cerrar la conexión
$conn->close(); // Cerrar la conexión a la base de datos
?>
