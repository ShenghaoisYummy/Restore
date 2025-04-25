import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, IconButton, Toolbar, Typography } from "@mui/material";
import { List, ListItem } from "@mui/material";
import { NavLink } from "react-router-dom";

const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];

const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

interface Props {
  darkMode: boolean;
  toogleDarkMode: (darkMode: boolean) => void;
}

export default function NavBar({ toogleDarkMode, darkMode }: Props) {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography component={NavLink} to="/" variant="h6">
          Re-Store
        </Typography>
        <IconButton onClick={() => toogleDarkMode(!darkMode)}>
          {darkMode ? <DarkMode /> : <LightMode sx={{ color: "orange" }} />}
        </IconButton>
        <List sx={{ display: "flex" }}>
          {midLinks.map(({ title, path }) => (
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={{
                color: "inherit",
                typography: "h6",
              }}
            >
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>
        <IconButton size="large" sx={{ color: "inherit" }}>
          <Badge badgeContent={4} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>
        <List sx={{ display: "flex" }}>
          {rightLinks.map(({ title, path }) => (
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={{
                color: "inherit",
                typography: "h6",
              }}
            >
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>
      </Toolbar>
    </AppBar>
  );
}
