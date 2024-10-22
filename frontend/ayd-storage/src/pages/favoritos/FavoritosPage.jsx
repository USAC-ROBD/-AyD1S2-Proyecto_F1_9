import React, {useEffect, useState} from "react";
import FileBrowser from "../../components/FileBrowser/FileBrowser";
import FloatingActionButtons from "../../components/iconsFav/floatingActionButtons";

const FavoritosPage = () => {


    return (
        <div>
            <FileBrowser esPapelera={false} esFavoritos={true} />
            <FloatingActionButtons />
        </div>
    )
}

export default FavoritosPage;