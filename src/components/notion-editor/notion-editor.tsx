import { useEffect, useLayoutEffect } from "react";
import {
	useEditor,
	EditorContent,
	EditorContext,
	useCurrentEditor,
	type JSONContent,
} from "@tiptap/react";
import { createExtensions } from "./extensions";
import EditorToolbarFloating from "./editor-toolbar-floating";
import useUiEditorState from "./hooks/use-ui-editor-state";

// --- Tiptap UI ---
import { SlashDropdownMenu } from "./ui/slash-dropdown-menu";
import { DragContextMenu } from "./ui/drag-context-menu";

// --- Styles ---
import "./styles/_keyframe-animations.scss";
import "./styles/_variables.scss";
import "./styles/notion-editor.scss";
import "./styles/list-node.scss";
import "./styles/paragraph-node.scss";
import "./styles/heading-node.scss";
import "./styles/code-block-node.scss";

// --- Lib ---
import { dispatchOrderedListRefresh } from "./lib/utils";
import { debounce } from "lodash-es";
import onUpdate, { eventInfo } from "./lib/on-update";
import onDrop from "./lib/on-drop";
import type { HandleBlockJson } from "./lib/content-utils";
import { ImageUploadNodeOptions } from "./extensions/image-upload-node";
import { BlockSortMap } from "./extensions/block-sort";

export interface NotionEditorProps {
	/** editor 内容为空时才会执行 */
	initContent?: () => Promise<JSONContent[]>;
	onUpdate?: (data: HandleBlockJson[]) => void;
	onDropEnd?: (data: HandleBlockJson[]) => void;
	uploadImageConfig?: Omit<ImageUploadNodeOptions, "HTMLAttributes">;
}

export const CacheMap = new Map<string, JSONContent>();

export function EditorContentArea() {
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
			<DragContextMenu />
			<SlashDropdownMenu />
			<EditorToolbarFloating />
		</EditorContent>
	);
}

export default function NotionEditor({
	onUpdate: handleUpdate,
	initContent,
	onDropEnd,
	uploadImageConfig,
}: NotionEditorProps) {
	const editor = useEditor({
		immediatelyRender: false,
		editorProps: {
			attributes: {
				id: "notion-editor-container",
			},
		},
		extensions: createExtensions({ uploadImageConfig }),
		onUpdate: debounce((props) => onUpdate(props, handleUpdate), 1000),
		onDrop: (_, slice) => {
			if (!slice || !onDropEnd) return;
			onDrop(slice, editor, onDropEnd);
		},
	});

	useLayoutEffect(() => {
		if (editor?.isEmpty) {
			initContent?.().then((result) => {
				if (result.length) {
					CacheMap.clear();
					BlockSortMap.clear();
					for (let i = 0, length = result.length; i < length; i++) {
						const item = result[i];
						try {
							CacheMap.set(item.attrs!.id, item);
							BlockSortMap.set(item.attrs!.id, item.attrs!.sort);
						} catch (err) {
							console.error(err);
						}
					}
					editor.commands.setContent({ type: "doc", content: result });
					eventInfo.canUpdate = false;
				}
			});
		}
	}, [editor]);

	if (!editor) return null;

	return (
		<EditorContext.Provider value={{ editor }}>
			<EditorContentArea />
		</EditorContext.Provider>
	);
}
