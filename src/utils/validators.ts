import { IsDateString, IsInt, IsNotEmpty, Max, MaxLength, Min, validate } from "class-validator";
const toSql: {
    (value: string | undefined | null): string;
    (value: number | undefined | null): number;
} = (value: any): any => {
    if (value === null || value === undefined || value === "") return "null";
    else if (typeof value === "number") return value;
    else if (typeof value === "string") return `'${value}'`;
    else throw new Error("Type Mismatch!");
};

class GameValidator {
    get bgm(): number {
        return toSql(this._bgm);
    }
    get startDate(): string {
        return toSql(this._startDate);
    }
    get brandName(): string {
        return toSql(this._brandName);
    }
    get brandAlias(): string {
        return toSql(this._brandAlias);
    }
    get alias(): string {
        return toSql(this._alias);
    }
    get name(): string {
        return toSql(this._name);
    }
    @IsNotEmpty({ message: "原名不可为空！" })
    @MaxLength(40, { message: "原名最大长度为40！" })
    private readonly _name: string;

    @IsNotEmpty({ message: "别名不可为空！" })
    @MaxLength(40, { message: "别名最大长度为40！" })
    private readonly _alias: string;

    @MaxLength(20, { message: "品牌别名最大长度为20！" })
    private readonly _brandAlias: string;

    @IsNotEmpty({ message: "品牌原名不可为空！" })
    @MaxLength(20, { message: "品牌原名最大长度为20！" })
    private readonly _brandName: string;

    @IsNotEmpty({ message: "起始日期不可为空！" })
    @IsDateString({}, { message: "起始日期不是有效字符串！" })
    private readonly _startDate: string;

    @IsInt({ message: "BGM数必须为整数！" })
    @Max(100, { message: "BGM数最大为100！" })
    @Min(0, { message: "BGM数最小为0！" })
    private readonly _bgm: number;

    constructor(data: {
        name: string;
        alias: string;
        brandName: string;
        brandAlias: string;
        startDate: string;
        bgm: number;
    }) {
        this._alias = data.alias.trim();
        this._name = data.name.trim();
        this._brandName = data.brandName.trim();
        this._brandAlias = data.brandAlias.trim();
        this._startDate = data.startDate.trim();
        this._bgm = data.bgm;
    }

    check() {
        return validate(this);
    }
}

class CharacterValidator {}

class LogValidator {}

export { GameValidator, CharacterValidator, LogValidator };
