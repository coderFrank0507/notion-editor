import type { ParagraphOptions } from "@tiptap/extension-paragraph";
import {
	Node,
	ReactNodeViewRenderer,
	NodeViewWrapper,
	NodeViewContent,
	ReactNodeViewProps,
	EditorEvents,
} from "@tiptap/react";
import { useLayoutEffect, useState } from "react";
import type { Node as PMNode } from "@tiptap/pm/model";
import { OrderedRefreshKey } from "../lib/utils";

function getOrderedIndex(doc: PMNode, pos: number) {
	let index = 1;
	doc.nodesBetween(0, pos, (node) => {
		if (!node.isBlock) return;
		if (node.type.name !== "orderedList") {
			index = 1; // reset return;
		} else {
			index++;
		}
	});
	return index;
}

export function OrderedItemView(props: ReactNodeViewProps) {
	const { editor, getPos } = props;
	const [_, setTick] = useState(0);

	useLayoutEffect(() => {
		const onTransaction = ({ transaction }: EditorEvents["transaction"]) => {
			const range = transaction.getMeta(OrderedRefreshKey);
			if (!range) return;

			const pos = getPos();
			if (pos >= range.from && pos <= range.to) {
				setTick((t) => t + 1);
			}
		};

		editor.on("transaction", onTransaction);
		return () => {
			editor.off("transaction", onTransaction);
		};
	}, []);
	const number = getOrderedIndex(editor.state.doc, getPos());

	return (
		<NodeViewWrapper as={"ul"}>
			<div className="ordered-item flex items-start">
				<div className="w-4 h-6 mr-1.5 flex justify-center items-center">{`${number}.`}</div>
				<NodeViewContent className="list-item-content" />
			</div>
		</NodeViewWrapper>
	);
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		orderedList: {
			toggleOrderedList: (type: string) => ReturnType;
		};
	}
}

export const OrderedList = Node.create<ParagraphOptions>({
	name: "orderedList",
	group: "block",
	content: "inline*",

	addOptions() {
		return {
			HTMLAttributes: {
				"data-type": "orderedList",
				class: "orderedList",
			},
		};
	},
	parseHTML() {
		return [{ tag: "ul" }];
	},
	renderHTML() {
		return ["ul", 0];
	},
	addCommands() {
		return {
			toggleOrderedList:
				(type) =>
				({ commands }) =>
					commands.toggleNode(this.name, type),
		};
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
