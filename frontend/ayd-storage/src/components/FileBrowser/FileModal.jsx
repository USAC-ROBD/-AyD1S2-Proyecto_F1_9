import React from 'react';
import { Box, Modal, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Función para obtener el tipo de archivo a partir de la extensión
const getFileType = (fileKey) => {
  const extension = fileKey.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
    return 'image';
  }
  if (['mp3', 'wav', 'ogg'].includes(extension)) {
    return 'audio';
  }
  if (['mp4', 'avi', 'mov', 'mkv'].includes(extension)) {
    return 'video';
  }
  if (extension === 'pdf') {
    return 'pdf';
  }
  if (['txt', 'json', 'html'].includes(extension)) {
    return 'text';
  }
  return 'unknown';
};

// Función para renderizar el contenido del archivo dependiendo de su tipo
const renderFileContent = (fileUrl, fileType) => {
  switch (fileType) {
    case 'image':
      return <img src={fileUrl} alt="File Content" style={{ maxWidth: '100%' }} />;
    case 'audio':
      return (
        <audio controls>
          <source src={fileUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      );
    case 'video':
      return (
        <video controls style={{ maxWidth: '100%' }}>
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    case 'pdf':
      return <embed src={fileUrl} type="application/pdf" width="100%" height="400px" />;
    case 'text':
      return <iframe src={fileUrl} title="File Content" style={{ width: '100%', height: '400px' }} />;
    default:
      return (
        <Typography>
          No preview available for this file type.{' '}
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Download File
          </a>
        </Typography>
      );
  }
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: '#12181B',
  border: '2px solid #1A8CD8',
  boxShadow: 24,
  p: 4,
  color: '#AAB8C2',
};

const FileModal = ({ open, onClose, fileContent }) => {
  // Asegúrate de que fileContent esté definido
  const fileUrl = fileContent ? `${process.env.REACT_APP_S3_URL}/${fileContent.key}` : '';
  const fileType = fileContent ? getFileType(fileContent.key) : 'unknown';

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="file-modal-title"
      aria-describedby="file-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="file-modal-title" variant="h6" component="h2" sx={{ color: '#FFFFFF' }}>
            File Viewer
          </Typography>
          <Button
            onClick={onClose}
            sx={{
              bgcolor: '#1A8CD8',
              color: '#FFFFFF',
              '&:hover': {
                bgcolor: '#14679D',
              },
            }}
          >
            <CloseIcon />
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          {renderFileContent(fileUrl, fileType)}
        </Box>
      </Box>
    </Modal>
  );
};

export default FileModal;
