import type { ParagraphOptions } from "@tiptap/extension-paragraph";
import {
	Node,
	ReactNodeViewRenderer,
	NodeViewWrapper,
	NodeViewContent,
	ReactNodeViewProps,
} from "@tiptap/react";
import { useMemo } from "react";
import { cn } from "../lib/utils";

export function BulletItemView(props: ReactNodeViewProps) {
	const { node } = props;

	const align = useMemo(() => {
		switch (node.attrs.textAlign) {
			case "left":
				return "text-left";
			case "center":
				return "text-center";
			case "right":
				return "text-right";
		}
	}, [node.attrs.textAlign]);

	return (
		<NodeViewWrapper as={"ul"}>
			<div className="flex items-start py-0.5">
				<div contentEditable={false} className="w-4 h-6 mr-1.5 flex justify-center items-center">
					<div className="size-2 relative rounded-full bg-(--tt-text-color)" />
				</div>

				<NodeViewContent
					className={cn("list-item-content flex-1 text-base", align)}
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
			},
		};
	},
	addAttributes() {
		return {
			sort: {
				default: null,
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
				type =>
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
