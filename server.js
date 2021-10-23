import Express from 'express';
import Cors from "cors";
import dotenv from 'dotenv';
import { conectarBD, getDB } from './db/db.js';
import rutasVentas from './Views/Ventas/Rutas.js';
import rutasProductos from './Views/Productos/Rutas.js';
import rutasUsuarios from "./Views/Usuarios/Rutas.js";
import { ObjectId } from "mongodb";


import jwt_decode from 'jwt-decode';



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
// -------------------Autorizacion estado carptea-------------
const autorizacionEstado = async (req, res, next) =>{
    //1
    const token = req.headers.authorization.split('Bearer')[1];
    const user = jwt_decode(token)['http://localhost/userData'];
    console.log(user);
    // verificar si el usuario esta en db o no
    const baseDeDatos = getDB();
    await baseDeDatos.collection('Usuarios').findOne({email: user.email}, async (err, response) =>{
    // si el usuario ya esta en db devulve la info de usuario
        if(response){
            console.log(response);
            if(response.estado==='No Autorizado'|| response.estado=== 'Pendiente' ){
               res.sendStatus(401);
               res.end();
            }else{
                console.log('habilitado')
                next();
            }
            }else{
                next();
            }
        }
    );
    console.log('autorixacion')
    
    //""
} 
//--------------Oauth-----------------------

// Importar las rutas de POST y GET para Ventas, Productos y Usuarios.

app.use(autorizacionEstado);
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

app.patch("/ventas/editar", (req, res) => {
  //
  const edicion = req.body; // se toma el contenido en el body del req, que es basicamente donde se colocan los parametros a buscar
  const baseDeDatos = getDB();
  console.log(edicion);
  const filtroVenta = { _id: new ObjectId(edicion.id) }; // filtramos el producto segun el Id
  delete edicion.id; // por mandar los ids por el body, tienen que borrarlos o el sistema se los va a meter a la base de datos
  const operacion = {
    $set: edicion,
  };
  baseDeDatos
    .collection("Ventas")
    .findOneAndUpdate(
      filtroVenta,
      operacion,
      { upsert: true, returnOriginal: true },
      (err, result) => {
        // el upsert sirve para crear una nueva funcion
        if (err) {
          console.error('Error actualizando la venta." ', err);
          res.sendStatus(500);
        } else {
          console.log("Venta actualizada con éxito.");
          res.sendStatus(200);
        }
      }
    );
});

app.delete("/ventas/eliminar", (req, res) => {
  const baseDeDatos = getDB();
  const filtroVenta = { _id: new ObjectId(req.body.id) };
  baseDeDatos.collection("Ventas").deleteOne(filtroVenta, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});
//----- CREAR USUARIO MÉTODO POST -----------------

const queryAllUsers = async (callback) => {
    const baseDeDatos = getDB();
    console.log('query');
    await baseDeDatos.collection('usuario').find({}).limit(50).toArray(callback);
  };


const crearUsuario = async (datosUsuario, callback) => {
    const baseDeDatos = getDB();
    await baseDeDatos.collection('Usuarios').insertOne(datosUsuario, callback);
  };

//----- CREAR USUARIO MÉTODO POST -----------------

//-----------------usuarios get rutas-----------------------

const genericCallback = (res) => (err, result) => {
    if (err) {
      res.status(500).send("Error consultando las ventas.");
    } else {
      res.json(result);
    }
  };


app.get('/moduloUsuarios/self', (req,res)=>{ // notese que aquí es donde se define la ruta que se utiliza en el insomnia, escuchando puerto 5000
    console.log("alguien hizo get en la ruta /moduloUsuarios/self")
    //en teoria, esto está llegando de una base de datos y aqui iria la consulta a la BD
    consultarOCrearUsuario(req, genericCallback(res));
});

//-----------------usuarios get rutas -----------------------
// export const getDB = () => {
//     return baseDeDatos;
// };

//-----------------usuarios get controller -----------------------

const consultarOCrearUsuario = async (req, callBack) =>{
    // obtener datos de usuario
    const token = req.headers.authorization.split('Bearer')[1];
    const user = jwt_decode(token)['http://localhost/userData'];
    console.log(user);
    // verificar si el usuario esta en db o no
    const baseDeDatos = getDB();
    await baseDeDatos.collection('Usuarios').findOne({email: user.email}, async (err, response) =>{
    // si el usuario ya esta en db devulve la info de usuario
        console.log("response con datos del usuario", response)

        if(response){
            callBack(err, response)
            
        } else{
            user.auth0ID = user._id;
            delete user._id;
            user.rol = 'Sin rol';
            user.estado= 'Pendiente';
            // user.name = usuario;
            await crearUsuario(user,(err, respuesta)=> callBack(err, user ));
            
        }
    });
    // si el usuario no esta en el db, lo crea y devuelve la info

};

//-----------------usuarios get controller -----------------------











const main = () => {    
    app.listen(process.env.PORT, () => {
        console.log(`Escuchando puerto ${process.env.PORT}`);
    });
};

conectarBD(main);