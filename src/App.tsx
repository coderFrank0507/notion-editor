import NotionEditor, {
	databaseToJSONContent,
	transacionToDbdata,
} from "./components/notion-editor";
import { databaseData } from "./components/notion-editor/data/database-data";

function App() {
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
			/>
		</div>
	);
}

export default App;
