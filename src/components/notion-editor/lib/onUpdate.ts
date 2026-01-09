import {
	type HandleBlockType,
	transacionToDbdata,
	type HandleBlockJson,
	blockHasChanged,
} from "./content-utils";
import { CacheMap } from "../notion-editor";
import type { EditorEvents } from "@tiptap/core";

export const dropInfo = {
	droping: false,
};

const onUpdate = (
	props: EditorEvents["update"],
	handleUpdate?: (data: HandleBlockJson[]) => void
) => {
	// 排序时不执行此函数
	if (dropInfo.droping) {
		dropInfo.droping = false;
		return;
	}

	const { editor, transaction } = props;
	// 没有文档变更，直接返回空
	if (!transaction.docChanged) return;

	const result: HandleBlockJson[] = [];

	const { content } = editor.getJSON();

	// const sortRes: DropResultItem[] = [];
	const startIndex: number[] = [];

	for (let i = 0, length = content.length; i < length; i++) {
		const item = content[i];
		const cache = CacheMap.get(item.attrs!.id);
		if (cache) {
			const changed = blockHasChanged(cache.json, item);
			if (changed) {
				startIndex.push(cache.sort);
				result.push({ handleType: "update", json: item, sort: cache.sort });
			}
		} else {
			startIndex.push(i);
			result.push({ handleType: "create", json: item, sort: i });
		}
		CacheMap.delete(item.attrs!.id);
	}

	if (CacheMap.size) {
		Array.from(CacheMap.values()).forEach((item) => {
			startIndex.push(item.sort);
			result.push({ handleType: "delete", json: item.json, sort: item.sort });
			CacheMap.delete(item.json.attrs!.id);
		});
	}

	const start = Math.min(...startIndex);

	// 缓存新的数据
	CacheMap.clear();
	content.forEach((item, i) => {
		CacheMap.set(item.attrs!.id, { sort: i, json: item });
		// sortRes.push({ id: item.attrs!.id, type: item.type, sort: i });
	});

	if (result.length) handleUpdate?.(result);
};

export default onUpdate;
