<?php
include 'conectar.php';
$nombre = $_POST['nombre'];
$edad = $_POST['edad'];
$nombredelnegocio = $_POST['nomnbre del negocio'];
$numerocedula = $_POST['numero cedula'];
$telefono = $_POST['telefono'];
$dirección = $_POST['dirección'];
$contraseña = $_POST['contraseña'];

$sql = "INSERT INTO usuario (nombre, edad, nomnre del negocio, numero cedula, telefono, dirección, contraseña)
VALUES ('$nombre', '$edad', '$nombredelnegocio', '$numerocedula', '$telefono', '$dirección', '$contraseña' )";

if (mysqli_query($conn, $sql)) {
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

mysqli_close($conn);

?>