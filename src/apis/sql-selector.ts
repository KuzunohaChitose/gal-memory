import { sqlQuery } from "@/apis/index";
import { Character, Game, Log } from "@/utils/pojo";
import { Ar, Ei, formatDate, Id, Tk, typeMapper } from "@/utils/funcs";
import { flow, pipe } from "fp-ts/function";
import { call } from "@/utils/extra";

type OriginalGame = {
    gameId: number;
    gameName: string;
    gameAlias: string;
    gameBrandName: string;
    gameBrandAlias: string | null;
    startDate: Date;
    bgm: number | null;
};
type OriginalLog = {
    logId: number;
    target: string;
    gameId: number;
    characterId: number;
    startDate: Date;
    endDate: Date | null;
    comment: string | null;
    gameAlias: string;
    characterAlias: string;
};
type OriginalCharacter = {
    characterId: number;
    characterName: string;
    characterAlias: string;
    romaOnn: string | null;
    characterVoice: string;
    gameIdMain: number;
    gameIdOther: string | null;
    gameAlias: string;
    img: number | null;
};

/**
 * 结果映射
 */
const ResultMap = {
    toCharacter: typeMapper<OriginalCharacter, Character>({
        characterAlias: "alias",
        characterId: "id",
        characterName: "name",
        characterVoice: "cvName",
        gameAlias: "gameName",
        gameIdMain: "mainGameId",
        gameIdOther: "otherGameId",
        romaOnn: "romaOnn",
        img: "img",
    }),
    toLog: typeMapper<OriginalLog, Log>(
        {
            characterAlias: "characterName",
            characterId: "characterId",
            comment: "comment",
            endDate: "endDate",
            gameAlias: "gameName",
            gameId: "gameId",
            logId: "id",
            startDate: "startDate",
            target: "target",
        },
        {
            _startDate: formatDate(),
            _endDate: formatDate(),
        }
    ),
    toGame: typeMapper<OriginalGame, Game>(
        {
            gameAlias: "alias",
            gameBrandAlias: "brandAlias",
            gameBrandName: "brandName",
            gameId: "id",
            gameName: "name",
            startDate: "startDate",
            bgm: "bgm",
        },
        {
            _startDate: formatDate(),
        }
    ),
};

const selectAllGames: Tk.Task<Game[]> = pipe(
    () => sqlQuery<OriginalGame>("select * from game_info"),
    pipe(ResultMap.toGame, Ar.map, Tk.map)
);

const selectAllCharacters: Tk.Task<Character[]> = pipe(
    () =>
        sqlQuery<OriginalCharacter>(
            "select character_info.*, gi.game_alias from character_info left join game_info gi on character_info.game_id_main = gi.game_id"
        ),
    pipe(ResultMap.toCharacter, Ar.map, Tk.map)
);

const selectAllLogs: Tk.Task<Log[]> = pipe(
    () =>
        sqlQuery<OriginalLog>(
            "select t1.*, ci.character_alias from (select play_log.*, gi.game_alias from play_log left join game_info gi on play_log.game_id = gi.game_id) t1 left join character_info ci on t1.character_id = ci.character_id"
        ),
    pipe(ResultMap.toLog, Ar.map, Tk.map)
);

export { selectAllGames, selectAllLogs, selectAllCharacters };
