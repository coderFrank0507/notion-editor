import type { ParagraphOptions } from "@tiptap/extension-paragraph";
import {
	Node,
	ReactNodeViewRenderer,
	NodeViewWrapper,
	NodeViewContent,
	ReactNodeViewProps,
} from "@tiptap/react";
import { useEffect, useState } from "react";
import type { Node as PMNode } from "@tiptap/pm/model";

function getOrderedIndex(doc: PMNode, pos: number) {
	let index = 1;

	doc.nodesBetween(0, pos, (node, nodePos) => {
		if (!node.isBlock) return;

		if (node.type.name !== "ordered-list") {
			index = 1; // reset
			return;
		} else {
			index++;
		}
	});

	return index;
}

export function OrderedItemView(props: ReactNodeViewProps) {
	const { editor, getPos } = props;
	const [sort, setSort] = useState(1);

	useEffect(() => {
		const number = getOrderedIndex(editor.state.doc, getPos());
		queueMicrotask(() => setSort(number));
	}, [editor.state.doc, getPos]);

	return (
		<NodeViewWrapper>
			<div className="ordered-item flex items-center">
				<div className="w-4 mr-2.5 flex justify-center">
					{/* <div className="size-2 rounded-full bg-text-color" /> */}
					{`${sort}.`}
				</div>
				<NodeViewContent className="list-item-content" />
			</div>
		</NodeViewWrapper>
	);
}

export const OrderedList = Node.create<ParagraphOptions>({
	name: "ordered-list",
	group: "block",
	content: "inline*",

	addOptions() {
		return {
			HTMLAttributes: {
				"data-type": "ordered-list",
				class: "ordered-list",
			},
		};
	},
	parseHTML() {
		return [{ tag: "div" }];
	},
	addNodeView() {
		return ReactNodeViewRenderer(OrderedItemView, {
			attrs({ node }) {
				return {
					"data-id": node.attrs.id,
				};
			},
		});
	},
});
