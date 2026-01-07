import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import UniqueID from "@tiptap/extension-unique-id";
import { Paragraph } from "./paragraph";
import { TaskList } from "./task-list";
import { Placeholder } from "@tiptap/extensions";

export default [
	Document,
	Text,
	Paragraph,
	TaskList,
	Placeholder.configure({
		placeholder: ({ node }) => {
			if (node.type.name === "task-list") {
				return "Task Item";
			}
			return "Write something …";
		},
	}),
	UniqueID.configure({
		types: ["heading", "paragraph", "task-list"],
	}),
];
