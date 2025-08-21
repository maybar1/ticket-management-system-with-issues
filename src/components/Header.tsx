import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";
import Avatar from "@mui/material/Avatar";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";



export default function Header() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => setOpen((v) => !v);
  const handleNavigation = (url: string) => {
    navigate(url);
    setOpen(false);
  };
  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + "/");
  const mainLinks = [
    { text: "בית", to: "/", icon: <HomeIcon /> },
    { text: "טפסים", to: "/forms", icon: <AssignmentIcon /> },
  ];

  const managementLinks = [
    { text: "ניהול", to: "/management", icon: <SettingsIcon /> },
   
  ];
  const helpLinks = [{ text: "עזרה", to: "/help", icon: <HelpOutlineIcon /> }];
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* כותרת בצד שמאל */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Ticket Management System
          </Typography>

          {/* קישורי ניווט */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button color="inherit" component={RouterLink} to="/">
              בית
            </Button>
            <Button color="inherit" component={RouterLink} to="/forms">
              טפסים
            </Button>
            <Button color="inherit" component={RouterLink} to="/management">
              ניהול
            </Button>
            <Button color="inherit" component={RouterLink} to="/help">
              עזרה
            </Button>
          </Box>

          <IconButton
            aria-label="פתח תפריט"
            size="large"
            edge="start"
            color="inherit"
            onClick={() => toggleDrawer()}
            sx={{ ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/** Drawer*/}
       <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        sx={{ '& .MuiDrawer-paper': { width: 300, p: 1, backgroundImage: 'none' } }}
      >
      
        <Toolbar />
        <Box sx={{ px: 2, pb: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ bgcolor: "primary.main" }}>TM</Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>תפריט</Typography>
            <Typography variant="caption" color="text.secondary">Ticket Management</Typography>
          </Box>
        </Box>
        <Divider />

        <List
          dense
          sx={{
            px: 1,
            "& .MuiListItemButton-root": { borderRadius: 2, mb: 0.5 },
            "& .Mui-selected": {
              bgcolor: "action.selected",
              "&:hover": { bgcolor: "action.selected" }
            }
          }}
        >
          {mainLinks.map(l => (
            <ListItemButton key={l.to} selected={isActive(l.to)} onClick={() => handleNavigation(l.to)}>
              <ListItemIcon sx={{ minWidth: 36 }}>{l.icon}</ListItemIcon>
              <ListItemText primary={l.text} />
            </ListItemButton>
          ))}
        </List>

        <List
          dense
          subheader={<ListSubheader disableSticky>מסכי ניהול</ListSubheader>}
          sx={{ px: 1, "& .MuiListItemButton-root": { borderRadius: 2, mb: 0.5 } }}
        >
          {managementLinks.map(l => (
            <ListItemButton key={l.to} selected={isActive(l.to)} onClick={() => handleNavigation(l.to)}>
              <ListItemIcon sx={{ minWidth: 36 }}>{l.icon}</ListItemIcon>
              <ListItemText primary={l.text} />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        <List dense sx={{ px: 1 }}>
          {helpLinks.map(l => (
            <ListItemButton key={l.to} selected={isActive(l.to)} onClick={() => handleNavigation(l.to)}>
              <ListItemIcon sx={{ minWidth: 36 }}>{l.icon}</ListItemIcon>
              <ListItemText primary={l.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}