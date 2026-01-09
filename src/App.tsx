import NotionEditor, { databaseToJSONContent } from "./components/notion-editor";
import { databaseData } from "./components/notion-editor/data/database-data";

function App() {
	return (
		<div className="p-10">
			<NotionEditor
				initContent={(editor) => {
					editor.commands.setContent({
						type: "doc",
						content: databaseToJSONContent(databaseData),
					});
				}}
			/>
		</div>
	);
}

export default App;
