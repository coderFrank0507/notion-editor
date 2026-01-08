import { useEffect, useState } from "react";
import { Editor, useCurrentEditor } from "@tiptap/react";
import useUiEditorState from "./hooks/use-ui-editor-state";
import { useFloatingToolbarVisibility } from "./hooks/use-floating-toolbar-visibility";
import { isSelectionValid } from "./lib/collab-utils";
import { FloatingElement } from "./ui-utils/floating-element";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "./ui-primitive/toolbar";
import { TurnIntoDropdown } from "./ui/turn-into-dropdown";
import { ImageNodeFloating } from "./extensions/image-node/image-node-floating";
import { ColorTextPopover } from "./ui/color-text-popover";
import { Popover, PopoverContent, PopoverTrigger } from "./ui-primitive/popover";
import { Button, ButtonProps } from "./ui-primitive/button";
import { MoreVerticalIcon } from "./icons/more-vertical-icon";
import { canSetTextAlign, TextAlign, TextAlignButton } from "./ui/text-align-button";
import { canToggleMark, Mark, MarkButton } from "./ui/mark-button";

export default function EditorToolbarFloating() {
	const { editor } = useCurrentEditor();
	const { lockDragHandle, commentInputVisible } = useUiEditorState(editor);

	const { shouldShow } = useFloatingToolbarVisibility({
		editor,
		isSelectionValid,
		extraHideWhen: Boolean(commentInputVisible),
	});

	if (lockDragHandle) return null;

	return (
		<FloatingElement shouldShow={shouldShow}>
			<Toolbar variant="floating">
				<ToolbarGroup>
					<TurnIntoDropdown hideWhenUnavailable={true} />
				</ToolbarGroup>

				<ToolbarSeparator />

				<ToolbarGroup>
					<MarkButton type="bold" hideWhenUnavailable={true} />
					<MarkButton type="italic" hideWhenUnavailable={true} />
					<MarkButton type="underline" hideWhenUnavailable={true} />
					<MarkButton type="strike" hideWhenUnavailable={true} />
					{/* <MarkButton type="code" hideWhenUnavailable={true} /> */}
				</ToolbarGroup>

				<ToolbarSeparator />

				<ToolbarGroup>
					<ImageNodeFloating />
				</ToolbarGroup>

				<ToolbarGroup>
					<ColorTextPopover hideWhenUnavailable={true} />
				</ToolbarGroup>

				<MoreOptions hideWhenUnavailable={true} />
			</Toolbar>
		</FloatingElement>
	);
}

function canMoreOptions(editor: Editor | null): boolean {
	if (!editor) {
		return false;
	}

	const canTextAlignAny = ["left", "center", "right", "justify"].some((align) =>
		canSetTextAlign(editor, align as TextAlign)
	);

	const canMarkAny = ["superscript", "subscript"].some((type) =>
		canToggleMark(editor, type as Mark)
	);

	return canMarkAny || canTextAlignAny;
}

function shouldShowMoreOptions(params: {
	editor: Editor | null;
	hideWhenUnavailable: boolean;
}): boolean {
	const { editor, hideWhenUnavailable } = params;

	if (!editor) {
		return false;
	}

	if (hideWhenUnavailable && !editor.isActive("code")) {
		return canMoreOptions(editor);
	}

	return Boolean(editor?.isEditable);
}

export interface MoreOptionsProps extends Omit<ButtonProps, "type"> {
	/**
	 * The Tiptap editor instance.
	 */
	editor?: Editor | null;
	/**
	 * Whether to hide the dropdown when no options are available.
	 * @default false
	 */
	hideWhenUnavailable?: boolean;
}

export function MoreOptions({ hideWhenUnavailable = false, ...props }: MoreOptionsProps) {
	const { editor } = useCurrentEditor();
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (!editor) return;

		const handleSelectionUpdate = () => {
			setShow(
				shouldShowMoreOptions({
					editor,
					hideWhenUnavailable,
				})
			);
		};

		handleSelectionUpdate();

		editor.on("selectionUpdate", handleSelectionUpdate);

		return () => {
			editor.off("selectionUpdate", handleSelectionUpdate);
		};
	}, [editor, hideWhenUnavailable]);

	if (!show || !editor || !editor.isEditable) {
		return null;
	}

	return (
		<>
			<ToolbarSeparator />
			<ToolbarGroup>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							type="button"
							data-style="ghost"
							role="button"
							tabIndex={-1}
							tooltip="More options"
							{...props}
						>
							<MoreVerticalIcon className="tiptap-button-icon" />
						</Button>
					</PopoverTrigger>

					<PopoverContent side="top" align="end" alignOffset={4} sideOffset={4} asChild>
						<Toolbar variant="floating" tabIndex={0}>
							<ToolbarGroup>
								<TextAlignButton align="left" />
								<TextAlignButton align="center" />
								<TextAlignButton align="right" />
								<TextAlignButton align="justify" />
							</ToolbarGroup>
						</Toolbar>
					</PopoverContent>
				</Popover>
			</ToolbarGroup>
		</>
	);
}
