"use client";

import { useCallback, useEffect, useState } from "react";
import { useCurrentEditor, type Editor } from "@tiptap/react";
import { useHotkeys } from "react-hotkeys-hook";

import { useIsBreakpoint } from "../../hooks/use-is-breakpoint";

// --- Lib ---
import { isMarkInSchema, isNodeTypeSelected, selectCurrentBlockContent } from "../../lib/utils";

// --- Icons ---
import { TextColorSmallIcon } from "../../icons/text-color-small-icon";

export const COLOR_TEXT_SHORTCUT_KEY = "mod+shift+t";

export interface ColorItem {
	label: string;
	flag: string;
	value: string;
	border: string;
}

export const TEXT_COLORS: ColorItem[] = [
	{
		label: "Default text",
		flag: "default",
		value: "var(--tt-c-t)",
		border: "var(--tt-c-t-c)",
	},
	{
		label: "Gray text",
		flag: "gray",
		value: "var(--tt-c-t-gray)",
		border: "var(--tt-c-t-gray-c)",
	},
	{
		label: "Brown text",
		flag: "brown",
		value: "var(--tt-c-t-brown)",
		border: "var(--tt-c-t-brown-c)",
	},
	{
		label: "Orange text",
		flag: "orange",
		value: "var(--tt-c-t-orange)",
		border: "var(--tt-c-t-orange-c)",
	},
	{
		label: "Yellow text",
		flag: "yellow",
		value: "var(--tt-c-t-yellow)",
		border: "var(--tt-c-t-yellow-c)",
	},
	{
		label: "Green text",
		flag: "green",
		value: "var(--tt-c-t-green)",
		border: "var(--tt-c-t-green-c)",
	},
	{
		label: "Blue text",
		flag: "blue",
		value: "var(--tt-c-t-blue)",
		border: "var(--tt-c-t-blue-c)",
	},
	{
		label: "Purple text",
		flag: "purple",
		value: "var(--tt-c-t-purple)",
		border: "var(--tt-c-t-purple-c)",
	},
	{
		label: "Pink text",
		flag: "pink",
		value: "var(--tt-c-t-pink)",
		border: "var(--tt-c-t-pink-c)",
	},
	{
		label: "Red text",
		flag: "red",
		value: "var(--tt-c-t-red)",
		border: "var(--tt-c-t-red-c)",
	},
];

/**
 * Configuration for the color text functionality
 */
export interface UseColorTextConfig {
	/**
	 * The Tiptap editor instance.
	 */
	editor?: Editor | null;
	/**
	 * The text color to apply.
	 * Can be any valid CSS color value.
	 */
	textColor: string;
	flag: string;
	/**
	 * Optional text to display alongside the icon.
	 */
	label: string;
	/**
	 * Whether the button should hide when the mark is not available.
	 * @default false
	 */
	hideWhenUnavailable?: boolean;
	/**
	 * Called when the text color is applied.
	 */
	onApplied?: ({ color, label }: { color: string; label: string }) => void;
}

/**
 * Checks if text color can be toggled in the current editor state
 */
export function canColorText(editor: Editor | null): boolean {
	if (!editor || !editor.isEditable) return false;
	if (!isMarkInSchema("textStyle", editor) || isNodeTypeSelected(editor, ["image"])) return false;

	try {
		return editor.can().setMark("textStyle", { color: "currentColor" });
	} catch {
		return false;
	}
}

/**
 * Checks if text color is active in the current selection
 */
export function isColorTextActive(editor: Editor | null, textColor: string): boolean {
	if (!editor || !editor.isEditable) return false;
	return editor.isActive("textStyle", { color: textColor });
}

/**
 * Determines if the color text button should be shown
 */
export function shouldShowButton(props: {
	editor: Editor | null;
	hideWhenUnavailable: boolean;
}): boolean {
	const { editor, hideWhenUnavailable } = props;

	if (!editor || !editor.isEditable) return false;
	if (!isMarkInSchema("textStyle", editor)) return false;

	if (hideWhenUnavailable && !editor.isActive("code")) {
		return canColorText(editor);
	}

	return true;
}

export function removeTextStyle(editor: Editor | null): boolean {
	if (!editor || !editor.isEditable) return false;
	if (!canColorText(editor)) return false;

	return editor.chain().focus().unsetMark("textStyle").run();
}

export function useColorText(config: UseColorTextConfig) {
	const { label, textColor, flag, hideWhenUnavailable = false, onApplied } = config;

	const { editor } = useCurrentEditor();
	const isMobile = useIsBreakpoint();
	const [isVisible, setIsVisible] = useState<boolean>(true);
	const canColorTextState = canColorText(editor);
	const isActive = isColorTextActive(editor, textColor);

	useEffect(() => {
		if (!editor) return;

		const handleSelectionUpdate = () => {
			setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
		};

		handleSelectionUpdate();

		editor.on("selectionUpdate", handleSelectionUpdate);

		return () => {
			editor.off("selectionUpdate", handleSelectionUpdate);
		};
	}, [editor, hideWhenUnavailable]);

	const handleColorText = useCallback(() => {
		if (!editor || !canColorTextState) return false;

		if (editor.state.storedMarks) {
			const textStyleMarkType = editor.schema.marks.textStyle;
			if (textStyleMarkType) {
				editor.view.dispatch(editor.state.tr.removeStoredMark(textStyleMarkType));
			}
		}

		setTimeout(() => {
			selectCurrentBlockContent(editor);

			const success = editor.chain().focus().toggleMark("textStyle", { color: textColor }).run();
			if (success) {
				onApplied?.({ color: textColor, label });
			}
			return success;
		}, 0);
	}, [editor, canColorTextState, textColor, onApplied, label]);

	useHotkeys(
		COLOR_TEXT_SHORTCUT_KEY,
		(event) => {
			event.preventDefault();
			handleColorText();
		},
		{
			enabled: isVisible && canColorTextState,
			enableOnContentEditable: !isMobile,
			enableOnFormTags: true,
		}
	);

	const handleRemoveColorText = useCallback(() => {
		const success = removeTextStyle(editor);
		if (success) {
			onApplied?.({ color: "", label: "Remove textStyle" });
		}
		return success;
	}, [editor, onApplied]);

	return {
		isVisible,
		isActive,
		handleColorText,
		handleRemoveColorText,
		canColorText: canColorTextState,
		label: label || `Color text to ${flag}`,
		shortcutKeys: COLOR_TEXT_SHORTCUT_KEY,
		Icon: TextColorSmallIcon,
	};
}
