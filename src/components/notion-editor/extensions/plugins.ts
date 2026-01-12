import { Extension } from "@tiptap/core";
import { Plugin, NodeSelection, TextSelection } from "prosemirror-state";
import { eventInfo } from "../lib/onUpdate";

export const ClearSelectionDropEnd = Extension.create({
	name: "clear-selection-drop-end",

	addProseMirrorPlugins() {
		return [
			new Plugin({
				appendTransaction(transactions, oldState, newState) {
					if (!eventInfo.draggedBlockId) return null;
					// console.log(oldState.doc.content.size, newState.doc.content.size);
					// const tr = transactions.find((tr) => tr.selection instanceof NodeSelection);
					// if (!tr) return;

					// const { selection } = newState;
					// if (!(selection instanceof NodeSelection)) return;

					// return newState.tr.setSelection(TextSelection.create(newState.doc, selection.from + 1));

					// newState.doc.content.forEach((node, _, index) => {
					// 	if (node.attrs?.id === eventInfo.draggedBlockId) {
					// 		console.log("prev", newState.doc.child(index - 1));
					// 		console.log("next", newState.doc.child(index + 1));
					// 	}
					// });
					// eventInfo.draggedBlockId = null;
					return null;
				},
			}),
		];
	},
});
