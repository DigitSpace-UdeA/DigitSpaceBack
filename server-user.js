
//impottacion express tradicional
/* const express = require('express'); */

import Express from "express";
import Cors from "cors"
import { Collection, MongoClient } from "mongodb";


const stringConexion =
    'mongodb+srv://YesicaV:DigitYesica@proyectodigitspace.hfib8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

/* const client = new MongoClient(stringConexion, {
    useNewUrlParser:true,
    useUnifiedTopogy:true,
}); 
 */
const client = new MongoClient(stringConexion,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

const app = Express();

app.use(Express.json());
app.use(Cors());

//creacion de rutas
//*****************GET***************************** */

app.get('/usuarios', (req, res) => {
    console.log('Get...')
    baseDeDatos.collection('Listado Usuarios').find({}).limit(50).toArray((err, result) => {
        if(err){
            res.status(400).send('error consultando la base de datos');
        } else{
            res.json(result);
        }

    });

    /* const usuarios = [
        {
            usuario: "pepito",
            rol: "vendedor",
            estado: "Autorizado"
        },
        {
            usuario: "maria",
            rol: "Admin",
            estado: "No Autorizado"
        }
    ];
    res.send(usuarios);*/
}); 

//*****************Post***************************** */

app.post('/usuarios/nuevo', (req, res) => {

    console.log('solicitud post', req);
    const datosUsuario = req.body;
    
    try {
        baseDeDatos.collection('Listado de Usuarios').insertOne(datosUsuario,(err,result)=>{
            if(err){
                console.log(err);
                res.sendStatus(500);
            }else{
                console.log(result);
                res.sendStatus(200);                
                res.send("Usuario Creado");
            }
        });

    } catch {
        res.sendStatus(500)
    }
});


//servidor esta escuchandopor el puerto indicado

let baseDeDatos;

const main = () => {

    client.connect((err, db) => {
        if(err){
            console.error('Error conectando la base de datos')
            return 'error';
        }
        baseDeDatos = db.db('Usuarios') // esta base de datos aun no existe y portanto se crea
        console.log('baseDeDatos exitosa')
        return app.listen(5000,()=>{
        console.log('escuchando puerto 5000')
    });
});
};

main();