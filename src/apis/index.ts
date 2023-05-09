import { createPool } from "mysql2";
import { camelCase } from "lodash";
import { pipe } from "fp-ts/function";

const pool = createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "galgame",
});
const promisePool = pool.promise();

const sqlQuery = async <T extends { [index: string]: unknown }>(sql: string): Promise<T[]> => {
    const conn = await promisePool.getConnection();
    const [res] = await conn.query(sql);
    conn.release();
    return (<T[]>res).map((e) => {
        const out: any = {};
        for (const label in e) {
            out[camelCase(label)] = e[label];
        }
        return out;
    });
};

type SqlUpdateInfo = {
    affectedRows: number;
    fieldCount: number;
    info: string;
    insertId: number;
    serverStatus: number;
    warningStatus: number;
};

const sqlUpdate = async (sql: string): Promise<SqlUpdateInfo> => {
    pipe(await promisePool.getConnection());
    const conn = await promisePool.getConnection();
    const [res] = await conn.execute(sql);
    conn.release();
    return res;
};

export { sqlUpdate, sqlQuery };
export type { SqlUpdateInfo };
