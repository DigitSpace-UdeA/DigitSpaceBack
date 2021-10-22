import Express from "express";
import { queryAllUsers } from "../../Controllers/Usuarios/Controller.js";

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

export default rutasUsuarios;