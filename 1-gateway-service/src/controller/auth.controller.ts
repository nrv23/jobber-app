/* eslint-disable @typescript-eslint/no-explicit-any */


import { Request, Response } from 'express';
import FormData from 'form-data';
import ProxyService, { services } from '@gateway/services/api/proxyRequest';
import BaseError from '@gateway/utils/Error';
//import { omit } from 'lodash';


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
        files.forEach((file: Express.Multer.File) => {
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
      const customeError = this.handleError(error);
      res.status(customeError.getError().statusCode).json({
        message: customeError.getError().message,
        statusCode: customeError.getError().statusCode,
      });
    }
  };

  // nuevas funciones

  siginUser = async (req: Request, res: Response) => {

    try {

      const { body } = req;
      const targetUrl = `${services.auth}signin`;
      // Redirige la solicitud
      const response = await ProxyService.proxyRequest(
        'POST',
        targetUrl,
        body
      );

      res.status(response.status).json(response.data);
    } catch (error) {
      const customeError = this.handleError(error);
      res.status(customeError.getError().statusCode).json({
        message: customeError.getError().message,
        statusCode: customeError.getError().statusCode,
      });
    }
  };

  getRefreshToken = async (req: Request, res: Response) => {
    try {

      const { headers, params } = req;
      const targetUrl = `${services.auth}refresh-token/${params['username']}`;
      const proxyHeaders = {
        ...headers
      };

      // Redirige la solicitud
      const response = await ProxyService.proxyRequest(
        'GET',
        targetUrl,
        proxyHeaders
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      const customeError = this.handleError(error);
      res.status(customeError.getError().statusCode).json({
        message: customeError.getError().message,
        statusCode: customeError.getError().statusCode,
      });
    }
  };

  resetPassword = async (req: Request, res: Response) => {

    try {

      // currentPassword: string, newPassword: string
      const { token } = req.params;
      const targetUrl = `${services.auth}reset-password/${token}`;
      const { body } = req;
      ;
      // Redirige la solicitud
      const response = await ProxyService.proxyRequest(
        'PATCH',
        targetUrl,
        body
      );
      res.status(response.status).json(response.data);

    } catch (error) {
      const customeError = this.handleError(error);
      res.status(customeError.getError().statusCode).json({
        message: customeError.getError().message,
        statusCode: customeError.getError().statusCode,
      });
    }
  };

  //
  forgotPassword = async (req: Request, res: Response) => {

    try {

      // currentPassword: string, newPassword: string
      const targetUrl = `${services.auth}forgot-password`;
      const { body } = req;

      // Redirige la solicitud
      const response = await ProxyService.proxyRequest(
        'PATCH',
        targetUrl,
        body
      );
      res.status(response.status).json(response.data);

    } catch (error) {
      const customeError = this.handleError(error);
      res.status(customeError.getError().statusCode).json({
        message: customeError.getError().message,
        statusCode: customeError.getError().statusCode,
      });
    }
  };


  //
  verifyEmail = async (req: Request, res: Response) => {


    try {
      // token: string
      // /verify-email
      // put
      const targetUrl = `${services.auth}verify-email`;
      const { body } = req;

      // Redirige la solicitud
      const response = await ProxyService.proxyRequest(
        'PATCH',
        targetUrl,
        body
      );
      res.status(response.status).json(response.data);

    } catch (error) {
      const customeError = this.handleError(error);
      res.status(customeError.getError().statusCode).json({
        message: customeError.getError().message,
        statusCode: customeError.getError().statusCode,
      });
    }
  };

  verifyOTP = async (req: Request, res: Response) => {


    try {

      // const response: AxiosResponse = await axiosAuthInstance.put(`/verify-otp/${otp}`, body);
      //response;
      // otp: string, body: { browserName: string, deviceType: string }

      const { body, headers, params } = req;
      const targetUrl = `${services.auth}verify-email/${params['otp']}`;
      const form = new FormData();
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
        'PUT',
        targetUrl,
        form,
        proxyHeaders
      );
      res.status(response.status).json(response.data);

    } catch (error) {
      const customeError = this.handleError(error);
      res.status(customeError.getError().statusCode).json({
        message: customeError.getError().message,
        statusCode: customeError.getError().statusCode,
      });
    }
  };

  resendEmail = async (req: Request, res: Response) => {
    //const response: AxiosResponse = await axiosAuthInstance.post('/resend-email', data);
    // data: { userId: number, email: string }
    //response;

    try {
      const { body } = req;
      const targetUrl = `${services.auth}resend-email`;

      // Redirige la solicitud
      const response = await ProxyService.proxyRequest(
        'PATCH',
        targetUrl,
        body
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.log({ error });
      const customeError = this.handleError(error);
      res.status(customeError.getError().statusCode).json({
        message: customeError.getError().message,
        statusCode: customeError.getError().statusCode,
      });
    }
  };


  changePassword = async (req: Request, res: Response) => {

    try {

      // currentPassword: string, newPassword: string
      const targetUrl = `${services.auth}change-password`;
      const { body } = req;

      // Redirige la solicitud
      const response = await ProxyService.proxyRequest(
        'PATCH',
        targetUrl,
        body
      );
      res.status(response.status).json(response.data);

    } catch (error) {
      const customeError = this.handleError(error);
      res.status(customeError.getError().statusCode).json({
        message: customeError.getError().message,
        statusCode: customeError.getError().statusCode,
      });
    }
  };
  // nuevas funciones
  getCurrentUser = async (req: Request, res: Response) => {
    try {
      const { headers } = req;
      const targetUrl = `${services.auth}current-user`;
      // Redirige la solicitud
      const response = await ProxyService.proxyRequest(
        'GET',
        targetUrl, {}, {
        'Authorization': headers['authorization']
      }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      const customeError = this.handleError(error);
      res.status(customeError.getError().statusCode).json({
        message: customeError.getError().message,
        statusCode: customeError.getError().statusCode,
      });
    }
  };

  private handleError(error: any) {
    const customeError = new BaseError({
      message: error.response.statusText || 'Error desconocido',
      statusCode: error.response?.status || 500,
      commingFrom: 'gateway Service'
    });

    return customeError;
  }
}


export default new AuthController();