// para hacer el import de express tradicional
//const express = require('express');

import Express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import Cors from 'cors'

// string de conexion, la contraseña será retirada de aqui en un proceso subsequente para que no vaya al git
const stringConexion = '';
// mongodb+srv://<SuUruario>:<SuContrasena>@proyectodigitspace.hfib8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority


const client = new MongoClient(stringConexion,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});



const app = Express();
app.use(Express.json());
app.use(Cors())


// se hace una ruta para GET o READ, y la ruta que se es /productos
app.get('/productos', (req,res)=>{ // notese que aquí es donde se define la ruta que se utiliza en el insomnia, escuchando puerto 5000
    console.log("alguien hizo get en la ruta /productos")
    //en teoria, esto está llegando de una base de datos y aqui iria la consulta a la BD
    //const productos = [
    //    {name:'Silla mecedora', brand: 'Ikea', valorunit:'600000'},
    //    {name:'Espejo esquinero', brand: 'Mikasa', valorunit:'350000'},
    //];
    baseDeDatos.collection("producto").find({}).limit(50).toArray((err,result)=>{
        if(err){
            res.status(500).send('Error consultando los productos'); // cuidado, aqui es res, el que le manda la información al front, no result
        }else{
            res.json(result);
        }
    }); //esto convierte el valor de la base de datos en formato tipo JSON
    
});


// se hace una ruta para POST o CREATE, y la ruta que se es /vehiculos/nuevo
app.post("/productos/nuevo",(req,res)=>{ // notese que aquí es donde se define la ruta que se utiliza en el insomnia, escuchando puerto 5000
    
    const datosProducto = req.body;
    console.log('llaves: ', Object.keys(datosProducto));
    try{
        if(Object.keys(datosProducto).includes("name") &&
        Object.keys(datosProducto).includes("brand") &&
        Object.keys(datosProducto).includes("valorunit")){
            // aqui adentro debe implementar codigo para crear vehiculo en la base de datos
            baseDeDatos.collection('producto').insertOne(datosProducto,(err,result)=>{
                if(err){
                    console.error(err)
                    res.sendStatus(500);
                } else {
                    console.log(result);
                    res.sendStatus(200)
                }
            });
            res.sendStatus(200)
            

        } else {
            res.sendStatus(500)
        }
    } catch {
        res.sendStatus(500)
        
    }
});

app.patch('/productos/editar',(req,res)=>{ // 
    const edicion = req.body; // se toma el contenido en el body del req, que es basicamente donde se colocan los parametros a buscar
    console.log(edicion);
    const filtroProducto = {_id: new ObjectId(edicion.id)} // filtramos el producto segun el Id
    delete edicion.id // por mandar los ids por el body, tienen que borrarlos o el sistema se los va a meter a la base de datos
    const operacion = {
        $set:edicion,
    }
    baseDeDatos.collection('producto').findOneAndUpdate(filtroProducto,operacion,{upsert:true, returnOriginal:true},(err,result)=>{  // el upsert sirve para crear una nueva funcion
        if(err){
            console.error('error actualizando el producto" ', err)
            res.sendStatus(500)
        }else{
            console.log("actualizado con exito")
            res.sendStatus(200)
        }
    }) 
})

app.delete('/productos/eliminar', (req,res)=>{
    const filtroProducto = {_id: new ObjectId(req.body.id)}
    baseDeDatos.collection('producto').deleteOne(filtroProducto,(err,result)=>{
        if(err){
            console.error(err);
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
})

let baseDeDatos;

const main = ()=>{

    client.connect((err,db)=>{
        if(err){
            console.error('Error conectando la base de datos')
            return 'error';
        }
        baseDeDatos = db.db('mobiliaria') // esta base de datos aun no existe y portanto se crea
        console.log('baseDeDatos exitosa')
        return app.listen(5000,()=>{
        console.log('escuchando puerto 5000')
    });
});
};

main();
