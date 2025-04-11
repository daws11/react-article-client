// src/pages/EditPost.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, CircularProgress, Alert, Stack, Paper
} from '@mui/material';
import { getArticleById, updateArticle } from '../api/articleApi';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  // const [originalStatus, setOriginalStatus] = useState(''); // Tidak terlalu perlu disimpan

  const [loading, setLoading] = useState(false); // Gabungkan loading fetch & update
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // --- Fetch Data Awal ---
  const fetchArticleData = useCallback(async () => {
    console.log(`Workspaceing data for article ID: ${id}`);
    setLoading(true);
    setError(null);
    setSuccess(null); // Reset pesan sukses
    setValidationErrors({}); // Reset error validasi
    try {
      const data = await getArticleById(id);
      console.log("Fetched data:", data);
      setTitle(data.title || '');
      setContent(data.content || '');
      setCategory(data.category || '');
      // setOriginalStatus(data.status);
    } catch (err) {
       const errorMsg = err.message || `Gagal memuat data artikel (ID: ${id}).`;
       setError(errorMsg);
       console.error("Fetch article error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]); // Depend on `id`

  useEffect(() => {
    if (id) { // Pastikan ID ada sebelum fetch
        fetchArticleData();
    }
  }, [id, fetchArticleData]); // Panggil saat komponen mount / id berubah


  // --- Validasi (Sama seperti AddNew) ---
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
    return Object.keys(errors).length === 0;
  };

  // --- Handler untuk Submit Update ---
  const handleSubmit = async (newStatus) => {
    setError(null);
    setSuccess(null);
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const articleData = {
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        status: newStatus
    };

    try {
      const updated = await updateArticle(id, articleData);
      setSuccess(`Artikel "${updated.title || 'artikel'}" berhasil diperbarui dengan status ${newStatus}! Mengarahkan kembali...`);
       setTimeout(() => {
        navigate('/all-posts');
      }, 2500);
    } catch (err) {
       setError(err.message || 'Gagal memperbarui artikel.');
       console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tampilkan loading besar jika data awal sedang dimuat
  if (loading && !title && !error) {
     return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
             <CircularProgress />
        </Box>
     );
  }

  // Tampilkan error besar jika fetch awal gagal
  if (error && !success) { // Jangan tampilkan error fetch jika update baru saja sukses
     return (
        <Alert severity="error" sx={{ m: 2 }}>
            {error} Silakan coba lagi atau kembali ke{' '}
            <MuiLink component={RouterLink} to="/all-posts">daftar artikel</MuiLink>.
        </Alert>
     );
  }

  // Tampilkan form jika data sudah ada atau error fetch tidak terjadi
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Post (ID: {id})
        </Typography>

        {/* Tampilkan error/success dari proses UPDATE */}
        {error && !loading && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
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
          InputLabelProps={{ shrink: true }} // Pastikan label tidak overlap jika value ada
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
          InputLabelProps={{ shrink: true }}
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
          InputLabelProps={{ shrink: true }}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={() => handleSubmit('Publish')}
            startIcon={loading ? <CircularProgress size={20} color="inherit"/> : null}
          >
            Update & Publish
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => handleSubmit('Draft')}
             startIcon={loading ? <CircularProgress size={20} color="inherit"/> : null}
          >
            Update & Save Draft
          </Button>
          <Button variant="text" onClick={() => navigate('/all-posts')} disabled={loading}>
                Cancel
          </Button>
        </Stack>
      </Box>
     </Paper>
  );
}

export default EditPost;