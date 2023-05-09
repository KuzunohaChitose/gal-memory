import { GetOptional } from "@/utils/types";
import * as process from "process";
import { decrement, flow, increment, pipe } from "fp-ts/function";
import * as Op from "fp-ts/Option";
import * as Id from "fp-ts/Identity";
import * as IO from "fp-ts/IO";
import * as Ar from "fp-ts/Array";
import * as Eq from "fp-ts/Eq";
import * as Or from "fp-ts/Ord";
import * as Ei from "fp-ts/Either";
import * as Num from "fp-ts/number";
import * as Str from "fp-ts/string";
import * as Bool from "fp-ts/boolean";
import * as Tk from "fp-ts/Task";
import dayjs from "dayjs";
import { sqlQuery } from "@/apis";
import { range } from "lodash";

const formatDate = (pattern: string = "YYYY-MM-DD") =>
    flow(
        (date: Date | null | undefined) => date,
        Id.bindTo("date"),
        Id.bind("res", ({ date }) =>
            pipe(
                date,
                Op.fromNullable,
                Op.map(dayjs),
                Op.map((e) => e.format(pattern))
            )
        ),
        Id.map(({ res }) => res),
        Op.match(() => null, Id.of)
    );

/**
 * 计算两个Date对象之间的时间差
 */
const between = (from: Date) => (to: Date) => (type?: "DAY" | "HOUR" | "MINUTE" | "SECOND") =>
    pipe(
        from.valueOf() - to.valueOf(),
        Id.map(Math.abs),
        Id.map((milli) =>
            type === "DAY"
                ? pipe(milli / 1000 / 60 / 60 / 24, Math.floor)
                : type === "HOUR"
                ? pipe(milli / 1000 / 60 / 60, Math.floor)
                : type === "MINUTE"
                ? pipe(milli / 1000 / 60, Math.floor)
                : type === "SECOND"
                ? pipe(milli / 1000, Math.floor)
                : milli
        )
    );

/**
 * 给对象附加默认值，当对对象具有默认值的键获取值时如不存在则返回默认值
 *
 * @param target 目标对象
 */
const withDefaults: <T extends object>(
    target: T
) => (defaults: Required<GetOptional<T>>) => Required<T> = (target) => (defaults) =>
    // @ts-ignore
    new Proxy(target, {
        get(target, p) {
            // @ts-ignore
            return target[p] ?? defaults[p];
        },
    });

/**
 * 判断值是否存在，若不为null或undefined则返回true<br>
 * 此函数可用于类型保护
 *
 * @template T
 * @param e {T}
 * @returns {boolean}
 */
const isPresent = <T>(e: T | undefined | null): e is T => pipe(e, Op.fromNullable, Op.isSome);

/**
 * 将X类型映射到Y类型，返回一个函数，接收X并将其转换为Y返回
 *
 * @param mapper 两个类型的映射关系
 * @param handler 在做类型转换时所作的处理
 * @returns (input: X) => Y
 */
const typeMapper = <X extends { [i: string]: unknown }, Y extends { [i: string]: unknown }>(
    mapper: { [P in keyof X]: keyof Y },
    handler: {
        [I in keyof X as I extends string ? `_${I}` : never]?: (i: X[I]) => any;
    } = {}
) => {
    return (input: X): Y => {
        const res: any = {};
        Object.keys(mapper).forEach((k) => {
            const f = handler[`_${k}`] ?? ((e) => e);
            res[mapper[k]] = (<any>f)(input[k]);
        });
        return res;
    };
};

/**
 * 获取静态资源的路径，此函数将自动适配返回对应路径
 *
 * @param path 目标路径，起于static
 */
const staticPath = (path: string) =>
    import.meta.env.MODE === "development"
        ? `/public/static/${path}`
        : `${process.cwd().replaceAll("\\", "/")}/resources/static/${path}`;

const loopNext: (elements: any[]) => (update: (i: number) => number) => (index: number) => number =
    (elements) => (update) => (index) => {
        return pipe(
            index,
            update,
            (i) => (i >= elements.length ? 0 : i),
            (i) => (i < 0 ? elements.length - 1 : i)
        );
    };

const getResourcesByCid = async (characterId: number) => {
    const [{ gameIdMain, gameIdOther, img }] = await sqlQuery<{
        gameIdMain: number;
        gameIdOther: string | null;
        img: number;
    }>(
        `select game_id_main, game_id_other, img from character_info where character_id = ${characterId}`
    );
    const musics = (
        await sqlQuery<{ gameId: number; bgm: number }>(
            `select game_id, bgm from game_info where game_id in (${gameIdMain}${
                gameIdOther === null ? "" : "," + gameIdOther
            }) and bgm > 0`
        )
    ).flatMap(({ gameId, bgm }) =>
        range(1, bgm + 1).map((n) => staticPath(`${gameId}/bgm/${n}.ogg`))
    );

    const images = range(1, img + 1).map((n) =>
        staticPath(`${gameIdMain}/${characterId}/${n}.png`)
    );

    return { musics, images };
};

export {
    formatDate,
    between,
    withDefaults,
    isPresent,
    typeMapper,
    staticPath,
    loopNext,
    getResourcesByCid,
};

export { Id, Op, Ar, Ei, IO, Eq, Or, Tk, Num, Str, Bool };
