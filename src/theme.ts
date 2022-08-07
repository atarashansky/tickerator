import { createTheme } from "@material-ui/core";

export const backgroundColor = "#253248";


export const theme = createTheme({
  palette: {
    text: {
      primary: "#FFFFFF"
    },
    background: {
        default: backgroundColor
    }
  },
});

export default theme;
