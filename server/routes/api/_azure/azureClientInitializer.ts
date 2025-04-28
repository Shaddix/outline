import * as azdev from "azure-devops-node-api";
import { IWorkItemTrackingApi } from "azure-devops-node-api/WorkItemTrackingApi";
import Integration from "@server/models/Integration";
import { IntegrationService, IntegrationType } from "@shared/types";
import Logger from "@server/logging/Logger";
import { GetUserResponseDto } from "@shared/_azure/api/types";



export async function getWorkItemClientInternal(organisation: string, token: string): Promise<IWorkItemTrackingApi> {
    const connection = await getConnection(organisation, token);
    return await connection.getWorkItemTrackingApi();
}

async function getConnection(organisation: string, token: string) {
    let authHandler = azdev.getPersonalAccessTokenHandler(token);
    let connection = new azdev.WebApi(`https://dev.azure.com/${organisation}`, authHandler);
    return connection;
}

export async function getAzureIntegration(): Promise<AzureDevOpsSettings> {
    const integration = await Integration.findOne(
        {
            where: { type: IntegrationType.Custom, service: IntegrationService.Azure },
        }
    );
    if (!integration)
        throw new Error('Azure DevOps integration is not configured');


    return integration?.settings as any;
}

export async function getWorkItemClient() {
    const integration = await getAzureIntegration();
    if (!integration) {
        throw new Error('Azure DevOps settings are not initialized');
    }
    const client = await getWorkItemClientInternal(integration?.organisation, integration?.pat);
    return client;
}

function getAzureApiBaseUrl(organisation: string) {
    return `https://vsaex.dev.azure.com/${organisation}/_apis/`;
}

export async function sendAzureRequest<T = any>(options: {
    method: 'GET' | 'POST';
    url: string;
    queryParameters?: string;
}) {
    const azureIntegration = await getAzureIntegration();
    const url = getAzureApiBaseUrl(azureIntegration.organisation) + options.url;
    Logger.info('task', 'URL: ' + url)

    const result = await fetch(url, {
        method: options.method,
        headers: {
            'Authorization': 'Basic ' + btoa(':' + azureIntegration.pat)
        }
    });
    return JSON.parse(await result.text()) as T;
}

export async function getUsers(options?: {
    query?: string;
}): Promise<GetUserResponseDto> {
    if (!options?.query) {
        return {
            continuationToken: null,
            items: [],
            totalCount: 0,
        }
    }

    try {
        const result = await sendAzureRequest<GetUserResponseDto>({
            url: 'userentitlements?' + new URLSearchParams({ ['$filter']: `name eq '${options?.query}'`, ['api-version']: '7.1' }).toString(), method: 'GET'
        })
        return result;
    } catch (e) {
        Logger.error('task', e);
        throw e;
    }


}



type AzureDevOpsSettings = {
    pat: string;
    organisation: string;
}