/* eslint-disable @typescript-eslint/no-explicit-any */


import { Request, Response } from 'express';
import FormData from 'form-data';
import ProxyService, {services} from '@gateway/services/api/proxyRequest';


/**
 * Maneja el registro con imagen
 */

class AuthController {

  registerUser = async (req: Request, res: Response) => {
    const { body, files, headers } = req;
  
    // Define la URL de destino
    const targetUrl = `${services.auth}signup`;
  
    try {
      // Configura FormData
      const form = new FormData();
  
      // Adjunta los archivos
      if (files && Array.isArray(files)) {
        files.forEach((file: any) => {
          form.append('image', file.buffer, file.originalname);
        });
      }
  
      // Adjunta otros campos del cuerpo
      for (const key in body) {
        form.append(key, body[key]);
      }
  
      // Configura los encabezados
      const proxyHeaders = {
        ...headers,
        ...form.getHeaders(),
      };
  
      // Redirige la solicitud
      const response = await ProxyService.proxyRequest(
        'POST',
        targetUrl,
        form,
        proxyHeaders
      );
  
      res.status(response.status).json(response.data);
    } catch (error: any) {
      console.log({error});
      res.status(error.response?.status || 500).json({
        message: 'Error en el registro',
        error: error.message || 'Error desconocido',
      });
    }
  };
}


export default new AuthController();