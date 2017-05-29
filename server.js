import chokidar from 'chokidar';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {clean} from 'require-clean';
import {exec} from 'child_process';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8000;

let graphQLServer;
let appServer;

function startAppServer(callback) {
    // Serve the Relay app
    const compiler = webpack({
        entry: path.resolve(__dirname, 'js', 'app.js'),
        module: {
            loaders: [
                {
                    exclude: /node_modules/,
                    loader: 'babel',
                    test: /\.js$/
                }
            ]
        },
        output: {
            filename: '/app.js',
            path: '/',
            publicPath: '/js/'
        }
    });
    appServer = new WebpackDevServer(compiler, {
        contentBase: '/public/',
        proxy: {
            '/graphql': `http://localhost:${GRAPHQL_PORT}`
        },
        publicPath: '/js/',
        stats: {
            colors: true,
            chunks: false,
            stats: 'errors-only'
        }
    });
    // Serve static resources
    appServer.use('/', express.static(path.resolve(__dirname, 'public')));
    appServer.listen(APP_PORT, () => {
        console.log(`App is now running on http://localhost:${APP_PORT}`);
        if (callback) {
            callback();
        }
    });
}

function startGraphQLServer(callback) {
    // Expose a GraphQL endpoint
    clean('./data/schema');
    const {Schema} = require('./data/schema');
    const graphQLApp = express();
    //CORS middleware
    graphQLApp.use(function (req, res, next) {

        // Website you wish to allow to connect
        //TODO - Origin should be restricted path but doesn't work.. not sure why
        //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/graphql');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware

        if (req.method === "OPTIONS") {
            return res.status(200).end();
        }

        return next();
    });
    graphQLApp.use('/', graphQLHTTP({graphiql: true, pretty: true, schema: Schema}));
    graphQLServer = graphQLApp.listen(GRAPHQL_PORT, () => {
        console.log(`GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`);
        if (callback) {
            callback();
        }
    });
}

function startServers(callback) {
    // Shut down the servers
    if (appServer) {
        appServer.listeningApp.close();
    }
    if (graphQLServer) {
        graphQLServer.close();
    }

    // Compile the schema
    exec('npm run update-schema', (error, stdout) => {
        console.log(stdout);
        let doneTasks = 0;
        function handleTaskDone() {
            doneTasks++;
            if (doneTasks === 2 && callback) {
                callback();
            }
        }
        startGraphQLServer(handleTaskDone);
        startAppServer(handleTaskDone);
    });
}
const watcher = chokidar.watch('./data/{database,schema}.js');
watcher.on('change', path => {
    console.log(`\`${path}\` changed. Restarting.`);
    startServers(() => console.log('Restart your browser to use the updated schema.'));
});
startServers();
