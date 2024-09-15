import React, { useState, useEffect } from "react";
import '../../../styles/Sidebar.css';
import { List, Stack, Toolbar, Typography, Divider,Box,Button } from "@mui/material";
import SidebarItem from "./SidebarItem";
import SidebarItemCollapse from "./SidebarItemCollapse";
import HomeIcon from '@mui/icons-material/Home';
import StorageBar from "./StorageBar";
import LogoutIcon from '@mui/icons-material/Logout';
import colorConfigs from "../../../configs/colorConfigs";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [structDB, setStructDB] = useState([]);
  const navigate = useNavigate();

  const sideBarItems = [
    {
      level: 0,
      state: "Home",  // Estado para activar el color del item seleccionado, debe ser igual al estado del componente en el archivo de rutas
      sidebarProps: {
        icon: <HomeIcon />,
        displayText: "Home",
      },
      userType: 2, // Tipo de usuario que puede ver este item. 1: Administrador, 2: Cliente, 3: Empleado         
    },
  ]

  useEffect(() => {
    //TODO: Verificar en el localStorage el tipo de usuario y mostrar los items correspondientes con un filter
    const userType = localStorage.getItem('USUARIO') ? JSON.parse(localStorage.getItem('USUARIO')).ROL : undefined;
    let filteredItems = [];
    if (!userType) { // Si no hay usuario logueado
      navigate('/');
    } else {
      filteredItems = sideBarItems.filter(item => item.userType === userType);
    }

    setStructDB(filteredItems);
  }, [navigate]);

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
      <StorageBar usedStorage={10} totalStorage={100} />
    </List>

      <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<LogoutIcon />}
          sx={{ "&: hover": {
                        backgroundColor: colorConfigs.sidebar.hoverBg
                    },
                    backgroundColor: colorConfigs.sidebar.hoverBg,
                    paddingY: "12px",
                    paddingLeft: `${12 * 0 + 12}px`,
                    paddingRight: '12px',}}
        >
          Logout
        </Button>
      </Box>
      </Box>
  );
};

export default Sidebar;