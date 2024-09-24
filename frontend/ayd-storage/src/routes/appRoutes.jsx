import HomePage from "../pages/home/HomePage"
import HomeIcon from '@mui/icons-material/Home';
import FilesPage from "../pages/files/FilesPage";
import Profile from "../pages/profile/Profile";
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
]

export default appRoutes;