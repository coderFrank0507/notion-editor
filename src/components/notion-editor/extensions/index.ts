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
import { BulletList } from "./bullet-list";
import { OrderedList } from "./ordered-list";
import { ClearNodeSelectionAfterDrop } from "./ClearNodeSelectionAfterDrop";

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
	BulletList,
	OrderedList,
	Dropcursor.configure({
		width: 2,
	}),
	Placeholder.configure({
		placeholder: ({ node }) => {
			const { type } = node;
			if (type.name === "task-list") return "Task Item";
			if (type.name === "bullet-list") return "Bullet Item";
			return "Write something …";
		},
	}),
	UniqueID.configure({
		types: ["heading", "paragraph", "task-list", "ordered-list", "bullet-list"],
	}),
	UiState,
	ClearNodeSelectionAfterDrop,
];
