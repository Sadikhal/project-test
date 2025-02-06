import axios from 'axios';

const upload = async (file) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'project'); // Replace with your Cloudinary upload preset

  try {
    const res = await axios.post(import.meta.env.VITE_UPLOAD_LINK, data);
    const { url } = res.data;
    return url;
  } catch (err) {
    console.error('Upload Error:', err);
    throw err; // Re-throw the error to handle it in the calling function
  }
};

export default upload;