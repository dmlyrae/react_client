interface getErrorMessage {
	(e:Error|unknown): string;
}
export const getErrorMessage:getErrorMessage = (e) => e instanceof Error ? e.message : typeof e === "string" ? e : String(e);