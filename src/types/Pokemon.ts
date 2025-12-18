import {ObjectId} from "mongodb";
import {PokemonType} from "./PokemonType";

export type Pokemon = {
    _id?: ObjectId
    name: string
    description: string
    height: number
    weight: number
    types: Array<PokemonType>
}