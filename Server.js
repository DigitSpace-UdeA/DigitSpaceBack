import Express from 'express';
import Cors from "cors";
import dotenv from 'dotenv';
import { conectarBD, getDB } from './db/db.js';
import rutasVentas from './Views/Ventas/Rutas.js';

dotenv.config({ path: './.env' });

const app = Express();

app.use(Express.json());
app.use(Cors());

// Importar las rutas del CRUD de Ventas
app.use(rutasVentas);

const main = () => {    
    app.listen(process.env.PORT, () => {
        console.log(`Escuchando puerto ${process.env.PORT}`);
    });
};

conectarBD(main);