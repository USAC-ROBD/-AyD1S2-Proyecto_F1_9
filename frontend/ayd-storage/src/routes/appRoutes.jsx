import HomePage from "../pages/home/HomePage"
import HomeIcon from '@mui/icons-material/Home';
import FilesPage from "../pages/files/FilesPage";
import Feedback from '@mui/icons-material/Feedback';  //icono para las solicitudes
import AdminPage from "../pages/admin/AdminPage";
import Profile from "../pages/profile/Profile";
import PapeleraPage from "../pages/papelera/PapeleraPage";
import Requests from "../pages/requests/Requests";
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
    },
    {
        path: "/requests", // identificador de la carpeta
        element: <Requests />,
        state: "Requests",
        sidebarProps: {
            displayText: "Requests",
            icon: <Feedback />
        }
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