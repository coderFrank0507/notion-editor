// --- Nodes ---
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import UniqueID from "@tiptap/extension-unique-id";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Paragraph from "./paragraph";
import HardBreak from "@tiptap/extension-hard-break";

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
import { ClearSelectionDropEnd } from "./plugins";

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
	HorizontalRule,
	Heading,
	HardBreak,
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
		types: ["heading", "paragraph", "taskList", "orderedList", "bulletList", "horizontalRule"],
	}),
	UiState,
	ClearSelectionDropEnd,
];
