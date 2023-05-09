import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Character, Game, Log } from "@/utils/pojo";
import { RootState } from "@/store/index";

const initialState: {
    characters: Character[];
    logs: Log[];
    games: Game[];
} = {
    characters: [],
    logs: [],
    games: [],
};

const dataSlice = createSlice({
    name: "database",
    initialState,
    reducers: {
        replaceCharacter: (state, action: PayloadAction<Character[]>) => {
            state.characters = action.payload;
        },
        replaceGame: (state, action: PayloadAction<Game[]>) => {
            state.games = action.payload;
        },
        replaceLog: (state, action: PayloadAction<Log[]>) => {
            state.logs = action.payload;
        },
    },
});

export default dataSlice.reducer;

export const dataActions = dataSlice.actions;

export const dataSelector = {
    characters: {
        getALl: (state: RootState) => state.data.characters,
        getById: (id: number) => (state: RootState) =>
            state.data.characters.find((e) => e.id === id),
    },
    games: {
        getAll: (state: RootState) => state.data.games,
        getById: (id: number) => (state: RootState) => state.data.games.find((e) => e.id === id),
    },
    logs: {
        getAll: (state: RootState) => state.data.logs,
        getById: (id: number) => (state: RootState) => state.data.logs.find((e) => e.id === id),
    },
};
