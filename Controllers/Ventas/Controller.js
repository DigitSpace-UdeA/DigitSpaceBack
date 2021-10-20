import { getDB } from "../../db/db.js";
import { MongoClient, ObjectId } from "mongodb";

const queryAllSales = async (callback) => {
  const basedeDatos = getDB();
  await basedeDatos.collection("Ventas").find({}).limit(50).toArray(callback);
};

const crearVentas = async (datosVenta, callback) => {
    const basedeDatos = getDB();
    await basedeDatos.collection("Ventas").insertOne(datosVenta, callback);
};

const consultarVentaIndiv = async (id, callback) => {
  const basedeDatos = getDB();
  await basedeDatos.collection("Ventas").findOne({ _id: new ObjectId(id) }, callback);
};

const editarVentas = async (id, edicion, callback) => {
    const filtroVenta = { _id: new ObjectId(id) };
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


export { queryAllSales, crearVentas, editarVentas, eliminarVentas, consultarVentaIndiv };