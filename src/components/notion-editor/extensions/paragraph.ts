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
				console.log($from.parent.type.name, this.name);
				// 只在 myBlock 内生效
				if ($from.parent.type.name !== this.name) {
					return false;
				}
				// this.options.HTMLAttributes["data-type"] = "text";
				return editor.commands.insertContent({
					type: "task-list",
				});
			},
		};
	},
});
