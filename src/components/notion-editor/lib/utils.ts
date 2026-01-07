import { Editor } from "@tiptap/core";
import { NodeSelection } from "@tiptap/pm/state";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const MAC_SYMBOLS: Record<string, string> = {
	mod: "⌘",
	command: "⌘",
	meta: "⌘",
	ctrl: "⌃",
	control: "⌃",
	alt: "⌥",
	option: "⌥",
	shift: "⇧",
	backspace: "Del",
	delete: "⌦",
	enter: "⏎",
	escape: "⎋",
	capslock: "⇪",
} as const;

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Checks if a value is a valid number (not null, undefined, or NaN)
 * @param value - The value to check
 * @returns boolean indicating if the value is a valid number
 */
export function isValidPosition(pos: number | null | undefined): pos is number {
	return typeof pos === "number" && pos >= 0;
}

/**
 * Determines if the current platform is macOS
 * @returns boolean indicating if the current platform is Mac
 */
export function isMac(): boolean {
	return typeof navigator !== "undefined" && navigator.platform.toLowerCase().includes("mac");
}

/**
 * Formats a shortcut key based on the platform (Mac or non-Mac)
 * @param key - The key to format (e.g., "ctrl", "alt", "shift")
 * @param isMac - Boolean indicating if the platform is Mac
 * @param capitalize - Whether to capitalize the key (default: true)
 * @returns Formatted shortcut key symbol
 */
export const formatShortcutKey = (key: string, isMac: boolean, capitalize: boolean = true) => {
	if (isMac) {
		const lowerKey = key.toLowerCase();
		return MAC_SYMBOLS[lowerKey] || (capitalize ? key.toUpperCase() : key);
	}

	return capitalize ? key.charAt(0).toUpperCase() + key.slice(1) : key;
};

/**
 * Parses a shortcut key string into an array of formatted key symbols
 * @param shortcutKeys - The string of shortcut keys (e.g., "ctrl-alt-shift")
 * @param delimiter - The delimiter used to split the keys (default: "-")
 * @param capitalize - Whether to capitalize the keys (default: true)
 * @returns Array of formatted shortcut key symbols
 */
export const parseShortcutKeys = (props: {
	shortcutKeys: string | undefined;
	delimiter?: string;
	capitalize?: boolean;
}) => {
	const { shortcutKeys, delimiter = "+", capitalize = true } = props;

	if (!shortcutKeys) return [];

	return shortcutKeys
		.split(delimiter)
		.map((key) => key.trim())
		.map((key) => formatShortcutKey(key, isMac(), capitalize));
};

/**
 * Checks if a mark exists in the editor schema
 * @param markName - The name of the mark to check
 * @param editor - The editor instance
 * @returns boolean indicating if the mark exists in the schema
 */
export const isMarkInSchema = (markName: string, editor: Editor | null): boolean => {
	if (!editor?.schema) return false;
	return editor.schema.spec.marks.get(markName) !== undefined;
};

/**
 * Determines whether the current selection contains a node whose type matches
 * any of the provided node type names.
 * @param editor Tiptap editor instance
 * @param nodeTypeNames List of node type names to match against
 * @param checkAncestorNodes Whether to check ancestor node types up the depth chain
 */
export function isNodeTypeSelected(
	editor: Editor | null,
	nodeTypeNames: string[] = [],
	checkAncestorNodes: boolean = false
): boolean {
	if (!editor || !editor.state.selection) return false;

	const { selection } = editor.state;
	if (selection.empty) return false;

	// Direct node selection check
	if (selection instanceof NodeSelection) {
		const selectedNode = selection.node;
		return selectedNode ? nodeTypeNames.includes(selectedNode.type.name) : false;
	}

	// Depth-based ancestor node check
	if (checkAncestorNodes) {
		const { $from } = selection;
		for (let depth = $from.depth; depth > 0; depth--) {
			const ancestorNode = $from.node(depth);
			if (nodeTypeNames.includes(ancestorNode.type.name)) {
				return true;
			}
		}
	}

	return false;
}
