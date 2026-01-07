// --- Nodes ---
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import UniqueID from "@tiptap/extension-unique-id";
import { Paragraph } from "./paragraph";

// --- Marks ---
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";

// --- Funcionlity ---
import { Placeholder } from "@tiptap/extensions";
import { Dropcursor } from "@tiptap/extensions";

// --- Custom Extensions ---
import { TaskList } from "./task-list";
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
	Dropcursor.configure({
		width: 2,
	}),
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
