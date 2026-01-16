import { mergeAttributes, Node } from "@tiptap/react";
import type { ParagraphOptions } from "@tiptap/extension-paragraph";
import { splitBlock } from "prosemirror-commands";

const Paragraph = Node.create<ParagraphOptions>({
	name: "paragraph",
	group: "block",
	content: "inline*",

	addOptions() {
		return {
			HTMLAttributes: {
				"data-type": "paragraph",
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
				if (["taskList", "bulletList", "orderedList"].includes($from.parent.type.name)) {
					if (hasContent) {
						return editor.commands.insertContent({
							type: $from.parent.type.name,
						});
					} else {
						return editor.chain().focus().setNode("paragraph").run();
					}
				}
				return editor.commands.createParagraphNear();
			},
		};
	},
});

export default Paragraph;
