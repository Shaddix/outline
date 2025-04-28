import find from "lodash/find";
import { observer } from "mobx-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useTranslation, Trans } from "react-i18next";
import { toast } from "sonner";
import { IntegrationType, IntegrationService } from "@shared/types";
import Integration from "~/models/Integration";
import SettingRow from "~/scenes/Settings/components/SettingRow";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import GoogleIcon from "~/components/Icons/GoogleIcon";
import Input from "~/components/Input";
import Scene from "~/components/Scene";
import Text from "~/components/Text";
import useStores from "~/hooks/useStores";

type FormData = {
  pat: string;
  organisation: string;
};

function Azure() {

  const { integrations } = useStores();
  const { t } = useTranslation();

  const integration = find(integrations.orderedData, {
    type: IntegrationType.Custom,
    service: IntegrationService.Azure,
  }) as Integration<IntegrationType.Custom> | undefined;

  const {
    register,
    reset,
    handleSubmit: formHandleSubmit,
    formState,
  } = useForm<FormData>({
    mode: "all",
    defaultValues: {
      pat: integration?.settings.pat,
      organisation: integration?.settings.organisation,
    },
  });

  React.useEffect(() => {
    void integrations.fetchPage({
      type: IntegrationType.Custom,
    });
  }, [integrations]);

  React.useEffect(() => {
    reset({
      pat: integration?.settings.pat,
      organisation: integration?.settings.organisation,
    });
  }, [integration, reset]);

  const handleSubmit = React.useCallback(
    async (data: FormData) => {
      try {
        if (data.pat) {
          await integrations.save({
            id: integration?.id,
            type: IntegrationType.Custom,
            service: IntegrationService.Azure,
            settings: {
              pat: data.pat,
              organisation: data.organisation,
            } as Integration<IntegrationType.Custom>["settings"],
          });
        } else {
          await integration?.delete();
        }

        toast.success(t("Settings saved"));
      } catch (err) {
        toast.error(err.message);
      }
    },
    [integrations, integration, t]
  );

  return (
    <Scene title="Azure DevOps" icon={<GoogleIcon />}>
      <Heading>Azure DevOps</Heading>

      <Text as="p" type="secondary">
        <Trans>
          Configure a Azure DevOps installation.
        </Trans>
      </Text>
      <form onSubmit={formHandleSubmit(handleSubmit)}>
        <SettingRow
          label={"Personal Access Token"}
          name="pat"
          description={t(
            "Personal access token for your Azure DevOps instance"
          )}
          border={false}
        >
          <Input
            required
            placeholder=""
            {...register("pat")}
          />
        </SettingRow>
        <SettingRow
          label={"Organisation"}
          name="pat"
          description={t(
            "Name of organisation in Azure DevOps (e.g. 'prismacode')"
          )}
          border={false}
        >
          <Input
            required
            placeholder=""
            {...register("organisation")}
          />
        </SettingRow>
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? `${t("Saving")}…` : t("Save")}
        </Button>
      </form>
    </Scene>
  );




}

export default observer(Azure);
