import { RouterProvider } from "react-router-dom";
import router from "@/router";
import { Layout, Menu, MenuProps } from "antd";
import { useEffect, useState } from "react";
import { useStoreRefresh } from "@/utils/hooks";

type MenuItem = Required<MenuProps>["items"][number];

const { Sider, Content } = Layout;

const items: MenuItem[] = [
    {
        key: "/",
        label: "主页",
    },
    {
        key: "/select",
        label: "查询",
        children: [
            {
                key: "/select/game",
                label: "游戏",
            },
            {
                key: "/select/character",
                label: "角色",
            },
            {
                key: "/select/log",
                label: "日志",
            },
        ],
    },
    {
        key: "/insert",
        label: "添加",
        children: [
            {
                key: "/insert/game",
                label: "游戏",
            },
        ],
    },
];

function App() {
    const refresh = useStoreRefresh();
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        refresh().then();
    }, [refresh]);

    return (
        <Layout className="min-h-screen overflow-hidden">
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <Menu
                    mode={"inline"}
                    defaultSelectedKeys={[location.hash.replace("#", "")]}
                    theme={"dark"}
                    items={items}
                    onClick={({ key }) => router.navigate({ pathname: key })}></Menu>
            </Sider>
            <Content>
                <RouterProvider router={router} />
            </Content>
        </Layout>
    );
}

export default App;
