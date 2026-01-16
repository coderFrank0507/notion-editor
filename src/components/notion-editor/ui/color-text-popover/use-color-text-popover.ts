"use client";

import { useCallback, useEffect, useState } from "react";
import { useCurrentEditor, type Editor } from "@tiptap/react";

// --- Icons ---
import { TextColorSmallIcon } from "../../icons/text-color-small-icon";

// --- Lib ---
import { isMarkInSchema } from "../../lib/utils";
import { getActiveMarkAttrs } from "../../lib/advanced-utils";

// --- Tiptap UI ---
import { canColorText, ColorItem } from "../../ui/color-text-button";
import { canColorHighlight } from "../../ui/color-highlight-button";

export type ColorType = "text" | "highlight";

export interface RecentColor {
	type: ColorType;
	label: string;
	value: string;
}

/**
 * Configuration for the color text popover functionality
 */
export interface UseColorTextPopoverConfig {
	/**
	 * The Tiptap editor instance.
	 */
	editor?: Editor | null;
	/**
	 * Whether the popover should hide when color text is not available.
	 * @default false
	 */
	hideWhenUnavailable?: boolean;
	/**
	 * Callback function called after a color is applied.
	 */
	onColorChanged?: ({
		type,
		label,
		value,
	}: {
		type: ColorType;
		label: string;
		value: string;
	}) => void;
}

/**
 * Get a color object by its value
 */
export function getColorByValue(value: string, colorArray: ColorItem[]): ColorItem {
	return (
		colorArray.find((color) => color.value === value) ?? {
			value,
			label: value,
			border: value,
			flag: value,
		}
	);
}

/**
 * Checks if color text popover should be shown
 */
export function shouldShowColorTextPopover(params: {
	editor: Editor | null;
	hideWhenUnavailable: boolean;
}): boolean {
	const { editor, hideWhenUnavailable } = params;

	if (!editor || !editor.isEditable) return false;

	if (hideWhenUnavailable && !editor.isActive("code")) {
		return canColorText(editor) || canColorHighlight(editor);
	}

	return true;
}

/**
 * Hook to manage recently used colors
 */
export function useRecentColors(maxColors: number = 3) {
	const [recentColors, setRecentColors] = useState<RecentColor[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		try {
			const storedColors = localStorage.getItem("editorRecentlyUsedColors");
			if (storedColors) {
				const colors = JSON.parse(storedColors) as RecentColor[];
				setRecentColors(colors.slice(0, maxColors));
			}
		} catch (e) {
			console.error("Failed to load stored colors:", e);
		} finally {
			setIsInitialized(true);
		}
	}, [maxColors]);

	const addRecentColor = useCallback(
		({ type, label, value }: { type: ColorType; label: string; value: string }) => {
			setRecentColors((prevColors) => {
				const filtered = prevColors.filter((c) => !(c.type === type && c.value === value));
				const updated = [{ type, label, value }, ...filtered].slice(0, maxColors);

				try {
					localStorage.setItem("editorRecentlyUsedColors", JSON.stringify(updated));
				} catch (e) {
					console.error("Failed to store colors:", e);
				}

				return updated;
			});
		},
		[maxColors]
	);

	return { recentColors, addRecentColor, isInitialized };
}

export function useColorTextPopover(config?: UseColorTextPopoverConfig) {
	const { hideWhenUnavailable = false, onColorChanged } = config || {};

	const { editor } = useCurrentEditor();
	const [isVisible, setIsVisible] = useState(true);

	const textStyleInSchema = isMarkInSchema("textStyle", editor);
	const highlightInSchema = isMarkInSchema("highlight", editor);

	const activeTextStyle = getActiveMarkAttrs(editor, "textStyle") || {};
	const activeHighlight = getActiveMarkAttrs(editor, "highlight") || {};

	const canToggle = canColorText(editor) || canColorHighlight(editor);

	useEffect(() => {
		if (!editor) return;

		const updateVisibility = () => {
			setIsVisible(
				shouldShowColorTextPopover({
					editor,
					hideWhenUnavailable,
				})
			);
		};

		updateVisibility();

		editor.on("selectionUpdate", updateVisibility);

		return () => {
			editor.off("selectionUpdate", updateVisibility);
		};
	}, [editor, hideWhenUnavailable, highlightInSchema, textStyleInSchema]);

	const handleColorChanged = useCallback(
		({ type, label, value }: { type: ColorType; label: string; value: string }) => {
			onColorChanged?.({ type, label, value });
		},
		[onColorChanged]
	);

	return {
		isVisible,
		canToggle,
		activeTextStyle,
		activeHighlight,
		handleColorChanged,
		label: "Text color",
		Icon: TextColorSmallIcon,
	};
}
