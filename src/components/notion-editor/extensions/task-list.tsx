import type { ParagraphOptions } from "@tiptap/extension-paragraph";
import {
	Node,
	ReactNodeViewRenderer,
	NodeViewWrapper,
	NodeViewContent,
	ReactNodeViewProps,
} from "@tiptap/react";
import { TaskItemChecked } from "../icons/task-item-checked";
import { cn } from "../lib/utils";

export function MyNodeView(props: ReactNodeViewProps) {
	const { editor, node, updateAttributes } = props;

	return (
		<NodeViewWrapper>
			<div className="flex items-center">
				<div
					className={cn(
						"size-[16px] mr-2 border-[1.5px] rounded relative cursor-pointer",
						node.attrs.checked && "bg-blue-600 border-blue-600"
					)}
					onMouseDownCapture={() => {
						editor.chain().blur();
					}}
					onClick={() => {
						updateAttributes({
							checked: !node.attrs.checked,
						});
					}}
				>
					<TaskItemChecked
						className={cn("block size-full none", node.attrs.checked && "block")}
						color="white"
					/>
				</div>
				<NodeViewContent
					className={cn("task-item-content", node.attrs.checked && "text-gray-500 line-through")}
				/>
			</div>
		</NodeViewWrapper>
	);
}

export const TaskList = Node.create<ParagraphOptions>({
	name: "task-list",
	group: "block",
	content: "inline*",

	addOptions() {
		return {
			HTMLAttributes: {
				"data-type": "task-list",
				class: "task-list",
			},
		};
	},
	addAttributes() {
		return {
			checked: {
				default: false,
			},
		};
	},
	parseHTML() {
		return [{ tag: "div[data-type='task-list']" }];
	},
	addNodeView() {
		return ReactNodeViewRenderer(MyNodeView, {
			attrs({ node }) {
				return {
					"data-id": node.attrs.id,
				};
			},
		});
	},
});
