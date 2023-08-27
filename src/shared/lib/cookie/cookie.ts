import { CookieAttributes } from "node_modules/typescript-cookie/dist/types";

export type CookieProps = Omit<CookieAttributes, "expires"> & {
	expires?: number | Date;
}

export function setCookie(name:string, value:string, props:CookieProps = {}) { 
	const { expires } = props;
	const newProps = {...props};

	if (typeof expires == 'number' && expires) { 
		const d = new Date(); 
		d.setTime(d.getTime() + expires * 3600000); // hours
		newProps.expires = d; 
	}

	if (expires && typeof expires !== "number" && "toUTCString" in expires) { 
		newProps.expires = expires; 
	} 

	value = encodeURIComponent(value); 

	let updatedCookie:string = name + '=' + value; 
	for (const propName in newProps) { 
		updatedCookie += '; ' + propName; 
		const propValue = props[propName as keyof CookieProps]; 
		if (propValue !== true) { 
			updatedCookie += '=' + propValue; 
		} 
	} 
	document.cookie = updatedCookie; 
} 

export function removeCookie (name: string) {
	const cookie = document.cookie.split(";")
		.find( c => c.startsWith(`${name}=`) );
	if (cookie) {
		document.cookie = cookie + ";expires=" + new Date().toUTCString()
	}
}

export function getCookie(name:string) { 
	const matches = document.cookie.match( new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)') ); 
	return matches ? decodeURIComponent(matches[1]) : undefined; 
}