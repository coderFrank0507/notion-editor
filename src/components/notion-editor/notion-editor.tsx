import { useEditor, EditorContent, EditorContext, useCurrentEditor } from "@tiptap/react";
import extensions from "./extensions";
import EditorToolbarFloating from "./editor-toolbar-floating";

// --- Styles ---
import "./styles/_keyframe-animations.scss";
import "./styles/_variables.scss";
import "./styles/notion-editor.scss";
import "./styles/task-list.scss";

export function EditorContentArea() {
	const { editor } = useCurrentEditor();

	if (!editor) return <span>Error: editor instance is null</span>;

	return (
		<div>
			<div className="flex gap-4">
				<button
					onClick={() => {
						editor.chain().focus().setNode("paragraph").run();
					}}
				>
					paragraph
				</button>
				<button
					onClick={() => {
						editor.chain().focus().setNode("task-list").run();
					}}
				>
					task-list
				</button>
			</div>
			<EditorContent
				editor={editor}
				role="presentation"
				id="notion-editor-content"
				// style={{
				// 	cursor: isDragging ? "grabbing" : "auto",
				// }}
			>
				<EditorToolbarFloating />
			</EditorContent>
		</div>
	);
}

export default function NotionEditor() {
	const editor = useEditor({
		immediatelyRender: false,
		// editorProps: {
		// 	attributes: {
		// 		class: "notion-editor",
		// 	},
		// },
		extensions,
	});

	if (!editor) return null;

	return (
		<EditorContext.Provider value={{ editor }}>
			<EditorContentArea />
		</EditorContext.Provider>
	);
}
