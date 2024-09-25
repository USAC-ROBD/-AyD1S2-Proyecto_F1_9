import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import FileBrowser from "../../components/FileBrowser/FileBrowser";
import FloatingActionButtons from "../../components/iconsFav/floatingActionButtons";

const FilesPage = () => {
    const [currentFolder, setCurrentFolder] = useState(null);
    const params = useParams();

    useEffect(() => {
        //verificamos si viene el id de la carpeta en la url
        const { id } = params;
        if (id) {
            //console.log("id de la carpeta: ", id);
            setCurrentFolder(id);
        }else{ // si no viene el id de la carpeta, obtenemos la carpeta raíz del usuario
            fetchRootFolder();
            //console.log("no viene id de la carpeta");
        }
      }, []);


    const fetchRootFolder = async () => {
        //obtenemos la carpeta raíz
        //sacamos el username
        const username = localStorage.getItem('USUARIO') ? JSON.parse(localStorage.getItem('USUARIO')).USUARIO : undefined;
        if (!username) return;
    
        fetch(`${process.env.REACT_APP_API_HOST}/getRootFolder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: username })
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === 200) {
              setCurrentFolder(data.rootFolder);
            }
          })
          .catch(error => console.error('Error:', error));
    }

    return (
        <div>
            <FileBrowser folder={currentFolder} />
            <FloatingActionButtons />
        </div>
    )
}

export default FilesPage;