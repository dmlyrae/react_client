import { classNames } from 'src/shared/lib/classNames/classNames'
import cl from './UsersList.module.scss';
import type { PropsWithChildren } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from 'src/shared/api/api';
import { INewUser, IUser } from 'src/app/types/IUser';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Button } from 'src/shared/ui/button/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import React from 'react';
import { useAppDispatch } from 'src/shared/lib/hooks/redux';
import { adminSlice } from 'src/app/reducers/AdminSlice';
import { ApiOutlined } from '@mui/icons-material';

interface UsersListProps {
	className?: string;
}

export function UsersList(props: PropsWithChildren<UsersListProps>) {

	const { className } = props;
	const { data, isLoading } = useQuery('users', api.getAllUsers)
	const queryClient = useQueryClient()
	const mutation = useMutation( 
		(id:string) => api.deleteUser(id),
		{
			onSuccess: (id:string) => {
				queryClient.invalidateQueries(["users"])
				dispatch(adminSlice.actions.changeTab(1))
			}
		}
	)
	const dispatch = useAppDispatch()

	if (isLoading) return (<div>{"Loading...."}</div>);

	const addUser = (e: React.MouseEvent) => {
		e.stopPropagation()
		dispatch(adminSlice.actions.changeTab(0))
	}

	return Array.isArray(data) && (
		<TableContainer 
			component={Paper}
			className={classNames(cl.UsersList, {}, [className])}
		>
		<Table sx={{ minWidth: 650 }} aria-label="simple table">
			<TableHead>
			<TableRow>
				<TableCell>Login</TableCell>
				<TableCell align="center">Firtst name</TableCell>
				<TableCell align="center">Last Name</TableCell>
				<TableCell align="center">Phone</TableCell>
				<TableCell align="center" color='alert'>Delete</TableCell>
			</TableRow>
			</TableHead>
			<TableBody>
			{
				data.map( (user:IUser) => (
					<TableRow
						key={user.id}
						sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            		>
						<TableCell component="th" scope="row">
							{user.login}
						</TableCell>
						<TableCell align="center">
							{user.firstname}
						</TableCell>
						<TableCell align="center">
							{user.lastname}
						</TableCell>
						<TableCell align="center">
							{user.phone}
						</TableCell>
						<TableCell align="center">
							<Button 
								sandbox='' 
								onClick={() => mutation.mutate(user.id)}
							>
								<DeleteForeverIcon/>
							</Button>
						</TableCell>
					</TableRow>
				) )
			}
			<TableRow
				sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
			>
				<TableCell align='center'>
					<Button
						onClick={addUser}
					>
						Add user
					</Button>
				</TableCell>
			</TableRow>
			</TableBody>
		</Table>
		</TableContainer>
	)
}