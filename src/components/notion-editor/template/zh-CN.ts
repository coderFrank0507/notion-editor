import type { DatabaseContentJson } from "../lib/content-utils";

export const template_ZH_CN: DatabaseContentJson[] = [
	{
		type: "heading",
		attrs: {
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
			textAlign: null,
			backgroundColor: null,
			sort: "j",
		},
		content: [["在这里编写你的内容 ..."]],
	},
	{
		type: "taskList",
		attrs: {
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
			textAlign: null,
			backgroundColor: null,
			sort: "yj",
		},
		content: [["选择一段文字，可进行样式设置"]],
	},
	{
		type: "bulletList",
		attrs: {
			textAlign: null,
			backgroundColor: null,
			sort: "yr",
		},
		content: [["点击拖动图片弹出更多设置"]],
	},
	{
		type: "codeBlock",
		attrs: {
			sort: "yU",
		},
		content: [["# Headings\n- Lists\n> Quotes\n`Inline code`"]],
	},
];
