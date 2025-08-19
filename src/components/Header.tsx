import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* כותרת בצד שמאל */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ticket Management System
        </Typography>

        {/* קישורי ניווט */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" component={RouterLink} to="/">בית</Button>
          <Button color="inherit" component={RouterLink} to="/forms">טפסים</Button>
          <Button color="inherit" component={RouterLink} to="/management">ניהול</Button>
          <Button color="inherit" component={RouterLink} to="/help">עזרה</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
