import "babel-polyfill";
import * as uuid from 'uuid';
const Query = {
    test:async(parent,args,ctx,info) => {
        return "hola";
    },
    login:async(parent,args,ctx,info)=>{
        const{nombre,contrasena} = args;
        const {client} = ctx;

        const db = client.db("Practica");
        const collection = db.collection("users");

        if(!await collection.findOne({nombre,contrasena})){
            throw new Error(`El usuario no existe o no es esa contrasena`);
        }
        await collection.updateOne({nombre},{$set:{"token":uuid.v4()}});
        const result = await collection.findOne({nombre});
        return result;
    },
    logout:async(parent,args,ctx,info)=>{
        const{nombre,contrasena,token} = args;
        const {client} = ctx;

        const db = client.db("Practica");
        const collection = db.collection("users");

        if(!await collection.findOne({nombre,contrasena})){
            throw new Error(`EL usuario no existe o no es esa la contrasena`);
        }
        if(await collection.findOne({nombre,contrasena})){
            if(token === null){
                throw new Error(`El usuario no esta logueado`);
            }
            await collection.updateOne({nombre},{$set:{"token":null}});
            const result = await collection.findOne({nombre});
            return result;
        }
    },
    getFacturas:async(parent,args,ctx,info) =>{
        const{nombre,token} = args;
        const {client} = ctx;
        const db = client.db("Practica");
        const collection = db.collection("users");
        const collection2 = db.collection("facturas");

        if(!await collection.findOne({nombre,token})){
            throw new Error(`EL usuario no existe o no esta logueado para hacer esto`);
        }
        return await collection2.find({titular:nombre}).toArray();
       
    },
}
export {Query as default};