import { forwardRef, useCallback } from "react";

// --- Lib ---
import { parseShortcutKeys } from "../../lib/utils";

// --- Tiptap UI ---
import type { UseTextConfig } from "../../ui/text-button";
import { TEXT_SHORTCUT_KEY, useText } from "../../ui/text-button";

// --- UI Primitives ---
import type { ButtonProps } from "../../ui-primitive/button";
import { Button } from "../../ui-primitive/button";
import { Badge } from "../../ui-primitive/badge";
import { useCurrentEditor } from "@tiptap/react";

export interface TextButtonProps extends Omit<ButtonProps, "type">, UseTextConfig {
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

export function TextShortcutBadge({ shortcutKeys = TEXT_SHORTCUT_KEY }: { shortcutKeys?: string }) {
	return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for converting to text/paragraph in a Tiptap editor.
 *
 * For custom button implementations, use the `useText` hook instead.
 */
export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
	(
		{
			text,
			hideWhenUnavailable = false,
			onToggled,
			showShortcut = false,
			onClick,
			children,
			...buttonProps
		},
		ref
	) => {
		const { editor } = useCurrentEditor();
		const { isVisible, canToggle, isActive, handleToggle, label, shortcutKeys, Icon } = useText({
			editor,
			hideWhenUnavailable,
			onToggled,
		});

		const handleClick = useCallback(
			(event: React.MouseEvent<HTMLButtonElement>) => {
				onClick?.(event);
				if (event.defaultPrevented) return;
				handleToggle();
			},
			[handleToggle, onClick]
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
				disabled={!canToggle}
				data-disabled={!canToggle}
				aria-label={label}
				aria-pressed={isActive}
				tooltip="Text"
				onClick={handleClick}
				{...buttonProps}
				ref={ref}
			>
				{children ?? (
					<>
						<Icon className="tiptap-button-icon" />
						{text && <span className="tiptap-button-text">{text}</span>}
						{showShortcut && <TextShortcutBadge shortcutKeys={shortcutKeys} />}
					</>
				)}
			</Button>
		);
	}
);

TextButton.displayName = "TextButton";
