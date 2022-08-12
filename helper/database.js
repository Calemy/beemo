import { MongoClient } from "mongodb";
import { database } from "../config.js";

export default new MongoClient(database);