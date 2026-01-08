import { forwardRef, useCallback, useMemo } from "react";

// --- Lib ---
import { parseShortcutKeys } from "../../lib/utils";

// --- Tiptap UI ---
import type { UseColorTextConfig } from "../../ui/color-text-button";
import { COLOR_TEXT_SHORTCUT_KEY, useColorText } from "../../ui/color-text-button";

// --- UI Primitives ---
import type { ButtonProps } from "../../ui-primitive/button";
import { Button } from "../../ui-primitive/button";
import { Badge } from "../../ui-primitive/badge";

// --- Styles ---
import "../../ui/color-text-button/color-text-button.scss";
import { useCurrentEditor } from "@tiptap/react";

export interface ColorTextButtonProps extends Omit<ButtonProps, "type">, UseColorTextConfig {
	/**
	 * Optional text to display alongside the icon.
	 */
	text?: string;
	/**
	 * Optional show shortcut keys in the button.
	 * @default false
	 */
	showShortcut?: boolean;
	flag: string;
}

export function ColorTextShortcutBadge({
	shortcutKeys = COLOR_TEXT_SHORTCUT_KEY,
}: {
	shortcutKeys?: string;
}) {
	return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for applying text colors in a Tiptap editor.
 *
 * For custom button implementations, use the `useColorText` hook instead.
 */
export const ColorTextButton = forwardRef<HTMLButtonElement, ColorTextButtonProps>(
	(
		{
			textColor,
			text,
			flag,
			hideWhenUnavailable = false,
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
			canColorText,
			isActive,
			handleColorText,
			handleRemoveColorText,
			label,
			shortcutKeys,
			Icon,
		} = useColorText({
			editor,
			textColor,
			flag,
			label: text || `Color text to ${textColor}`,
			hideWhenUnavailable,
			onApplied,
		});

		const handleClick = useCallback(
			(event: React.MouseEvent<HTMLButtonElement>) => {
				onClick?.(event);
				if (event.defaultPrevented) return;
				if (flag === "default") {
					handleRemoveColorText();
				} else {
					handleColorText();
				}
			},
			[handleColorText, handleRemoveColorText, onClick, flag]
		);

		const buttonStyle = useMemo(
			() =>
				({
					...style,
					"--color-text-button-color": textColor,
				} as React.CSSProperties),
			[textColor, style]
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
				disabled={!canColorText}
				data-disabled={!canColorText}
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
						<span className="tiptap-button-color-text" style={{ color: textColor }}>
							<Icon className="tiptap-button-icon" style={{ color: textColor, flexGrow: 1 }} />
						</span>
						{text && <span className="tiptap-button-text">{text}</span>}
						{showShortcut && <ColorTextShortcutBadge shortcutKeys={shortcutKeys} />}
					</>
				)}
			</Button>
		);
	}
);

ColorTextButton.displayName = "ColorTextButton";
