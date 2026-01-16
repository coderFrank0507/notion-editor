import type { DatabaseContentJson } from "../lib/content-utils";

export const template_EN: DatabaseContentJson[] = [
	{
		type: "heading",
		attrs: {
			textAlign: null,
			backgroundColor: null,
			level: 1,
			sort: "U",
		},
		content: [["Welcome to Easy-Note"]],
	},
	{
		type: "paragraph",
		attrs: {
			textAlign: null,
			backgroundColor: null,
			sort: "j",
		},
		content: [["Start writing your thoughts here …"]],
	},
	{
		type: "taskList",
		attrs: {
			textAlign: null,
			backgroundColor: null,
			checked: true,
			sort: "v",
		},
		content: [["Read up to this point"]],
	},
	{
		type: "taskList",
		attrs: {
			textAlign: null,
			backgroundColor: null,
			checked: false,
			sort: "x",
		},
		content: [["Try a slash command"]],
	},
	{
		type: "image",
		attrs: {
			id: "81b9bf40-8e99-47d4-a5a8-5697f388c5a3",
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
		content: [["Content blocks = Node Components"]],
	},
	{
		type: "bulletList",
		attrs: {
			textAlign: null,
			backgroundColor: null,
			sort: "yr",
		},
		content: [["Toolbars, menus, and buttons = UI Components"]],
	},
	{
		type: "codeBlock",
		attrs: {
			sort: "yU",
		},
		content: [["# Headings\n- Lists\n> Quotes\n`Inline code`"]],
	},
];
