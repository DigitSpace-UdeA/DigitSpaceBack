import Express from 'express';
import { MongoClient } from 'mongodb';

const stringConexion =
  "mongodb+srv://Tutor:DigitTutor@proyectodigitspace.hfib8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(stringConexion, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = Express();

app.use(Express.json());

app.get('/ventas', (req, res) => {
    console.log("alguien hizo get en la ruta /ventas");
    conexion.collection("Ventas").find    
    res.send(ventas);
});

app.post('/ventas/nueva', (req, res) => {
    console.log(req);
    const datosVenta = req.body;
    console.log("Llaves: ", Object.keys(datosVenta));
    try {
        if (
            Object.keys(datosVenta).includes("name") &&
            Object.keys(datosVenta).includes("brand") &&
            Object.keys(datosVenta).includes("price")
        ) {
            conexion.collection("Ventas").insertOne(datosVenta, (err, result) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    console.log(result);
                    res.sendStatus(200);
                }
            });
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    } catch {
        res.sendStatus(500);
    }
});

let conexion;

const main = () => {
    
    client.connect((err, db) => {
        if (err) {
            console.log("Error conectando a la base de datos");
            return "error";
        }
        conexion = db.db("mobiliaria");
        return app.listen(5000, () => {
            console.log("Escuchando puerto 5000");
        });
    });
};

main();