/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BUCKET_NAME: string;
	readonly VITE_BUCKET_API_ENDPOINT: string;
	readonly VITE_BUCKET_REGION: string;
	readonly VITE_BUCKET_ACCESS_KEY_ID: string;
	readonly VITE_BUCKET_SECRET_ACCESS_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
