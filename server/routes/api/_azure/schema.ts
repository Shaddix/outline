import { z } from "zod";
import { BaseSchema } from "@server/routes/api/schema";

export const AzureCreateWorkItemSchema = BaseSchema.extend({
  body: z.object({
    /** API Key name */
    title: z.string(),
    assignee: z.string(),
  }),
});
export type AzureCreateWorkItemSchemaReq = z.infer<typeof AzureCreateWorkItemSchema>;


export const APIKeysListSchema = BaseSchema.extend({
  body: z.object({
    /** The owner of the API key */
    userId: z.string().uuid().optional(),
  }),
});

export const AzureGetWorkItemSchema = BaseSchema.extend({
  body: z.object({
    id: z.number(),
  })
});
export type AzureGetWorkItemSchemaReq = z.infer<typeof AzureGetWorkItemSchema>;

export const AzureGetUsersSchema = BaseSchema.extend({
  body: z.object({
    query: z.string(),
  })
});
export type AzureGetUsersSchemaReq = z.infer<typeof AzureGetUsersSchema>;