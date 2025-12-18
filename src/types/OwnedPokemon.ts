import {ObjectId} from "mongodb";

export type OwnedPokemon = {
    _id?: ObjectId
    // #En base datos se guardará solo el id, encadenado pokemon.
    pokemon: string
    nickname: String
    attack: number
    defense: number
    speed: number
    special: number
    level: number
}