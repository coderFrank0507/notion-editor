import { useCurrentEditor } from "@tiptap/react";

export default function EditorToolbarFloating() {
	const { editor } = useCurrentEditor();

	if (!editor) return null;

	return <div>EditorToolbarFloating</div>;
}
