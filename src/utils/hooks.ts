import {
    ChangeEvent,
    ChangeEventHandler,
    RefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Ar, isPresent, loopNext, withDefaults } from "@/utils/funcs";
import { EChartsOption, EChartsType, init } from "echarts";
import { Empty, Equal } from "@/utils/types";
import { AppDispatch, RootState } from "@/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { dataActions } from "@/store/data-slice";
import { selectAllLogs, selectAllCharacters, selectAllGames } from "@/apis/sql-selector";
import { extend } from "lodash";
import { randomElem, randomInt } from "fp-ts/Random";
import { NonEmptyArray } from "fp-ts/NonEmptyArray";
import { useInterval } from "ahooks";
import { increment } from "fp-ts/function";

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * 返回一个函数，调用此函数将Store中数据与数据库同步
 */
export const useStoreRefresh = () => {
    const dispatch = useAppDispatch();
    return useCallback(async () => {
        dispatch(dataActions.replaceLog(await selectAllLogs()));
        dispatch(dataActions.replaceGame(await selectAllGames()));
        dispatch(dataActions.replaceCharacter(await selectAllCharacters()));
    }, [dispatch]);
};

export const useDynamicChart = (canvas: RefObject<HTMLElement>, option: EChartsOption | Empty) => {
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
export const useDataBinding = <
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

const log = <T>(t: T) => {
    console.log(t);
    return t;
};

export const useAudio = (urls: string[]) => {
    const [totalTime, setTotalTime] = useState(NaN);
    const [paused, setPaused] = useState(true);
    const [volume, setVolume] = useState(100);
    const [currentTime, setCurrentTime] = useState(0);
    const index = useRef(-1);
    const audio = useRef(new Audio());

    useEffect(() => {
        if (Ar.isNonEmpty(urls)) {
            index.current = randomInt(0, urls.length - 1)();
            audio.current.src = urls[index.current];
            audio.current.oncanplaythrough = () => audio.current.play().then();
            audio.current.onended = () => {
                index.current = loopNext(urls)(increment)(index.current);
                audio.current.src = urls[index.current];
            };
            audio.current.ondurationchange = () => setTotalTime(audio.current.duration);
            audio.current.onplaying = () => setPaused(false);
            audio.current.onpause = () => setPaused(true);
            audio.current.ontimeupdate = () => setCurrentTime(audio.current.currentTime);
            audio.current.onvolumechange = () =>
                setVolume(parseInt((audio.current.volume * 100).toFixed()));
        }

        return () => {
            audio.current.pause();
        };
    }, [urls]);

    return {
        action: {
            /**
             * 设置歌曲当前时间
             *
             * @param currentTime 应在[0, totalTime]之间
             */
            setCurrentTime(currentTime: number) {
                if (index.current >= 0) {
                    if (currentTime > totalTime) audio.current.currentTime = totalTime;
                    else if (currentTime < 0) audio.current.currentTime = 0;
                    else audio.current.currentTime = currentTime;
                }
            },
            /**
             * 设置当前歌曲，为整数时向后切歌，否则向前切歌，为零时从头播放当前歌曲
             *
             * @param next 应为整数，否则自动向下取整
             * @returns {number} 当前播放歌曲在urls中的索引
             */
            setCurrentSong(next?: number) {
                if (index.current >= 0 && next !== undefined) {
                    index.current = loopNext(urls)((n) => n + Math.floor(next))(index.current);
                    audio.current.src = urls[index.current];
                }
                return index.current;
            },
            /**
             * 设置音量，合法值为[0, 100]之间的整数<br>
             * 传入浮点数时将自动向下取整
             *
             * @param volume 音量值
             */
            setVolume(volume: number) {
                if (index.current >= 0 && Math.floor(volume) <= 100 && Math.floor(volume) >= 0) {
                    audio.current.volume = Math.floor(volume) / 100;
                }
            },
            /**
             * 设置暂停状态，无入参时自动切换状态
             *
             * @param stopped 暂停
             */
            setPaused(stopped?: boolean) {
                if (index.current >= 0 && stopped === undefined) {
                    if (paused) audio.current.play().then();
                    else audio.current.pause();
                } else if (index.current >= 0 && stopped && !paused) {
                    audio.current.pause();
                } else if (index.current >= 0 && !stopped && paused) {
                    audio.current.play().then();
                }
            },
        },
        attrs: { totalTime, paused, volume, currentTime },
    };
};
