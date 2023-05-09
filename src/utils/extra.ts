import { chainRec } from "fp-ts";

const key =
    <T, K extends keyof T>(key: K) =>
    (value: T) =>
        value[key];

const call =
    <T extends (...args: any[]) => any>(...args: Parameters<T>) =>
    (fn: T) =>
        fn(args);

export { key, call };
