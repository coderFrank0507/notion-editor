import type { DatabaseContentJson } from "../lib/content-utils";

export const EditorDatabaseContentJson: DatabaseContentJson[] = [
	{
		type: "heading",
		attrs: {
			id: "167ae9bd-ff92-4c6a-90ea-d69ff09d9a05",
			textAlign: null,
			backgroundColor: null,
			level: 2,
			sort: "U",
		},
		content: [["欢迎来到 Easy-Node"]],
	},
	{
		type: "paragraph",
		attrs: {
			id: "d691888a-1af0-433e-9e5e-80147d4b31f2",
			textAlign: null,
			backgroundColor: null,
			sort: "j",
		},
		content: [["在这里编写你的内容 ..."]],
	},
	{
		type: "taskList",
		attrs: {
			id: "43859b6e-f152-4b3c-bfa5-af0514999241",
			textAlign: null,
			backgroundColor: null,
			checked: true,
			sort: "v",
		},
		content: [["已完成待办项"]],
	},
	{
		type: "taskList",
		attrs: {
			id: "d6653fdb-b8d9-48f6-aaad-cd2b1c45d203",
			textAlign: null,
			backgroundColor: null,
			checked: false,
			sort: "x",
		},
		content: [["点击选框完成代办"]],
	},
	{
		type: "image",
		attrs: {
			id: "3e59d805-80d8-44d2-abe3-7639e110b910",
			src: "https://test-image-1316325187.cos.ap-beijing.myqcloud.com/2026-01-16/template_1768554635795.jpg",
			alt: "template",
			title: "template",
			width: 600,
			height: null,
			"data-align": "center",
			showCaption: false,
			sort: "r",
		},
		content: [["template"]],
	},
	{
		type: "bulletList",
		attrs: {
			id: "8b1a0937-4741-4ea4-88e4-5001e090098e",
			textAlign: null,
			backgroundColor: null,
			sort: "yj",
		},
		content: [["选择一段文字，可进行样式设置"]],
	},
	{
		type: "bulletList",
		attrs: {
			id: "cd10ae22-b74a-4ac7-894c-200bb63fe635",
			textAlign: null,
			backgroundColor: null,
			sort: "yr",
		},
		content: [["点击拖动图片弹出更多设置"]],
	},
	{
		type: "codeBlock",
		attrs: {
			id: "be6d9c81-069c-4494-80c4-c1f42e82f845",
			sort: "yU",
		},
		content: [["# Headings\n- Lists\n> Quotes\n`Inline code`"]],
	},
];
