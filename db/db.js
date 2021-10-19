import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
const stringConexion = process.env.DATABASE_URL;

const client = new MongoClient(stringConexion, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let conexion;

const conectarBD = (callback) => {
    client.connect((err, db) => {
        if (err) {
            console.error("Error conectando a la base de datos");
            return 'error'
        }
        conexion = db.db("mobiliaria");
        console.log("Conexión exitosa.");
        return callback;
    });
};

export { conectarBD };