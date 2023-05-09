import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import store from "@/store";
import { DevSupport } from "@react-buddy/ide-toolbox";
import { ComponentPreviews, useInitial } from "@/dev";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Provider store={store}>
        <DevSupport ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
        >
            <App />
        </DevSupport>
    </Provider>
);

postMessage({ payload: "removeLoading" }, "*");
