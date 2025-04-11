// src/pages/Preview.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, CircularProgress, Typography, Alert, Pagination, Grid,
  Card, CardContent, CardHeader, Paper, Chip // Tambah Chip untuk Kategori
} from '@mui/material';
import { getArticles } from '../api/articleApi';

const ITEMS_PER_PAGE = 6; // Atur jumlah item per halaman

function Preview() {
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

   // --- Fetch Data ---
   const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Preview: Fetching articles...");
      // Asumsi backend MASIH /limit/offset, ambil banyak data
      const data = await getArticles(1000, 0);
      console.log("Preview: Articles fetched:", data);
      setAllArticles(Array.isArray(data) ? data : []);
    } catch (err) {
       const errorMsg = err.message || 'Gagal memuat artikel untuk pratinjau.';
       setError(errorMsg);
       console.error("Preview fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // --- Filter Artikel "Publish" (Client-Side) ---
  const publishedArticles = useMemo(() => {
    console.log("Preview: Filtering published articles...", allArticles);
    return allArticles.filter(article => article.status === 'Publish');
  }, [allArticles]);

  // --- Logic Pagination (Client-Side) ---
  const totalPages = Math.ceil(publishedArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  // Pastikan slice tidak error jika publishedArticles kosong
  const currentArticles = publishedArticles.length > 0 ? publishedArticles.slice(startIndex, endIndex) : [];

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0); // Scroll ke atas saat ganti halaman
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Article Preview
      </Typography>
       <Typography variant="subtitle1" color="text.secondary" gutterBottom>
         Menampilkan artikel yang sudah dipublikasikan.
       </Typography>

      {loading && (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
             <CircularProgress />
        </Box>
      )}
      {!loading && error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!loading && !error && publishedArticles.length === 0 && (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
           <Typography variant="body1">Tidak ada artikel yang dipublikasikan saat ini.</Typography>
        </Paper>
      )}

      {!loading && !error && publishedArticles.length > 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {currentArticles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                   <CardHeader
                      title={article.title}
                      titleTypographyProps={{ variant: 'h6', component: 'h2', noWrap: true }} // Judul H2 & tidak wrap
                      action={
                        <Chip label={article.category} size="small" color="secondary" variant="outlined"/>
                      }
                      sx={{ pb: 0 }} // Kurangi padding bawah header
                   />
                  <CardContent sx={{ flexGrow: 1 }}> {/* Konten mengisi sisa ruang */}
                    <Typography variant="body2" color="text.secondary" sx={{
                       display: '-webkit-box',
                       overflow: 'hidden',
                       WebkitBoxOrient: 'vertical',
                       WebkitLineClamp: 5, // Batasi 5 baris untuk konten
                       textOverflow: 'ellipsis',
                       minHeight: '80px' // Beri tinggi minimum agar card rata
                    }}>
                      {article.content}
                    </Typography>
                  </CardContent>
                   {/* Tambahkan action area jika perlu (misal: Link ke detail view) */}
                   {/* <CardActions> <Button size="small">Read More</Button> </CardActions> */}
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

       {/* <Alert severity="info" sx={{ mt: 4 }}>
        <strong>Penting:</strong> Penyaringan 'Published' dan pagination saat ini dilakukan di sisi frontend. API backend sebaiknya mendukung parameter `?status=Publish` dan pagination sisi server untuk performa yang lebih baik.
      </Alert> */}
    </Box>
  );
}

export default Preview;