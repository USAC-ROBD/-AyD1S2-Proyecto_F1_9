import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { triggerAction } from '../../redux/features/storageBarSlice';
import { Box, Button, TextField, Typography, Container, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close'; // Importa el icono de cerrar
import folderImageEmpty from '../../assets/images/carpeta-vacia.png';
import folderImageFull from '../../assets/images/carpeta.png';
import fileImage from '../../assets/images/documento.png';
import acc from '../../assets/images/acc_icon.svg';
import doc from '../../assets/images/doc_icon.svg';
import img from '../../assets/images/img_icon.svg';
import pdf from '../../assets/images/pdf_icon.svg';
import ppt from '../../assets/images/ppt_icon.svg';
import txt from '../../assets/images/txt_icon.svg';
import vau from '../../assets/images/vau_icon.svg';
import xls from '../../assets/images/xls_icon.svg';
import FormUploadFile from './FormUploadFile';
import FormCreateFolder from './FormCreateFolder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import ContextMenu from './Options';
import FormShare from './FormShare';

const FileBrowser = ({ folder, esPapelera, esFavoritos }) => { //si esta en la papelera no se pueden abrir carpetas
  const dispatch = useDispatch();
  const [currentFolderId, setCurrentFolderId] = useState(folder);
  const [currentFolder, setCurrentFolder] = useState([]);
  const [history, setHistory] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [renameFile, setRenameFile] = useState(null);
  const [newName, setNewName] = useState('');
  const [visible, setVisible] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [visibleFormShare, setVisibleFormShare] = useState(false);

  // const contextMenuRef = useRef(null);
  const renameDialogRef = useRef(null);
  const formShareRef = useRef(null);

  // Inicializar la carpeta raíz
  useEffect(() => {
    if (!esPapelera && !esFavoritos) {
      setCurrentFolderId(folder);
    }
  }, [esFavoritos, esPapelera, folder]);

  useEffect(() => {
    if (!esPapelera) {
      fetchChildItems(currentFolderId);
    }
    if (esPapelera) {
      const usuario = JSON.parse(localStorage.getItem('USUARIO'));
      fetchDeletedItems(usuario);
    }
    if (esFavoritos) {
      const usuario = JSON.parse(localStorage.getItem('USUARIO'));
      if (usuario) {
        fetchFavItems(usuario.ID_CUENTA, currentFolderId);
      }
    }

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

  const fetchFavItems = async (idAccount, idFolder) => {
    console.log(idAccount, idFolder);
    if (!idAccount && !idFolder) return;
    fetch(`${process.env.REACT_APP_API_HOST}/getFavorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idAccount, idFolder })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          setCurrentFolder(data.children);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const fetchDeletedItems = async (usuario) => {
    console.log(usuario);
    if (!usuario) return;
    fetch(`${process.env.REACT_APP_API_HOST}/getDeletedFiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idUsuario: usuario.ID_USUARIO })
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
    if (esPapelera) return; //si esta en la papelera no se pueden abrir carpetas
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
      yPos: e.pageY,
      idFolder: currentFolderId
    });
    setVisible(true);
  };

  const handleRename = async () => {
    if (renameFile && newName.trim() !== '') {
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/rename`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idRename: contextMenu.item.id, idPadre: currentFolderId, newName, type: contextMenu.item.type })
      })

      const data = await response.json()

      if(response.ok) {
        if(data.icon === 'success') {
          renameFile.name = newName;
          setCurrentFolder([...currentFolder]);
          setRenameFile(null);
          setNewName('');
          setContextMenu(null);
          return
        }
      }
      Swal.fire({
        icon: data.icon,
        title: data.message,
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  const handleDelete = (item) => {
    fetchDeleteFile(item);
  };

  const handleRestore = (item) => {
    fetchRestoreFile(item);
  };

  const handleUploadFile = (file) => {
    const newFile = {
      id: file.id,
      name: file.name,
      type: 'file'
    };
    // Agregar el nuevo archivo a la carpeta actual
    setCurrentFolder([...currentFolder, newFile]);
    // actualizar la barra de almacenamiento en el sidebar
    dispatch(triggerAction());
  }

  const handleCreateFolder = (folder) => {
    const newFolder = {
      id: folder.id,
      name: folder.name,
      type: 'folder',
      children: []
    };
    // Agregar la nueva carpeta a la carpeta actual
    setCurrentFolder([...currentFolder, newFolder]);
  }

  const activeRename = () => {
    setNewName(contextMenu.item.name)
    setRenameFile(contextMenu.item)
    setVisible(false)
  }

  const activeDelete = () => {
    handleDelete(contextMenu.item)
    setContextMenu(null)
    setVisible(false)
  }

  const activeRestore = () => {
    handleRestore(contextMenu.item)
    setContextMenu(null)
    setVisible(false)
  }

  const activeShare = () => {
    setShareFile(contextMenu.item)
    setVisible(false)
    setVisibleFormShare(true)
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase(); // Obtiene la extensión y la convierte a minúsculas
    switch (extension) {
      case 'pdf':
        return pdf; // Cambia la ruta del ícono según el tipo de archivo
      case 'doc':
      case 'docx':
        return doc;
      case 'xls':
      case 'xlsx':
        return xls;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return img;
      case 'ppt':
      case 'pptx':
        return ppt
      case 'accdb':
        return acc;
      case 'mkv':
      case 'midi':
      case 'mp3':
      case 'mp4':
        return vau;
      case 'txt':
        return txt;
      default:
        return fileImage;
    }
  }

  const fetchDeleteFile = async (item) => {
    fetch(`${process.env.REACT_APP_API_HOST}/deleteFile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idFile: item.id, type: item.type })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          console.log('File moved to recycling bin');
          const filtered = currentFolder.filter((i) => i !== item);
          setCurrentFolder(filtered);
        }
      })
      .catch(error => console.error('Error:', error));
  }

  const fetchRestoreFile = async (item) => {
    fetch(`${process.env.REACT_APP_API_HOST}/restoreFile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idFile: item.id, type: item.type })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          console.log('File moved to recycling bin');
          const filtered = currentFolder.filter((i) => i !== item);
          setCurrentFolder(filtered);
        }
      })
      .catch(error => console.error('Error:', error));
  }

  const handleEmptyTrash = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, empty the trash',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // User pressed confirm
        fetchEmptyTrash();
        Swal.fire(
          'Emptied!',
          'The trash has been emptied.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User pressed cancel
        Swal.fire(
          'Cancelled',
          'Your trash is still intact :)',
          'error'
        );
        // Additional logic when canceled
      }
    });
  };

  const fetchEmptyTrash = async () => {
    const idUser = JSON.parse(localStorage.getItem('USUARIO')).ID_USUARIO;
    if (!idUser) return;
    fetch(`${process.env.REACT_APP_API_HOST}/emptyTrash`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idUser })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          console.log('Trash emptied');
          setCurrentFolder([]);
        }
      })
      .catch(error => console.error('Error:', error));
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
              {esPapelera ? 'Recycling Bin' : esFavoritos ? 'Favorites' : 'Files'}
            </Typography>
          </Grid>
          <Grid item size={{ xs: 12, md: 3, lg: 2 }} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {!esPapelera && !esFavoritos && (
              <FormUploadFile parentFolder={currentFolderId} onUploadFile={handleUploadFile} />
            )}

          </Grid>
          {!esPapelera && !esFavoritos && (
            <Grid item size={{ xs: 12, md: 3, lg: 2 }} sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>

              <FormCreateFolder parentFolder={currentFolderId} onCreateFolder={handleCreateFolder} />

            </Grid>
          )}
          <Grid item size={{ xs: 12, md: 3, lg: 2 }} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {esPapelera && (
              <Button
                sx={{
                  color: '#fff',
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 0px 12px rgba(255, 255, 255, 0.68)',
                  },
                  border: '1px solid #fff',
                }}
                onClick={handleEmptyTrash}
              >
                <DeleteOutlineIcon sx={{ color: '#fff', fontSize: '2rem', marginRight: '5px' }} />
                Empty Trash
              </Button>
            )}
          </Grid>


        </Grid>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', paddingTop: '10px' }}>
          {currentFolder.map((item, index) => (
            <Box
              key={index}
              onDoubleClick={() => item.type === 'folder' && enterFolder(item.id)}
              onContextMenu={(e) => handleContextMenu(e, item)}
              sx={{
                margin: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                minWidth: '100px',
                maxWidth: '100px',
              }}
            >
              <img
                src={item.type === 'folder' ? (item.children > 0 ? folderImageFull : folderImageEmpty) : getFileIcon(item.name)}
                alt={item.name}
                style={{ width: '50px', height: '50px' }}
              />
              <div>{item.name.length <= 30 ? item.name.match(new RegExp(`.{1,10}`, 'g')).join('\n') : item.name.match(new RegExp(`.{1,10}`, 'g')).join('\n').substring(0, 25) + '...'}</div>
            </Box>
          ))}
        </Box>
      </Box>

      <ContextMenu
        contextMenu={contextMenu}
        visible={visible}
        setVisible={setVisible}
        activeRename={activeRename}
        activeDelete={activeDelete}
        activeRestore={activeRestore}
        activeShare={activeShare}
        esPapelera={esPapelera}
        onSetFavItem={fetchFavItems}
      />

      <FormShare 
        file={shareFile} 
        visible={visibleFormShare} 
        setVisible={setVisibleFormShare} 
      />

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
            label="New name"
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
            Confirm
          </Button>
          <Button
            variant="contained"
            color="default"
            sx={{ mt: 2, bgcolor: '#1e253a', ':hover': { bgcolor: '#3f4a61' } }}
            onClick={() => {
              setRenameFile(null);
              setNewName('');
              setContextMenu(null);
            }}
          >
            Cancel
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
          Back
        </Button>
      )}
    </Container>
  );
};

export default FileBrowser;
