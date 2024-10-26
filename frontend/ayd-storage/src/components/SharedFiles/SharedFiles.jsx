import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, TextField, Typography, Container, IconButton, Tooltip, Badge, } from '@mui/material';
import Grid from '@mui/material/Grid2';
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
import ContextMenu from './Options';
import { AccountCircle } from '@mui/icons-material';

const SharedFiles = () => { //si esta en la papelera no se pueden abrir carpetas
  const dispatch = useDispatch();
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [currentFolder, setCurrentFolder] = useState([]);
  const [history, setHistory] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [visible, setVisible] = useState(false);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    console.log('currentFolderId', currentFolderId);
    if (currentFolderId) {
      fetch(`${process.env.REACT_APP_API_HOST}/getChildItems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idFolder: currentFolderId })
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 200) {
            setCurrentFolder(data.children);
          }
        })
        .catch(error => console.error('Error:', error));
    } else {
      const usuario = JSON.parse(localStorage.getItem('USUARIO'));
      fetchItems(usuario);
    }
  }, [currentFolderId]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('USUARIO'));
    fetchItems(usuario);
  }, []);

  const fetchItems = async (usuario) => {
    console.log(usuario);
    if (!usuario) return;
    fetch(`${process.env.REACT_APP_API_HOST}/getSharedWithMeItems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idUsuario: usuario.ID_USUARIO })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          console.log(data);
          setCurrentFolder(data.children);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const enterFolder = (newFolder) => {
    setHistory([...history, currentFolderId]);
    setCurrentFolderId(newFolder.id);
    if (newFolder.owner) {
      setOwner(newFolder.owner);
    }
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
    setVisible(true);
  };

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
              Shared With Me
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', paddingTop: '10px' }}>
          {currentFolder.map((item, index) => (
            <Box
              key={index}
              onDoubleClick={() => item.type === 'folder' && enterFolder(item)}
              onContextMenu={(e) => handleContextMenu(e, item)}
              sx={{
                margin: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                minWidth: '100px',
                maxWidth: '100px',
              }}
            >
              <Tooltip title={item.owner? "Owner: "+ item.owner: "Owner: " + owner} arrow>
                <Badge
                  overlap="circular"
                  badgeContent={<AccountCircle sx={{ fontSize: 25 }} />}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{ position: 'absolute', top: '5px', right: '10px' }} // Adjust position
                />
              </Tooltip>
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
      />

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

export default SharedFiles;
