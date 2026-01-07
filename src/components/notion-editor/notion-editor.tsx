import { useEditor, EditorContent, EditorContext, useCurrentEditor } from "@tiptap/react";
import extensions from "./extensions";
import EditorToolbarFloating from "./editor-toolbar-floating";
import useUiEditorState from "./hooks/use-ui-editor-state";

// --- Tiptap UI ---
// import { SlashDropdownMenu } from "./ui/slash-dropdown-menu";
import { DragContextMenu } from "./ui/drag-context-menu";

// --- Styles ---
import "./styles/_keyframe-animations.scss";
import "./styles/_variables.scss";
import "./styles/notion-editor.scss";
import "./styles/list-node.scss";
import "./styles/paragraph-node.scss";
import { HeadTools } from "./_dev-tools";

export function EditorContentArea() {
	const { editor } = useCurrentEditor();
	const { isDragging } = useUiEditorState(editor);

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
			<EditorToolbarFloating />
		</EditorContent>
	);
}

export default function NotionEditor() {
	const editor = useEditor({
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: "notion-editor-container",
			},
		},
		extensions,
		content: {
			type: "doc",
			content: [
				{
					type: "paragraph",
					attrs: { id: "a8129dc9-4933-4bae-9708-4b662daeb2d6" },
					content: [
						{
							type: "text",
							text: "hello world",
						},
					],
				},
				{
					type: "paragraph",
					attrs: { id: "a8129dc9-4933-4bae-9708-4b662daeb2d8" },
					content: [
						{
							type: "text",
							text: "frank wang",
						},
					],
				},
			],
		},
	});

	if (!editor) return null;

	return (
		<>
			<HeadTools editor={editor} />
			<EditorContext.Provider value={{ editor }}>
				<EditorContentArea />
			</EditorContext.Provider>
		</>
	);
}
