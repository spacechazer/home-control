import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import theme from "./theme";
import App from "./App";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
    onUpdate: async (registration) => {
        if (await registration.unregister()) {
            window.location.reload();
        }
    },
});
