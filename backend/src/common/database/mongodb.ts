import { config } from "../config/config";

export const mongodbConfig = {
    dbName: config.db.dbName,
    user: config.db.dbUserName,
    pass: config.db.dbPassword
}