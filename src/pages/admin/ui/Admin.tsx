import { classNames } from 'src/shared/lib/classNames/classNames'
import cl from './Admin.module.scss';
import { useEffect, type PropsWithChildren } from 'react';
import { useAppSelector } from 'src/shared/lib/hooks/redux';
import { UserCreate } from 'src/widgets/userCreate';
import { UsersList } from 'src/widgets/usersList/ui/UsersList';
import { RequestCreate } from 'src/widgets/requestCreate';
import { RequestsList } from 'src/widgets/requestsList';

interface AdminProps {
	className?: string;
}

export function Admin(props: PropsWithChildren<AdminProps>) {

	const { className } = props;
	const { tab } = useAppSelector( state => state.admin );


	useEffect(() => {

	}, [])

	return (
		<div 
			className={classNames(cl.Admin, {}, [className])}
		>
			{
				(tab === -1 || tab === 3) && (
					<RequestsList />
				)
			}
			{
				tab === 0 && (
					<UserCreate />
				)
			}
			{
				tab === 1 && (
					<UsersList />
				)
			}
			{
				tab === 2 && (
					<RequestCreate />
				)
			}
		</div>
	)
}