// src/components/ArticleTable.jsx
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip, Box, Typography, Link as MuiLink // Import MuiLink
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Link as RouterLink } from 'react-router-dom'; // Untuk link edit

function ArticleTable({ articles = [], onEdit, onTrash }) {

  if (!articles || articles.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">
          Tidak ada artikel untuk ditampilkan di tab ini.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table sx={{ minWidth: 650 }} aria-label="article table">
        <TableHead>
          <TableRow sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((article) => (
            <TableRow
              key={article.id}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {/* Tambahkan Link ke halaman Edit jika diperlukan */}
                 <MuiLink component={RouterLink} to={`/edit-post/${article.id}`} underline="hover">
                     {article.title}
                 </MuiLink>
              </TableCell>
              <TableCell>{article.category}</TableCell>
              <TableCell align="right">
                <Box>
                  <Tooltip title="Edit">
                    <IconButton
                      aria-label="edit"
                      size="small"
                      component={RouterLink} // Jadikan IconButton sebagai Link
                      to={`/edit-post/${article.id}`} // Langsung arahkan
                      sx={{ mr: 0.5 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Move to Thrash">
                    <IconButton
                      aria-label="thrash"
                      size="small"
                      color="error"
                      onClick={() => onTrash(article)} // Panggil onTrash dgn objek artikel
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ArticleTable;