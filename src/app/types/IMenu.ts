

export type TEntity = {
	category: string; 
	name: string;
	label: string;
	max: number;
}

export type TCategory = {
	name: string;
	label: string;
	entities: TEntity[];
}

export interface TRequestEntity extends TEntity {
	count: number; 
}

export interface TCommonWish {
	count: number; 
	text: string;
}

export interface TRequestCategory {
	name: string;
	label: string;
	entities: TRequestEntity[];
}

export type TRequest = {
	menu: TRequestCategory[];
	common: TCommonWish[];
}


export type TRequestResponse = {
	request: string | TRequest;
	user: string;
	id: string;
	time: string;
	processed: boolean;
}