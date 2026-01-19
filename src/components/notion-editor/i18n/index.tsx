import zhCN from "./zh-CN";
import en from "./en";

import { createContext, useContext } from "react";

const LanguageStore = {
	"zh-CN": zhCN,
	en,
};

export type LangKey = keyof typeof LanguageStore;

export const LangContext = createContext<{
	lang: LangKey;
}>({ lang: "zh-CN" });

function getObjValue(obj: any, path: string) {
	const keys = path.split(".");
	let cur = obj;

	for (const key of keys) {
		if (cur == null) return undefined;
		cur = cur[key];
	}

	return cur;
}

export const useLanguage = () => {
	const { lang } = useContext(LangContext);

	const t = (path?: string) => {
		if (!path) return null;
		return getObjValue(LanguageStore[lang], path);
	};

	return { t };
};
