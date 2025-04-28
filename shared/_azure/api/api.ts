import { client } from "~/utils/ApiClient";
import { GetUserResponseDto } from "./types";
import { ClientData } from "../types";
import { useQuery } from "@tanstack/react-query";
import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";


export async function getWorkItem(id: number) {
    const result = await client.post<ClientData<WorkItem>>('/azureWorkItem.get', { id: id })
    return result;
}

export function useWorkItemQuery(id: number) {
    return useQuery({
        queryFn: () => {
            return getWorkItem(id)
        },
        queryKey: ['workitem', 'get', id]
    })
}


async function getUsers(options: { query?: string }) {
    const result = await client.post<ClientData<GetUserResponseDto>>('/azureWorkItem.users', options);
    return result;
}

export function useUsersQuery(options: { query?: string }) {
    return useQuery({
        queryFn: () => {
            return getUsers(options)
        },
        queryKey: ['users', 'get', options?.query]
    })
}
