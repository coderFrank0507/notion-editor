import NotionEditor, {
	databaseToJSONContent,
	transacionToDbdata,
} from "./components/notion-editor";
import { databaseData } from "./components/notion-editor/data/database-data";

function App() {
	return (
		<div className="p-10">
			<NotionEditor
				initContent={(editor) => {
					return databaseToJSONContent(databaseData);
				}}
				onUpdate={(data) => {
					console.log("data: ", data);
					const blocks = transacionToDbdata(data);
					console.log("blocks: ", blocks);
				}}
			/>
		</div>
	);
}

export default App;
