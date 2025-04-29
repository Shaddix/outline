import React from "react";
import { useWorkItemQuery } from "./api/api";


export const AzureNodeComponent = (props: { taskId: number }) => {
    const workItemQuery = useWorkItemQuery(props.taskId);
    const data = workItemQuery.data?.data;
    return <div className="azureSomething">{data ? <a target="_blank" href={data?._links['html']?.href}>#{props.taskId}</a> : <>#{props.taskId}</>} {workItemQuery.isLoading ? "...loading" : workItemQuery.isError ? 'error' : <>{data?.fields?.['System.Title']} - {data?.fields?.['System.State']}</>}</div>
}


export default AzureNodeComponent;
