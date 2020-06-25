import "babel-polyfill";
const Mutation={
    addUser:async(parent,args,ctx,info)=>{
        const{nombre,contrasena} = args;//nom,con
        //const nombre = args.nombre;
        //const contrasena = args.contrasena;
        const {client} = ctx;

        const db = client.db("Practica");
        const collection = db.collection("users");

        if(await collection.findOne({nombre})){
            throw new Error(`El usuario ya existe`);
        }

        const result = await collection.insertOne({nombre,contrasena});
        // const result = await collection.insertOne(nombre={nom},contrasena={con})

        return{
            nombre,
            contrasena,
            id: result.ops[0]._id
        };
        //tambien valdria return result.ops[0];ESTA ES LA MAS ADECUADA

    },
    addFactura:async(parent,args,ctx,info) =>{
        const{concepto,cantidad,titular,token,nombre} = args;
        const {client} = ctx;
        const db = client.db("Practica");
        const collection = db.collection("facturas");

        var date = new Date();
        var dia = String(date.getDate()).padStart(2,'0');
        var mes = String(date.getDate() + 1).padStart(2,'0');
        var ano = date.getFullYear();
        date = `${dia}/${mes}/${ano}`;
        const fecha = date;
        
        const collection2 = db.collection("users");

        if(!await collection2.findOne({nombre,token})){
            throw new Error(`Este usuario no esta logueado para hacer esto`);
        }

        await collection.insertOne({fecha,concepto,cantidad,titular});
        const result = await collection.findOne({concepto});
        console.log(result.concepto);
        return result;
    },
    removeUser:async(parent,args,ctx,info) =>{
        const {nombre,token} = args;
        const{client} = ctx;
        const db = client.db("Practica");
        const collection = db.collection("users");
        const collection2 = db.collection("facturas");
        
        if(!await collection.findOne({nombre,token})){
            throw new Error(`El usuario no esta logueado para realizar esta accion o no existe`);
        }

        const result = await collection.findOneAndDelete({nombre,token});

        await collection2.deleteMany({titular:nombre});

        return result.value;

    }
}
export {Mutation as default}; 