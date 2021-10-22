import Express from "express";
import { crearVentas, queryAllSales } from "../../Controllers/Ventas/Controller.js";

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

export default rutasVentas;