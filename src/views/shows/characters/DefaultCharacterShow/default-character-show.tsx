import { FC } from "react";
import { useParams } from "react-router-dom";
import { useAudio } from "@/utils/hooks";
import { getResourcesByCid, isPresent, staticPath } from "@/utils/funcs";
import { useRequest } from "ahooks";
import Background from "@/components/Background";

const withDefaultMusics = (musics: string[] | undefined): string[] => {
    return isPresent(musics) && isPresent(musics[0]) ? musics : [staticPath("default/default.mp3")];
};
const withDefaultImages = (images: string[] | undefined): string[] => {
    return isPresent(images) && isPresent(images[0]) ? images : [staticPath("default/default.png")];
};

const DefaultCharacterShow: FC = () => {
    const { characterId } = useParams();
    const { data } = useRequest(() =>
        getResourcesByCid(parseInt(characterId ?? "3")).then(({ musics, images }) => ({
            musics: withDefaultMusics(musics),
            images: withDefaultImages(images),
        }))
    );
    const {} = useAudio(data?.musics ?? []);

    return <Background urls={data?.images ?? []} options={{ delay: 10000 }}></Background>;
};

export default DefaultCharacterShow;
