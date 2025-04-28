import { MutableRefObject } from "react";
import useStores from "~/hooks/useStores";
import DialogsStore from "~/stores/DialogsStore";


export const AzureWidget = (props: {
    dialogsRef: MutableRefObject<DialogsStore>
}) => {
    const { dialogs } = useStores();
    props.dialogsRef.current = dialogs;
    return null;
}

export default AzureWidget;