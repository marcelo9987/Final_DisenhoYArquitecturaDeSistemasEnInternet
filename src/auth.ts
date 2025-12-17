import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {USER_COLLECTION} from "./utils";
import {ObjectId} from "mongodb";
import {getDB} from "./db/db";

dotenv.config();

const SECRETO = process.env.SECRETO

export const signToken = (userID: string): string =>
{
    if (!SECRETO) {
        throw new Error('Secreto de JWT no definido en las variables de entorno');
    }
    return jwt.sign({userID},SECRETO, {expiresIn:"1h"});
};

export const verifyToken = (token: string) =>
{
    try
    {
        if (!SECRETO)
        {
            throw new Error('Secreto de JWT no definido en las variables de entorno');
        }
        return jwt.verify(token, SECRETO) as {userID: string};
    }
    catch (err)
    {
        return null;
    }
}

export const getUserFromToken =  async (token: string) =>
{
    const payload = verifyToken(token);
    if (!payload)
    {
        return null;
    }
    const db = getDB();
    return await db.collection(USER_COLLECTION).findOne({_id: new ObjectId(payload.userID)});
};

