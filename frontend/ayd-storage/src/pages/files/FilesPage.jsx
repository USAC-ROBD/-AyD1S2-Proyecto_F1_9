import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import FileBrowser from "../../components/FileBrowser/FileBrowser";
import FloatingActionButtons from "../../components/iconsFav/floatingActionButtons";
import Swal from 'sweetalert2';

const FilesPage = () => {
    const [currentFolder, setCurrentFolder] = useState(null);
    const params = useParams();

    useEffect(() => {
      const user = localStorage.getItem('USUARIO') ? JSON.parse(localStorage.getItem('USUARIO')) : undefined;
      if (!user) return;

      if (user.ELIMINADO === 2) {
        const eliminacion = new Date(user.ELIMINACION);
        const hoy = new Date();
        if (hoy >= eliminacion) {
          fetch(`${process.env.REACT_APP_API_HOST}/deleteAccount`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_cuenta: user.ID_CUENTA })
          })
            .then(response => response.json())
            .then(data => {
              if (data.status === 200) {
                Swal.fire({
                  icon: 'error',
                  title: 'Your account has been deleted!'
                })
                  .then(result => {
                    if (result.isConfirmed) {
                      localStorage.removeItem('USUARIO');
                      window.location.href = '/';
                    }
                  });
              }
            })
            .catch(error => {
              Swal.fire({
                icon: 'error',
                title: 'Failed to delete account!'
              })
                .then(result => {
                  if (result.isConfirmed) {
                    localStorage.removeItem('USUARIO');
                    window.location.href = '/';
                  }
                });
            });
        } else {
          const dias_restantes = Math.floor((eliminacion - hoy) / (1000 * 60 * 60 * 24));
          Swal.fire({
            icon: 'warning',
            title: `Your account will be deleted in ${dias_restantes} days!`
          });
        }
      }

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
        const user = localStorage.getItem('USUARIO') ? JSON.parse(localStorage.getItem('USUARIO')) : undefined;
        const username = user ? user.USUARIO : undefined;
        const id_account = user ? user.ID_CUENTA : undefined;
        if (!username || !id_account) return;
    
        fetch(`${process.env.REACT_APP_API_HOST}/getRootFolder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: username , id_account: id_account })
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
            <FileBrowser folder={currentFolder} esPapelera={false} />
            <FloatingActionButtons />
        </div>
    )
}

export default FilesPage;