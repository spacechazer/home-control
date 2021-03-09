import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import theme from "./theme";
import App from "./App";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>,
    document.getElementById("root")
);
