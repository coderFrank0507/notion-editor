import { useEditor, EditorContent } from "@tiptap/react";
import extensions from "./extensions";
import EditorToolbarFloating from "./editor-toolbar-floating";

import "./styles/notion-editor.scss";
import "./styles/task-list.scss";

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
