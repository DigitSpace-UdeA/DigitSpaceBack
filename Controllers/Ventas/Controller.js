import { getDB } from "../../db/db.js";
import { MongoClient, ObjectId } from "mongodb";

const queryAllSales = async (callback) => {
  const basedeDatos = getDB();
  await basedeDatos.collection("Ventas").find({}).limit(50).toArray(callback);
};

const crearVentas = async (datosVenta, callback) => {
    if (
        Object.keys(datosVenta).includes("name") &&
        Object.keys(datosVenta).includes("brand") &&
        Object.keys(datosVenta).includes("price")
    ) {
        const basedeDatos = getDB();
        await basedeDatos.collection("Ventas").insertOne(datosVenta, callback);
    } else {
        return "error";
    }
};

const editarVentas = async (edicion, callback) => {
    const filtroVenta = { _id: new ObjectId(edicion.id) };
    delete edicion.id;
    const operacion = {
        $set: edicion,
    };
    const basedeDatos = getDB();
    await basedeDatos
        .collection("Ventas")
        .findOneAndUpdate(
            filtroVenta,
            operacion,
            { upsert: true, returnOriginal: true }, callback);
};

const eliminarVentas = async (id, callback) => {
  const filtroVenta = { _id: new ObjectId(id) };
  const basedeDatos = getDB();
  await basedeDatos
    .collection("Ventas")
    .deleteOne(filtroVenta, callback);
};


export { queryAllSales, crearVentas, editarVentas, eliminarVentas };