// src/pages/AllPosts.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Tabs, Tab, Box, CircularProgress, Typography, Alert } from '@mui/material';
// Jangan import useNavigate di sini jika sudah dihandle di ArticleTable
import ArticleTable from '../components/ArticleTable';
import { getArticles, trashArticle } from '../api/articleApi';

// Definisikan TABS di luar komponen jika tidak bergantung pada state/props
const TABS_CONFIG = [
  { value: 'Published', label: 'Published', apiStatus: 'Publish' },
  { value: 'Drafts', label: 'Drafts', apiStatus: 'Draft' },
  { value: 'Trashed', label: 'Trashed', apiStatus: 'Thrash' },
];

function AllPosts() {
  const [allArticles, setAllArticles] = useState([]);
  const [activeTabValue, setActiveTabValue] = useState(TABS_CONFIG[0].value); // State by value
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const navigate = useNavigate(); // Tidak perlu jika link di tabel

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Asumsi backend MASIH /limit/offset, ambil banyak data
      console.log("Fetching articles...");
      const data = await getArticles(1000, 0);
      console.log("Articles fetched:", data);
      setAllArticles(Array.isArray(data) ? data : []); // Pastikan selalu array
    } catch (err) {
      const errorMsg = err.message || 'Gagal memuat artikel. Coba lagi nanti.';
      setError(errorMsg);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleTabChange = (event, newValue) => {
    setActiveTabValue(newValue);
  };

  // --- Filtering Client-Side ---
  const filteredArticles = useMemo(() => {
    if (!allArticles || allArticles.length === 0) return [];
    const currentTabConfig = TABS_CONFIG.find(tab => tab.value === activeTabValue);
    if (!currentTabConfig) return [];

    const targetStatus = currentTabConfig.apiStatus;
    console.log(`Filtering for status: ${targetStatus}`, allArticles);
    return allArticles.filter(article => article.status === targetStatus);
  }, [allArticles, activeTabValue]);

   // --- Handler untuk tombol Trash ---
   // useCallback digunakan agar fungsi ini tidak dibuat ulang kecuali dependensinya berubah
  const handleTrash = useCallback(async (articleToTrash) => {
    if (!window.confirm(`Anda yakin ingin memindahkan "${articleToTrash.title}" ke Thrash?`)) {
      return;
    }

    // Tampilkan loading spesifik atau gunakan state loading utama
    setLoading(true);
    setError(null); // Reset error sebelum mencoba lagi
    try {
      console.log(`Trashing article ID: ${articleToTrash.id}`);
      await trashArticle(articleToTrash.id, articleToTrash); // Kirim objek lengkap
      console.log(`Article ${articleToTrash.id} trashed successfully.`);
      // Refresh data setelah berhasil
      await fetchArticles();
    } catch (err) {
      const errorMsg = err.message || `Gagal memindahkan artikel "${articleToTrash.title}" ke Thrash.`;
      setError(errorMsg);
      console.error("Trash error:", err);
      setLoading(false); // Pastikan loading berhenti jika gagal di sini
    }
    // setLoading(false) akan dihandle oleh fetchArticles jika sukses
  }, [fetchArticles]); // fetchArticles adalah dependensi karena dipakai untuk refresh


  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        All Posts
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTabValue} onChange={handleTabChange} aria-label="Article Status Tabs">
          {TABS_CONFIG.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Box>

      {/* Tampilkan Loading atau Error */}
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', my: 4 }} />}
      {/* Tampilkan error hanya jika tidak sedang loading */}
      {!loading && error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Tampilkan Tabel jika tidak loading dan tidak error */}
      {!loading && !error && (
        <ArticleTable
          articles={filteredArticles}
          // onEdit tidak perlu dipass jika link sudah di handle di tabel
          onTrash={handleTrash}
        />
      )}

       {/* <Alert severity="info" sx={{ mt: 4 }}>
        <strong>Penting:</strong> Penyaringan (Published/Drafts/Trashed) dan pengambilan data saat ini dilakukan di sisi frontend. Untuk performa optimal, backend API sebaiknya dimodifikasi agar mendukung parameter `?status=...` dan pagination sisi server.
      </Alert> */}
    </Box>
  );
}

export default AllPosts;