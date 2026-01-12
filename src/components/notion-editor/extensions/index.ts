// import StarterKit from "@tiptap/starter-kit";

// --- Tiptap Core Extensions ---
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import UniqueID from "@tiptap/extension-unique-id";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Paragraph from "./paragraph";
import HardBreak from "@tiptap/extension-hard-break";
import CodeBlock from "@tiptap/extension-code-block";
import History from "@tiptap/extension-history";
import TextAlign from "@tiptap/extension-text-align";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import { Placeholder, Selection } from "@tiptap/extensions";
import { Dropcursor } from "@tiptap/extensions";
import { Color, TextStyle } from "@tiptap/extension-text-style";

// --- Custom Extensions ---
import { TaskList } from "./task-list";
import { UiState } from "./ui-state-extension";
import { BulletList } from "./bullet-list";
import { OrderedList } from "./ordered-list";
import { ClearSelectionDropEnd } from "./plugins";
import { Image } from "./image-node/image-node-extension";
import { NodeBackground } from "./node-background-extension";
import { ImageUploadNode } from "./image-upload-node/image-upload-node-extension";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "../lib/utils";

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
	HardBreak,
	Selection,
	Typography,
	Color,
	TextStyle,
	UiState,
	Image,
	NodeBackground,
	ClearSelectionDropEnd,
	Heading.extend({
		addAttributes() {
			return {
				level: { default: null },
				sort: { default: null },
			};
		},
	}),
	CodeBlock.extend({
		addAttributes() {
			return {
				sort: { default: null },
			};
		},
	}),
	Highlight.configure({ multicolor: true }),
	TextAlign.configure({ types: ["heading", "paragraph", "taskList", "orderedList", "bulletList"] }),
	Dropcursor.configure({
		width: 2,
	}),
	History.configure({
		depth: 50,
		newGroupDelay: 500,
	}),
	ImageUploadNode.configure({
		accept: "image/*",
		maxSize: MAX_FILE_SIZE,
		limit: 3,
		upload: handleImageUpload,
		onError: (error) => console.error("Upload failed:", error),
	}),
	Placeholder.configure({
		placeholder: ({ node }) => {
			const { type } = node;
			if (type.name === "task-list") return "Task Item";
			if (type.name === "bullet-list") return "Bullet Item";
			return "Write, type '/' for commands…";
		},
	}),
	UniqueID.configure({
		types: [
			"heading",
			"paragraph",
			"taskList",
			"orderedList",
			"bulletList",
			"horizontalRule",
			"image",
			"codeBlock",
		],
	}),
];
