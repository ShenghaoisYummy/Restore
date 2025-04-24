import { DarkMode, LightMode } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

interface Props {
  darkMode: boolean;
  toogleDarkMode: (darkMode: boolean) => void;
}

export default function NavBar({ toogleDarkMode, darkMode }: Props) {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">Re-Store</Typography>
        <IconButton onClick={() => toogleDarkMode(!darkMode)}>
          {darkMode ? <DarkMode /> : <LightMode sx={{ color: "orange" }} />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
