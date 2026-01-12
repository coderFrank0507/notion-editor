import { JSONContent } from "@tiptap/core";

export const EditorDataJson: JSONContent = {
	type: "doc",
	content: [
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
				{
					type: "text",
					text: "Welcome to ",
				},
				{
					type: "text",
					text: "Notion",
					marks: [{ type: "bold" }, { type: "textStyle", attrs: { color: "var(--tt-c-t-red)" } }],
				},
				{
					type: "text",
					text: "-like ",
				},
				{
					type: "text",
					text: "template",
					marks: [{ type: "highlight", attrs: { color: "var(--tt-c-h-orange)" } }],
				},
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
				{
					type: "text",
					text: "Start writing your thoughts here …",
				},
				{
					type: "hardBreak",
				},
				{
					type: "text",
					text: "Try some ",
				},
				{
					type: "text",
					marks: [
						{
							type: "bold",
						},
					],
					text: "Markdown",
				},
			],
		},
		// {
		// 	type: "image",
		// 	attrs: {
		// 		id: "81b9bf40-8e99-47d4-a5a8-5697f388c5a3",
		// 		src: "https://test-image-1316325187.cos.ap-beijing.myqcloud.com/2025-11-28/01.jpg",
		// 		alt: "test",
		// 		title: "test",
		// 		width: 300,
		// 		height: 500,
		// 		"data-align": "center",
		// 	},
		// },
		{
			type: "taskList",
			attrs: {
				id: "9aa558bd-c8d2-4f38-a574-13505e158fe5",
				textAlign: null,
				backgroundColor: null,
				checked: true,
				sort: "r",
			},
			content: [
				{
					type: "text",
					text: "Read up to this point",
				},
			],
		},
		// {
		// 	type: "taskList",
		// 	attrs: {
		// 		id: "d9b7734a-4b28-4903-9f44-262450bb142d",
		// 		textAlign: null,
		// 		backgroundColor: null,
		// 		checked: false,
		// 	},
		// 	content: [
		// 		{
		// 			type: "text",
		// 			text: "Try a slash command",
		// 		},
		// 	],
		// },
		// {
		// 	type: "taskList",
		// 	attrs: {
		// 		id: "5cceb712-6cb7-4e26-a768-8fb28637b098",
		// 		textAlign: null,
		// 		backgroundColor: null,
		// 		checked: false,
		// 	},
		// 	content: [
		// 		{
		// 			type: "text",
		// 			text: "Mention someone",
		// 		},
		// 	],
		// },
		// {
		// 	type: "codeBlock",
		// 	attrs: {
		// 		id: "81b9bf40-8e99-47d4-a5a8-5697f388c5a4",
		// 		language: null,
		// 	},
		// 	content: [
		// 		{
		// 			type: "text",
		// 			text: "# Headings\n- Lists\n> Quotes\n`Inline code`",
		// 		},
		// 	],
		// },
		// {
		// 	type: "bulletList",
		// 	attrs: {
		// 		id: "b8c80273-447a-4e0e-ab9f-78d0150d0a3b",
		// 		textAlign: null,
		// 		backgroundColor: null,
		// 	},
		// 	content: [
		// 		{
		// 			type: "text",
		// 			text: "Content blocks = Node Components",
		// 		},
		// 	],
		// },
		// {
		// 	type: "bulletList",
		// 	attrs: {
		// 		id: "49974099-ca00-48f1-bd3d-ffd877fa45f1",
		// 		textAlign: null,
		// 		backgroundColor: null,
		// 	},
		// 	content: [
		// 		{
		// 			type: "text",
		// 			text: "Toolbars, menus, and buttons = UI Components",
		// 		},
		// 	],
		// },
		// {
		// 	type: "orderedList",
		// 	attrs: {
		// 		id: "30afe9a9-a336-40ae-8b0c-8cdaa040db81",
		// 		textAlign: null,
		// 		backgroundColor: null,
		// 	},
		// 	content: [
		// 		{
		// 			type: "text",
		// 			text: "Content blocks = Node Components",
		// 		},
		// 	],
		// },
		// {
		// 	type: "orderedList",
		// 	attrs: {
		// 		id: "30afe9a9-a336-40ae-8b0c-8cdaa040db82",
		// 		textAlign: null,
		// 		backgroundColor: null,
		// 		nodeTextAlign: null,
		// 		nodeVerticalAlign: null,
		// 	},
		// 	content: [
		// 		{
		// 			type: "text",
		// 			text: "Toolbars, menus, and buttons = UI Components",
		// 		},
		// 	],
		// },
	],
};
