//Hacer el import de express
//const express = require('express');

import Express  from "express";
import { MongoClient } from "mongodb";
import Cors from "cors"



const stringConexion =
'mongodb+srv://KaterinB:DigitKaterin@proyectodigitspace.hfib8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const client = new MongoClient(stringConexion, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let baseDeDatos;

const app = Express()
app.use = Express.json();
app.use(Cors());



//creación de rutas
app.get("/moduloUsuarios2", (req, res)=>{
    console.log("alguien hizo get en ruta modulous");
   baseDeDatos
   .collection("Listado Usuarios")
   .find({}) //filtros que uno quiera, se tiene que poner sí o sí
   .limit(50) //limites, opcional
   .toArray((err, result)=>{
    if(err){
        res.status(500).send("error en get");
    }
    else{
        res.json(result);
    }
   })
} );


//app.post("/editarUsuaio2", (req, res) =>{
   // console.log('solocitud post', req.body);
   //rest.send(' post' creado);
//})




// escucha solicitudes en un puerto especifico


const main = () => {
    client.connect((err,db)=>{
        if(err){
            console.error("error conectar base de datos")
            return'error';
        }
        baseDeDatos = db.db('Usuarios');
        console.log('conexión exitosa');
        return app.listen(5000, () =>{
            console.log('escuchando puerto');
        });
    });
};

main();