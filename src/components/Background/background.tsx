import { FC, useEffect, useRef } from "react";
import { useAnimate } from "framer-motion";
import { decrement, increment, pipe } from "fp-ts/function";
import { Ar } from "@/utils/funcs";
import { randomElem, randomInt } from "fp-ts/Random";
import { useInterval } from "ahooks";
import { loopNext } from "@/utils/funcs";
import { call } from "@/utils/extra";

const Background: FC<{
    children?: JSX.Element;
    urls: string[];
    options: {
        duration?: number;
        delay: number | undefined;
        order?: "inc" | "dec";
    };
    bgClassName?: string;
}> = ({ children, bgClassName, urls, options }) => {
    const [scope, animate] = useAnimate();

    const index = useRef(-1);

    useEffect(() => {
        if (Ar.isNonEmpty(urls)) index.current = randomInt(0, urls.length - 1)();
    }, [urls]);

    const changeBg = (opacity: 0 | 1, duration: number) =>
        animate(
            scope.current,
            {
                backgroundImage: `linear-gradient(rgba(22, 78, 99, ${opacity}), rgba(22, 78, 99, ${opacity})), url(${
                    urls[index.current]
                })`,
            },
            { duration }
        );

    useInterval(
        () =>
            changeBg(1, options.duration ?? 1)
                .then(() => {
                    index.current = loopNext(urls)(
                        (options.order ?? "inc") === "inc" ? increment : decrement
                    )(index.current);
                    return changeBg(1, 0);
                })
                .then(() => changeBg(0, options.duration ?? 1)),
        Ar.isEmpty(urls) ? undefined : options.delay,
        { immediate: true }
    );

    return (
        <div
            ref={scope}
            style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundImage: Ar.isEmpty(urls)
                    ? `linear-gradient(rgba(22, 78, 99, 1), rgba(22, 78, 99, 1))`
                    : `linear-gradient(rgba(22, 78, 99, 0), rgba(22, 78, 99, 0)), url(${
                          urls[index.current]
                      })`,
                width: "100%",
                height: "100%",
            }}
            className={bgClassName}>
            {children}
        </div>
    );
};

export default Background;
