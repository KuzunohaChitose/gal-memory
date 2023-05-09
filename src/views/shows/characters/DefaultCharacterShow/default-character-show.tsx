import { FC } from "react";
import { useParams } from "react-router-dom";
import { useAudio } from "@/utils/hooks";
import { Ar, getResourcesByCid, isPresent, Op, staticPath, Tk } from "@/utils/funcs";
import { useRequest } from "ahooks";
import Background from "@/components/Background";
import { constant, pipe } from "fp-ts/function";
import { key } from "@/utils/extra";

const DefaultCharacterShow: FC = () => {
    const params = useParams();
    const { data } = pipe(
        () =>
            pipe(
                params,
                key("characterId"),
                Op.fromNullable,
                Op.map(parseInt),
                Op.getOrElse(constant(0)),
                getResourcesByCid
            ),
        Tk.map(({ musics, images }) => ({
            musics:
                isPresent(musics) && Ar.isNonEmpty(musics)
                    ? musics
                    : [staticPath("default/default.mp3")],
            images:
                isPresent(images) && Ar.isNonEmpty(images)
                    ? images
                    : [staticPath("default/default.png")],
        })),
        useRequest
    );
    useAudio(data?.musics);

    return <Background urls={data?.images} delay={10000}></Background>;
};

export default DefaultCharacterShow;
