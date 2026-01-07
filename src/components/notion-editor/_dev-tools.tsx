import { Editor } from "@tiptap/core";

interface HeadToolsProps {
	editor: Editor;
}

export function HeadTools({ editor }: HeadToolsProps) {
	return (
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
			<button
				onClick={() => {
					editor.chain().focus().setNode("bullet-list").run();
				}}
			>
				bullet-list
			</button>
			<button
				onClick={() => {
					editor.chain().focus().setNode("ordered-list").run();
				}}
			>
				ordered-list
			</button>
		</div>
	);
}
