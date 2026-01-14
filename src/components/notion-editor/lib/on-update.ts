import { type HandleBlockJson, patchBlock } from "./content-utils";
import { CacheMap, type NotionEditorProps } from "../notion-editor";
import type { EditorEvents } from "@tiptap/core";
import { generateBaseIndex } from "./generate-unique-sort";

export const eventInfo: {
	canUpdate: boolean;
	draggedBlockId: string | null;
} = {
	canUpdate: true,
	draggedBlockId: null,
};

const onUpdate = (props: EditorEvents["update"], handleUpdate?: NotionEditorProps["onUpdate"]) => {
	// 排序时不执行此函数
	if (!eventInfo.canUpdate) {
		eventInfo.canUpdate = true;
		return;
	}

	console.log("onUpdate");

	const { editor, transaction } = props;
	// 没有文档变更，直接返回空
	if (!transaction.docChanged || editor.isEmpty) return;

	const result: HandleBlockJson[] = [];

	const { content } = editor.getJSON();

	for (let i = 0, length = content.length; i < length; i++) {
		const item = content[i];
		const cache = CacheMap.get(item.attrs!.id);
		if (cache) {
			const changed = patchBlock(cache, item);
			if (changed) result.push({ handleType: "update", json: item });
		} else {
			const left = content[i - 1]?.attrs.sort;
			const right = content[i + 1]?.attrs.sort;
			item.attrs.sort = generateBaseIndex(left, right);
			result.push({ handleType: "create", json: item });
		}
		CacheMap.delete(item.attrs!.id);
	}

	if (CacheMap.size) {
		Array.from(CacheMap.values()).forEach((item) => {
			result.push({ handleType: "delete", json: item });
			CacheMap.delete(item.attrs!.id);
		});
	}

	// 缓存新的数据
	CacheMap.clear();
	content.forEach((item) => {
		CacheMap.set(item.attrs!.id, item);
	});

	if (result.length) handleUpdate?.(result);
};

export default onUpdate;
