import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { generateBaseIndex } from "../lib/generate-unique-sort";
import { CacheMap } from "../notion-editor";

/**
 * key: id
 * value: sort
 */
export const BlockSortMap = new Map<string, string>();

export const BlockSortExtension = Extension.create({
	name: "blockSort",

	// addGlobalAttributes() {
	// 	return [
	// 		{
	// 			types: [
	// 				"paragraph",
	// 				"heading",
	// 				"image",
	// 				"codeBlock",
	// 				"taskList",
	// 				"bulletList",
	// 				"orderedList",
	// 			],
	// 			attributes: {
	// 				sort: {
	// 					default: null,
	// 					parseHTML: (element) => element.getAttribute("data-sort"),
	// 					renderHTML: (attrs) => {
	// 						if (!attrs.sort) return {};
	// 						return { "data-sort": attrs.sort };
	// 					},
	// 				},
	// 			},
	// 		},
	// 	];
	// },

	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: new PluginKey("block-sort"),
				appendTransaction(transactions, oldState, newState) {
					const hasDocChanges =
						transactions.some((transaction) => transaction.docChanged) &&
						!oldState.doc.eq(newState.doc);
					if (!hasDocChanges) return;

					const tr = newState.tr;

					newState.doc.content.descendants((node, pos) => {
						if (!node.isBlock) return;
						const cache = BlockSortMap.get(node.attrs.id);
						if (cache) return false;

						const $pos = newState.doc.resolve(pos);
						const prev = $pos.nodeBefore;
						const $posabc = newState.doc.resolve(pos + node.nodeSize);
						const next = $posabc.nodeAfter;
						const prevSort = prev?.attrs?.sort ?? null;
						const nextSort = next?.attrs?.sort ?? null;

						const sort = generateBaseIndex(prevSort, nextSort);
						BlockSortMap.set(node.attrs.id, sort);
						tr.setNodeMarkup(pos, undefined, { ...node.attrs, sort });
						return false;
					});

					return tr;
				},
			}),
		];
	},
});
