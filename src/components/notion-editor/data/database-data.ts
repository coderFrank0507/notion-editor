import { DatabaseContentJson } from "../lib/content-utils";

export const databaseData: DatabaseContentJson[] = [
	{
		type: "heading",
		attrs: {
			id: "b6cd8ecb-fc0d-4575-ab93-3418a52279b9",
			textAlign: null,
			backgroundColor: null,
			level: 1,
			sort: "U",
		},
		content: [
			["Welcome to "],
			["Notion", [["t", "var(--tt-c-t-red)"], ["b"]]],
			["-like "],
			["template", [["h", "var(--tt-c-h-orange)"]]],
		],
	},
	{
		type: "paragraph",
		attrs: {
			id: "70447a3a-b34b-4b71-975d-d70ba7376c13",
			textAlign: null,
			backgroundColor: null,
			sort: "j",
		},
		content: [
			["Start writing your thoughts here …"],
			[
				{
					type: "hardBreak",
				},
			],
			["Try some "],
			["Markdown", [["b"]]],
		],
	},
	{
		type: "image",
		attrs: {
			id: "81b9bf40-8e99-47d4-a5a8-5697f388c5a3",
			src: "https://test-image-1316325187.cos.ap-beijing.myqcloud.com/2025-11-28/01.jpg",
			alt: "test",
			title: "test",
			width: 200,
			height: 500,
			"data-align": "center",
			showCaption: false,
			sort: "r",
		},
		content: [["test"]],
	},
	{
		type: "taskList",
		attrs: {
			id: "9aa558bd-c8d2-4f38-a574-13505e158fe5",
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
			id: "d9b7734a-4b28-4903-9f44-262450bb142d",
			textAlign: null,
			backgroundColor: null,
			checked: false,
			sort: "x",
		},
		content: [["Try a slash command"]],
	},
	{
		type: "taskList",
		attrs: {
			id: "5cceb712-6cb7-4e26-a768-8fb28637b098",
			textAlign: null,
			backgroundColor: null,
			checked: false,
			sort: "y",
		},
		content: [["Mention someone"]],
	},
	{
		type: "codeBlock",
		attrs: {
			id: "81b9bf40-8e99-47d4-a5a8-5697f388c5a4",
			sort: "yU",
		},
		content: [["# Headings\n- Lists\n> Quotes\n`Inline code`"]],
	},
	{
		type: "bulletList",
		attrs: {
			id: "b8c80273-447a-4e0e-ab9f-78d0150d0a3b",
			textAlign: null,
			backgroundColor: null,
			sort: "yj",
		},
		content: [["Content blocks = Node Components"]],
	},
	{
		type: "bulletList",
		attrs: {
			id: "49974099-ca00-48f1-bd3d-ffd877fa45f1",
			textAlign: null,
			backgroundColor: null,
			sort: "yr",
		},
		content: [["Toolbars, menus, and buttons = UI Components"]],
	},
	{
		type: "orderedList",
		attrs: {
			id: "30afe9a9-a336-40ae-8b0c-8cdaa040db81",
			textAlign: null,
			backgroundColor: null,
			sort: "yv",
		},
		content: [["Content blocks = Node Components"]],
	},
	{
		type: "orderedList",
		attrs: {
			id: "30afe9a9-a336-40ae-8b0c-8cdaa040db82",
			textAlign: null,
			backgroundColor: null,
			sort: "yx",
		},
		content: [["Toolbars, menus, and buttons = UI Components"]],
	},
];
