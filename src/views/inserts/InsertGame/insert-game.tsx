import { FC, useMemo } from "react";
import { Button, Card, DatePicker, Form, Input, InputNumber } from "antd";
import style from "./insert-game.module.css";
import dayjs from "dayjs";
import { insertGame } from "@/apis/sql-updater";
import { FormItem } from "@/views/inserts";
import { GameValidator } from "@/utils/validators";
import { useStoreRefresh } from "@/utils/hooks";
import { flow, pipe } from "fp-ts/function";
import { Ar, Ei, IO, Tk } from "@/utils/funcs";
import { call, key } from "@/utils/extra";

const InsertGame: FC = () => {
    const items = useMemo(
        (): FormItem[] => [
            {
                label: "原名",
                name: "name",
                initialValue: "",
                render: () => <Input />,
            },
            {
                label: "别名",
                name: "alias",
                initialValue: "",
                render: () => <Input />,
            },
            {
                label: "起始时间",
                name: "startDate",
                initialValue: dayjs(),
                render: () => <DatePicker className="w-full" />,
            },
            {
                label: "品牌原名",
                name: "brandName",
                initialValue: "",
                render: () => <Input />,
            },
            {
                label: "品牌别名",
                name: "brandAlias",
                initialValue: "",
                render: () => <Input />,
            },
            {
                label: "BGM数",
                name: "bgm",
                initialValue: 0,
                render: () => <InputNumber className="w-full" />,
            },
        ],
        []
    );
    const [form] = Form.useForm();
    const refresh = useStoreRefresh();

    const submit: Tk.Task<void> = pipe(
        items,
        Ar.map(key("name")),
        (names) => () => form.validateFields(names),
        Tk.map((e) => new GameValidator({ ...e, startDate: e.startDate.format("YYYY-MM-DD") })),
        Tk.chain(insertGame),
        Tk.map(
            Ei.match(
                (res): IO.IO<void> =>
                    () => {
                        if (res.affectedRows > 0) refresh().then();
                    },
                (err): IO.IO<void> =>
                    () => {
                        form.resetFields([err[0].property.slice(1)]);
                        for (const key in err[0].constraints) console.log(err[0].constraints[key]);
                    }
            )
        ),
        Tk.map(call())
    );

    const reset = () => form.resetFields();

    return (
        <Card className={style.card} title={"新增游戏"}>
            <Form
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                initialValues={{ size: "large" }}
                size={"large"}>
                {items.map(({ label, initialValue, name, render }) => (
                    <Form.Item {...{ label, initialValue, name, key: name }}>{render()}</Form.Item>
                ))}
                <Button type="primary" onClick={submit}>
                    提交
                </Button>
                <Button type="default" onClick={reset}>
                    重置
                </Button>
            </Form>
        </Card>
    );
};

export default InsertGame;
