import InsertGame from "./InsertGame";

type FormItem = {
    label: string;
    name: string;
    initialValue: unknown;
    render: () => JSX.Element;
};

export type { FormItem };
export { InsertGame };
