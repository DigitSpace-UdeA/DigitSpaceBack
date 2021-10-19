import { getDB } from "../../db/db.js";

const queryAllSales = async (callback) => {
  const basedeDatos = getDB();
  await basedeDatos.collection("Ventas").find({}).limit(50).toArray(callback);
};

const crearVehiculo = async (datosVenta, callback) => {
    if (
        Object.keys(datosVenta).includes("name") &&
        Object.keys(datosVenta).includes("brand") &&
        Object.keys(datosVenta).includes("price")
    ) {
        const basedeDatos = getDB();
        basedeDatos.collection("Ventas").insertOne(datosVenta, callback);
    } else {
        return "error";
    }
};

/*rutasVentas.route("/ventas/editar").patch((req, res) => {
  const edicion = req.body;
  console.log(edicion);
  const filtroVenta = { _id: new ObjectId(edicion.id) };
  delete edicion.id;
  const operacion = {
    $set: edicion,
  };
  const basedeDatos = getDB();
  basedeDatos
    .collection("Ventas")
    .findOneAndUpdate(
      filtroVenta,
      operacion,
      { upsert: true, returnOriginal: true },
      (err, result) => {
        if (err) {
          console.error("Error actualizando la venta: ", err);
          res.sendStatus(500);
        } else {
          console.log("Actualización exitosa.");
          res.sendStatus(200);
        }
      }
    );
});

rutasVentas.route("/ventas/eliminar").delete((req, res) => {
  const filtroVenta = { _id: new ObjectId(req.body.id) };
  const basedeDatos = getDB();
  basedeDatos.collection("Ventas").deleteOne(filtroVenta, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      console.log("Venta eliminada exitosamente.");
      res.sendStatus(200);
    }
  });
});

*/
export { queryAllSales, crearVehiculo };