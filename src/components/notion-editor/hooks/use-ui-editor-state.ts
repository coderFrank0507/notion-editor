import { useEditorState } from "@tiptap/react";
import { defaultUiState, type UiState } from "../extensions/ui-state-extension";
import type { Editor } from "@tiptap/react";

export function useUiEditorState(editor: Editor): UiState {
	return (
		useEditorState({
			editor,
			selector: ({ editor }) => {
				if (!editor) return defaultUiState;

				const state = editor.storage.uiState;
				if (!state) {
					console.warn(
						"Editor storage uiState is not initialized. Ensure you have the uiState extension added to your editor."
					);
					return defaultUiState;
				}

				return { ...defaultUiState, ...state };
			},
		}) ?? defaultUiState
	);
}

export default useUiEditorState;
