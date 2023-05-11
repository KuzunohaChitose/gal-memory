import * as process from "process";
import { flow, pipe } from "fp-ts/function";
import * as Op from "fp-ts/Option";
import * as Id from "fp-ts/Identity";
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
 * 获取静态资源的路径，此函数将自动适配返回对应路径
 *
 * @param path 目标路径，起于static
 */
const staticPath = (path: string) =>
    import.meta.env.MODE === "development"
        ? `/public/static/${path}`
        : `${process.cwd().replaceAll("\\", "/")}/resources/static/${path}`;
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

export { formatDate, between, staticPath, getResourcesByCid };
