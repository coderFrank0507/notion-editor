"use client";

import { useCallback } from "react";
import type { Editor } from "@tiptap/react";

// --- Icons ---
import { CodeBlockIcon } from "../../icons/code-block-icon";
import { HeadingOneIcon } from "../../icons/heading-one-icon";
import { HeadingTwoIcon } from "../../icons/heading-two-icon";
import { HeadingThreeIcon } from "../../icons/heading-three-icon";
import { ImageIcon } from "../../icons/image-icon";
import { ListIcon } from "../../icons/list-icon";
import { ListOrderedIcon } from "../../icons/list-ordered-icon";
import { BlockquoteIcon } from "../../icons/blockquote-icon";
import { ListTodoIcon } from "../../icons/list-todo-icon";
import { TypeIcon } from "../../icons/type-icon";

// --- Lib ---
import { isNodeInSchema } from "../../lib/utils";

// --- Tiptap UI ---
import type { SuggestionItem } from "../../ui-utils/suggestion-menu";

export interface SlashMenuConfig {
	enabledItems?: SlashMenuItemType[];
	customItems?: SuggestionItem[];
	itemGroups?: {
		[key in SlashMenuItemType]?: string;
	};
	showGroups?: boolean;
}

const texts = {
	// Style
	text: {
		title: "Text",
		subtext: "Regular text paragraph",
		keywords: ["p", "paragraph", "text"],
		badge: TypeIcon,
		group: "Style",
	},
	heading_1: {
		title: "Heading 1",
		subtext: "Top-level heading",
		keywords: ["h", "heading1", "h1"],
		badge: HeadingOneIcon,
		group: "Style",
	},
	heading_2: {
		title: "Heading 2",
		subtext: "Key section heading",
		keywords: ["h2", "heading2", "subheading"],
		badge: HeadingTwoIcon,
		group: "Style",
	},
	heading_3: {
		title: "Heading 3",
		subtext: "Subsection and group heading",
		keywords: ["h3", "heading3", "subheading"],
		badge: HeadingThreeIcon,
		group: "Style",
	},
	bullet_list: {
		title: "Bullet List",
		subtext: "List with unordered items",
		keywords: ["ul", "li", "list", "bulletlist", "bullet list"],
		badge: ListIcon,
		group: "Style",
	},
	ordered_list: {
		title: "Numbered List",
		subtext: "List with ordered items",
		keywords: ["ol", "li", "list", "numberedlist", "numbered list"],
		badge: ListOrderedIcon,
		group: "Style",
	},
	task_list: {
		title: "To-do list",
		subtext: "List with tasks",
		keywords: ["tasklist", "task list", "todo", "checklist"],
		badge: ListTodoIcon,
		group: "Style",
	},
	code_block: {
		title: "Code Block",
		subtext: "Code block with syntax highlighting",
		keywords: ["code", "pre"],
		badge: CodeBlockIcon,
		group: "Style",
	},

	// Upload
	image: {
		title: "Image",
		subtext: "Resizable image with caption",
		keywords: ["image", "imageUpload", "upload", "img", "picture", "media", "url"],
		badge: ImageIcon,
		group: "Upload",
	},
};

export type SlashMenuItemType = keyof typeof texts;

const getItemImplementations = () => {
	return {
		// Style
		text: {
			check: (editor: Editor) => isNodeInSchema("paragraph", editor),
			action: ({ editor }: { editor: Editor }) => {
				editor.chain().focus().setParagraph().run();
			},
		},
		heading_1: {
			check: (editor: Editor) => isNodeInSchema("heading", editor),
			action: ({ editor }: { editor: Editor }) => {
				editor.chain().focus().toggleHeading({ level: 1 }).run();
			},
		},
		heading_2: {
			check: (editor: Editor) => isNodeInSchema("heading", editor),
			action: ({ editor }: { editor: Editor }) => {
				editor.chain().focus().toggleHeading({ level: 2 }).run();
			},
		},
		heading_3: {
			check: (editor: Editor) => isNodeInSchema("heading", editor),
			action: ({ editor }: { editor: Editor }) => {
				editor.chain().focus().toggleHeading({ level: 3 }).run();
			},
		},
		bullet_list: {
			check: (editor: Editor) => isNodeInSchema("bulletList", editor),
			action: ({ editor }: { editor: Editor }) => {
				editor.chain().focus().toggleBulletList("bulletList").run();
			},
		},
		ordered_list: {
			check: (editor: Editor) => isNodeInSchema("orderedList", editor),
			action: ({ editor }: { editor: Editor }) => {
				editor.chain().focus().toggleOrderedList("orderedList").run();
			},
		},
		task_list: {
			check: (editor: Editor) => isNodeInSchema("taskList", editor),
			action: ({ editor }: { editor: Editor }) => {
				editor.chain().focus().toggleTaskList("taskList").run();
			},
		},
		code_block: {
			check: (editor: Editor) => isNodeInSchema("codeBlock", editor),
			action: ({ editor }: { editor: Editor }) => {
				editor.chain().focus().toggleNode("codeBlock", "paragraph").run();
			},
		},

		// Upload
		image: {
			check: (editor: Editor) => isNodeInSchema("image", editor),
			action: ({ editor }: { editor: Editor }) => {
				editor
					.chain()
					.focus()
					.insertContent({
						type: "imageUpload",
					})
					.run();
			},
		},
	};
};

function organizeItemsByGroups(items: SuggestionItem[], showGroups: boolean): SuggestionItem[] {
	if (!showGroups) {
		return items.map((item) => ({ ...item, group: "" }));
	}

	const groups: { [groupLabel: string]: SuggestionItem[] } = {};

	// Group items
	items.forEach((item) => {
		const groupLabel = item.group || "";
		if (!groups[groupLabel]) {
			groups[groupLabel] = [];
		}
		groups[groupLabel].push(item);
	});

	// Flatten groups in order (this maintains the visual order for keyboard navigation)
	const organizedItems: SuggestionItem[] = [];
	Object.entries(groups).forEach(([, groupItems]) => {
		organizedItems.push(...groupItems);
	});

	return organizedItems;
}

/**
 * Custom hook for slash dropdown menu functionality
 */
export function useSlashDropdownMenu(config?: SlashMenuConfig) {
	const getSlashMenuItems = useCallback(
		(editor: Editor) => {
			const items: SuggestionItem[] = [];

			const enabledItems = config?.enabledItems || (Object.keys(texts) as SlashMenuItemType[]);
			const showGroups = config?.showGroups !== false;

			const itemImplementations = getItemImplementations();

			enabledItems.forEach((itemType) => {
				const itemImpl = itemImplementations[itemType];
				const itemText = texts[itemType];

				if (itemImpl && itemText && itemImpl.check(editor)) {
					const item: SuggestionItem = {
						onSelect: ({ editor }) => itemImpl.action({ editor }),
						...itemText,
					};

					if (config?.itemGroups?.[itemType]) {
						item.group = config.itemGroups[itemType];
					} else if (!showGroups) {
						item.group = "";
					}

					items.push(item);
				}
			});

			if (config?.customItems) {
				items.push(...config.customItems);
			}

			// Reorganize items by groups to ensure keyboard navigation works correctly
			return organizeItemsByGroups(items, showGroups);
		},
		[config]
	);

	return {
		getSlashMenuItems,
		config,
	};
}
