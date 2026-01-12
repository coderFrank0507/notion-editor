import { mergeAttributes, Node } from "@tiptap/react";
import type { ParagraphOptions } from "@tiptap/extension-paragraph";

const Paragraph = Node.create<ParagraphOptions>({
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
	addAttributes() {
		return {
			sort: {
				default: null,
			},
		};
	},
	parseHTML() {
		return [{ tag: "p" }];
	},
	renderHTML({ HTMLAttributes }) {
		return ["p", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
	},
	addKeyboardShortcuts() {
		return {
			Enter: ({ editor }) => {
				const { state } = editor;
				const { $from } = state.selection;

				const hasContent = $from.parent.textContent.trim().length > 0;
				if (
					["taskList", "bulletList", "orderedList"].includes($from.parent.type.name) &&
					hasContent
				) {
					const res = editor.commands.insertContent({
						type: $from.parent.type.name,
					});
					return res;
				}

				if ($from.parent.type.name !== "paragraph" && !hasContent) {
					return editor.chain().focus().setNode("paragraph").run();
				} else {
					return false;
				}
			},
		};
	},
});

export default Paragraph;
