import Express from "express";
import { getDB } from "../../db/db.js";
import { MongoClient, ObjectId } from "mongodb";
import { crearVehiculo, queryAllSales } from "../../Controllers/Ventas/Controller.js";

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
    crearVehiculo(req.body, genericCallback(res));
});

export default rutasVentas;