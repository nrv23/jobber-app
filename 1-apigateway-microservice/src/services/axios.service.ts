import { config } from '@gateway/config';
import axios from 'axios';
import { sign } from 'jsonwebtoken';


export class AxiosService {

    public axios: ReturnType<typeof axios.create>;

    constructor(base_url: string, serviceName: string) {
        this.axios = this.axiosCreateInstance(base_url, serviceName);
    }


    public axiosCreateInstance(baseUrl:string, serviceName?:string): ReturnType<typeof axios.create> {
        let gatewayToken = '';

        if(serviceName) {
            gatewayToken = sign({id: serviceName}, `${config.configProperties.GATEWAY_JWT_TOKEN}`);
        }
        const instance : ReturnType<typeof axios.create>= axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                gatewayToken
            },
            withCredentials: true
        });

        return instance;
    }
}