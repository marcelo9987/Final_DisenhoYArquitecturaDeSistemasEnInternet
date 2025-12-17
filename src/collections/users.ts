import {getDB} from "../db/db";
import bcrypt from "bcryptjs";
import {USER_COLLECTION} from "../utils";

export const createUser = async (email: string, password: string) =>
{
    const db = getDB();

    const contrasenhaEncriptada = await bcrypt.hash(password, 10);

    const resultadoRegistro = await db.collection(USER_COLLECTION).insertOne({
        email: email,
        password: contrasenhaEncriptada,
    });

    return resultadoRegistro.insertedId.toString();

}


export const validateUser = async (email: string, password: string) =>
{
    const db = getDB();

    const usuario = await db.collection(USER_COLLECTION).findOne({email});
    if (!usuario)
    {
        return null;
    }

    const contrasenhaValida = await bcrypt.compare(password, usuario.password);
    if (!contrasenhaValida)
    {
        return null;
    }

    return usuario;

}
