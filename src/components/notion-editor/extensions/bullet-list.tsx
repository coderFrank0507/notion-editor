import type { ParagraphOptions } from "@tiptap/extension-paragraph";
import {
	Node,
	ReactNodeViewRenderer,
	NodeViewWrapper,
	NodeViewContent,
	ReactNodeViewProps,
} from "@tiptap/react";

export function BulletItemView(props: ReactNodeViewProps) {
	// const { editor, node, updateAttributes } = props;

	return (
		<NodeViewWrapper>
			<div className="flex items-center">
				<div className="w-4 mr-2.5 flex justify-center">
					<div className="size-2 rounded-full bg-text-color" />
				</div>
				<NodeViewContent className="list-item-content" />
			</div>
		</NodeViewWrapper>
	);
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		bulletList: {
			toggleBulletList: (type: string) => ReturnType;
		};
	}
}

export const BulletList = Node.create<ParagraphOptions>({
	name: "bulletList",
	group: "block",
	content: "inline*",

	addOptions() {
		return {
			HTMLAttributes: {
				"data-type": "bulletList",
				class: "bulletList",
			},
		};
	},
	parseHTML() {
		return [{ tag: "div" }];
	},
	renderHTML() {
		return ["div", 0];
	},
	addCommands() {
		return {
			toggleBulletList:
				(type) =>
				({ commands }) =>
					commands.toggleNode(this.name, type),
		};
	},
	addNodeView() {
		return ReactNodeViewRenderer(BulletItemView, {
			attrs({ node }) {
				return {
					"data-id": node.attrs.id,
				};
			},
		});
	},
});
