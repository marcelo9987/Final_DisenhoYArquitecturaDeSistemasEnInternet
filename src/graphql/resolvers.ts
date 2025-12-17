import {IResolvers} from "@graphql-tools/utils";
import {createUser, validateUser} from "../collections/users";
import {signToken} from "../auth";

export const resolvers: IResolvers =
    {
        Query: {
            me:async(_,__,{user}) =>
            {
                if(!user)
                {
                    throw new Error('No autenticado');
                }
                return {
                    _id: user._id.toString(),
                    ...user
                }
            }
        },


        Mutation: {
            register: async (_, {email, password}) =>
            {
                const idUsuarioCreado = await createUser(email, password);
                return signToken(idUsuarioCreado);
            },
            login: async (_, {email, password}) =>
            {
                const usuario = await validateUser(email, password);
                if (!usuario)
                {
                    throw new Error('Usuario no encontrado o contraseña incorrecta');
                }

                return signToken(usuario._id.toString());
            },
        }
    };