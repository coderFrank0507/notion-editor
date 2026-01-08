import { useCurrentEditor } from "@tiptap/react";
import useUiEditorState from "./hooks/use-ui-editor-state";
import { useFloatingToolbarVisibility } from "./hooks/use-floating-toolbar-visibility";
import { isSelectionValid } from "./lib/collab-utils";
import { FloatingElement } from "./ui-utils/floating-element";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "./ui-primitive/toolbar";
import { MarkButton } from "./ui/mark-button";
import { TurnIntoDropdown } from "./ui/turn-into-dropdown";
import { ImageNodeFloating } from "./extensions/image-node/image-node-floating";

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
			</Toolbar>
		</FloatingElement>
	);
}
