import { useEffect } from "react";
import {
	useEditor,
	EditorContent,
	EditorContext,
	useCurrentEditor,
	type JSONContent,
	type Editor,
} from "@tiptap/react";
import extensions from "./extensions";
import EditorToolbarFloating from "./editor-toolbar-floating";
import useUiEditorState from "./hooks/use-ui-editor-state";
import type { Node } from "@tiptap/pm/model";

// --- Tiptap UI ---
import { SlashDropdownMenu } from "./ui/slash-dropdown-menu";
import { DragContextMenu, DragContextMenuProps } from "./ui/drag-context-menu";

// --- Styles ---
import "./styles/_keyframe-animations.scss";
import "./styles/_variables.scss";
import "./styles/notion-editor.scss";
import "./styles/list-node.scss";
import "./styles/paragraph-node.scss";
import "./styles/heading-node.scss";
import "./styles/code-block-node.scss";
import "./styles/tailwind.css";

import { dispatchOrderedListRefresh } from "./lib/utils";
import { HandleBlockJson } from "./lib/content-utils";
import { debounce } from "lodash-es";
import onUpdate, { eventInfo } from "./lib/onUpdate";
import { generateBaseIndex } from "./lib/generate-unique-sort";

// --- Dev ---
// import { HeadTools } from "./_dev-tools";

export interface NotionEditorProps {
	initContent?: (editor: Editor) => JSONContent[];
	onUpdate?: (data: HandleBlockJson[]) => void;
	onDropEnd?: DragContextMenuProps["handleDropEnd"];
}

export const CacheMap = new Map<string, JSONContent>();

export function EditorContentArea({ onDropEnd }: NotionEditorProps) {
	const { editor } = useCurrentEditor();
	const { isDragging } = useUiEditorState(editor);

	useEffect(() => {
		const containerDom = document.querySelector("#notion-editor-container");
		const observer = new MutationObserver(() => {
			dispatchOrderedListRefresh(editor);
		});
		if (containerDom) {
			observer.observe(containerDom, {
				childList: true,
				subtree: false,
			});
		}
		return () => {
			observer.disconnect();
		};
	}, [editor]);

	if (!editor) return <span>Error: editor instance is null</span>;

	return (
		<EditorContent
			editor={editor}
			role="presentation"
			id="notion-editor-content"
			style={{
				cursor: isDragging ? "grabbing" : "auto",
			}}
		>
			<DragContextMenu handleDropEnd={onDropEnd} />
			<SlashDropdownMenu />
			<EditorToolbarFloating />
		</EditorContent>
	);
}

export default function NotionEditor({ onUpdate: handleUpdate, initContent }: NotionEditorProps) {
	const editor = useEditor({
		immediatelyRender: false,
		editorProps: {
			attributes: {
				id: "notion-editor-container",
			},
		},
		extensions,
		onUpdate: debounce((props) => onUpdate(props, handleUpdate), 1000),
		onDrop: (event, slice) => {
			if (!slice) return;

			const blocks: Node[] = [];

			slice.content.forEach((node) => {
				if (node.isBlock) {
					blocks.push(node);
					eventInfo.draggedBlockId = node.attrs.id;
				}
			});

			setTimeout(() => {
				const jsonContent = editor.getJSON();
				jsonContent.content.forEach((node, index) => {
					// console.log(index, node.attrs.id, eventInfo.draggedBlockId);
					if (node.attrs?.id === eventInfo.draggedBlockId) {
						const prev = jsonContent.content[index - 1];
						const next = jsonContent.content[index + 1];
						const left = prev?.attrs.sort;
						const right = next?.attrs.sort;
						node.attrs.sort = generateBaseIndex(left, right);
						console.log("node: ", node);
					}
				});
			});
			// console.log("blocks: ", blocks);
		},
	});

	useEffect(() => {
		if (editor?.isEmpty && initContent) {
			const result = initContent(editor);
			console.log("init result: ", result);
			if (result.length) {
				CacheMap.clear();
				for (let i = 0, length = result.length; i < length; i++) {
					const item = result[i];
					try {
						CacheMap.set(item.attrs!.id, item);
					} catch (err) {
						console.error(item);
					}
				}
				editor.commands.setContent({
					type: "doc",
					content: result,
				});
				eventInfo.canUpdate = false;
			}
		}
	}, [editor, initContent]);

	if (!editor) return null;

	return (
		<EditorContext.Provider value={{ editor }}>
			<EditorContentArea />
		</EditorContext.Provider>
	);
}
