import Express from "express";
import { getDB } from "../../db/db.js";
import { MongoClient, ObjectId } from "mongodb";
import { crearProductos, editarProductos, eliminarProductos, queryAllProducts } from "../../Controllers/Productos/Controller.js";


const rutasProductos = Express.Router();

const genericCallback = (res) => (err, result) => {
  if (err) {
    res.status(500).send("Error consultando las ventas.");
  } else {
    res.json(result);
  }
};

rutasProductos.route("/productos").get((req, res) => {
  console.log("Se consulta la base de datos que está en la ruta /productos");
  queryAllProducts(genericCallback(res));
});

rutasProductos.route("/productos/nuevo").post((req, res) => {
  crearProductos(req.body, genericCallback(res));
});

rutasProductos.route("/productos/editar").patch((req, res) => {
  editarProductos(req.body, genericCallback(res));
});

rutasProductos.route("/productos/eliminar").delete((req, res) => {
  eliminarProductos(req, genericCallback(res));
});

export default rutasProductos;