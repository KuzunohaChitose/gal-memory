import {
    ChangeEvent,
    ChangeEventHandler,
    RefObject,
    useCallback,
    useEffect,
    useState,
} from "react";
import { isPresent } from "nohello-tools/es6/functions";
import { EChartsOption, EChartsType, init } from "echarts";
import { Empty } from "@/utils/types";
import { AppDispatch, RootState } from "@/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { dataActions } from "@/store/data-slice";
import { selectAllLogs, selectAllCharacters, selectAllGames } from "@/apis/sql-selector";

const useAppDispatch: () => AppDispatch = useDispatch;

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * 返回一个函数，调用此函数将Store中数据与数据库同步
 */
const useStoreRefresh = () => {
    const dispatch = useAppDispatch();
    return useCallback(async () => {
        dispatch(dataActions.replaceLog(await selectAllLogs()));
        dispatch(dataActions.replaceGame(await selectAllGames()));
        dispatch(dataActions.replaceCharacter(await selectAllCharacters()));
    }, [dispatch]);
};

const useDynamicChart = (canvas: RefObject<HTMLElement>, option: EChartsOption | Empty) => {
    useEffect(() => {
        let chart: EChartsType | Empty = null;
        if (isPresent(canvas.current) && isPresent(option)) {
            const observer = new ResizeObserver(() => {
                chart?.clear();
                chart?.resize();
                chart?.setOption(option);
            });
            chart = init(canvas.current);
            chart.setOption(option);
            observer.observe(canvas.current);
        }
        return () => chart?.dispose();
    }, [canvas, option]);
};
/**
 * 对实现双向绑定的一个简单封装
 *
 * @param param 初始值
 */
const useDataBinding = <
    F extends (state: { (): string; (val: string): void }) => (...args: any[]) => void = (state: {
        (): string;
        (val: string): void;
    }) => ChangeEventHandler<HTMLInputElement>
>(
    param: Partial<{
        check: (value: string) => boolean;
        onChange: F;
        initVal: string;
    }> = {}
) => {
    const initVal = param.initVal ?? "";
    const check = param.check ?? (() => true);
    const changeFunction = (param.onChange ??
        ((state) =>
            ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
                state(value))) as F;
    const [value, setValue] = useState(initVal);

    const state: {
        (): string;
        (val: string): void;
    } = ((val: any) => {
        if (val !== undefined && typeof val === "string") {
            if (check(val)) setValue(val);
        } else return value;
    }) as any;

    const bind = {
        onChange: changeFunction(state) as ReturnType<F>,
        value,
    };

    return Object.assign(state, { bind });
};

export { useAppSelector, useAppDispatch, useDataBinding, useStoreRefresh, useDynamicChart };
