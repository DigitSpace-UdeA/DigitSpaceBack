import Express from "express";
import { getDB } from "../../db/db.js";
import { MongoClient, ObjectId } from "mongodb";
import { consultarVentaIndiv, crearVentas, editarVentas, eliminarVentas, queryAllSales } from "../../Controllers/Ventas/Controller.js";

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

rutasVentas.route("/ventas/:id").get((req, res) => {
  console.log("Se consulta una única venta por su respectivo id.");
  consultarVentaIndiv(req.params.id, genericCallback(res));
});

rutasVentas.route("/ventas/:id").patch((req, res) => {
    editarVentas(req.params.id, req.body, genericCallback(res));
});

rutasVentas.route("/ventas/:id").delete((req, res) => {
  eliminarVentas(req.params.id, genericCallback(res));
});

export default rutasVentas;