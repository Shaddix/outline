import React, { useMemo, useState } from "react";
import useStores from "~/hooks/useStores";
import { toast } from "sonner";
import Button from "~/components/Button";
import Flex from "~/components/Flex";
import Input from "~/components/Input";
import { useForm } from "react-hook-form";
import { client } from "~/utils/ApiClient";
import type { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { ClientData } from "./types";
import FilterOptions from "~/components/FilterOptions";
import { useUsersQuery } from "./api/api";

type CreateAzureTaskForm = {
    assignee: string;
    assigneeId: string;
    title: string;
}
export const CreateAzureTaskModal = (props: {
    onCreated?: (wi: WorkItem) => void
}) => {
    const { dialogs } = useStores();

    const [selectedUser, setSelectedUser] = useState<{ label: string; key: string; } | undefined>()
    const form = useForm<CreateAzureTaskForm>({
        mode: "all",
    });

    const handleSubmit = React.useCallback(
        async (data: CreateAzureTaskForm) => {

            try {
                const dto = {
                    title: data.title,
                    assignee: selectedUser?.key,
                };
                const result = await client.post<ClientData<WorkItem>>('/azureWorkItem.create', dto);
                props.onCreated?.(result.data);
                dialogs.closeAllModals();

            } catch (err) {
                toast.error(err.message);
            } finally {
            }
        },
        [selectedUser]
    );
    const [userFilter, setUserFilter] = useState('');
    const assigneesQuery = useUsersQuery({ query: userFilter });
    const options = useMemo(() => {
        const queryResult = assigneesQuery.data?.data?.items?.map(x => ({ label: x.user.displayName, key: x.user.principalName })) ?? [];
        if (selectedUser && !queryResult.find(x => x.key === selectedUser.key)) {
            queryResult.push(selectedUser);
        }
        return queryResult;
    }, [assigneesQuery.data]);
    return (
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Flex gap={12} column>
                <FilterOptions
                    defaultLabel="Assignee"
                    options={options}
                    fetchQuery={async (options) => {
                        setUserFilter(options.query)
                        return []
                    }}

                    selectedKeys={[selectedUser?.key]}

                    onSelect={function (key: string | null | undefined): void {
                        setSelectedUser(options.find(x => x.key === key))
                    }}
                    showFilter={true}
                />
                <Input
                    type="text"
                    label={"Title"}
                    required
                    flex
                    {...form.register('title')}
                />

                <Flex justify="flex-end">
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                    >
                        Create
                    </Button>
                </Flex>
            </Flex>
        </form>
    );
}

export default CreateAzureTaskModal;