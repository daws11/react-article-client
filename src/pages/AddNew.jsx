// src/pages/AddNew.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, CircularProgress, Alert, Stack, Paper
} from '@mui/material';
import { createArticle } from '../api/articleApi';

function AddNew() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // --- State untuk error validasi per field ---
  const [validationErrors, setValidationErrors] = useState({});

  // Validasi Frontend sebelum submit
  const validateForm = () => {
    const errors = {};
    if (title.trim().length < 20) {
      errors.title = 'Judul minimal 20 karakter.';
    }
    if (content.trim().length < 200) {
      errors.content = 'Konten minimal 200 karakter.';
    }
    if (category.trim().length < 3) {
      errors.category = 'Kategori minimal 3 karakter.';
    }
    setValidationErrors(errors);
    // Return true jika objek errors kosong
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (status) => {
    setError(null); // Reset error API
    setSuccess(null);
    setValidationErrors({}); // Reset error validasi

    if (!validateForm()) {
      return; // Hentikan jika validasi frontend gagal
    }

    setLoading(true);
    const articleData = { title: title.trim(), content: content.trim(), category: category.trim(), status };

    try {
      const created = await createArticle(articleData);
      setSuccess(`Artikel "${created.title || 'baru'}" berhasil dibuat dengan status ${status}! Mengarahkan kembali...`);
      setTitle('');
      setContent('');
      setCategory('');
      setTimeout(() => {
        navigate('/all-posts');
      }, 2500);
    } catch (err) {
      // Tangkap error spesifik dari API jika ada
      setError(err.message || 'Gagal membuat artikel. Periksa kembali isian Anda.');
      console.error("Create error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()} // Cegah submit form HTML standar
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Post
        </Typography>

        {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <TextField
          required
          id="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={Boolean(validationErrors.title)}
          helperText={validationErrors.title || "Minimal 20 karakter"}
          fullWidth
          disabled={loading}
        />

        <TextField
          required
          id="content"
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          error={Boolean(validationErrors.content)}
          helperText={validationErrors.content || "Minimal 200 karakter"}
          multiline
          rows={10}
          fullWidth
          disabled={loading}
        />

        <TextField
          required
          id="category"
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          error={Boolean(validationErrors.category)}
          helperText={validationErrors.category || "Minimal 3 karakter"}
          fullWidth
          disabled={loading}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={() => handleSubmit('Publish')}
            startIcon={loading ? <CircularProgress size={20} color="inherit"/> : null}
          >
            Publish
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => handleSubmit('Draft')}
             startIcon={loading ? <CircularProgress size={20} color="inherit"/> : null}
          >
            Save Draft
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

export default AddNew;