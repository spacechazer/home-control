import { createMuiTheme } from "@material-ui/core/styles";
import amber from "@material-ui/core/colors/amber";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: amber[800],
            dark: "#111",
            light: amber[300],
        },
        secondary: {
            main: amber[600],
            dark: "#222",
            light: amber["A200"],
        },
    },
    typography: {
        fontFamily: ["Ubuntu"].join(","),
    },
    overrides: {
        MuiCssBaseline: {
            "@global": {
                body: {
                    backgroundColor: "#000",
                    backgroundRepeat: "no-repeat",
                    color: "white",
                    userSelect: "none",
                },
            },
        },
        MuiButton: {
            outlinedPrimary: {
                borderColor: "#333",

                "&:hover": {
                    borderColor: "#333",
                },
            },
        },
        MuiButtonGroup: {
            groupedOutlinedHorizontal: {
                "&:not(:last-child):hover": {
                    borderRightColor: "red",
                },
            },
        },
        MuiTypography: {
            h2: {
                fontWeight: "bold",
                fontSize: "1.85rem",
            },
            h3: {
                fontWeight: "bold",
                fontSize: "1.25rem",
            },
        },
    },
});

export default theme;
