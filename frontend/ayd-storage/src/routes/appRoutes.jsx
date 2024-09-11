import HomePage from "../pages/home/HomePage"
import HomeIcon from '@mui/icons-material/Home';

const appRoutes = [
    {
        index: true,
        path: "/home",
        element: <HomePage />,
        state: "Home",
        sidebarProps: {
            displayText: "Home",
            icon: <HomeIcon />
        }
    },
]

export default appRoutes;