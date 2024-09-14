// Propósito: Controlador de ejemplo para mostrar el funcionamiento de la API
import configurations from "../utils/configurations.mjs";

const ejemplo = (req, res) => {
    return res.status(200).json({ "status": 200, "message": "API Funcionando correctamente " + configurations.host + ":" + configurations.port });
}

export const test = { ejemplo };