/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosRequestConfig, Method } from 'axios';
import { config } from '@gateway/config';

export const services: Record<string, string> = {
  auth: config.configProperties.AUTH_BASE_URL!,
  notifications: config.configProperties.NOITFICATION_BASE_URL!,
};

/**
 * Proxy dinámico para redirigir solicitudes al microservicio adecuado.
 */
class ProxyService {
  /**
   * Redirige cualquier solicitud HTTP
   */
  public async proxyRequest(
    method: Method,
    targetUrl: string,
    data?: any,
    headers?: Record<string, any>
  ) {
    try {
      const config: AxiosRequestConfig = {
        method,
        url: targetUrl,
        headers,
        data,
      };

      const response = await axios.request(config);
      return response;
    } catch (error) {
      console.error(`Error en la solicitud ${method} a ${targetUrl}:`, error);
      throw error;
    }
  }
}

export default new ProxyService();