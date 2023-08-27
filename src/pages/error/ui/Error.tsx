import { classNames } from 'src/shared/lib/classNames/classNames'
import cl from './Error.module.scss';
import type { PropsWithChildren } from 'react';
import { Button, ThemeButton } from 'src/shared/ui/button/Button';

interface ErrorProps {
	className?: string;
	errorMessage?: string;
}

export function Error(props: PropsWithChildren<ErrorProps>) {
	const { className } = props;
	const message = props.errorMessage ?? '404. Page not found.';

	const reloadPage = () => {
		location.reload()
	}

	return (
		<div 
			className={classNames(cl.Error, {}, [className])}
		>
			<p>
				{'Произошла непредвиденная ошибка.'}
			</p>
			<p>
				{message}
			</p>
			<Button
				theme={ThemeButton.SIMPLE}
				onClick={reloadPage}
			>
				{'Обновить страницу'}
			</Button>
		</div>
	)
}