import type { Node as PMNode } from "@tiptap/pm/model";
import { Editor } from "@tiptap/core";
import { AllSelection, NodeSelection, PluginKey, TextSelection } from "@tiptap/pm/state";
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

export const SR_ONLY = {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: 0,
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	borderWidth: 0,
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

/**
 * Finds a node at the specified position with error handling
 * @param editor The Tiptap editor instance
 * @param position The position in the document to find the node
 * @returns The node at the specified position, or null if not found
 */
export function findNodeAtPosition(editor: Editor, position: number) {
	try {
		const node = editor.state.doc.nodeAt(position);
		if (!node) {
			console.warn(`No node found at position ${position}`);
			return null;
		}
		return node;
	} catch (error) {
		console.error(`Error getting node at position ${position}:`, error);
		return null;
	}
}

/**
 * Finds the position and instance of a node in the document
 * @param props Object containing editor, node (optional), and nodePos (optional)
 * @param props.editor The Tiptap editor instance
 * @param props.node The node to find (optional if nodePos is provided)
 * @param props.nodePos The position of the node to find (optional if node is provided)
 * @returns An object with the position and node, or null if not found
 */
export function findNodePosition(props: {
	editor: Editor | null;
	node?: PMNode | null;
	nodePos?: number | null;
}): { pos: number; node: PMNode } | null {
	const { editor, node, nodePos } = props;

	if (!editor || !editor.state?.doc) return null;

	// Zero is valid position
	const hasValidNode = node !== undefined && node !== null;
	const hasValidPos = isValidPosition(nodePos);

	if (!hasValidNode && !hasValidPos) {
		return null;
	}

	// First search for the node in the document if we have a node
	if (hasValidNode) {
		let foundPos = -1;
		let foundNode: PMNode | null = null;

		editor.state.doc.descendants((currentNode, pos) => {
			// TODO: Needed?
			// if (currentNode.type && currentNode.type.name === node!.type.name) {
			if (currentNode === node) {
				foundPos = pos;
				foundNode = currentNode;
				return false;
			}
			return true;
		});

		if (foundPos !== -1 && foundNode !== null) {
			return { pos: foundPos, node: foundNode };
		}
	}

	// If we have a valid position, use findNodeAtPosition
	if (hasValidPos) {
		const nodeAtPos = findNodeAtPosition(editor, nodePos!);
		if (nodeAtPos) {
			return { pos: nodePos!, node: nodeAtPos };
		}
	}

	return null;
}

/**
 * Checks if a node exists in the editor schema
 * @param nodeName - The name of the node to check
 * @param editor - The editor instance
 * @returns boolean indicating if the node exists in the schema
 */
export const isNodeInSchema = (nodeName: string, editor: Editor | null): boolean => {
	if (!editor?.schema) return false;
	return editor.schema.spec.nodes.get(nodeName) !== undefined;
};

/**
 * Check whether the current selection is fully within nodes
 * whose type names are in the provided `types` list.
 *
 * - NodeSelection → checks the selected node.
 * - Text/AllSelection → ensures all textblocks within [from, to) are allowed.
 */
export function selectionWithinConvertibleTypes(editor: Editor, types: string[] = []): boolean {
	if (!editor || types.length === 0) return false;

	const { state } = editor;
	const { selection } = state;
	const allowed = new Set(types);

	if (selection instanceof NodeSelection) {
		const nodeType = selection.node?.type?.name;
		return !!nodeType && allowed.has(nodeType);
	}

	if (selection instanceof TextSelection || selection instanceof AllSelection) {
		let valid = true;
		state.doc.nodesBetween(selection.from, selection.to, (node) => {
			if (node.isTextblock && !allowed.has(node.type.name)) {
				valid = false;
				return false; // stop early
			}
			return valid;
		});
		return valid;
	}

	return false;
}

export const OrderedRefreshKey = new PluginKey<{
	from: number;
	to: number;
} | null>("ordered-refresh");

export function dispatchOrderedListRefresh(editor: Editor) {
	const view = editor.view;
	const tr = view.state.tr;
	tr.setMeta(OrderedRefreshKey, {
		from: 0,
		to: editor.state.doc.content.size,
	});

	view.dispatch(tr);
}
