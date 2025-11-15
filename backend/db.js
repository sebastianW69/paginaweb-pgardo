import mysql2 from "mysql2/promise";

export const db = await mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "textilesdb"
});

console.log("Base de datos conectada");
