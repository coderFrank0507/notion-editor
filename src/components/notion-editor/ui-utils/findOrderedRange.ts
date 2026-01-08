import type { Node as PMNode } from "@tiptap/pm/model";

export function findOrderedRange(doc: PMNode, pos: number) {
	let from = pos;
	let to = pos;

	// 👆 向上找
	doc.nodesBetween(0, pos, (node, nodePos) => {
		if (!node.isBlock) return;

		if (nodePos >= pos) return false;

		if (node.type.name === "orderedList") {
			from = nodePos;
		} else {
			return false;
		}
	});

	// 👇 向下找
	doc.nodesBetween(pos, doc.content.size, (node, nodePos) => {
		if (!node.isBlock) return;

		if (node.type.name === "orderedList") {
			to = nodePos + node.nodeSize;
		} else if (nodePos !== pos) {
			return false;
		}
	});

	return { from, to };
}
