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

export function TaskItemView(props: ReactNodeViewProps) {
	const { editor, node, updateAttributes } = props;

	return (
		<NodeViewWrapper>
			<div className="flex items-center">
				<div
					className={cn(
						"size-[16px] mr-2 border-[1.5px] border-text-color rounded relative cursor-pointer",
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
					className={cn("list-item-content", node.attrs.checked && "text-gray-500 line-through")}
				/>
			</div>
		</NodeViewWrapper>
	);
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		taskList: {
			toggleTaskList: (type: string) => ReturnType;
		};
	}
}

export const TaskList = Node.create<ParagraphOptions>({
	name: "taskList",
	group: "block",
	content: "inline*",

	addOptions() {
		return {
			HTMLAttributes: {
				"data-type": "taskList",
				class: "taskList",
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
		return [{ tag: "div" }];
	},
	renderHTML() {
		return ["div", 0];
	},
	addCommands() {
		return {
			toggleTaskList:
				(type) =>
				({ commands }) =>
					commands.toggleNode(this.name, type),
		};
	},
	addNodeView() {
		return ReactNodeViewRenderer(TaskItemView, {
			attrs({ node }) {
				return {
					"data-id": node.attrs.id,
				};
			},
		});
	},
});
