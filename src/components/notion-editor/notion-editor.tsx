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
import onUpdate from "./lib/onUpdate";

// --- Dev ---
// import { HeadTools } from "./_dev-tools";

interface NotionEditorProps {
	initContent?: (editor: Editor) => void;
	onUpdate?: (data: HandleBlockJson[]) => void;
	onDropEnd?: DragContextMenuProps["handleDropEnd"];
}

export const CacheMap = new Map<string, { sort: number; json: JSONContent }>();

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
		// content: EditorDataJson,
		onUpdate: debounce((props) => onUpdate(props, handleUpdate), 1000),
		onCreate: ({ editor }) => {
			CacheMap.clear();
			const { content } = editor.getJSON();
			if (content.length) {
				for (let i = 0, length = content.length; i < length; i++) {
					const item = content[i];
					try {
						CacheMap.set(item.attrs!.id, { sort: i, json: item });
					} catch (err) {
						console.error(item);
					}
				}
			}
		},
	});

	useEffect(() => {
		if (editor?.isEmpty) initContent?.(editor);
	}, [editor, initContent]);

	if (!editor) return null;

	return (
		<EditorContext.Provider value={{ editor }}>
			<EditorContentArea />
		</EditorContext.Provider>
	);
}
