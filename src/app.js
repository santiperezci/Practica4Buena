import {MongoClient, ObjectID} from "mongodb";
import {GraphQLServer} from "graphql-yoga";
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import * as uuid from 'uuid';
//falta la mutacion añadir facturas
import "babel-polyfill";

//logueado != registrado
//La api como sabe que yo ya estoy logueado¿?
//En el resolver que hago?

const usr = "avalero";
const pwd = "123456abc";
const url = "cluster0-vbkmi.gcp.mongodb.net/test?retryWrites=true&w=majority";
const connectToDb = async function(usr, pwd, url) {
    const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  
    await client.connect();
    return client;
};
//SOlo puedo hacer cosas sobre mis facturas
//al añadir factura meter usuario y token.
const runGraphQLServer = function(context){
    const resolvers = {
        Facturas:{
            titular:async(parent,args,ctx,info) =>{
                const titularnombre = parent.titular;
                const {client} = ctx;
                const db = client.db("Practica");
                const collection = db.collection("users");

                return(await collection.findOne({nombre: titularnombre}));
            }
        },
        Query,//seria Query:Query COMO YA LO TENEMOS DEFINIDO, SE LLAMA SIMPLEMENTE PONIENDO EL NOMBRE
        Mutation,
        
    }//ahora a typedefs le pasamos la ruta de donde están
    const server = new GraphQLServer({ typeDefs: './src/schema.graphql', resolvers, context });
  const options = {
    port: 8000
  };
  //En el otro vamos a meter los resolvers de la factura

  try {
    server.start(options, ({ port }) =>
      console.log(
        `Server started, listening on port ${port} for incoming requests.`
      )
    );
  } catch (e) {
    console.info(e);
    server.close();
  }
};

const runApp = async function() {
  const client = await connectToDb(usr, pwd, url);
  console.log("Connect to Mongo DB");
  try {
    runGraphQLServer({ client });
    //En la otra le paso db: definicion... y esa mierda
  } catch (e) {
      console.log(e)
    client.close();
  }
};

runApp();





//PARA GENERAR EL TOKEN HACERLO CON UUID.V4();
//YO tengo la api y aqui tengo la base de datos y aqui está el fron que es lo de graphql
//EL proecso es lelgo y me registro, entonces para registrarme lo que le digo es
//mi usuario es taltalta y mi contraseña taltaltal
//Entonces compreuba la api si avalaero  ya esta cogido y si no lo esta
//la api guarda avalero y la contraseña, entonces la api te contesta
//que ya esta registrado.
//Luego entras y le dices que quieres login y le metes avalero 1234. Te dice si existe
//Entonecs se genera un token para qeu el se autentique. ES un numero aleatorio
//y lo guardo en la base de datos junto a a valero. ENtonces el usuario ya tiene la sesion iniciada
//CUando el usuario pida las facturas, dira quiero las facturas y soy avalero y mi token es taltaltaltal
//ENtonces por lo tanto le devuelvo las facturas
//Cuando te deslogueas, entonecs se borra el token, y  haria falta volver a loguearse
//NO SOLO UNA PERSONA PUEDE ESTAR CONECTADA A LA VEZ, LOGUEADOS PUEDE HABER INFINITOS