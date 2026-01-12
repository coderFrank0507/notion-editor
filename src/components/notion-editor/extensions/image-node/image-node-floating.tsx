import { useCurrentEditor } from "@tiptap/react";

// --- Lib ---
import { isNodeTypeSelected } from "../../lib/utils";

// --- Tiptap UI ---
import { DeleteNodeButton } from "../../ui/delete-node-button";
import { ImageAlignButton } from "../../ui/image-align-button";

// --- UI Primitive ---
import { Separator } from "../../ui-primitive/separator";
import { ImageCaptionButton } from "../../ui/image-caption-button";
import { ImageUploadButton } from "../../ui/image-upload-button";
import { RefreshCcwIcon } from "../../icons/refresh-ccw-icon";

export function ImageNodeFloating() {
	const { editor } = useCurrentEditor();
	const visible = isNodeTypeSelected(editor, ["image"]);

	if (!editor || !visible) {
		return null;
	}

	return (
		<>
			<ImageAlignButton align="left" />
			<ImageAlignButton align="center" />
			<ImageAlignButton align="right" />
			<Separator />
			<ImageCaptionButton />
			<Separator />
			<ImageUploadButton icon={RefreshCcwIcon} tooltip="Replace" />
			<DeleteNodeButton />
		</>
	);
}
