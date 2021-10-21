import { getDB } from "../../db/db.js";
import { ObjectId } from "mongodb";

const queryAllProducts = async (callback) => {
  const basedeDatos = getDB();
  await basedeDatos.collection("producto").find({}).limit(50).toArray(callback);
};

const crearProductos = async (datosProducto, callback) => {
    const basedeDatos = getDB();
    await basedeDatos.collection("producto").insertOne(datosProducto, callback);
};

const consultarProductoIndiv = async (id, callback) => {
  const basedeDatos = getDB();
  await basedeDatos
    .collection("producto")
    .findOne({ _id: new ObjectId(id) }, callback);
};

const editarProductos = async (edicion, callback) => {
    const filtroProducto = { _id: new ObjectId(id) };
    const operacion = {
        $set: edicion,
    };
    const basedeDatos = getDB();
    await basedeDatos
      .collection("producto")
      .findOneAndUpdate(
        filtroProducto,
        operacion,
        { upsert: true, returnOriginal: true },
        callback
      );
};

const eliminarProductos = async (id, callback) => {
  const filtroProducto = { _id: new ObjectId(id) };
  const basedeDatos = getDB();
  await basedeDatos.collection("producto").deleteOne(filtroProducto, callback);
};


export { queryAllProducts, crearProductos, editarProductos, eliminarProductos, consultarProductoIndiv };