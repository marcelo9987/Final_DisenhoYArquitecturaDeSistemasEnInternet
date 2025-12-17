import {Db, MongoClient} from "mongodb";
import {dbName} from "../utils";


let client: MongoClient;
let db: Db;

export const connectToMongo = async () =>
{
    try
    {
        const mongoURL = process.env.MONGO_URL;
        if(!mongoURL)
        {
            throw new Error("Falta la url de mongo.");
        }
        client = new MongoClient(mongoURL);
        await client.connect();
        db = client.db(dbName);
        console.log("Conectado a la base de datos de MongoDB");

    }
    catch (err)
    {
        console.log("Error al conectarse a la base de datos:", err);
    }
};

export const getDB = () : Db => db;
