type Game = {
    id: number;
    name: string;
    alias: string;
    brandName: string;
    brandAlias: string | null;
    startDate: string;
    bgm: number | null;
};

type Log = {
    id: number;
    target: string;
    gameId: number;
    gameName: string;
    characterId: number;
    characterName: string;
    startDate: string;
    endDate: string | null;
    comment: string | null;
};

type Character = {
    id: number;
    name: string;
    alias: string;
    romaOnn: string | null;
    cvName: string;
    mainGameId: number;
    otherGameId: string | null;
    gameName: string;
    img: number | null;
};

export type { Game, Log, Character };
