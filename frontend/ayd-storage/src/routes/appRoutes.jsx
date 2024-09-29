import HomePage from "../pages/home/HomePage"
import HomeIcon from '@mui/icons-material/Home';
import FilesPage from "../pages/files/FilesPage";
import AdminPage from "../pages/admin/AdminPage";
import Profile from "../pages/profile/Profile";
import PapeleraPage from "../pages/papelera/PapeleraPage";
import FolderCopyRoundedIcon from '@mui/icons-material/FolderCopyRounded';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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
    {
        path: "/profile", // identificador de la carpeta
        element: <Profile />,
        state: "File",
        sidebarProps: {
            displayText: "Archivos",
            icon: <FolderCopyRoundedIcon />
        }
    },{
        path: "/recycling",
        element: <PapeleraPage />,
        state: "Recycling",
        sidebarProps: {
            displayText: "Recycling Bioin",
            icon: <DeleteOutlineIcon />
        }
    }
]

export default appRoutes;