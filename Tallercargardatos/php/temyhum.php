<?php
include 'conectar.php';
$nombre = $_POST['nombre'];
$edad = $_POST['edad'];
$nombre_del_negocio = $_POST['nombre_del_negocio'];
$numero_cedula = $_POST['numero_cedula'];
$telefono = $_POST['telefono'];
$direccion = $_POST['direccion'];
$contra = $_POST['contra'];

$sql = "INSERT INTO usuario (nombre, edad, nombre_del_negocio, numero_cedula, telefono, direccion, contra)
VALUES ('$nombre', '$edad', '$nombre_del_negocio', '$numero_cedula', '$telefono', '$direccion', '$contra' )";

if (mysqli_query($conn, $sql)) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

mysqli_close($conn);

?>