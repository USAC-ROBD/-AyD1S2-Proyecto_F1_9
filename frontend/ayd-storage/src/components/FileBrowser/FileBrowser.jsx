import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close'; // Importa el icono de cerrar
import folderImageEmpty from '../../assets/images/carpeta-vacia.png';
import folderImageFull from '../../assets/images/carpeta.png';
import fileImage from '../../assets/images/documento.png';
import FormUploadFile from './FormUploadFile';
import FormCreateFolder from './FormCreateFolder';

const FileBrowser = ({ folder }) => {
  const [currentFolderId, setCurrentFolderId] = useState(folder);
  const [currentFolder, setCurrentFolder] = useState([]);
  const [history, setHistory] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [renameFile, setRenameFile] = useState(null);
  const [newName, setNewName] = useState('');

  const contextMenuRef = useRef(null);
  const renameDialogRef = useRef(null);

  // Inicializar la carpeta raíz
  useEffect(() => {
    setCurrentFolderId(folder);
  }, [folder]);

  useEffect(() => {
    fetchChildItems(currentFolderId);
  }, [currentFolderId]);

  const fetchChildItems = async (idFolder) => {
    if (!idFolder) return;
    fetch(`${process.env.REACT_APP_API_HOST}/getChildItems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idFolder })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          setCurrentFolder(data.children);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const enterFolder = (newFolder) => {
    setHistory([...history, currentFolderId]);
    setCurrentFolderId(newFolder);
  };

  const goBack = () => {
    if (history.length > 0) {
      const previousFolder = history.pop();
      setCurrentFolderId(previousFolder);
      setHistory([...history]);
    }
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({
      item,
      xPos: e.pageX,
      yPos: e.pageY
    });
  };

  const handleRename = () => {
    if (renameFile && newName.trim() !== '') {
      renameFile.name = newName;
      setCurrentFolder([...currentFolder]);
      setRenameFile(null);
      setNewName('');
    }
  };

  const handleDelete = (item) => {
    const filtered = currentFolder.filter((i) => i !== item);
    setCurrentFolder(filtered);
  };

  const handleUploadFile = (file) => {
    const newFile = {
      id : file.id,
      name: file.name,
      type: 'file'
    };
    // Agregar el nuevo archivo a la carpeta actual
    setCurrentFolder([...currentFolder, newFile]);
  }

  const handleCreateFolder = (folder) => {
    const newFolder = {
      id : folder.id,
      name: folder.name,
      type: 'folder',
      children: []
    };
    // Agregar la nueva carpeta a la carpeta actual
    setCurrentFolder([...currentFolder, newFolder]);
  }

  return (
    <Container
      component="main"
      maxWidth="100%"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        bgcolor: '#1e293a',
        p: 3,
        height: '100vh',
        position: 'relative'
      }}
    >
      
      <Box sx={{ flexGrow: 1 }} >
        <Grid container spacing={1}>
          <Grid item size={{ xs: 12, md: 6, lg: 8 }}>
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              Explorador de Archivos
            </Typography>
          </Grid>
          <Grid item size={{ xs: 12, md: 3, lg: 2 }} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <FormUploadFile parentFolder={currentFolderId} onUploadFile={handleUploadFile} />
          </Grid>
          <Grid item size={{ xs: 12, md: 3, lg: 2 }} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <FormCreateFolder parentFolder={currentFolderId} onCreateFolder={handleCreateFolder} />
          </Grid>
          

        </Grid>

        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {currentFolder.map((item, index) => (
              <Box
                key={index}
                onDoubleClick={() => item.type === 'folder' && enterFolder(item.id)}
                onContextMenu={(e) => handleContextMenu(e, item)}
                sx={{
                  margin: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={item.type === 'folder' ? (item.children > 0 ? folderImageFull : folderImageEmpty) : fileImage}
                  alt={item.name}
                  style={{ width: '50px', height: '50px' }}
                />
                <div>{item.name}</div>
              </Box>
            ))}
          </Box>
      </Box>

      {contextMenu && (
        <Box
          ref={contextMenuRef}
          sx={{
            position: 'absolute',
            top: contextMenu.yPos,
            left: contextMenu.xPos,
            backgroundColor: '#1e293a',
            border: '1px solid #ccc',
            zIndex: 1000,
            p: 1,
            boxShadow: 3,
            borderRadius: 1,
            minWidth: '150px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            overflow: 'visible',
          }}
        >
          <IconButton
            onClick={() => setContextMenu(null)}
            sx={{
              position: 'absolute',
              top: '-22px',
              right: '-20px',
              color: '#fff',
              border: '2px solid #ccc',
              backgroundColor: '#1e253a',
              width: '35px',
              height: '35px',
              zIndex: 1001,
              '&:hover': {
                backgroundColor: '#3f4a61',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 1, bgcolor: '#', ':hover': { bgcolor: '#3f4a61' } }}
            onClick={() => {
              setNewName(contextMenu.item.name);
              setRenameFile(contextMenu.item);
              setContextMenu(null);
            }}
          >
            Renombrar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mb: 1, bgcolor: '#d32f2f', ':hover': { bgcolor: '#f44336' } }}
            onClick={() => {
              handleDelete(contextMenu.item);
              setContextMenu(null);
            }}
          >
            Eliminar
          </Button>
        </Box>
      )}

      {renameFile && (
        <Box
          ref={renameDialogRef}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1e293a',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: 1,
            zIndex: 1001,
            boxShadow: 3,
          }}
        >
          <IconButton
            onClick={() => {
              setRenameFile(null);
              setNewName('');
            }}
            sx={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              color: '#fff',
              border: '2px solid #ccc',
              backgroundColor: '#1e253a',
              width: '35px',
              height: '35px',
              zIndex: 1001,
              '&:hover': {
                backgroundColor: '#3f4a61',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <TextField
            margin="normal"
            required
            fullWidth
            id="rename"
            label="Nuevo Nombre"
            name="rename"
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            variant="outlined"
            sx={{
              bgcolor: '#233044',
              borderRadius: 1,
              input: { color: 'white' }, // Color del texto de entrada
              '& .MuiInputLabel-root': {
                color: 'white', // Color de la etiqueta
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white', // Color de la etiqueta cuando está enfocada
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, bgcolor: '#1e253a', ':hover': { bgcolor: '#3f4a61' } }}
            onClick={handleRename}
          >
            Confirmar
          </Button>
          <Button
            variant="contained"
            color="default"
            sx={{ mt: 2, bgcolor: '#1e253a', ':hover': { bgcolor: '#3f4a61' } }}
            onClick={() => {
              setRenameFile(null);
              setNewName('');
            }}
          >
            Cancelar
          </Button>
        </Box>
      )}

      {history.length > 0 && (
        <Button
          variant="contained"
          color="default"
          sx={{ mt: 2, bgcolor: '#1e253a', ':hover': { bgcolor: '#3f4a61' } }}
          onClick={goBack}
        >
          Regresar
        </Button>
      )}
    </Container>
  );
};

export default FileBrowser;
