import { forwardRef, useCallback, useMemo } from "react";

// --- Lib ---
import { parseShortcutKeys } from "../../lib/utils";

// --- Tiptap UI ---
import type { UseColorHighlightConfig } from "../../ui/color-highlight-button";
import { COLOR_HIGHLIGHT_SHORTCUT_KEY, useColorHighlight } from "../../ui/color-highlight-button";

// --- UI Primitives ---
import type { ButtonProps } from "../../ui-primitive/button";
import { Button } from "../../ui-primitive/button";
import { Badge } from "../../ui-primitive/badge";

// --- Styles ---
import "../../ui/color-highlight-button/color-highlight-button.scss";
import { useCurrentEditor } from "@tiptap/react";

export interface ColorHighlightButtonProps
	extends Omit<ButtonProps, "type">,
		UseColorHighlightConfig {
	/**
	 * Optional text to display alongside the icon.
	 */
	text?: string;
	/**
	 * Optional show shortcut keys in the button.
	 * @default false
	 */
	showShortcut?: boolean;
}

export function ColorHighlightShortcutBadge({
	shortcutKeys = COLOR_HIGHLIGHT_SHORTCUT_KEY,
}: {
	shortcutKeys?: string;
}) {
	return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

export const ColorHighlightButton = forwardRef<HTMLButtonElement, ColorHighlightButtonProps>(
	(
		{
			highlightColor,
			text,
			flag,
			hideWhenUnavailable = false,
			mode = "mark",
			onApplied,
			showShortcut = false,
			onClick,
			children,
			style,
			...buttonProps
		},
		ref
	) => {
		const { editor } = useCurrentEditor();
		const {
			isVisible,
			canColorHighlight,
			isActive,
			handleColorHighlight,
			handleRemoveHighlight,
			label,
			shortcutKeys,
		} = useColorHighlight({
			editor,
			highlightColor,
			flag,
			label: text || `Toggle highlight (${highlightColor})`,
			hideWhenUnavailable,
			mode,
			onApplied,
		});

		const handleClick = useCallback(
			(event: React.MouseEvent<HTMLButtonElement>) => {
				onClick?.(event);
				if (event.defaultPrevented) return;
				if (flag === "default") {
					handleRemoveHighlight();
				} else {
					handleColorHighlight();
				}
			},
			[handleColorHighlight, handleRemoveHighlight, onClick, flag]
		);

		const buttonStyle = useMemo(
			() =>
				({
					...style,
					"--highlight-color": highlightColor,
				} as React.CSSProperties),
			[highlightColor, style]
		);

		if (!isVisible) {
			return null;
		}

		return (
			<Button
				type="button"
				data-style="ghost"
				data-active-state={isActive ? "on" : "off"}
				role="button"
				tabIndex={-1}
				disabled={!canColorHighlight}
				data-disabled={!canColorHighlight}
				aria-label={label}
				aria-pressed={isActive}
				tooltip={label}
				onClick={handleClick}
				style={buttonStyle}
				{...buttonProps}
				ref={ref}
			>
				{children ?? (
					<>
						<span
							className="tiptap-button-highlight"
							style={{ "--highlight-color": highlightColor } as React.CSSProperties}
						/>
						{text && <span className="tiptap-button-text">{text}</span>}
						{showShortcut && <ColorHighlightShortcutBadge shortcutKeys={shortcutKeys} />}
					</>
				)}
			</Button>
		);
	}
);

ColorHighlightButton.displayName = "ColorHighlightButton";
