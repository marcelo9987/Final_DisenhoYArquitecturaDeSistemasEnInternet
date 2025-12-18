import {connectToMongo} from "./db/db";
import {ApolloServer} from "apollo-server";
import {typeDefs} from "./graphql/schema";
import {resolvers} from "./graphql/resolvers";
import {getTrainerFromToken} from "./auth";
import {K_PUERTO} from "./utils";


const start = async () =>
{
    await connectToMongo();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({req}) =>
        {
            const token = req.headers.authorization || "";
            const user = token ? await getTrainerFromToken(token) : null;
            return {user};
        }
    })

    await server.listen({port: K_PUERTO});
    console.log('Servidor iniciado en http://localhost:',K_PUERTO);
}

start().catch(err =>
{
    console.error('Error al iniciar el servidor:', err);
});
