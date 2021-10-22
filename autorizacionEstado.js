import { getDB } from "./server";
const autorizacionEstado = (req, res, next) =>{
    //1
    const token = req.headers.authorization.split('Bearer')[1];
    const user = jwt_decode(token)['http://localhost/userData'];
    console.log(user);
    // verificar si el usuario esta en db o no
    //const baseDeDatos = getDB();
    await baseDeDatos.collection('Usuarios').findOne({email: user.email}, async (err, response) =>{
    // si el usuario ya esta en db devulve la info de usuario
        console.log("response con datos del usuario", response)

        if(response){
            callBack(err, response)
        }
    });
    
    console.log('autorixacion')
    next();

}
export default autorizacionEstado;  