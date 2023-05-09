import { createHashRouter } from "react-router-dom";
import HomeView from "@/views/HomeView";
import SelectAll from "@/views/SelectAll";
import DefaultCharacterShow from "@/views/shows/characters/DefaultCharacterShow";
import InsertGame from "@/views/inserts/InsertGame";

const router = createHashRouter([
    {
        path: "/",
        element: <HomeView />,
        id: "主页",
    },
    {
        path: "/select",
        id: "查询",
        children: [
            {
                id: "所有游戏",
                path: "/select/game",
                element: <SelectAll.ShowGames />,
            },
            {
                id: "所有角色",
                path: "/select/character",
                element: <SelectAll.ShowCharacters />,
            },
            {
                id: "所有日志",
                path: "/select/log",
                element: <SelectAll.ShowLogs />,
            },
        ],
    },
    {
        path: "/insert",
        id: "添加",
        children: [
            {
                path: "/insert/game",
                element: <InsertGame></InsertGame>
            },
            {
                path: "/insert/log",
            },
            {
                path: "/insert/character",
            },
        ],
    },
    {
        path: "/show",
        id: "展示",
        children: [
            {
                path: "/show/character/:characterId",
                element: <DefaultCharacterShow />,
            },
        ],
    },
]);

export default router;
