import { Config } from "./index";

export const mongooseStatus = (mongoose:any, config:Config) : void => {
    const database = mongoose.connection;
    mongoose.Promise = Promise;
    mongoose.connect(config.database, {
        // useMongoClient: true,
        promiseLibrary: global.Promise
    });
    database.on('error', (error:any) => console.log(`Connection to wmkApi database failed: ${error}`));
    database.on('connected', () => console.log('Connected to wmkApi database "dev"'));
    database.on('disconnected', () => console.log('Disconnected from wmkApi database'));
    process.on('SIGINT', () => {
        database.close(() => {
            console.log('wmkApi terminated, connection closed');
            process.exit(0);
        })
    });
};