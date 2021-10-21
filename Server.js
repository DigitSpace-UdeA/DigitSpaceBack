import Express from 'express';
import Cors from "cors";
import dotenv from 'dotenv';
import { conectarBD, getDB } from './db/db.js';
import rutasVentas from './Views/Ventas/Rutas.js';
import rutasProductos from './Views/Productos/Rutas.js';
import rutasUsuarios from "./Views/Usuarios/Rutas.js";

//-------------Oauth-------------------
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';
//-------------Oauth-------------------

dotenv.config({ path: './.env' });

const app = Express();

app.use(Express.json());
app.use(Cors());

//-------------Oauth-------------------

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute:  5,
        jwksUri: 'https://digit-space.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'api-autenticacion-digitspace',
  issuer: 'https://digit-space.us.auth0.com/',
  algorithms: ['RS256']
});

app.use(jwtCheck);

//--------------Oauth-----------------------

// Importar las rutas del CRUD de Ventas
app.use(rutasVentas);
app.use(rutasProductos);
app.use(rutasUsuarios);


const main = () => {    
    app.listen(process.env.PORT, () => {
        console.log(`Escuchando puerto ${process.env.PORT}`);
    });
};

conectarBD(main);