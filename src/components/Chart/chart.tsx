import style from "./chart.module.css";
import { createRef } from "react";
import { ChartProps, StaticChartProps } from "@/components/Chart/index";
import { isPresent, withDefaults } from "@/utils/funcs";
import { useRequest } from "ahooks";
import { useDynamicChart } from "@/utils/hooks";

const Chart = <D extends unknown>(props: ChartProps<D>) => {
    const { className, request, callback } = withDefaults(props)({
        className: style.chart,
    });
    const div = createRef<HTMLDivElement>();
    const { data } = useRequest(request);
    useDynamicChart(div, isPresent(data) ? callback(data) : null);

    return <div className={className} ref={div}></div>;
};

const Static = (props: StaticChartProps) => {
    const { className, option } = withDefaults(props)({
        className: style.chart,
    });

    const div = createRef<HTMLDivElement>();

    useDynamicChart(div, option);

    return <div className={className} ref={div}></div>;
};

export default Object.assign(Chart, { Static });
