import { JSONContent } from "@tiptap/core";
import { isEqual } from "lodash-es";

export type FontStyle = "b" | "i" | "u" | "s";
export type FontColor = string;
export type PropertyType = [FontStyle | "t" | "h", FontColor?];
export type NodeItem = [string | JSONContent, Array<PropertyType>?];
export type DatabaseContentJson = {
	type: string;
	attrs?: JSONContent["attrs"];
	content?: Array<NodeItem>;
};
export type HandleType = "create" | "update" | "delete";
export interface HandleBlockType {
	handleType: HandleType;
	json: DatabaseContentJson;
}
export interface HandleBlockJson {
	handleType: HandleType;
	json: JSONContent;
	sort: number;
}

function isSameArray(c1: Array<JSONContent>, c2: Array<JSONContent>) {
	return Array.isArray(c1) === Array.isArray(c2);
}

export function blockHasChanged(n1: JSONContent, n2: JSONContent) {
	// console.log(n1, n2);
	// 块类型是否一致
	if (n1.type !== n2.type) return true;

	// 对比块级属性
	if (!isEqual(n1.attrs, n2.attrs)) return true;

	const n1cl = n1.content?.length;
	const n2cl = n2.content?.length;
	// 数组长度是否一致
	if (n1cl !== n2cl) return true;

	if (n1cl && n2cl) {
		// n1 n2 的 content 是否都有内容并且都是数组
		if (!isSameArray(n1.content, n2.content)) return true;

		for (let i = 0; i < n1cl; i++) {
			const c1 = n1.content[i];
			const c2 = n2.content[i];

			// 内容类型是否一致，有 text | hardBreak
			if (c1.type !== c2.type) return true;
			// 内容属性是否一致
			if (!isEqual(c1.attrs, c2.attrs)) return true;

			// 内容是否一致
			if (c1.text !== c2.text) return true;

			const m1l = c1.marks?.length;
			const m2l = c2.marks?.length;
			// 长度是否一致
			if (m1l !== m2l) return true;

			if (m1l && m2l) {
				// 新旧内容的标记属性是否都有内容并且都是数组
				if (!isSameArray(c1.marks, c2.marks)) return true;

				for (let j = 0; j < m1l; j++) {
					const n1mi = c1.marks[j];
					const n2mi = c2.marks[j];
					// 标记类型是否一致，有 bold | italic | textStyle 等
					if (n1mi.type !== n2mi.type) return true;
					// mark.type = textStyle 时，会有 attrs 属性
					if (!isEqual(n1mi.attrs, n2mi.attrs)) return true;
				}
			}
		}
	}
	return false;
}

function textContent(contentItem: JSONContent) {
	if (contentItem.type === "hardBreak") return contentItem;
	return contentItem.text;
}

function fontProperty(marks: JSONContent["marks"]) {
	const property: PropertyType[] = [];
	if (marks?.length) {
		for (const mark of marks) {
			switch (mark.type) {
				case "bold":
					property.push(["b"]);
					break;
				case "italic":
					property.push(["i"]);
					break;
				case "strike":
					property.push(["s"]);
					break;
				case "underline":
					property.push(["u"]);
					break;
				case "textStyle":
					property.push(["t", mark.attrs!.color]);
					break;
				case "highlight":
					property.push(["h", mark.attrs!.color]);
					break;
			}
		}
	}

	return property;
}

// paragraph, heading, codeBlock 都可以用次方法格式化
function transformContent(content: Array<JSONContent>) {
	const list: NodeItem[] = [];
	for (const item of content) {
		const text = textContent(item);
		if (item.marks) {
			const property = fontProperty(item.marks);

			list.push([text ?? "", property]);
		} else {
			list.push([text ?? ""]);
		}
	}
	return list;
}

export function transacionToDbdata(json: JSONContent, handleType: HandleType): DatabaseContentJson {
	const result: DatabaseContentJson = { type: json.type! };
	if (json.attrs) result["attrs"] = json.attrs;
	if (json.content && handleType !== "delete") {
		const content = transformContent(json.content);
		result["content"] = content;
	}
	return result;
}

// --- Database to JSONContent

function parseContent(data: NodeItem) {
	const [text, property] = data;
	if (typeof text === "string") {
		const blockContentItem: JSONContent = {
			type: "text",
			text,
		};
		if (property) {
			const marks: JSONContent["marks"] = [];
			for (const [type, value] of property) {
				switch (type) {
					case "b":
						marks.push({ type: "bold" });
						break;
					case "i":
						marks.push({ type: "italic" });
						break;
					case "s":
						marks.push({ type: "strike" });
						break;
					case "u":
						marks.push({ type: "underline" });
						break;
					case "t":
						marks.push({ type: "textStyle", attrs: { color: value } });
						break;
					case "h":
						marks.push({ type: "highlight", attrs: { color: value } });
						break;
				}
			}
			if (marks.length) blockContentItem["marks"] = marks;
		}

		return blockContentItem;
	} else {
		return text;
	}
}

export function databaseToJSONContent(data: Array<DatabaseContentJson>) {
	const content: JSONContent[] = [];

	for (const item of data) {
		const block: JSONContent = {
			type: item.type,
			attrs: item.attrs,
		};
		if (item.content?.length) {
			const blockContent: Array<JSONContent> = [];
			for (const i of item.content) {
				blockContent.push(parseContent(i));
			}
			if (blockContent.length) block["content"] = blockContent;
		}
		content.push(block);
	}

	return content;
}
