import { getDB } from "../../db/db.js";
import { ObjectId } from "mongodb";

const queryAllUsers = async (callback) => {
  const basedeDatos = getDB();
  await basedeDatos.collection("Usuarios").find({}).limit(50).toArray(callback);
};

const editarUsuarios = async (id, edicion, callback) => {
    const filtroUsuarios = { _id: new ObjectId(edicion.id) };
    const operacion = {
        $set: edicion,
    };
    const basedeDatos = getDB();
    await basedeDatos
      .collection("Usuarios")
      .findOneAndUpdate(
        filtroUsuarios,
        operacion,
        { upsert: true, returnOriginal: true },
        callback
      );
};

const eliminarUsuarios = async (req, callback) => {
  const filtroUsuarios = { _id: new ObjectId(req.id) };
  const basedeDatos = getDB();
  await basedeDatos.collection("Usuarios").deleteOne(filtroUsuarios, callback);
};

export { queryAllUsers, editarUsuarios, eliminarUsuarios };