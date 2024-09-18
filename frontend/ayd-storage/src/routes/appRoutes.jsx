import HomePage from "../pages/home/HomePage"
import HomeIcon from '@mui/icons-material/Home';
import FilesPage from "../pages/files/FilesPage";
import AdminPage from "../pages/admin/AdminPage";
import FolderCopyRoundedIcon from '@mui/icons-material/FolderCopyRounded';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';

const appRoutes = [
    {
        path: "/home",
        element: <HomePage />,
        state: "Home",
        sidebarProps: {
            displayText: "Home",
            icon: <HomeIcon />
        }
    },
    {
        path: "/admin",
        element: <AdminPage />,
        state: "Admin",
        sidebarProps: {
            displayText: "Administrador",
            icon: <AdminPanelSettings />
        }
    },
    {
        path: "/files/:id", // identificador de la carpeta
        element: <FilesPage />,
        state: "File",
        sidebarProps: {
            displayText: "Archivos",
            icon: <FolderCopyRoundedIcon />
        }
    },
    {
        path: "/files", // identificador de la carpeta
        element: <FilesPage />,
        state: "File",
        sidebarProps: {
            displayText: "Archivos",
            icon: <FolderCopyRoundedIcon />
        }
    },
]

export default appRoutes;