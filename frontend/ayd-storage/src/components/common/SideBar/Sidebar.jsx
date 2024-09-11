import React, { useState, useEffect } from "react";
import '../../../styles/Sidebar.css';
import { Avatar, Drawer, List, Stack, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import sizeConfigs from "../../../configs/sizeConfigs";
import assets from "../../../assets";
import colorConfigs from "../../../configs/colorConfigs";
// import appRoutes from "../../routes/appRoutes";
// import structDB from "./StructDB";
import SidebarItem from "./SidebarItem";
import SidebarItemCollapse from "./SidebarItemCollapse";
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import HomeIcon from '@mui/icons-material/Home';

const Sidebar = () => {
  const [structDB, setStructDB] = useState([]);
  const [rotateIcon, setRotateIcon] = useState(false);

    const sideBarItems = [
        {
            level: 0,
            state: "Home",  // Estado para activar el color del item seleccionado, debe ser igual al estado del componente en el archivo de rutas
            sidebarProps: {
                icon: <HomeIcon />,
                displayText: "Home",
            }

        },
    ]

  useEffect(() => {
     setStructDB(sideBarItems);
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sizeConfigs.sidebar.width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sizeConfigs.sidebar.width,
          boxSizing: "border-box",
          borderRight: "0px",
          backgroundColor: colorConfigs.sidebar.bg,
          color: colorConfigs.sidebar.color,
        },
      }}
    >
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
            <Link to="/">
              <Avatar src={assets.images.logo} />
            </Link>
            <Typography variant="h6" sx={{ marginTop: "20px" }}>
              AYD Storage
            </Typography>
          </Stack>
        </Toolbar>
        {structDB.map((item, index) => (
          item.sidebarProps ? (
            item.child ? (
              <SidebarItemCollapse item={item} key={index} />
            ) : (
              <SidebarItem item={item} key={index} />
            )
          ) : null
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;