import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AllPosts from '../pages/AllPosts';
import AddNew from '../pages/AddNew';
import EditPost from '../pages/EditPost';
import Preview from '../pages/Preview';

function AppRoutes() {
  return (
    <Routes>
      {/* Redirect halaman utama ke /all-posts */}
      <Route path="/" element={<Navigate replace to="/all-posts" />} />

      {/* Definisikan route halaman Anda */}
      <Route path="/all-posts" element={<AllPosts />} />
      <Route path="/add-new" element={<AddNew />} />
      <Route path="/edit-post/:id" element={<EditPost />} />
      <Route path="/preview" element={<Preview />} />

      {/* Rute fallback untuk halaman tidak ditemukan */}
      <Route path="*" element={
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h1>404 - Halaman Tidak Ditemukan</h1>
              <p>Maaf, halaman yang Anda cari tidak ada.</p>
          </div>
        } />
    </Routes>
  );
}

export default AppRoutes;