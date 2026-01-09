import type { ParagraphOptions } from "@tiptap/extension-paragraph";
import {
	Node,
	ReactNodeViewRenderer,
	NodeViewWrapper,
	NodeViewContent,
	ReactNodeViewProps,
} from "@tiptap/react";

export function BulletItemView(props: ReactNodeViewProps) {
	const { node } = props;

	return (
		<NodeViewWrapper as={"ul"}>
			<div className="flex items-start py-0.5">
				<div contentEditable={false} className="w-4 h-6 mr-1.5 flex justify-center items-center">
					<div className="size-2 relative rounded-full bg-text-color" />
				</div>

				<NodeViewContent
					className="list-item-content flex-1"
					style={{ backgroundColor: node.attrs.backgroundColor }}
				/>
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
		return [{ tag: "ul" }];
	},
	renderHTML() {
		return ["ul", 0];
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
