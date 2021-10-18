import Express from 'express';
import { MongoClient } from 'mongodb';

const stringConexion = ""

const client = MongoClient(stringConexion, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = Express();

app.use(Express.json());

app.get('/ventas', (req, res) => {
    console.log("alguien hizo get en la ruta /ventas");
    const ventas = [
      { nombre: "Sofa", marca: "Deko", precio: "2000", modelo: "2012" },
      { nombre: "Cama", marca: "Deko", precio: "3500", modelo: "2014" },
      { nombre: "Sofacama", marca: "Deko", precio: "1950", modelo: "2018" },
      { nombre: "Silla Individual", marca: "Isabelina", precio: "850", modelo: "2020" },
      { nombre: "Comedor", marca: "Deko", precio: "1700", modelo: "2019" },
      { nombre: "Sala", marca: "Kingdom", precio: "4500", modelo: "2016" },
    ];
    res.send(ventas);
});

app.post("/ventas/nueva", (req, res) => {
    console.log("Vehículo a crear: ", req.body);
    res.send("Venta creada exitósamente");
});

app.listen(5000, () => {
    console.log("Escuchando puerto 5000");
});