import { FC } from "react";
import { getResourcesByCid } from "@/utils/funcs";
import { useRequest } from "ahooks";
import { useBgImage } from "@/utils/hooks";

const HomeView: FC = () => {
    const { data: resources } = useRequest(() => getResourcesByCid(2));
    const [scope] = useBgImage<HTMLDivElement>({
        urls: resources?.images ?? [],
        delay: 5000,
        duration: 1,
        color: "22,78,99",
    });

    return (
        <div
            ref={scope}
            className="h-full w-full bg-cyan-900 bg-cover bg-center bg-no-repeat"></div>
    );
};

export default HomeView;
