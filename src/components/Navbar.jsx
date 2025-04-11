// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation(); // Untuk mengetahui path aktif

  const getButtonVariant = (path) => {
    return location.pathname === path ? 'outlined' : 'text';
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Article Dashboard
        </Typography>
        <Box>
          <Button
            color="inherit"
            variant={getButtonVariant('/all-posts')}
            component={RouterLink}
            to="/all-posts"
            sx={{ mr: 1 }}
          >
            All Posts
          </Button>
          <Button
             color="inherit"
             variant={getButtonVariant('/add-new')}
             component={RouterLink}
             to="/add-new"
             sx={{ mr: 1 }}
           >
            Add New
          </Button>
          <Button
             color="inherit"
             variant={getButtonVariant('/preview')}
             component={RouterLink}
             to="/preview"
           >
            Preview
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;