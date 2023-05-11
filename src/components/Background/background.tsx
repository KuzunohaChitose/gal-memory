import { isPresent } from "nohello-tools/es6/functions";
import { FC, useEffect } from "react";
import { useBackgroundImages } from "nohello-tools/es6/react-hooks";

const Background: FC<{
    className?: string;
    duration?: number;
    delay: number | undefined;
    urls: string[] | undefined;
    children?: JSX.Element;
    color?: `${number},${number},${number}`;
}> = ({ className = "", duration = 1, color = "22,78,99", delay = 10000, urls = [], children }) => {
    const [scope, pause] = useBackgroundImages({
        urls,
        color,
        duration,
        delay,
    });

    useEffect(() => {
        pause(!isPresent(delay));
    }, [delay]);

    return (
        <div
            ref={scope}
            style={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundImage: `linear-gradient(rgba(${color},1),rgba(${color},1))`,
                width: "100%",
                height: "100%",
            }}
            className={className}>
            {children}
        </div>
    );
};

export default Background;
