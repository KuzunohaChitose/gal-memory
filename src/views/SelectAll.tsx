import { FC } from "react";
import { Button, Table } from "antd";
import { useAppSelector } from "@/utils/hooks";
import { dataSelector } from "@/store/data-slice";
import { ColumnsType } from "antd/es/table";
import router from "@/router";

const ShowGames: FC = () => {
    const data = useAppSelector(dataSelector.games.getAll);

    const columns: ColumnsType<(typeof data)[number]> = [
        {
            title: "原名",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "译名",
            dataIndex: "alias",
            key: "alias",
        },
        {
            title: "品牌",
            dataIndex: "brandName",
            key: "brandName",
        },
        {
            title: "品牌别名",
            dataIndex: "brandAlias",
            key: "brandAlias",
        },
        {
            title: "开始时间",
            dataIndex: "startDate",
            key: "startDate",
        },
    ];

    return (
        <div>
            <Table dataSource={data?.map((e) => ({ key: e.id, ...e }))} columns={columns}></Table>
        </div>
    );
};

const ShowLogs: FC = () => {
    const data = useAppSelector(dataSelector.logs.getAll);
    const ids = useAppSelector(dataSelector.characters.getALl);

    const columns: ColumnsType<(typeof data)[number]> = [
        {
            title: "路线",
            dataIndex: "target",
            key: "target",
        },
        {
            title: "游戏名",
            dataIndex: "gameName",
            key: "gameName",
        },
        {
            title: "角色名",
            dataIndex: "characterName",
            key: "characterName",
            render: (value) => (
                <Button
                    onClick={() => {
                        for (const { alias, id } of ids) {
                            if (alias === value)
                                router.navigate({ pathname: `/show/character/${id}` }).then();
                        }
                    }}
                    type="link">
                    {value}
                </Button>
            ),
        },
        {
            title: "开始日期",
            dataIndex: "startDate",
            key: "startDate",
        },
        {
            title: "结束日期",
            dataIndex: "endDate",
            key: "endDate",
        },
        {
            title: "感想",
            dataIndex: "comment",
            key: "comment",
        },
    ];

    return (
        <div>
            <Table
                dataSource={data?.map((e) => ({ key: e.id, ...e }))}
                columns={columns.map((e) => ({ align: "center", ...e }))}></Table>
        </div>
    );
};

const ShowCharacters: FC = () => {
    const data = useAppSelector(dataSelector.characters.getALl);

    const columns: ColumnsType<(typeof data)[number]> = [
        {
            title: "原名",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "别名",
            dataIndex: "alias",
            key: "alias",
        },
        {
            title: "罗马音",
            dataIndex: "romaOnn",
            key: "romaOnn",
        },
        {
            title: "声优",
            dataIndex: "cvName",
            key: "cvName",
        },
        {
            title: "出场游戏",
            dataIndex: "gameName",
            key: "gameName",
        },
    ];
    return (
        <div>
            <Table dataSource={data?.map((e) => ({ key: e.id, ...e }))} columns={columns}></Table>
        </div>
    );
};

export default { ShowGames, ShowLogs, ShowCharacters };
