import Express from "express";
import { getDB } from "../../db/db.js";
import { MongoClient, ObjectId } from "mongodb";
import { crearVentas, editarVentas, eliminarVentas, queryAllSales } from "../../Controllers/Ventas/Controller.js";

const rutasVentas = Express.Router();

const genericCallback = (res) => (err, result) => {
  if (err) {
    res.status(500).send("Error consultando las ventas.");
  } else {
    res.json(result);
  }
};

rutasVentas.route("/ventas").get((req, res) => {
  console.log("Se consulta la base de datos que está en la ruta /ventas");
  queryAllSales(genericCallback(res));
});

rutasVentas.route("/ventas/nueva").post((req, res) => {
    crearVentas(req.body, genericCallback(res));
});

rutasVentas.route("/ventas/editar").patch((req, res) => {
    editarVentas(req.body, genericCallback(res));
});

rutasVentas.route("/ventas/eliminar").delete((req, res) => {
  eliminarVentas(req.body.id, genericCallback(res));
});

export default rutasVentas;