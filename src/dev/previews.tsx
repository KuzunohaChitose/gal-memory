import React from "react";
import { ComponentPreview, Previews } from "@react-buddy/ide-toolbox";
import { PaletteTree } from "./palette";
import HomeView from "@/views/HomeView";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree />}>
            <ComponentPreview path="/HomeView">
                <HomeView />
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;