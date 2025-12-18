import {ObjectId} from "mongodb";

export type Trainer =
    {
        id ?: ObjectId,
        name:string,
        pokemons: Array<string>
    }