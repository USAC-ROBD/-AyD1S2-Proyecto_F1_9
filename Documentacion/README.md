# Documentación del Proyecto

## Índice

1. [Metodología de Desarrollo](#metodología-de-desarrollo)
2. [Reuniones de la Metodología](#reuniones-de-la-metodología)
3. [Modelo de Branching](#modelo-de-branching)
4. [Toma de Requerimientos](#toma-de-requerimientos)
   - [Requerimientos Funcionales](#requerimientos-funcionales)
   - [Requerimientos No Funcionales](#requerimientos-no-funcionales)
5. [Historias de Usuario](#historias-de-usuario)
6. [Descripción de las Tecnologías](#descripción-de-las-tecnologías)
7. [Diagramas de Actividades](#diagramas-de-actividades)
8. [Arquitectura de Sistemas](#arquitectura-de-sistemas)
9. [Diagrama de Despliegue](#diagrama-de-despliegue)
10. [Modelo de Datos](#modelo-de-datos)
11. [Seguridad de la Aplicación](#seguridad-de-la-aplicación)
12. [Mockups](#mockups)
13. [Documentación de Pipelines](#documentación-de-pipelines)

---

## Metodología de Desarrollo

### SCRUM

**Descripción:**

SCRUM es una metodología ágil de gestión de proyectos que se enfoca en la entrega incremental y evolutiva de productos de software. En SCRUM, el trabajo se organiza en ciclos cortos llamados sprints, que suelen durar entre 2 a 4 semanas. Al final de cada sprint, se entrega una versión funcional del producto, permitiendo una revisión continua del progreso y la adaptación a cambios. Los roles principales en SCRUM incluyen el Product Owner (responsable de definir las características y prioridades del producto), el Scrum Master (facilitador del proceso), y el Equipo de Desarrollo (encargado de construir el producto).

**Justificación:**

SCRUM proporciona una estructura organizada y flexible que es especialmente útil para proyectos que requieren adaptabilidad, constante retroalimentación, y entregas incrementales, lo cual se ajusta perfectamente a las necesidades del proyecto en curso.

## Reuniones de la Metodología

**1. Sprint Planning (Planificación del Sprint)**

Es la reunión que marca el inicio de un sprint. El equipo de desarrollo y el Product Owner se reúnen para definir qué trabajo del backlog se llevará a cabo en el próximo sprint.

**2. Daily meeting (Reunión Diaria)**

Es una reunión breve que se lleva a cabo diariamente. Su objetivo es que los desarrolladores notifiquen si existen bloqueantes, notifiquen avances logrados y lo que haran en ese día.

**3. Sprint Review (Revisión del Sprint)**

Se lleva a cabo al final del sprint. Se muestra lo que se ha hecho en el sprint y se recopilan comentarios.

**4. Sprint Retrospective (Retrospectiva del Sprint)**

También se realiza al final del sprint, pero está orientada exclusivamente al equipo de desarrollo. El objetivo es reflexionar sobre el sprint que acaba de terminar, identificar lo que funcionó bien y lo que puede mejorarse.

## Modelo de Branching

### Git Flow

**Descripción del Modelo de Branching:**

Git Flow es una metodología de ramificación estructurada y utilizada principalmente en proyectos grandes y con ciclos de lanzamiento más largos. Introduce varias ramas con roles específicos:

* **Master**: Representa el código de producción. Solo se actualiza con versiones que están listas para ser lanzadas.
* **Develop**: Es la rama principal para el desarrollo. Todas las nuevas funcionalidades se integran aquí antes de ser fusionadas en Master.
* **Feature Branches**: Cada nueva funcionalidad tiene su propia rama que se deriva de Develop. Una vez completada, se fusiona de nuevo a Develop.
* **Release Branches**: Antes de lanzar una versión estable, se crea una rama de "release" desde Develop, lo que permite realizar correcciones menores y pruebas antes de fusionarla en Master.
* **Hotfix Branches**: Se crean desde Master para corregir errores críticos en producción. Una vez corregido, se fusionan tanto en Master como en Develop.

### Diagrama de branching al finalizar Fase 1:

<div align="center"><img src="./assets/GitFlowPF1.png"/></div>

### Diagrama de branching al finalizar Fase 2:

<div align="center"><img src="./assets/gitflow-f2.png"/></div>

## Toma de Requerimientos

[Requerimientos](Requerimientos.md)

## Historias de Usuario

[Historias de usuario](historias-de-usuario.md)

## Descripción de las Tecnologías

### Tecnologías a Utilizar:

### Base de Datos

#### MySQL

<div align="center"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" width="100"/></div>

MySQL se utilizará para almacenar y gestionar los datos de la aplicación. Esto puede incluir información de usuarios, transacciones, inventarios, etc.

MySQL es un sistema de gestión de bases de datos relacional (RDBMS) basado en SQL (Structured Query Language). Es conocido por ser rápido, confiable y fácil de usar, lo que lo convierte en una opción popular para aplicaciones web.

### Backend

#### NodeJS

<div align="center"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" width="100"/></div>

Node.js con Express será el encargado del desarrollo del backend, gestionando las API que se conectan con la base de datos y el frontend. Además, procesará la lógica del negocio y manejará la autenticación, autorizaciones y solicitudes HTTP.

Node.js es un entorno de ejecución de JavaScript del lado del servidor. Utiliza un modelo de E/S sin bloqueo y orientado a eventos, lo que lo hace muy eficiente para manejar múltiples conexiones simultáneas.

Express es un marco de aplicaciones web rápido y minimalista para Node.js. Proporciona una serie de características útiles para construir API y manejar rutas, middleware y solicitudes HTTP de manera sencilla.

### Frontend

#### React

<div align="center"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="100"/></div>

React se utilizará para desarrollar la interfaz de usuario de la aplicación web, ofreciendo una experiencia dinámica e interactiva para los usuarios finales.

React es una biblioteca de JavaScript para construir interfaces de usuario. Es mantenida por Facebook y una gran comunidad de desarrolladores. React permite crear componentes reutilizables y manejar el estado de las aplicaciones de manera eficiente.

### Despliegue

#### AWS

<div align="center"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" width="100"/></div>

Amazon Web Services y sus diferentes recursos se utilizarán para poder realizar el despliegue de nuestra aplicación en la nube. Entre los servicios a utilizar están los siguientes.

- **Amazon RDS**
  RDS alojará la base de datos MySQL, proporcionando un entorno escalable y gestionado sin tener que preocuparse por la administración de servidores.

  RDS es un servicio gestionado de bases de datos relacionales que soporta múltiples motores de bases de datos, incluido MySQL.
- **Amazon EC2**
  EC2 proporciona instancias de servidores virtuales que permiten ejecutar aplicaciones en la nube. Ofrece escalabilidad, flexibilidad en el uso de recursos, y control total sobre el entorno de ejecución.

  EC2 se utilizará para alojar el backend con Node.js y Express. Esto permitirá ejecutar la lógica del servidor y manejar las solicitudes del frontend y de la base de datos.
- **Amazon S3**
  S3 se usará para almacenar archivos estáticos, como imágenes, videos o archivos subidos por los usuarios, que luego pueden ser servidos a través del frontend o utilizados por el backend.

  S3 es un servicio de almacenamiento de objetos en la nube que permite almacenar y recuperar cualquier cantidad de datos desde cualquier lugar.

## Diagramas de Actividades

1. Registro de usuarios

   ![Registro](https://hackmd.io/_uploads/rJ8sSl02C.png)
2. Inicio se Sesión

   ![Inicio Sesion](https://hackmd.io/_uploads/BJvCrgCh0.png)
3. Recuperar Contraseña

   ![Recuperar Contraseña](https://hackmd.io/_uploads/HJDH8lC30.png)
4. Administrador

   ![Administrador](https://hackmd.io/_uploads/HJ8-OeAnR.png)
5. Empleado

   ![Empleado](https://hackmd.io/_uploads/H1B7ugAhR.png)
6. Carpetas

   ![Carpetas](https://hackmd.io/_uploads/ry59_G6hA.png)
7. Archivos

   ![Archivos](https://hackmd.io/_uploads/SkundzThC.png)
8. Eliminar Carpeta/ Archivo

   ![Eliminar](https://hackmd.io/_uploads/SyletzT3A.png)
9. Vaciar Papelera

   ![vaciar papelera](https://hackmd.io/_uploads/SyGbtfp2R.png)
10. Modificar Perfil

    ![modificar perfil](https://hackmd.io/_uploads/Hy5MKzanR.png)
11. Solicitud de cambio de almacenamiento

    ![expansion](https://hackmd.io/_uploads/BJmStMah0.png)
12. Solicitud de eliminación de cuenta

    ![solicitud eliminacion](https://hackmd.io/_uploads/rJYDKMp3C.png)

## Diagrama de Despliegue

![diagrama de despliegue](https://hackmd.io/_uploads/Hkg-09C30.jpg)

## Arquitectura de Sistemas

**Descripción de la Arquitectura:**

* **Usuarios**
  Los usuarios pueden acceder a la aplicación desde navegadores web o dispositivos móviles.
* **Amazon S3 (Simple Storage Service)**

  * **Bucket de Frontend**:
    Este bucket almacena los archivos estáticos de la aplicación frontend, como HTML, CSS, JavaScript, imágenes, etc.
    Los usuarios acceden directamente a este bucket para cargar la interfaz de la aplicación en sus navegadores.
  * **Bucket de Archivos**:
    Este bucket se utiliza para almacenar archivos que los usuarios suben o descargan, como documentos, imágenes, etc.
    Proporciona un almacenamiento duradero y escalable para archivos de usuario.
* **Amazon EC2 (Elastic Compute Cloud)**

  * **Instancia EC2 para el Backend**:
    Esta instancia de EC2 ejecuta el servidor backend de la aplicación, que maneja la lógica de la aplicación, procesa peticiones de los usuarios, y realiza operaciones con la base de datos.
    El backend se comunica con los buckets de S3 para acceder a los archivos almacenados y con la base de datos para gestionar datos dinámicos.
    Amazon RDS (Relational Database Service):
* **Instancia RDS MySQL**
  Este componente proporciona una base de datos relacional MySQL gestionada, donde se almacenan los datos estructurados de la aplicación, como información de usuarios, registros de actividad, configuraciones, etc.
  El backend se conecta a esta base de datos para realizar operaciones como consultas, inserciones, actualizaciones y eliminaciones.

![[AyD1]Proyecto1](https://hackmd.io/_uploads/rywQ29AhC.jpg)

## Diagrama de Despliegue

**Diagrama de Despliegue:**
Incluir un diagrama de despliegue que detalle la infraestructura en la que se ejecutará la aplicación, como servidores, bases de datos, redes, etc.

## Modelo de Datos

**Modelo Entidad-Relación:**
![Modelo_Relacional](./assets/er-f2.png)

## Seguridad de la Aplicación

1. **Encriptación de Contraseñas:** Todas las contraseñas deben estar encriptadas al almacenarse.
2. **Validación de Emails:** No se deben permitir emails repetidos ni nombres de usuario duplicados.
3. **Control de Accesos:** Las cuentas de administradores y empleados no pueden acceder a los archivos de los clientes.
4. **Autenticación:** Implementación de autenticación robusta para garantizar que los usuarios son quienes dicen ser.
5. **Notificaciones y Confirmaciones por Email:** Confirmación de registro, eliminación de cuenta y cambios en el perfil mediante correos electrónicos seguros.
6. **Backup Cifrado:** El sistema debe permitir la creación de backups cifrados de los archivos de los usuarios, asegurando la protección de los datos sensibles.

### Pruebas de Seguridad

- **Pruebas Unitarias:** Se generarán pruebas unitarias para validar la seguridad del sistema, ejecutadas automáticamente en el ciclo de DevOps.
- **Pruebas Funcionales:** Se realizarán pruebas funcionales para verificar la correcta implementación de las funcionalidades de seguridad.
- **Detección de Errores:** En caso de que las pruebas fallen, el pipeline de DevOps se detendrá para evitar el despliegue de código inseguro.

## Mockups

**Mockups de las Principales Vistas:**

- **Login**
  ![1729904782961](images/README/1729904782961.png)

- **Registro**
  ![1729904803194](images/README/1729904803194.png)

- **Inicio de Administrador**
  ![Admin](./assets/mockup-inicio-admin.png)

- **Inicio de Usuario**
  ![image](./assets/mockup-inicio-cliente.png)

- **Profile**
![image](./assets/mockup-profile.png)

- **Trash**
![image](./assets/mockup-papelera.png)

- **Favoritos**
![image](./assets/mockup-favoritos.png)

- **Compartido Conmigo**
![image](./assets/mockup-shared.png)

## Documentación de Pipelines

**Pipelines para los Servicios:**

  ## 1. CI/CD Pipeline for Backend

Este pipeline está diseñado para realizar las tareas de integración continua y despliegue de un proyecto backend. A continuación se describen los pasos y configuraciones implementadas.

## Pipeline Configuration

- **Nombre**: `CI/CD Pipeline backend`
- **Trigger**: Se ejecuta en los pull requests hacia la rama `main`.

## Jobs

### 1. Build

  - **Runs-on**: `ubuntu-latest`
  - **Steps**:
    - **Checkout code**  
      - Usa: `actions/checkout@v3`
      - Descripción: Clona el repositorio en la máquina virtual.

    - **Set up Node.js 18.x**  
      - Usa: `actions/setup-node@v3`
      - Configuración: `node-version: '18'`
      - Descripción: Instala y configura Node.js versión 18.x.

  - **Set environment variables**  
    - Script:
      ```bash
      cd ./backend
      echo "HOST=${{ secrets.HOST }}" >> .env
      echo "PORT=${{ secrets.PORT }}" >> .env
      echo "DB_HOST=${{ secrets.DB_HOST }}" >> .env
      echo "DB_PORT=${{ secrets.DB_PORT }}" >> .env
      echo "DB_NAME=${{ secrets.DB_NAME }}" >> .env
      echo "DB_USER=${{ secrets.DB_USER }}" >> .env
      echo "DB_PASSWORD=${{ secrets.DB_PASSWORD }}" >> .env
      echo "ACCESS_KEY_ID=${{ secrets.ACCESS_KEY_ID }}" >> .env
      echo "SECRET_ACCESS_KEY=${{ secrets.SECRET_ACCESS_KEY }}" >> .env
      echo "REGION=${{ secrets.REGION }}" >> .env
      echo "BUCKET=${{ secrets.BUCKET }}" >> .env
      echo "FRONT_URL=${{ secrets.FRONT_URL }}" >> .env
      echo "EMAIL_ORIGIN=${{ secrets.EMAIL_ORIGIN }}" >> .env
      echo "APP_KEY=${{ secrets.APP_KEY }}" >> .env
      echo "EMAIL_HOST=${{ secrets.EMAIL_HOST }}" >> .env
      echo "REACT_APP_API_HOST=${{ secrets.REACT_APP_API_HOST }}" >> .env
      ```
    - Descripción: Configura las variables de entorno en el archivo `.env` usando los secretos de GitHub.

  - **Install dependencies**  
    - Script:
      ```bash
      cd ./backend
      npm install
      ```
    - Descripción: Instala las dependencias necesarias del proyecto backend.

  - **Run tests**  
    - Script:
      ```bash
      cd ./backend
      npm test
      ```
    - Descripción: Ejecuta los tests del proyecto para verificar que todo funcione correctamente.

  - **Log in to DockerHub**  
    - Script:
      ```bash
      echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
      ```
    - Descripción: Inicia sesión en DockerHub usando los secretos de GitHub.

  - **Build and push Docker image**  
    - Script:
      ```bash
      cd ./backend
      docker build -t ${{ secrets.DOCKER_USERNAME }}/backend-ayd-image:latest .
      docker push ${{ secrets.DOCKER_USERNAME }}/backend-ayd-image:latest
      ```
    - Descripción: Construye y sube la imagen Docker del backend a DockerHub.

### 2. Deploy

- **Runs-on**: `ubuntu-latest`
- **Dependencies**: Este job depende del job `build`.
- **Steps**:
  - **Run deployment script via SSH**  
    - Usa: `appleboy/ssh-action@v0.1.7`
    - Configuración:
      - `host`: `${{ secrets.EC2_HOST }}`
      - `username`: `${{ secrets.EC2_USER }}`
      - `key`: `${{ secrets.EC2_KEY }}`
      - **Script**:
        ```bash
        docker pull ${{ secrets.DOCKER_USERNAME }}/backend-ayd-image:latest
        docker stop backend-ayd-container || true
        docker rm backend-ayd-container || true
        docker run -d --name backend-ayd-container --env-file /home/ubuntu/ayd/AyD1S2-Proyecto_F1_9/backend/.env -p ${{ secrets.PORT }}:4000 ${{ secrets.DOCKER_USERNAME }}/backend-ayd-image:latest
        ```
    - Descripción: Realiza el despliegue del contenedor Docker en el servidor de producción.

## Notas

- Este pipeline requiere que los secretos estén configurados correctamente en GitHub para evitar fallos en los pasos que dependen de ellos.
- Hay que asegurarse de que el servidor de despliegue tenga configurado el archivo `.env` y los permisos necesarios para Docker.



## 2. CI/CD Pipeline for Frontend

Este pipeline se encarga de realizar las tareas de integración continua y despliegue para el proyecto frontend, específicamente para una aplicación React. A continuación se detallan los pasos y configuraciones.

## Pipeline Configuration

- **Nombre**: `CI/CD Pipeline frontend`
- **Trigger**: Se ejecuta en los pull requests hacia la rama `main`.

## Jobs

### 1. Build

- **Runs-on**: `ubuntu-latest`
- **Steps**:
  - **Checkout code**  
    - Usa: `actions/checkout@v3`
    - Descripción: Clona el repositorio en la máquina virtual.

  - **Set up Node.js**  
    - Usa: `actions/setup-node@v3`
    - Configuración: `node-version: '18'`
    - Descripción: Instala y configura Node.js versión 18.x.

  - **Set environment variables**  
    - Script:
      ```bash
      cd ./frontend/ayd-storage
      echo "REACT_APP_API_HOST=${{ secrets.REACT_APP_API_HOST }}" >> .env
      echo "REACT_APP_S3_URL=${{ secrets.REACT_APP_S3_URL }}" >> .env
      ```
    - Descripción: Configura las variables de entorno necesarias para el frontend en el archivo `.env` usando los secretos de GitHub.

  - **Install dependencies**  
    - Script:
      ```bash
      cd ./frontend/ayd-storage
      npm install
      ```
    - Descripción: Instala las dependencias del proyecto frontend.

  - **Disable CI strict mode**  
    - Script:
      ```bash
      unset CI
      ```
    - Descripción: Desactiva el modo estricto de CI para evitar errores en la compilación de la app de React.

  - **Build React app**  
    - Script:
      ```bash
      cd ./frontend/ayd-storage
      CI=false npm run build
      ```
    - Descripción: Compila la aplicación React para producción.

  - **Upload build artifact**  
    - Usa: `actions/upload-artifact@v3`
    - Configuración:
      - `name`: `react-build-ayd-storage`
      - `path`: `./frontend/ayd-storage/build`
    - Descripción: Sube el artefacto compilado para que esté disponible en el job de despliegue.

### 2. Deploy

- **Runs-on**: `ubuntu-latest`
- **Dependencies**: Este job depende del job `build`.
- **Steps**:
  - **Download build artifact**  
    - Usa: `actions/download-artifact@v3`
    - Configuración:
      - `name`: `react-build-ayd-storage`
      - `path`: `./build`
    - Descripción: Descarga el artefacto compilado de la aplicación React.

  - **Configure AWS credentials**  
    - Usa: `aws-actions/configure-aws-credentials@v2`
    - Configuración:
      - `aws-access-key-id`: `${{ secrets.ACCESS_KEY_ID }}`
      - `aws-secret-access-key`: `${{ secrets.SECRET_ACCESS_KEY }}`
      - `aws-region`: `${{ secrets.REGION }}`
    - Descripción: Configura las credenciales de AWS para realizar el despliegue en S3.

  - **Sync build folder to S3**  
    - Script:
      ```bash
      aws s3 sync ./build s3://${{ secrets.BUCKET_FRONTEND }} --delete
      ```
    - Descripción: Sincroniza el contenido de la carpeta `build` con el bucket de S3 configurado, eliminando archivos obsoletos en el bucket.

## Notas

- Este pipeline requiere que los secretos de AWS y otras configuraciones estén correctamente establecidos en GitHub.
- El bucket S3 configurado en `BUCKET_FRONTEND` debe permitir el acceso a los archivos estáticos para que la aplicación esté disponible públicamente.




