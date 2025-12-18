import {IResolvers} from "@graphql-tools/utils";
import {
    catchPokemon,
    encontrarEntrenadorPorId,
    liberarPokemon,
    registrarEntrenador,
    validateTrainer
} from "../collections/trainers";
import {signToken} from "../auth";
import {Pokemon} from "../types/Pokemon";
import {getOwnedPokemons, getPokemons, introducirNuevoPokemon, obtenerPokemonPorId} from "../collections/pokemons";
import {OwnedPokemon} from "../types/OwnedPokemon";
import {Trainer} from "../types/Trainer";

const checkContext = (contexto: any, razon: string) =>
{
    if (!contexto.user)
    {
        throw new Error("Error, tienes que estar logueado para: " + razon);
    }
};


export const resolvers: IResolvers =
    {
        Query: {
            me: async (_, __, contexto) =>
            {
                checkContext(contexto, "Para hacer me");
                return await encontrarEntrenadorPorId(contexto.user._id);
            },
            pokemons:async (_,{page, size},___)=>
            {
                return await getPokemons(page,size);
            },
            pokemon:async (_, {id},__) =>
            {
                return obtenerPokemonPorId(id);
            },
        },

        // Trainer:
        //     {
        //         pokemons:async(parent,__,___)=>
        //         {
        //             return await getOwnedPokemons(parent.pokemons);
        //         },
        //     },

        OwnedPokemon:
            {
              pokemon:async(parent,__,___) =>
              {
                  return await obtenerPokemonPorId(parent.pokemon)
              }
            },



        Mutation: {
            startJourney: async (_, {name, password}) =>
            {
                const idUsuarioCreado = await registrarEntrenador(name, password);
                return signToken(idUsuarioCreado);
            },
            login: async (_, {name, password}) =>
            {
                const usuario = await validateTrainer(name, password);
                if (!usuario)
                {
                    throw new Error('Usuario no encontrado o contraseña incorrecta');
                }

                return signToken(usuario._id.toString());
            },
            createPokemon: async (_, {name, description, height, weight, types}, contexto): Promise<Pokemon> =>
            {
                checkContext(contexto, "crear un pokemon");
                return await introducirNuevoPokemon(name, description, height, weight, types);
            },
            catchPokemon: async(_, {pokemonId, nickname},contexto):Promise<OwnedPokemon> =>
            {
                checkContext(contexto, "capturar un pokemon.");
                return await catchPokemon(pokemonId,nickname,contexto.user._id.toString());
            },
            freePokemon:async(_, {ownedPokemonId},contexto) =>
            {
                checkContext(contexto,"Liberar un pokemon.");
                return await liberarPokemon(ownedPokemonId, contexto.user._id.toString(), contexto.user.pokemons);
            }
        }
    };