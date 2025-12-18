import {getDB} from "../db/db";
import bcrypt from "bcryptjs";
import {OWNED_POKEMON_COLLECTION, POKEMON_COLLECTION, TRAINER_COLLECTION} from "../utils";
import {Db, ObjectId} from "mongodb";
import {Trainer} from "../types/Trainer";
import {OwnedPokemon} from "../types/OwnedPokemon";
import {obtenerPokemonPorId} from "./pokemons";

export const existeEntrenadorPorNombre: (name: string) => Promise<boolean> = async (name: string): Promise<boolean> =>
{
    const db: Db = getDB();
    return (await db.collection(TRAINER_COLLECTION).findOne({name})) !== null;
};


const comprobarNumeroPokemonEntrenador: (trainerID: string) => Promise<number> = async (trainerID: string): Promise<number> =>
{
    const entrenadorObtenido: Trainer | null = await getDB().collection<Trainer>(TRAINER_COLLECTION)
                                                            .findOne({_id: new ObjectId(trainerID)});
    if (!entrenadorObtenido)
    {
        throw new Error("No existe el entrenador que has enviado:" + trainerID);
    }
    return entrenadorObtenido.pokemons.length;
};


export const registrarEntrenador = async (name: string, password: string) =>
{
    if ((await existeEntrenadorPorNombre(name)))
    {
        throw new Error("El entrenador con nombre:" + name + " ya está registrado");
    }

    const db = getDB();

    const contrasenhaEncriptada = await bcrypt.hash(password, 10);

    const resultadoRegistro = await db.collection(TRAINER_COLLECTION).insertOne({
        name: name,
        password: contrasenhaEncriptada,
        pokemons: []
    });

    return resultadoRegistro.insertedId.toString();

};


export const validateTrainer = async (name: string, password: string) =>
{
    const db = getDB();

    const usuario = await db.collection(TRAINER_COLLECTION).findOne({name});
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

};

export const encontrarEntrenadorPorId: (id: string) => Promise<Trainer> = async (id: string): Promise<Trainer> =>
{
    const usuarioBuscado = await getDB().collection<Trainer>(TRAINER_COLLECTION).findOne({_id: new ObjectId(id)});
    if (!usuarioBuscado)
    {
        throw new Error("El usuario buscado no existe en la base de datos");
    }
    return usuarioBuscado;
};


export const catchPokemon: (pokemonId: string, nickname: string, userId: string) => Promise<OwnedPokemon> = async (pokemonId: string, nickname: string, userId: string): Promise<OwnedPokemon> =>
{
    if ((await obtenerPokemonPorId(pokemonId)) === null)
    {
        throw new Error("El pokemon a capturar no existe");
    }

    const attack: number = Math.floor((Math.random() * 100) + 1);
    const defense: number = Math.floor((Math.random() * 100) + 1);
    const speed: number = Math.floor((Math.random() * 100) + 1);
    const special: number = Math.floor((Math.random() * 100) + 1);
    const level: number = Math.floor((Math.random() * 100) + 1);

    if (await comprobarNumeroPokemonEntrenador(userId) >= 6)
    {
        throw new Error("Sólo puedes tener hasta 6 pokemons en tu inventario.");
    }


    const pokemonNuevo: OwnedPokemon = {
        // #En base datos se guardará solo el id, encadenado pokemon.
        pokemon: pokemonId,
        nickname: nickname,
        attack: attack,
        defense: defense,
        speed: speed,
        special: special,
        level: level
    };

    const db: Db = getDB();

    const resultadoSubida = await db.collection(OWNED_POKEMON_COLLECTION).insertOne(pokemonNuevo);

    const pokemonSubido: OwnedPokemon | null = await db.collection<OwnedPokemon>(OWNED_POKEMON_COLLECTION)
                                                       .findOne({_id: resultadoSubida.insertedId});
    if (!pokemonSubido)
    {
        throw new Error("Error al subir el nuevo owned pokemon ");
    }

    await db.collection(TRAINER_COLLECTION)
            .updateOne({_id: new ObjectId(userId)}, {$addToSet: {pokemons: pokemonSubido}});
    return pokemonSubido;

};

export const liberarPokemon = async (id_pokemon: string, trainerId: string, pokemones: string[]) =>
{

    const exists = await obtenerPokemonPorId(id_pokemon);
    if (!exists) throw new Error("Ese pokemon no existe");

    const newPokemons = pokemones.filter((x: string) => {
        id_pokemon!==x;
    });

    await getDB().collection(TRAINER_COLLECTION).updateOne({ _id: new ObjectId(trainerId) }, {
        $set: { pokemons: newPokemons }
    });

    await getDB().collection(POKEMON_COLLECTION).deleteOne({ _id: new ObjectId(id_pokemon) });

    return await getDB().collection<Trainer>(TRAINER_COLLECTION).findOne({ _id: new ObjectId(trainerId) })
};





