import Express from 'express';
import Cors from "cors";
import dotenv from 'dotenv';
import { conectarBD, getDB } from './db/db.js';
import rutasVentas from './Views/Ventas/Rutas.js';
import rutasProductos from './Views/Productos/Rutas.js';
import rutasUsuarios from "./Views/Usuarios/Rutas.js";
import { ObjectId } from "mongodb";

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

// Importar las rutas de POST y GET para Ventas, Productos y Usuarios.
app.use(rutasVentas);
app.use(rutasProductos);
app.use(rutasUsuarios);


// Métodos de PATCH y DELETE para Ventas, Productos y Usuarios.

app.patch("/productos/editar", (req, res) => {
  //
  const edicion = req.body;
  const baseDeDatos = getDB(); // se toma el contenido en el body del req, que es basicamente donde se colocan los parametros a buscar
  console.log(edicion);
  const filtroProducto = { _id: new ObjectId(edicion.id) }; // filtramos el producto segun el Id
  delete edicion.id; // por mandar los ids por el body, tienen que borrarlos o el sistema se los va a meter a la base de datos
  const operacion = {
    $set: edicion,
    };
  baseDeDatos
    .collection("producto")
    .findOneAndUpdate(
      filtroProducto,
      operacion,
      { upsert: true, returnOriginal: true },
      (err, result) => {
        // el upsert sirve para crear una nueva funcion
        if (err) {
          console.error('error actualizando el producto" ', err);
          res.sendStatus(500);
        } else {
          console.log("actualizado con exito");
          res.sendStatus(200);
        }
      }
    );
});

app.delete("/productos/eliminar", (req, res) => {
  const filtroProducto = { _id: new ObjectId(req.body.id) };
  const baseDeDatos = getDB();
  baseDeDatos
    .collection("producto")
    .deleteOne(filtroProducto, (err, result) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
});

app.patch('/moduloUsuarios/editar/',(req,res)=>{ // 
    const edicion = req.body; // se toma el contenido en el body del req, que es basicamente donde se colocan los parametros a buscar
    const baseDeDatos = getDB();
    console.log(edicion);
    const filtroListadoUsuario = {_id: new ObjectId(edicion.id)} // filtramos el producto segun el Id
    delete edicion.id // por mandar los ids por el body, tienen que borrarlos o el sistema se los va a meter a la base de datos
    const operacion = {
        $set:edicion,
    }
    baseDeDatos.collection('Usuarios').findOneAndUpdate(filtroListadoUsuario,operacion,{upsert:true, returnOriginal:true},(err,result)=>{  // el upsert sirve para crear una nueva funcion
        if(err){
            console.error('error actualizando el producto" ', err)
            res.sendStatus(500)
        }else{
            console.log("actualizado con exito")
            res.sendStatus(200)
        }
    }) 
})

app.delete('/moduloUsuarios/eliminar/', (req,res)=>{
    const baseDeDatos = getDB();
    const filtroListadoUsuario = { _id: new ObjectId(req.body.id) }
    baseDeDatos.collection('Usuarios').deleteOne(filtroListadoUsuario,(err,result)=>{
        if(err){
            console.error(err);
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
})

const main = () => {    
    app.listen(process.env.PORT, () => {
        console.log(`Escuchando puerto ${process.env.PORT}`);
    });
};

conectarBD(main);