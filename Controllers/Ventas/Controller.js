import { getDB } from "../../db/db.js";

const queryAllSales = async (callback) => {
  const basedeDatos = getDB();
  await basedeDatos.collection("Ventas").find({}).limit(50).toArray(callback);
};

const crearVentas = async (datosVenta, callback) => {
    const basedeDatos = getDB();
    await basedeDatos.collection("Ventas").insertOne(datosVenta, callback);
};

export { queryAllSales, crearVentas };