import Express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import Cors from "cors";

const stringConexion =
  "mongodb+srv://Tutor:DigitTutor@proyectodigitspace.hfib8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(stringConexion, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = Express();
app.use(Express.json());
app.use(Cors());

app.get('/ventas', (req, res) => {
    console.log("Se consulta la base de datos que está en la ruta /ventas");
    conexion.collection("Ventas").find({}).limit(50).toArray((err, result) => {
        if (err) {
            res.sendStatus(500).send("Error consultando las ventas.");
        } else {
            res.json(result);
        }
    });
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

app.patch("/ventas/editar", (req, res) => {
    const edicion = req.body;
    console.log(edicion);
    const filtroVenta = {_id: new ObjectId(edicion.id)};
    delete edicion.id;
    const operacion = {
      $set: edicion,
    };
    conexion
      .collection("Ventas")
      .findOneAndUpdate(
        filtroVenta,
        operacion,
        { upsert: true, returnOriginal: true },
        (err, result) => {
          if (err) {
            console.error("Error actualizando la venta: ", err);
            res.sendStatus(500);
          } else {
            console.log("Actualización exitosa.");
            res.sendStatus(200);
          }
        }
      );
});

app.delete("/ventas/eliminar", (req, res) => {
    const filtroVenta = { _id: new ObjectId(req.body.id) };
    conexion.collection("Ventas").deleteOne(filtroVenta, (err, result) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            console.log("Venta eliminada exitosamente.");
            res.sendStatus(200);
        }      
    });
});


let conexion;

const main = () => {    
    client.connect((err, db) => {
        if (err) {
            console.log("Error conectando a la base de datos");
        }
        conexion = db.db("mobiliaria");
        console.log("Conexión exitosa.");
        return app.listen(5000, () => {
            console.log("Escuchando puerto 5000.");
        });
    });
};

main();