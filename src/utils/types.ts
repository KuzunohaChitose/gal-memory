export type GetRequired<T> = {
    [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P];
};

export type RequiredKeys<T, K = keyof T> = K extends keyof T
    ? T extends Required<Pick<T, K>>
        ? K
        : never
    : never;

export type GetOptional<T, U extends Required<T> = Required<T>, K extends keyof T = keyof T> = Pick<
    T,
    K extends keyof T ? (T[K] extends U[K] ? never : K) : never
>;

export type OptionalKeys<T> = {
    [P in keyof T]-?: {} extends Pick<T, P> ? P : never;
}[keyof T];

export type UnionToIntersection<U> = (U extends unknown ? (arg: U) => 0 : never) extends (
    arg: infer I
) => 0
    ? I
    : never;

export type UnionToTuple<
    U,
    Last = UnionToIntersection<U extends unknown ? (x: U) => 0 : never> extends (x: infer L) => 0
        ? L
        : never
> = [U] extends [never] ? [] : [...UnionToTuple<Exclude<U, Last>>, Last];

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

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
