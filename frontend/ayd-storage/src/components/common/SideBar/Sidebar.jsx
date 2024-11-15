import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import '../../../styles/Sidebar.css';
import { List, Stack, Toolbar, Typography, Divider, Box, Button } from "@mui/material";
import SidebarItem from "./SidebarItem";
import SidebarItemCollapse from "./SidebarItemCollapse";
import HomeIcon from '@mui/icons-material/Home';
import FolderCopyRoundedIcon from '@mui/icons-material/FolderCopyRounded';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import StorageBar from "./StorageBar";
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import colorConfigs from "../../../configs/colorConfigs";
import { useNavigate } from "react-router-dom";
import Feedback from '@mui/icons-material/Feedback';  //icono para las solicitudes
import { resetAction } from "../../../redux/features/storageBarSlice";
import ShareIcon from '@mui/icons-material/Share';


const Sidebar = () => {
  const actionTriggered = useSelector((state) => {
    return state.updateStorageBar.actionTriggered;
  }); // Escucha el cambio de estado
  const dispatch = useDispatch();
  // Calcula el porcentaje de almacenamiento utilizado

  const userType = localStorage.getItem('USUARIO') ? JSON.parse(localStorage.getItem('USUARIO')).ROL : undefined;
  const [usedStorage, setUsedStorage] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0); //varia dependiendo del plan del usuario
  const [structDB, setStructDB] = useState([]);
  const navigate = useNavigate();

  let showSharedIcon = false;

  const sideBarItems = [
    {
      level: 0,
      state: "Home",  // Estado para activar el color del item seleccionado, debe ser igual al estado del componente en el archivo de rutas
      path: "/home",
      sidebarProps: {
        icon: <HomeIcon />,
        displayText: "Home",
      },
      userType: 4, // Tipo de usuario que puede ver este item. 1: Administrador, 2: Cliente, 3: Empleado         
    },
    {
      level: 0,
      state: "Admin",
      path: "/admin",
      sidebarProps: {
        icon: <AdminPanelSettings />,
        displayText: "Administrador",
      },
      userType: 1, // Tipo de usuario que puede ver este item. 1: Administrador, 2: Cliente, 3: Empleado         
    },
    {
      level: 0,
      state: "Employee",
      path: "/employee",
      sidebarProps: {
        icon: <AdminPanelSettings />,
        displayText: "Empleado",
      },
      userType: 3, // Tipo de usuario que puede ver este item. 1: Administrador, 2: Cliente, 3: Empleado         
    },
    {
      level: 0,
      state: "Requests",  // Apartados para las solicitudes
      path: "/requests",
      sidebarProps: {
        icon: <Feedback />,
        displayText: "Requests",
      },
      userType: 1,
    },
    {
      level: 0,
      state: "Files",
      path: "/files",
      sidebarProps: {
        icon: <FolderCopyRoundedIcon />,
        displayText: "Archivos",
      },
      userType: 2, // Tipo de usuario que puede ver este item. 1: Administrador, 2: Cliente, 3: Empleado         
    },
    {
      level: 0,
      state: "Profile",
      path: "/profile",
      sidebarProps: {
        icon: <PersonIcon />,
        displayText: "Profile",
      },
      userType: 2, // Tipo de usuario que puede ver este item. 1: Administrador, 2: Cliente, 3: Empleado         
    },
    {
      level: 0,
      state: "Favorites",
      path: "/favorites",
      sidebarProps: {
        icon: <FavoriteIcon />,
        displayText: "Favoritos",
      },
      userType: 2, // Tipo de usuario que puede ver este item. 1: Administrador, 2: Cliente, 3: Empleado
    },
    {
      level: 0,
      state: "Recycling",
      path: "/recycling",
      sidebarProps: {
        icon: <DeleteOutlineIcon />,
        displayText: "Recycling Bin",
      },
      userType: 2, // Tipo de usuario que puede ver este item. 1: Administrador, 2: Cliente, 3: Empleado         
    },
    ,
  ]

  useEffect(() => {
    // Este efecto se activará cuando `actionTriggered` cambie para actualizar el la barra de almacenamiento
    if (actionTriggered) {
      fetchStorage();
      dispatch(resetAction()); // Resetea el estado
    }
  }, [actionTriggered]);

  useEffect(() => {
    //TODO: Verificar en el localStorage el tipo de usuario y mostrar los items correspondientes con un filter
    //userType = localStorage.getItem('USUARIO') ? JSON.parse(localStorage.getItem('USUARIO')).ROL : undefined;
    if (!userType) { // Si no hay usuario logueado
      navigate('/');
    } 
    fetchStorage();
    fetchShowSharedIcon();
  }, []);

  const filtrarItems = () => {
    let filteredItems = [];
    filteredItems = sideBarItems.filter(item => item.userType === userType);
    setStructDB(filteredItems);
  }

  const fetchStorage = async () => {
    //obtenemos los datos del uso de almacenamiento
    //sacamos el username
    const username = localStorage.getItem('USUARIO') ? JSON.parse(localStorage.getItem('USUARIO')).USUARIO : undefined;
    if (!username) return;
    //TODO: Obtener el espacio de almacenamiento utilizado y total del usuario
    fetch(`${process.env.REACT_APP_API_HOST}/getStorage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          setUsedStorage(data.used);
          setTotalStorage(data.total);
        }
      })
      .catch(error => console.error('Error:', error));
  }

  const fetchShowSharedIcon = async () => {
    //hacemos la peticion para saber si el usuario tiene archivos compartidos
    const usuario = JSON.parse(localStorage.getItem('USUARIO'));
    if (!usuario) return;
    fetch(`${process.env.REACT_APP_API_HOST}/showSharedIconInSideBar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idUsuario: usuario.ID_USUARIO })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          if (data.icon) {
            if (showSharedIcon) return;
            showSharedIcon = true;
            sideBarItems.push({
              level: 0,
              state: "shared-with-me",
              path: "/shared-with-me",
              sidebarProps: {
                icon: <ShareIcon />,
                displayText: "Shared with me",
              },
              userType: 2, // Tipo de usuario que puede ver este item. 1: Administrador, 2: Cliente, 3: Empleado         
            },)

            
          }
        }
        filtrarItems();
      }
      )
      .catch(error => {
        console.error('Error:', error);
        filtrarItems();
      })
  }

  return (
    <Box sx={{ height: '100vh', position: 'relative' }}>
      <List disablePadding>
        <Toolbar sx={{
          marginBottom: "20px"
        }}>
          <Stack
            sx={{ width: "100%", marginTop: "20px" }}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h6" sx={{ marginTop: "20px" }}>
              AYD
            </Typography>
            <Typography variant="h6">
              Storage
            </Typography>
          </Stack>
        </Toolbar>
        <Divider variant="middle" component="li"
          sx={{
            marginTop: "5px",
            marginBottom: "5px",
            borderColor: "rgb(255 255 255 / 30%)"
          }}
        />
        {structDB.map((item, index) => (
          item.sidebarProps ? (
            item.child ? (
              <SidebarItemCollapse item={item} key={index} />
            ) : (
              <SidebarItem item={item} key={index} />
            )
          ) : null
        ))}
        <Divider variant="middle" component="li"
          sx={{
            marginTop: "5px",
            marginBottom: "5px",
            borderColor: "rgb(255 255 255 / 30%)"
          }}
        />
        {userType === 2 ? <StorageBar used={usedStorage} total={totalStorage} /> : null}
      </List>

      <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<LogoutIcon />}
          sx={{
            "&: hover": {
              backgroundColor: colorConfigs.sidebar.hoverBg
            },
            backgroundColor: colorConfigs.sidebar.hoverBg,
            paddingY: "12px",
            paddingLeft: `${12 * 0 + 12}px`,
            paddingRight: '12px',
          }}
          onClick={() => {
            localStorage.removeItem('USUARIO');
            navigate('/');
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;