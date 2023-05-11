export type Empty = null | undefined;
export type DelEmpty<T> = T extends Empty ? never : T;
export type HasEmpty<T> = undefined extends T ? true : null extends T ? true : false;

export type GetEmpty<T extends object> = {
    [P in keyof T as HasEmpty<T[P]> extends true ? P : never]: T[P];
};

export type PickToNonEmpty<T extends object, K extends keyof GetEmpty<T> = keyof GetEmpty<T>> = {
    [P in K]: DelEmpty<T[P]>;
} & {
    [P in Exclude<keyof T, K>]: T[P];
};
