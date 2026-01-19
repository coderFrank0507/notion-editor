import { useEffect, useLayoutEffect, useState } from "react";
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

// --- Lib ---
import { dispatchOrderedListRefresh } from "./lib/utils";
import { debounce } from "lodash-es";
import onUpdate, { eventInfo } from "./lib/on-update";
import onDrop from "./lib/on-drop";
import { ImageUploadNodeOptions } from "./extensions/image-upload-node";
import { BlockSortMap } from "./extensions/block-sort";
import type { HandleBlockJson } from "./lib/content-utils";

// --- i18n ---
import { LangContext, type LangKey, useLanguage } from "./i18n";

// --- Styles ---
import "./styles/_keyframe-animations.scss";
import "./styles/_variables.scss";
import "./styles/notion-editor.scss";
import "./styles/list-node.scss";
import "./styles/paragraph-node.scss";
import "./styles/heading-node.scss";
import "./styles/code-block-node.scss";

export interface NotionEditorProps {
	lang?: LangKey;
	/** editor 内容为空时才会执行 */
	initContent?: () => Promise<JSONContent[]>;
	onUpdate?: (data: HandleBlockJson[]) => void;
	onDropEnd?: (data: HandleBlockJson[]) => void;
	uploadImageConfig?: Omit<ImageUploadNodeOptions, "HTMLAttributes">;
}

export const CacheMap = new Map<string, JSONContent>();

export function EditorContentArea({ lang }: NotionEditorProps) {
	const { t } = useLanguage();
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

	if (!editor) return <span>Error: {t("editor_error")}</span>;

	return (
		<>
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
		</>
	);
}

export default function NotionEditor(props: NotionEditorProps) {
	const {
		// lang = "zh-CN",
		onUpdate: handleUpdate,
		initContent,
		onDropEnd,
		uploadImageConfig,
	} = props;

	const [lang, setLang] = useState<LangKey>("zh-CN");

	const editor = useEditor({
		immediatelyRender: false,
		editorProps: {
			attributes: {
				id: "notion-editor-container",
			},
		},
		extensions: createExtensions({ uploadImageConfig, lang }),
		onUpdate: debounce(props => onUpdate(props, handleUpdate), 1000),
		onDrop: (_, slice) => {
			if (!slice || !onDropEnd) return;
			onDrop(slice, editor, onDropEnd);
		},
	});

	useLayoutEffect(() => {
		if (editor?.isEmpty) {
			initContent?.().then(result => {
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
		<>
			<div className="flex gap-4">
				<button onClick={() => setLang("zh-CN")}>zh-CN</button>
				<button onClick={() => setLang("en")}>En</button>
			</div>
			<LangContext.Provider value={{ lang }}>
				<EditorContext.Provider value={{ editor }}>
					<EditorContentArea {...props} lang={lang} />
				</EditorContext.Provider>
			</LangContext.Provider>
		</>
	);
}
