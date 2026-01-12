const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE = CHARS.length;

const charToRank = (c: string) => CHARS.indexOf(c);
const rankToChar = (r: number) => CHARS[r];

export function generateBaseIndex(left: string | null, right: string | null): string {
	let result = "";
	let i = 0;

	while (true) {
		const l = left && i < left.length ? charToRank(left[i]) : 0;
		const r = right && i < right.length ? charToRank(right[i]) : BASE - 1;

		if (r - l > 1) {
			const mid = Math.floor((l + r) / 2);
			result += rankToChar(mid);
			return result;
		}

		result += rankToChar(l);
		i++;
	}
}

function generateUniqueSuffix(clientId: string, counter: number) {
	return `${clientId}${counter.toString(36)}`;
}

function randomSuffix(length = 4) {
	let s = "";
	for (let i = 0; i < length; i++) {
		s += CHARS[Math.floor(Math.random() * BASE)];
	}
	return s;
}

export function generateConcurrentIndex(
	left: string | null,
	right: string | null,
	options: {
		clientId?: string;
		counter?: number;
	} = {}
): string {
	const base = generateBaseIndex(left, right);

	// 推荐：clientId + counter
	if (options.clientId && options.counter !== undefined) {
		return `${base}|${generateUniqueSuffix(options.clientId, options.counter)}`;
	}

	// 简化版：随机
	return `${base}|${randomSuffix()}`;
}
