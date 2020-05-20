import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { success, error } from './utils/consoleStyles';
import { AuthResolver } from './resolvers/Auth.resolver';

(async () => {
    const app = express();
    const PORT = process.env.PORT || 4000;

    try {
        await createConnection();
        console.log(`${success('SUCCESS')} Connected to the database.`);
    } catch (err) {
        console.log(`${error('ERROR')} Failed to connect to the database: ${err}`);
    }

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [AuthResolver],
        }),
    });

    apolloServer.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`${success('SUCCESS')} Janus is running on port: ${PORT}`);
    });
})();
