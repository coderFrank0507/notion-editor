// --- Nodes ---
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import UniqueID from "@tiptap/extension-unique-id";

// --- Marks ---
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";

// --- Custom Extensions ---
import { Paragraph } from "./paragraph";
import { TaskList } from "./task-list";
import { Placeholder } from "@tiptap/extensions";
import { UiState } from "./ui-state-extension";

export default [
	Document,
	Text,
	Paragraph,
	Bold,
	Italic,
	Underline,
	Strike,
	Code,
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
	UiState,
];
