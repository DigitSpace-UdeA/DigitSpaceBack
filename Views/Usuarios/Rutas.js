import Express from "express";
import { getDB } from "../../db/db.js";
import { MongoClient, ObjectId } from "mongodb";
import { editarUsuarios, eliminarUsuarios, queryAllUsers } from "../../Controllers/Usuarios/Controller.js";

const rutasUsuarios = Express.Router();

const genericCallback = (res) => (err, result) => {
  if (err) {
    res.status(500).send("Error consultando las ventas.");
  } else {
    res.json(result);
  }
};

rutasUsuarios.route("/moduloUsuarios").get((req, res) => {
  console.log("Se consulta la base de datos que está en la ruta /Usuarios");
  queryAllUsers(genericCallback(res));
});

rutasUsuarios.route("/moduloUsuarios/editar").patch((req, res) => {
  editarUsuarios(req.body, genericCallback(res));
});

rutasUsuarios.route("/moduloUsuarios/eliminar").delete((req, res) => {
  eliminarUsuarios(req, genericCallback(res));
});

export default rutasUsuarios;