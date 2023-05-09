import { isPresent, withDefaults } from "@/utils/funcs";
import { useBgImage } from "@/utils/hooks";
import { useEffect } from "react";

const Background = (props: {
    className?: string;
    duration?: number;
    delay: number | undefined;
    urls: string[] | undefined;
    children?: JSX.Element;
    color?: `${number},${number},${number}`;
}) => {
    const { urls, children, color, duration, className, delay } = withDefaults(props)({
        className: "",
        duration: 1,
        children: <></>,
        color: "22,78,99",
    });

    const [scope, pause] = useBgImage({
        urls: urls ?? [],
        color,
        duration,
        delay: delay ?? 100000,
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
