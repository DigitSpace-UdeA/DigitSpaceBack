import { getDB } from "../../db/db.js";

const queryAllUsers = async (callback) => {
  const basedeDatos = getDB();
  await basedeDatos.collection("Usuarios").find({}).limit(50).toArray(callback);
};

export { queryAllUsers };