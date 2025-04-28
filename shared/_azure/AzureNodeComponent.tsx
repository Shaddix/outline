import React from "react";
import { useWorkItemQuery } from "./api/api";


export const AzureNodeComponent = (props: { taskId: number }) => {
    const workItemQuery = useWorkItemQuery(props.taskId);
    const data = workItemQuery.data?.data;
    return <div>#{props.taskId} {workItemQuery.isLoading ? "...loading" : workItemQuery.isError ? 'error' : <><a target="_blank" href={data?._links['html']?.href}>{data?.fields?.['System.Title']}</a> - {data?.fields?.['System.State']}</>}</div>
}


export default AzureNodeComponent;
