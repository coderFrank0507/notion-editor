// clearNodeSelectionAfterDrop.ts
import { Extension } from "@tiptap/core";
import { Plugin, NodeSelection, TextSelection } from "prosemirror-state";

export const ClearNodeSelectionAfterDrop = Extension.create({
	name: "clear-node-selection-after-drop",

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
