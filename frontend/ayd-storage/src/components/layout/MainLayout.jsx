import React from 'react';
import { Box, Toolbar, AppBar, Drawer } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import sizeConfigs from '../../configs/sizeConfigs';
import colorConfigs from '../../configs/colorConfigs';
// import Topbar from '../common/Topbar';
import Sidebar from '../common/SideBar/Sidebar';
import { Outlet } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

const MainLayout = () => {

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${sizeConfigs.sidebar.width}px)` },
                    ml: { sm: `${sizeConfigs.sidebar.width}px` },
                    backgroundColor: colorConfigs.sidebar.bg,
                    display: { sm: 'none' }
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                    </Typography>
                </Toolbar>
            </AppBar>
            {/* <Topbar /> */}
            <Box
                component="nav"
                sx={{
                    width: {sm: sizeConfigs.sidebar.width},
                    flexShrink: { sm: 0 }
                    
                }}
                aria-label="XD"
            >

                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
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
                    <Sidebar/>
                </Drawer>


                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
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
                    open
                >
                    <Sidebar/>
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 0,
                    width: { sm: `calc(100% - ${sizeConfigs.sidebar.width}px)` },
                    backgroundColor: colorConfigs.mainBg
                }}
            >
                <Toolbar
                    sx={{
                        display: { sm: 'none' }
                    }}
                />
                <Outlet />
            </Box>
        </Box>
    )
};

export default MainLayout;