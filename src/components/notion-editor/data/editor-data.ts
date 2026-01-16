import { JSONContent } from "@tiptap/core";

export const EditorDataJson: JSONContent = {
	type: "doc",
	content: [
		{
			type: "image",
			attrs: {
				id: "81b9bf40-8e99-47d4-a5a8-5697f388c5a3",
				src: "https://test-image-1316325187.cos.ap-beijing.myqcloud.com/2025-11-28/01.jpg",
				alt: "test",
				title: "test",
				width: 300,
				height: 500,
				"data-align": "center",
			},
		},
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
		{
			type: "taskList",
			attrs: {
				id: "d9b7734a-4b28-4903-9f44-262450bb142d",
				textAlign: null,
				backgroundColor: null,
				checked: false,
			},
			content: [
				{
					type: "text",
					text: "Try a slash command",
				},
			],
		},
	],
};
