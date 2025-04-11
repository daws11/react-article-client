import axiosInstance from './axiosInstance';

/**
 * Mengambil daftar artikel.
 * PENTING: Versi ini mengasumsikan backend MASIH menggunakan path params /:limit/:offset
 * dan BELUM mendukung filter status via query param.
 * @param {number} limit - Jumlah artikel per halaman
 * @param {number} offset - Jumlah artikel yang dilewati
 * @returns {Promise<Array>} - Promise yang resolve dengan array artikel
 */
export const getArticles = async (limit = 10, offset = 0) => {
    // Hapus atau ubah warning lama
    console.log(`API CALL: getArticles using query params ?limit=${limit}&offset=${offset}`);
    try {
      // Gunakan 'params' option dari Axios untuk mengirim query parameters
      const response = await axiosInstance.get('/', { // Targetkan base path '/' relatif terhadap baseURL instance
        params: {
          limit: limit,
          offset: offset
          // Jika backend Anda mendukung filter status di sini, tambahkan juga:
          // status: 'Publish' // Contoh jika Anda perlu filter
        }
      });
      // Kembalikan array kosong jika response.data null atau undefined untuk konsistensi
      return response.data || [];
    } catch (error) {
      console.error('Error fetching articles:', error.response?.data?.error || error.response || error.message);
      // Lemparkan error agar bisa ditangani di komponen UI
      throw new Error(error.response?.data?.error || 'Failed to fetch articles');
    }
  };  

// Fungsi untuk mendapatkan artikel by ID
export const getArticleById = async (id) => {
  if (!id) throw new Error("Article ID is required");
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error.response || error.message);
    throw error;
  }
};

// Fungsi untuk membuat artikel baru
export const createArticle = async (articleData) => {
  // articleData = { title: "...", content: "...", category: "...", status: "Publish/Draft" }
  if (!articleData || !articleData.title || !articleData.content || !articleData.category || !articleData.status) {
      throw new Error("Incomplete article data provided to createArticle");
  }
  try {
    const response = await axiosInstance.post('/', articleData); // Endpoint POST adalah '/' relatif thd base URL
    return response.data;
  } catch (error) {
    console.error('Error creating article:', error.response || error.message);
    // Coba ekstrak pesan error backend jika ada
    const backendError = error.response?.data?.error || error.message;
    throw new Error(backendError || 'Failed to create article');
  }
};

// Fungsi untuk update artikel
export const updateArticle = async (id, articleData) => {
  // articleData = { title: "...", content: "...", category: "...", status: "Publish/Draft/Thrash" }
   if (!id) throw new Error("Article ID is required for update");
   if (!articleData || !articleData.title || !articleData.content || !articleData.category || !articleData.status) {
      throw new Error("Incomplete article data provided to updateArticle");
   }
  try {
    const response = await axiosInstance.put(`/${id}`, articleData);
    return response.data;
  } catch (error) {
    console.error(`Error updating article ${id}:`, error.response || error.message);
    const backendError = error.response?.data?.error || error.message;
    throw new Error(backendError || `Failed to update article ${id}`);
  }
};

/**
 * Memindahkan artikel ke Thrash dengan mengubah statusnya.
 * PENTING: Versi ini mengirim ulang sebagian besar data artikel karena menggunakan PUT
 * dan asumsi backend saat ini memerlukannya.
 * @param {number} id - ID Artikel
 * @param {object} currentArticleData - Objek artikel saat ini (untuk title, content, category)
 * @returns {Promise<object>} - Promise yang resolve dengan data artikel terupdate
 */
export const trashArticle = async (id, currentArticleData) => {
  if (!id) throw new Error("Article ID is required for trashing");
  if (!currentArticleData) throw new Error("Current article data is required for PUT request");

  // Siapkan data untuk PUT, ganti status ke Thrash
  const dataToUpdate = {
      title: currentArticleData.title,
      content: currentArticleData.content,
      category: currentArticleData.category,
      status: 'Thrash'
  };

  console.warn("API CALL: trashArticle using PUT with potentially redundant data. Consider PATCH or modifying backend PUT.");
  try {
    const response = await axiosInstance.put(`/${id}`, dataToUpdate);
    return response.data;
  } catch (error) {
    console.error(`Error trashing article ${id}:`, error.response || error.message);
    const backendError = error.response?.data?.error || error.message;
    throw new Error(backendError || `Failed to trash article ${id}`);
  }
};