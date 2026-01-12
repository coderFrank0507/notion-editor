import { useEffect, useRef, useState } from "react";
import { Uppy } from "@uppy/core";
import AWSS3 from "@uppy/aws-s3";
import NotionEditor, {
	databaseToJSONContent,
	transacionToDbdata,
} from "./components/notion-editor";
import { databaseData } from "./components/notion-editor/data/database-data";
import { createPresignedUrl } from "./http/file";

function App() {
	const updateProgress = useRef(null);

	const [uppy] = useState(() => {
		const uppy = new Uppy();
		uppy.use(AWSS3, {
			shouldUseMultipart: false,
			async getUploadParameters(file) {
				try {
					const result = await createPresignedUrl({
						filename: file.data instanceof File ? file.data.name : "test",
						type: file.data instanceof File ? file.data?.type : "",
						size: file.size!,
					});
					console.log("result: ", result);
					return result;
				} catch (error) {
					console.log(error);
				}
			},
		});
		return uppy;
	});

	useEffect(() => {
		const handleProgress = (_: any, progress: any) => {
			updateProgress.current?.({
				progress: Math.round((progress.bytesUploaded / progress.bytesTotal) * 100),
			});
		};

		const handleUploadSuccess = () => {
			uppy.cancelAll();
		};

		uppy.on("upload-progress", handleProgress);
		uppy.on("complete", handleUploadSuccess);

		return () => {
			uppy.off("upload-progress", handleProgress);
			uppy.off("complete", handleUploadSuccess);
		};
	}, [uppy]);

	return (
		<div className="p-10">
			<NotionEditor
				initContent={() => {
					return databaseToJSONContent(databaseData);
				}}
				onUpdate={(data) => {
					const blocks = transacionToDbdata(data);
					console.log("onUpdate: ", blocks);
				}}
				onDropEnd={(data) => {
					console.log("onDropEnd: ", data);
				}}
				uploadImageConfig={{
					maxSize: 3 * 1024 * 1024, // 3MB
					upload: async (file, onProgress) => {
						console.log("file: ", file);
						if (!updateProgress.current) updateProgress.current = onProgress;
						uppy.addFile({ name: file.name, data: file });
						const res = await uppy.upload();
						const { successful } = res;
						const [response] = successful;
						return response.uploadURL;
					},
					onError: (error) => {
						console.log("error: ", error);
					},
				}}
			/>
		</div>
	);
}

export default App;
