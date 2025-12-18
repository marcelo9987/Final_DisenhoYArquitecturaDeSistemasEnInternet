import {Pokemon} from "../types/Pokemon";
import {getDB} from "../db/db";
import {Db, ObjectId} from "mongodb";
import {OWNED_POKEMON_COLLECTION, POKEMON_COLLECTION, TRAINER_COLLECTION} from "../utils";
import {PokemonType} from "../types/PokemonType";
import {OwnedPokemon} from "../types/OwnedPokemon";


export const introducirNuevoPokemon: (name: string, description: string, height: number, weight: number, types: [string]) => Promise<Pokemon> = async (name: string, description: string, height: number, weight: number, types: [string]): Promise<Pokemon> =>
{
    const db: Db = getDB();
    const pokemonAInsertar: Pokemon = {name: name, description: description, height: height, weight: weight, types: types.map(i => PokemonType[i as keyof typeof PokemonType])};
    const insertOneResult = await db.collection(POKEMON_COLLECTION).insertOne(pokemonAInsertar);

    const resultadoInsercion: Pokemon | null = await db.collection<Pokemon>(POKEMON_COLLECTION)
                                                       .findOne({_id: insertOneResult.insertedId});
    if (!resultadoInsercion)
    {
        throw new Error("Inserción incorrecta");
    }

    return resultadoInsercion;

};

export const obtenerPokemonPorId: (id: string) => Promise<Pokemon | null> = async (id: string): Promise<Pokemon | null> =>
{
    return await getDB().collection<Pokemon>(POKEMON_COLLECTION).findOne({_id: new ObjectId(id)});
};

export const getPokemons: (page: number, size: number) => Promise<Array<Pokemon>> = async (page: number, size: number): Promise<Array<Pokemon>> =>
{
    const db: Db = getDB();
    page = page ? page : 1;
    size = size ? size : 10;

    return await db.collection<Pokemon>(POKEMON_COLLECTION).find().skip((page - 1) * size).limit(size).toArray();
};

export const getOwnedPokemons = async(ids:string[]) =>
{
    const ids_nuevas = ids.map((x) => new ObjectId(x));

    return await getDB().collection<OwnedPokemon>(OWNED_POKEMON_COLLECTION).find({ _id: { $in: ids_nuevas } }).toArray();
}

