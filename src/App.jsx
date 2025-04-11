import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { CssBaseline, Container } from '@mui/material'; // Contoh dengan MUI
// Import komponen Layout/Navbar Anda nanti di sini
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <CssBaseline /> {/* Reset CSS dasar (jika pakai MUI/library lain) */}
      <Navbar /> 
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> {/* Layout Konten Utama */}
        <AppRoutes />
      </Container>
    </>
  );
}

export default App;