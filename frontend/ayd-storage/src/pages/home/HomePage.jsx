import React from "react";
import FileBrowser from "../../components/FileBrowser/FileBrowser";
import SettingsMenu from "../../components/Admin/SettingsMenu";

const HomePage = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <FileBrowser />
            <SettingsMenu />
        </div>
    )
}

export default HomePage;