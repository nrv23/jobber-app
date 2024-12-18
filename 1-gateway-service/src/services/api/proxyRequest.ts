/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosRequestConfig, Method } from 'axios';
import { config } from '@gateway/config';
import BaseError from '@gateway/utils/Error';
import { Logger } from 'winston';
import { winstonLogger } from '@nrv23/jobber-shared';

export const services: Record<string, string> = {
  auth: config.configProperties.AUTH_BASE_URL!,
  notifications: config.configProperties.NOITFICATION_BASE_URL!,
};

const log: Logger = winstonLogger(`${config.configProperties.ELASTIC_SEARCH_URL}`, 'Authentication Server', 'debug');

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
      const customeError = this.handleError(error);
      log.log('error', `AuthenticationService proxyRequest method() ${customeError.getError().comingFrom}`, customeError);
      throw error;
    }
  }

  private handleError(error: any) {
    const customeError = new BaseError({
      message: error.message || 'Error desconocido',
      statusCode: error.response?.status || 500,
      commingFrom: 'gateway Service proxyRequest() Method'
    });

    return customeError;
  }
}

export default new ProxyService();