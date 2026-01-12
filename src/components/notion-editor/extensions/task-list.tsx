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
		<NodeViewWrapper as={"ul"}>
			<div className="flex items-start py-0.5">
				<div contentEditable={false} className="w-4 h-6 mr-1.5 flex items-center">
					<div
						className={cn(
							"size-4 border-[1.5px] rounded relative cursor-pointer",
							node.attrs.checked
								? "bg-(--tt-color-blue-dec-1) border-(--tt-color-blue-dec-1)"
								: "border"
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
							className={cn("block size-full", node.attrs.checked ? "block" : "none")}
							color={node.attrs.checked ? "white" : "transparent"}
						/>
					</div>
				</div>

				<NodeViewContent
					className={cn(
						"list-item-content flex-1",
						node.attrs.checked && "text-gray-500 line-through"
					)}
					style={{ backgroundColor: node.attrs.backgroundColor }}
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
