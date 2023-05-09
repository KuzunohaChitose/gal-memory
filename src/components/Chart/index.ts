import Chart from "@/components/Chart/chart";
import { EChartsOption } from "echarts";

export type ChartProps<D> = {
    className?: string;
    request: () => Promise<D>;
    callback: (res: D) => EChartsOption;
};

export type StaticChartProps = {
    className?: string;
    option: EChartsOption;
};

export default Chart;
