import * as React from "react";

// --- Tiptap UI ---
import type { UseImageCaptionConfig } from "../../ui/image-caption-button";
import { useImageCaption } from "../../ui/image-caption-button";

// --- UI Primitives ---
import type { ButtonProps } from "../../ui-primitive/button";
import { Button } from "../../ui-primitive/button";
import { useCurrentEditor } from "@tiptap/react";

export interface ImageCaptionButtonProps extends Omit<ButtonProps, "type">, UseImageCaptionConfig {
	/**
	 * Optional text to display alongside the icon.
	 */
	text?: string;
}

/**
 * Button component for toggling image captions in a Tiptap editor.
 * Only appears when an image is selected in the editor.
 *
 * For custom button implementations, use the `useImageCaption` hook instead.
 */
export const ImageCaptionButton = React.forwardRef<HTMLButtonElement, ImageCaptionButtonProps>(
	({ text, hideWhenUnavailable = false, onSet, onClick, children, ...buttonProps }, ref) => {
		const { editor } = useCurrentEditor();
		const { isVisible, isActive, canToggle, handleToggleCaption, label, Icon } = useImageCaption({
			editor,
			hideWhenUnavailable,
			onSet,
		});

		const handleClick = React.useCallback(
			(event: React.MouseEvent<HTMLButtonElement>) => {
				onClick?.(event);
				if (event.defaultPrevented) return;
				handleToggleCaption();
			},
			[handleToggleCaption, onClick]
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
				tooltip={label}
				onClick={handleClick}
				{...buttonProps}
				ref={ref}
			>
				{children ?? (
					<>
						<Icon className="tiptap-button-icon" />
						{text && <span className="tiptap-button-text">{text}</span>}
					</>
				)}
			</Button>
		);
	}
);

ImageCaptionButton.displayName = "ImageCaptionButton";
