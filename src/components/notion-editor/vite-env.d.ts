/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly BUCKET_NAME: string;
	readonly BUCKET_API_ENDPOINT: string;
	readonly BUCKET_REGION: string;
	readonly BUCKET_ACCESS_KEY_ID: string;
	readonly BUCKET_SECRET_ACCESS_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
