type Mods = Record<string, boolean | string>

export function classNames (cls: string, mods: Mods = {}, additional: Array<string | undefined> = []): string {
	return [
		cls,
		...additional,
		...Object.entries(mods)
			.filter(([, value]) => Boolean(value))
			.map(([className]) => className)
	].join(' ')
}
