import Surreal from "surrealdb.js"

export const database = new Surreal(process.env.DATABASE_URL as string);

export async function connect() {
    await database.signin({
        user: process.env.DATABASE_USER as string,
        pass: process.env.DATABASE_PASS as string,
    });

    await database.use(process.env.DATABASE_NAME as string, process.env.SERVER_NAME as string);
}   