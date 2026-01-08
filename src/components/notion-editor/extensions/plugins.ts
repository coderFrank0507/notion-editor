import { Extension } from "@tiptap/core";
import { Plugin, NodeSelection, TextSelection } from "prosemirror-state";

export const ClearSelectionDropEnd = Extension.create({
	name: "clear-selection-drop-end",

	addProseMirrorPlugins() {
		return [
			new Plugin({
				appendTransaction(transactions, _, newState) {
					const tr = transactions.find((tr) => tr.selection instanceof NodeSelection);
					if (!tr) return;

					const { selection } = newState;
					if (!(selection instanceof NodeSelection)) return;

					return newState.tr.setSelection(TextSelection.create(newState.doc, selection.from + 1));
				},
			}),
		];
	},
});
