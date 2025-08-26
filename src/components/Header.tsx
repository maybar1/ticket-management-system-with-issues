import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import * as React from "react";
import { useEffect } from "react"; // 👈 חדש
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import { ToggleButtonGroup } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";

export type Role = "student" | "team";
type HeaderProps = { role: Role; onRoleChange?: (r: Role) => void };

export default function Header({ role, onRoleChange }: HeaderProps) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 כל פעם שהתפקיד משתנה, נשמור ל-localStorage כתפקיד שהצ'אט מבין: student/agent
  useEffect(() => {
    const mapped = role === "team" ? "agent" : "student";
    localStorage.setItem("role", mapped);
  }, [role]);

  const toggleDrawer = () => setOpen((v) => !v);
  const handleNavigation = (url: string) => {
    navigate(url);
    setOpen(false);
  };
  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to + "/");

  const studentLinks = [
    { text: "בית", to: "/", icon: <HomeIcon /> },
    { text: "הפניות שלי", to: "/my", icon: <AssignmentIcon /> },
    { text: "פנייה חדשה", to: "/NewTicket", icon: <AssignmentIcon /> },
    { text: "עזרה", to: "/help", icon: <HelpOutlineIcon /> },
  ];

  const managementLinks = [
    { text: "בית", to: "/", icon: <HomeIcon /> },
    { text: "ניהול פניות", to: "/tickets", icon: <AssignmentIcon /> },
    { text: "עזרה", to: "/help", icon: <HelpOutlineIcon /> },
  ];
  const mainLinks = role === "student" ? studentLinks : managementLinks;

  const handleRoleToggle = (_: unknown, newRole: Role | null) => {
    if (newRole) {
      onRoleChange?.(newRole);

      // 👇 שמירה ל-localStorage גם כאן (מיד עם שינוי)
      const mapped = newRole === "team" ? "agent" : "student";
      localStorage.setItem("role", mapped);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* כותרת בצד שמאל */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Ticket Management System
          </Typography>

          {/* כפתור החלפת תפקיד */}
          <ToggleButtonGroup
            exclusive
            size="small"
            value={role}
            onChange={handleRoleToggle}
            sx={{ mr: 1 }}
          >
            <ToggleButton value="student">
              <SchoolIcon fontSize="small" sx={{ mr: 0.5 }} />
              סטודנט
            </ToggleButton>
            <ToggleButton value="team" aria-label="מנהל">
              <GroupIcon fontSize="small" sx={{ mr: 0.5 }} />
              מנהל
            </ToggleButton>
          </ToggleButtonGroup>

          {/* קישורי ניווט */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {mainLinks.map((l) => (
              <Button
                key={l.to}
                color="inherit"
                component={RouterLink}
                to={l.to}
              >
                {l.text}
              </Button>
            ))}
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

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": { width: 300, p: 1, backgroundImage: "none" },
        }}
      >
        <Toolbar />
        <Box
          sx={{ px: 2, pb: 1, display: "flex", alignItems: "center", gap: 1.5 }}
        >
          <Avatar sx={{ bgcolor: "primary.main" }}>TM</Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              תפריט
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {role === "student" ? "סטודנט" : "מנהל"}
            </Typography>
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
              "&:hover": { bgcolor: "action.selected" },
            },
          }}
        >
          {mainLinks.map((l) => (
            <ListItemButton
              key={l.to}
              selected={isActive(l.to)}
              onClick={() => handleNavigation(l.to)}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{l.icon}</ListItemIcon>
              <ListItemText primary={l.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}
