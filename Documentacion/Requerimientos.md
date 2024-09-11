## Requerimientos Funcionales

#### 1. Creación de Cuentas

- **RF001** : Creación de Cuentas
  - **Descripción**: Los clientes podrán crear sus usuarios desde un apartado de registro, se debe de almacenar la información básica del cliente.
  - **Métricas**:
    - Tiempo medio para crear una cuenta: < 5 minutos.
    - Porcentaje de operaciones exitosas de creación de cuentas: 100%.

- **RF002** : Registro e Inicio de Sesión
  - **Descripción**: Los empleados, clientes y administradores deben poder iniciar sesión en la plataforma.
  - **Métricas**:
    - Tiempo medio de inicio de sesión: < 30 segundos.
    - Tasa de éxito de inicio de sesión (sin errores): 99.9%.

- **RF003**: Actualización de Perfil
  - **Descripción**: Los usuarios deben poder actualizar su perfil.
  - **Métricas**:
    - Tiempo medio para actualizar el perfil: < 2 minutos.
    - Porcentaje de actualizaciones de perfil exitosas: 100%.
---
#### 2. Roles y Permisos

- **RF004**: Acceso de Administradores
  - **Descripción**: Los administradores tienen acceso completo a la gestion de todos los usuarios del sistema, configurar cuentas, reportes y estadisticas.
  - **Métricas**:
    - Tiempo de respuesta al intentar acceder a funcionalidades administrativas: < 2 segundos.
    - Porcentaje de accesos exitosos a funcionalidades administrativas: 100%.

- **RF005**: Acceso de Empleados
  - **Descripción**: Los empleados pueden gestionar usuarios cliente y configuración de cuentas.
  - **Métricas**:
    - Tiempo medio para realizar una operación de gestión de cuentas o usuarios: < 10 segundos.
    - Porcentaje de asccesos exitosos a funcionalidades de empleados: 99.5%.

- **RF006**: Acceso de Clientes
  - **Descripción**: A los clientes se debe mostrar su explorador de archivos, junto con una gráfica que marque cuánto espacio está siendo ocupado en su cuenta, en este podrá navegar y localizar sus archivos.
  - **Métricas**:
    - Tiempo medio para visualizar su explorador: < 3 segundos.
    - Porcentaje de accesos exitosos a su cuenta: 99.9%.
---
#### 3. Usuarios Administradores

- **RF007**: Creación de usuarios tipo cliente y empleado
  - **Descripción**: Los administradores podran crear usuarios de tipo cliente y empleado.
  - **Métricas**:
    - Tiempo medio para crear un usuario: < 2 minutos.
    - Porcentaje de creacion de usuarios : 99.9%.

- **RF008**: Modificación de cuentas
  - **Descripción**: Modificacion del espacio de almacenamiento asignado a una cuenta.
  - **Métricas**:
    - Tiempo medio para realizar una modificacion: < 30 segundos.
    - Si el espacio ocupado supera al espacio reducido no podrá efectuarse la reducción
    - Porcentaje de modificaciones exitosas : 99.9%.

- **RF009**: Eliminacion de cuentas
  - **Descripción**: Las eliminaciones de cuentas además de ser solicitadas desde el perfil del usuario, el administrador podrá eliminarlas dando un aviso al usuario por medio de correo electrónico, de no iniciar sesión en un periodo de 1 mes se procederá a eliminar la cuenta, esta acción debe eliminar toda la información de la cuenta del usuario sin eliminar al usuario(esta acción es irreversible).
  - **Métricas**:
    - Tiempo medio para realizar una eliminacion: < 3 segundos.
    - Se debe validar que pasen 30 dias para realizar la eliminacion definitiva de la cuenta.
    - Se debe notificar por correo electronico la alerta de eliminación.
    - Porcentaje de notificaciones exitosas : 99.9%.
    - Porcentaje de eliminaciones exitosas : 100.00%.

- **RF010**: Creacion de cuentas post-eliminación.
  - **Descripción**: Si un usuario desea crear una cuenta después de haber eliminado la que ya se le había proporcionado esta se creará vacía.
  - **Métricas**:
  - La cuenta nueva que cree el usuario estará vacía.
---
#### 4. Gestión de Carpetas y Archivos

- **RF001**: Creación de Carpetas
  - **Descripción**: Los usuarios podrán crear nuevas carpetas en su espacio de almacenamiento.
  - **Métricas**:
    - Tiempo medio para crear una carpeta: < 1 minuto.
    - Porcentaje de operaciones exitosas de creación de carpetas: 100%.

- **RF002**: Eliminación de Carpetas
  - **Descripción**: Los usuarios podrán eliminar carpetas, y estas serán enviadas a la papelera.
  - **Métricas**:
    - Tiempo medio para eliminar una carpeta: < 1 minuto.
    - Porcentaje de operaciones exitosas de eliminación de carpetas: 100%.

- **RF003**: Modificación de Carpetas
  - **Descripción**: Los usuarios podrán modificar las propiedades de las carpetas existentes.
  - **Métricas**:
    - Tiempo medio para modificar una carpeta: < 1 minuto.
    - Porcentaje de modificaciones exitosas: 100%.

- **RF004**: Subida de Archivos
  - **Descripción**: Los usuarios podrán subir archivos a sus carpetas.
  - **Métricas**:
    - Tiempo medio para subir un archivo: < 2 minutos.
    - Porcentaje de operaciones exitosas de subida de archivos: 100%.

- **RF005**: Descarga de Archivos
  - **Descripción**: Los usuarios podrán descargar archivos de sus carpetas.
  - **Métricas**:
    - Tiempo medio para descargar un archivo: < 2 minutos.
    - Porcentaje de operaciones exitosas de descarga de archivos: 100%.

- **RF006**: Eliminación de Archivos
  - **Descripción**: Los usuarios podrán eliminar archivos, y estos serán enviados a la papelera.
  - **Métricas**:
    - Tiempo medio para eliminar un archivo: < 1 minuto.
    - Porcentaje de operaciones exitosas de eliminación de archivos: 100%.

- **RF007**: Modificación de Archivos
  - **Descripción**: Los usuarios podrán modificar archivos existentes en sus carpetas.
  - **Métricas**:
    - Tiempo medio para modificar un archivo: < 2 minutos.
    - Porcentaje de modificaciones exitosas: 100%.

- **RF008**: Vaciamiento de la Papelera
  - **Descripción**: Los usuarios podrán vaciar la papelera, lo cual es una acción irreversible.
  - **Métricas**:
    - Tiempo medio para vaciar la papelera: < 1 minuto.
    - Porcentaje de vaciamiento exitoso: 100%.
---
#### 5. Gestión de Perfil y Espacio

- **RF009**: Modificación de Datos del Perfil
  - **Descripción**: Los usuarios podrán actualizar su perfil con nueva información.
  - **Métricas**:
    - Tiempo medio para actualizar el perfil: < 2 minutos.
    - Porcentaje de actualizaciones exitosas: 100%.

- **RF010**: Solicitud de Expansión o Reducción de Espacio
  - **Descripción**: Los usuarios podrán solicitar la expansión o reducción del espacio de almacenamiento en su cuenta.
  - **Métricas**:
    - Tiempo medio para procesar una solicitud de expansión o reducción: < 1 hora.
    - Porcentaje de solicitudes procesadas exitosamente: 100%.

- **RF011**: Eliminación de Cuenta
  - **Descripción**: Los usuarios podrán solicitar la eliminación de su cuenta, la cual es irreversible y requiere confirmación por correo.
  - **Métricas**:
    - Tiempo medio para procesar una solicitud de eliminación: < 24 horas.
    - Porcentaje de confirmaciones por correo exitosas: 100%.
    - Porcentaje de eliminaciones exitosas: 100%.
---
#### 6. Compartición de Archivos y Carpetas

- **RF012**: Compartición de Archivos y Carpetas
  - **Descripción**: Los usuarios podrán compartir archivos y carpetas con otros usuarios mediante correo o nombre de usuario.
  - **Métricas**:
    - Tiempo medio para compartir un archivo o carpeta: < 2 minutos.
    - Porcentaje de operaciones de compartición exitosas: 100%.

- **RF013**: Creación de Carpeta de Compartidos Conmigo
  - **Descripción**: Se creará una carpeta de "Compartidos Conmigo" cuando al menos un usuario comparta un archivo con el usuario.
  - **Métricas**:
    - Tiempo medio para crear la carpeta de compartidos conmigo: < 1 minuto.
    - Porcentaje de creación exitosa: 100%.

- **RF014**: Visualización del Propietario
  - **Descripción**: Se mostrará quién es el propietario del archivo o carpeta.
  - **Métricas**:
    - Tiempo medio para mostrar el propietario: < 1 minuto.
    - Porcentaje de operaciones exitosas: 100%.

- **RF015**: Restricciones de Modificación
  - **Descripción**: Solo el propietario de un archivo o carpeta podrá modificar o eliminar el contenido.
  - **Métricas**:
    - Tiempo medio para validar permisos de modificación: < 1 minuto.
    - Porcentaje de permisos validados correctamente: 100%.

- **RF016**: Acceso a Archivos y Carpetas Compartidos
  - **Descripción**: Los usuarios con permisos podrán acceder a los archivos y carpetas compartidos con ellos.
  - **Métricas**:
    - Tiempo medio para acceder a archivos o carpetas compartidos: < 2 minutos.
    - Porcentaje de accesos exitosos: 100%.

- **RF017**: Eliminación de Archivos y Carpetas Compartidos
  - **Descripción**: Los archivos y carpetas compartidos pueden ser eliminados por el propietario. La eliminación será definitiva.
  - **Métricas**:
    - Tiempo medio para eliminar un archivo o carpeta compartido: < 2 minutos.
    - Porcentaje de eliminaciones exitosas: 100%.
    
- **RF018**: Notificaciones de Compartición
  - **Descripción**: Los usuarios recibirán una notificación cuando un archivo o carpeta sea compartida con ellos.
  - **Métricas**:
    - Tiempo medio para enviar una notificación de compartición: < 1 minuto.
    - Porcentaje de notificaciones enviadas exitosamente: 100%.
---
### Requerimientos No Funcionales
**Descripción:**  
Lista de requerimientos no funcionales del sistema, tales como seguridad, rendimiento, usabilidad, etc. Incluir cómo se medirá su cumplimiento.

#### Seguridad: 
•	Las contraseñas de los usuarios deben estar encriptadas.
•	El sistema debe implementar confirmación por correo electrónico para nuevas cuentas.
•	Se requiere autenticación para acceder al sistema.
#### Usabilidad: 
•	La interfaz debe ser amigable e intuitiva para el usuario.
•	Debe haber una opción de "olvidé contraseña" en la página de inicio de sesión.
#### Escalabilidad: 
•	El sistema debe soportar diferentes paquetes de almacenamiento (15GB, 50GB, 150GB).
•	Debe permitir la expansión o reducción del espacio de almacenamiento de las cuentas.
#### Disponibilidad: 
•	Los usuarios deben poder acceder a sus archivos desde cualquier parte del mundo.
#### Rendimiento: 
•	El sistema debe ser capaz de previsualizar archivos (PDF, imágenes, música, videos).
#### Integridad de datos: 
•	El sistema debe garantizar la integridad del almacenamiento de los usuarios.
#### Privacidad: 
•	Los roles administrativos no deben tener acceso a los archivos de los usuarios.
#### Interoperabilidad: 
•	El sistema debe manejar archivos de cualquier tipo.
#### Capacidad: 
•	El sistema debe poder manejar múltiples usuarios y sus respectivos archivos.
#### Mantenibilidad: 
•	El sistema debe permitir la gestión de usuarios y cuentas por parte de los administradores.
 #### Recuperabilidad: 
•	Los usuarios deben poder crear un backup cifrado de sus archivos.
#### Cumplimiento: 
•	El sistema debe enviar notificaciones por correo electrónico para acciones importantes (confirmación de cuenta, eliminación de cuenta, etc.).
#### Localización: 
•	El sistema debe manejar información de usuarios de diferentes países y nacionalidades.

