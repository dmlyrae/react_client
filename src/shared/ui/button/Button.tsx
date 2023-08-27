import { classNames } from 'src/shared/lib/classNames/classNames'
import cl from './Button.module.scss'
import type { PropsWithChildren } from 'react'

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
	className?: string;
	theme?: ThemeButton;
	disabled?: boolean;
}

export enum ThemeButton {
	CLEAR = 'clear',
	ACCENT = 'accent',
	SIMPLE = 'simple',
	REMOVE = 'remove',
}

const validtypes = ["reset", "button", "submit", "remove"];

export function Button (props: PropsWithChildren<ButtonProps>) {
	const {
			className,
			children,
			theme = ThemeButton.SIMPLE,
			type,
			...otherProps
	} = props

	const buttonType = (type === 'reset' || type === 'submit' ) ? type : 'button';

	return (
			<button
				type={buttonType}
				className={classNames(cl.Button, {}, [className, cl[theme]])}
				{...otherProps}
			>
				{children}
			</button>
		)
}
