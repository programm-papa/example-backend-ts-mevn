"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseStatus = void 0;
const mongooseStatus = (mongoose, config) => {
    const database = mongoose.connection;
    mongoose.Promise = Promise;
    mongoose.connect(config.database, {
        // useMongoClient: true,
        promiseLibrary: global.Promise
    });
    database.on('error', (error) => console.log(`Connection to wmkApi database failed: ${error}`));
    database.on('connected', () => console.log('Connected to wmkApi database "dev"'));
    database.on('disconnected', () => console.log('Disconnected from wmkApi database'));
    process.on('SIGINT', () => {
        database.close(() => {
            console.log('wmkApi terminated, connection closed');
            process.exit(0);
        });
    });
};
exports.mongooseStatus = mongooseStatus;
