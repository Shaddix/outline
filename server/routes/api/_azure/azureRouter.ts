import Router from "koa-router";
import { UserRole } from "@shared/types";
import auth from "@server/middlewares/authentication";
import { transaction } from "@server/middlewares/transaction";
import validate from "@server/middlewares/validate";
import { APIContext, AuthenticationType } from "@server/types";
import * as T from "./schema";
import { getUsers, getWorkItemClient } from "./azureClientInitializer";

const router = new Router();



router.post(
    "azureWorkItem.create",
    auth({ role: UserRole.Member, type: AuthenticationType.APP }),
    validate(T.AzureCreateWorkItemSchema),
    transaction(),
    async (ctx: APIContext<T.AzureCreateWorkItemSchemaReq>) => {
        const { title, assignee } = ctx.input.body;

        const client = await getWorkItemClient();
        const data = [{
            "op": "add",
            "path": "/fields/System.Title",
            "from": null,
            "value": title,
        }];
        if (assignee) {
            data.push({
                "op": "add",
                "path": "/fields/System.AssignedTo",
                "from": null,
                "value": assignee,
            })
        }
        const wi = await client.createWorkItem(null, data, "Unicorn", "Task");
        ctx.body = {
            data: wi,
        };
    }
);
router.post(
    "azureWorkItem.get",
    auth({ role: UserRole.Member, type: AuthenticationType.APP }),
    validate(T.AzureGetWorkItemSchema),
    transaction(),
    async (ctx: APIContext<T.AzureGetWorkItemSchemaReq>) => {
        const { id } = ctx.input.body;

        const client = await getWorkItemClient();
        const wi = await client.getWorkItem(id);
        ctx.body = {
            data: wi,
        };
    }
);
router.post(
    "azureWorkItem.users",
    auth({ role: UserRole.Member, type: AuthenticationType.APP }),
    validate(T.AzureGetUsersSchema),
    transaction(),
    async (ctx: APIContext<T.AzureGetUsersSchemaReq>) => {
        const { query } = ctx.input.body as any;
        ctx.body = {
            data: await getUsers({
                query: query
            }),
        };
    }
);

export default router;