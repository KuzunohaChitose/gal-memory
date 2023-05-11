import { sqlUpdate, SqlUpdateInfo } from "@/apis/index";
import { GameValidator } from "@/utils/validators";
import { array as Ar, either as Ei, task as Tk } from "fp-ts";
import { pipe } from "fp-ts/function";
import { ValidationError } from "class-validator";

const insertGame: (
    game: GameValidator
) => Tk.Task<Ei.Either<SqlUpdateInfo, ValidationError[]>> = (game) =>
    pipe(
        () => game.check(),
        Tk.chain(
            (error) => async () =>
                Ar.isEmpty(error)
                    ? Ei.left(
                          await sqlUpdate(
                              `insert game_info (game_name, game_alias, game_brand_name, game_brand_alias, start_date, bgm) values (${game.name}, ${game.alias}, ${game.brandName}, ${game.brandAlias}, ${game.startDate}, ${game.bgm});`
                          )
                      )
                    : Ei.right(error)
        )
    );

const insertCharacter = () => {};

const insertLog = () => {};

export { insertGame, insertCharacter, insertLog };
