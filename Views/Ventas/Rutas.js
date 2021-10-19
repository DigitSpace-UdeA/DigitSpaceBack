import Express from 'express';
import { getDB } from "../../db/db.js";
import { MongoClient, ObjectId } from "mongodb";

const rutasVentas = Express.Router();

rutasVentas.route("/ventas").get((req, res) => {
  console.log("Se consulta la base de datos que está en la ruta /ventas");
  const basedeDatos = getDB();
  basedeDatos
    .collection("Ventas")
    .find({})
    .limit(50)
    .toArray((err, result) => {
      if (err) {
        res.sendStatus(500).send("Error consultando las ventas.");
      } else {
        res.json(result);
      }
    });
});

rutasVentas.route("/ventas/nueva").post((req, res) => {
  console.log(req);
  const datosVenta = req.body;
  console.log("Llaves: ", Object.keys(datosVenta));
  try {
    if (
      Object.keys(datosVenta).includes("name") &&
      Object.keys(datosVenta).includes("brand") &&
      Object.keys(datosVenta).includes("price")
    ) {
      const basedeDatos = getDB();
      basedeDatos.collection("Ventas").insertOne(datosVenta, (err, result) => {
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

rutasVentas.route("/ventas/editar").patch((req, res) => {
  const edicion = req.body;
  console.log(edicion);
  const filtroVenta = { _id: new ObjectId(edicion.id) };
  delete edicion.id;
  const operacion = {
    $set: edicion,
  };
  const basedeDatos = getDB();
  basedeDatos
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

rutasVentas.route("/ventas/eliminar").delete((req, res) => {
  const filtroVenta = { _id: new ObjectId(req.body.id) };
  const basedeDatos = getDB();
  basedeDatos.collection("Ventas").deleteOne(filtroVenta, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      console.log("Venta eliminada exitosamente.");
      res.sendStatus(200);
    }
  });
});

export default rutasVentas;