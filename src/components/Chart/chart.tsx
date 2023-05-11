import style from "./chart.module.css";
import { createRef, RefObject } from "react";
import { ChartProps, StaticChartProps } from "@/components/Chart/index";
import { useRequest } from "ahooks";
import { useDynamicChart } from "@/utils/hooks";
import { pipe } from "fp-ts/function";
import { fromNullable, map, match } from "fp-ts/Option";
import { EChartsOption } from "echarts";

const Chart = <D extends unknown>({
    className = style.chart,
    request,
    callback,
}: ChartProps<D>) => {
    const div: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    const { data } = useRequest(request);
    pipe(
        data,
        fromNullable,
        map(callback),
        match<EChartsOption, [RefObject<HTMLDivElement>, EChartsOption | null]>(
            () => [div, null],
            (option) => [div, option]
        ),
        (res) => useDynamicChart(...res)
    );

    return <div className={className} ref={div}></div>;
};

const Static = ({ className = style.chart, option }: StaticChartProps) => {
    const div = createRef<HTMLDivElement>();

    useDynamicChart(div, option);

    return <div className={className} ref={div}></div>;
};

export default Object.assign(Chart, { Static });
