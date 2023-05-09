import { FC, useEffect } from "react";
import { getResourcesByCid, staticPath, Tk } from "@/utils/funcs";
import { range } from "lodash";
import { useRequest } from "ahooks";
import { useAudio } from "@/utils/hooks";
import { sqlQuery } from "@/apis";
import Background from "@/components/Background";


const HomeView: FC = () => {
    const { data: resources } = useRequest(() => getResourcesByCid(2));

    useEffect(() => {
    }, []);

    return <Background urls={resources?.images ?? []} options={{ delay: 60000 }}></Background>;
};

export default HomeView;
