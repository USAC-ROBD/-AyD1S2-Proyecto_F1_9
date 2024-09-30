import HomePage from "../pages/home/HomePage"
import HomeIcon from '@mui/icons-material/Home';
import FilesPage from "../pages/files/FilesPage";
import Feedback from '@mui/icons-material/Feedback';  //icono para las solicitudes
import Profile from "../pages/profile/Profile";
import Requests from "../pages/requests/Requests";
import FolderCopyRoundedIcon from '@mui/icons-material/FolderCopyRounded';

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
]

export default appRoutes;