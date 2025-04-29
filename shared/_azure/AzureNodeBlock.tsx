import { NodeSpec, NodeType } from "prosemirror-model";
import { Command, EditorState, Transaction } from "prosemirror-state";
import * as React from "react";
import { Primitive } from "utility-types";
import toggleWrap from "../editor/commands/toggleWrap";
import Node from "../editor/nodes/Node";
import { css } from "styled-components";
import { ComponentProps } from "@shared/editor/types";
import { WidgetProps } from "@shared/editor/lib/Extension";
import DialogsStore from "~/stores/DialogsStore";
import { wrapIn } from "prosemirror-commands";

export const AzureNodeStyles = () => css`
.azureSomething {
    background-color: rgb(237, 242, 247);
}`
const obj = {
  current: null! as DialogsStore,
};
export default class AzureBlock extends Node {
  get name() {
    return "azure_block";
  }

  get rulePlugins() {
    return [];
  }

  get schema(): NodeSpec {
    return {
      attrs: {
        taskId: {
          default: undefined,
        },
        style: {
          default: "tip",
        },
      },
      group: "block",
      defining: true,
      draggable: true,
      parseDOM: [

      ],
      toDOM: (node) => {
        return [
          "div",
          { class: `azure-block`, style: 'border: 1px;' },
        ];
      },
    };
  }

  component = (props: ComponentProps) => {
    const Component = React.lazy(() => import('./AzureNodeComponent'));
    return <Component taskId={props.node.attrs.taskId} />;
  }

  commands({ type }: { type: NodeType }) {
    // return () => (state, dispatch) => { alert('zxc'); return true; };
    const CreateAzureTaskModal = React.lazy(() => import('./CreateAzureTaskModal'));
    return {
      azure_alert: (): Command => (state, dispatch) => { alert('zxc'); return false; },
      azure_create_task: (attrs: Record<string, Primitive>): Command => {
        return (state, dispatch) => {
          obj.current.openModal({
            title: 'Create Task',
            content: <React.Suspense fallback=""><CreateAzureTaskModal onCreated={(wi) => {
              attrs['taskId'] = wi.id!;
              dispatch?.(
                state.tr.insert(state.tr.selection.from, type.create(attrs))
              );
            }} /></React.Suspense>,

          })

          return false;
        }
      },
      azure_reference_task: (attrs: Record<string, Primitive>): Command => (state, dispatch) => {
        const result = prompt('Enter work item id')
        if (!result)
          return false;
        const taskId = parseInt(result);
        if (!taskId) {
          alert('Entered value is not a number');
          return false;
        }

        attrs['taskId'] = taskId;
        dispatch?.(
          state.tr.insert(state.tr.selection.from, type.create(attrs))
        );
        return true;
      },
    };
  }


  widget(_props: WidgetProps): React.ReactElement | undefined {
    const Component = React.lazy(() => import('./AzureWidget'));

    return <Component dialogsRef={obj} />;

  }
  // inputRules({ type }: { type: NodeType }) {
  //   return [wrappingInputRule(/^:::$/, type)];
  // }

  // toMarkdown(state: MarkdownSerializerState, node: ProsemirrorNode) {
  //   state.write("\n:::" + (node.attrs.style || "info") + "\n");
  //   state.renderContent(node);
  //   state.ensureNewLine();
  //   state.write(":::");
  //   state.closeBlock(node);
  // }

  // parseMarkdown() {
  //   return {
  //     block: "container_notice",
  //     getAttrs: (tok: Token) => ({ style: tok.info }),
  //   };
  // }
}
