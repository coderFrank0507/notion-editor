import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function createPresignedUrl({
	filename,
	type,
	size,
}: {
	filename: string;
	type: string;
	size: number;
}) {
	const date = new Date();
	const isoString = date.toISOString();
	const dateString = isoString.split("T")[0];

	const params: PutObjectCommandInput = {
		Bucket: import.meta.env.VITE_BUCKET_NAME,
		Key: `${dateString}/${filename.replaceAll(" ", "_")}_${date.getTime()}`,
		ContentType: type,
		ContentLength: size,
	};

	const s3Client = new S3Client({
		endpoint: import.meta.env.VITE_BUCKET_API_ENDPOINT,
		region: import.meta.env.VITE_BUCKET_REGION,
		credentials: {
			accessKeyId: import.meta.env.VITE_BUCKET_ACCESS_KEY_ID,
			secretAccessKey: import.meta.env.VITE_BUCKET_SECRET_ACCESS_KEY,
		},
	});

	const command = new PutObjectCommand(params);
	const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

	return {
		url,
		method: "PUT" as const,
	};
}
