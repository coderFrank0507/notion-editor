import { mergeAttributes, Node } from "@tiptap/react";
import type { ParagraphOptions } from "@tiptap/extension-paragraph";

export const Paragraph = Node.create<ParagraphOptions>({
	name: "paragraph",
	group: "block",
	content: "inline*",

	addOptions() {
		return {
			HTMLAttributes: {
				"data-type": "paragraph",
				class: "paragraph",
			},
		};
	},
	// addAttributes() {
	// 	return {
	// 		"data-type": "paragraph",
	// 		class: "paragraph",
	// 	};
	// },
	parseHTML() {
		return [{ tag: "div" }];
	},
	renderHTML({ HTMLAttributes }) {
		return ["div", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
	},
	addKeyboardShortcuts() {
		return {
			Enter: ({ editor }) => {
				const { state } = editor;
				const { $from } = state.selection;

				const hasContent = $from.parent.textContent.trim().length > 0;
				if ($from.parent.type.name === "task-list" && hasContent) {
					return editor.commands.insertContent({
						type: "task-list",
					});
				}

				if ($from.parent.type.name !== "paragraph") {
					return editor.chain().focus().setNode("paragraph").run();
				} else {
					return false;
				}
			},
		};
	},
});
