import { Client } from '@elastic/elasticsearch';
import { Logger } from 'winston';
import { winstonLogger } from '@nrv23/jobber-shared';
import { ClusterHealthHealthResponseBody } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';

import { config } from './config';

const log: Logger = winstonLogger(`${config.configProperties.ELASTIC_SEARCH_URL}`,'notifiactionElasticSearchServer','debug');

const elasticSearchClient = new Client({

    node: `${config.configProperties.ELASTIC_SEARCH_URL}`
});

export async function connect(): Promise<void> {
    let isConnected: boolean = false; 

    while(!isConnected) {
        try {
            
            const healthResponse: ClusterHealthHealthResponseBody = await elasticSearchClient.cluster.health({});
            log.info(`NotificationService ElasticSearch health status - ${healthResponse.status}`);
            isConnected= true;

        } catch (error) {
            log.error('error','Connection to elasticSearch failed. Retrying...');
            log.log('error','NotificationService connect() method ', error);
        }
    }
}