import { Client } from '@elastic/elasticsearch';
import { Logger } from 'winston';
import { winstonLogger } from '@nrv23/jobber-shared';
import { ClusterHealthHealthResponseBody } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { config } from '@auth/config';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'authElasticSearchServer','debug');

export const elasticSearchClient = new Client({

    node: `${config.ELASTIC_SEARCH_URL}`
});

export async function connect(): Promise<void> {
    let isConnected: boolean = false; 
    
    while(!isConnected) {
        log.info('AuthService connecting to elasticsearch...');
        try {
            
            const healthResponse: ClusterHealthHealthResponseBody = await elasticSearchClient.cluster.health({});
            log.info(`AuthService ElasticSearch health status - ${healthResponse.status}`);
            isConnected= true;

        } catch (error) {
            log.error('error','Connection to elasticSearch failed. Retrying...');
            log.log('error','AuthService connect() method ', error);
        }
    }
}