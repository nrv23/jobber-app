import { winstonLogger } from '@nrv23/jobber-shared';
import { Logger } from 'winston';
import { config } from '@gateway/config';
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';

const log: Logger = winstonLogger(`${config.configProperties.ELASTIC_SEARCH_URL}`, 'apiGatewayElasticConnection', 'debug');


class ElasticSearch {

    private elasticSearchClient: Client;

    constructor( ) {
        this.elasticSearchClient =  new Client({

            node: `${config.configProperties.ELASTIC_SEARCH_URL}` // donde se muestran los logs
        });
    }

    public async checkConnection(): Promise<void> {

        let isConnected: boolean = false;

        while(!isConnected) {
            log.info('GatewayService Connecting to ElasticSearch ');
            try {
                const healthResponse: ClusterHealthResponse = await this.elasticSearchClient.cluster.health({});
                log.info(`GatewayService ElasticSearch health status - ${healthResponse.status}`);
                isConnected = true;
            } catch (error) {
                log.info('Connection with elasticSearch failed... Retrying');
                log.log('error','GatewayService checkConnection() method error',error);
            }
        }
    }
}

export const elasticSearch: ElasticSearch = new ElasticSearch();