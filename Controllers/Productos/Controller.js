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

export { queryAllProducts, crearProductos };