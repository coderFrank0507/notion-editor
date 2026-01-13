import { eventInfo } from "./on-update";
import { NotionEditorProps } from "../notion-editor";
import { generateBaseIndex } from "./generate-unique-sort";
import type { Editor } from "@tiptap/core";
import type { Slice } from "@tiptap/pm/model";

const onDrop = (slice: Slice, editor: Editor, onDropEnd: NotionEditorProps["onDropEnd"]) => {
	slice.content.forEach((node) => {
		if (node.isBlock) {
			eventInfo.draggedBlockId = node.attrs.id;
		}
	});

	setTimeout(() => {
		const jsonContent = editor.getJSON();
		jsonContent.content.forEach((node, index) => {
			if (node.attrs?.id === eventInfo.draggedBlockId) {
				const prev = jsonContent.content[index - 1];
				const next = jsonContent.content[index + 1];
				const left = prev?.attrs.sort;
				const right = next?.attrs.sort;
				node.attrs.sort = generateBaseIndex(left, right);
				onDropEnd([{ handleType: "update-sort", json: { attrs: node.attrs } }]);
				eventInfo.draggedBlockId = null;
			}
		});
	});
};

export default onDrop;
