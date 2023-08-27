import { classNames } from 'src/shared/lib/classNames/classNames'
import cl from './RequestsList.module.scss';
import React, { useMemo, type PropsWithChildren, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from 'src/shared/api/api';
import { Loader } from 'src/shared/ui/loader/Loader';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Checkbox, ButtonGroup, Stack } from '@mui/material';
import { TRequest, TRequestResponse } from 'src/app/types/IMenu';
import { INewUser, IUser } from 'src/app/types/IUser';
import moment from 'moment';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { adminSlice } from 'src/app/reducers/AdminSlice';
import { useNavigate } from 'react-router-dom';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

interface RequestsListProps {
	className?: string;
}

export function RequestsList(props: PropsWithChildren<RequestsListProps>) {

	const { className } = props;
	const { data: requests, isLoading: isLoadingRequests, isSuccess: IsSuccessRequests } = useQuery('requests', api.getAllRequests )
	const { data: users, isLoading: isLoadingUsers, isSuccess: isSuccessUsers } = useQuery('users', api.getAllUsers )
	const navigate = useNavigate()

	const queryClient = useQueryClient()

	const mutationRequest = useMutation( 
		(id:string) => api.deleteRequest(id),
		{
			onSuccess: (id:string) => {
				queryClient.invalidateQueries(["requests"])
			}
		}
	)

	const mutationDoneRequest = useMutation( 
		(ids:string[]) => api.checkmarkRequests(ids),
		{
			onSuccess: (id:string) => {
				queryClient.invalidateQueries(["requests"])
				setChecked( prev => prev.map( _ => false))
			}
		}
	)

	const usersRefBook:Record<string,IUser> = useMemo(() => {
		if (!Array.isArray(users)) return {}
		return users.reduce( (result:Record<string,IUser>,user:IUser) => {
			result[user.id] = {...user}
			return result;
		}, {})
	}, [users]);

	const [typeSort, setTypeSort] = useState<string>("processed");
	const sortedRequests = useMemo(() => {
		if (!Array.isArray(requests)) return [];
		if (typeSort === "processed") {
			return requests.sort((a:TRequestResponse,b:TRequestResponse) => {
				const ca = a.processed ? 1 : 0;
				const cb = b.processed ? 1 : 0;
				return ca - cb;
			})
		}
		return requests;
	}, [requests, typeSort])

	const [ checked, setChecked ] = useState<boolean[]>([]);

	const checkRequest = function(index: number) {
		return function(e : React.ChangeEvent) {
			setChecked( prev => {
					const newState = Array.from({length: Math.max((sortedRequests?.length ?? 0), checked.length, index)}, 
						(_,i) => prev[i] ?? false);
					newState[index] = !newState[index];
					return newState;
				} )
			}
		}

	const showCheckmarkButton = useMemo(() => {
		return checked.some(Boolean)	
	}, [checked])

	const doneCheckedRequests = (e: React.MouseEvent) => {
		e.stopPropagation();
		const ids = checked.reduce( (result:string[], c:boolean, i:number) => {
			if (c) {
				result.push(sortedRequests[i]['id']);
			}
			return result;
		}, [] )
		mutationDoneRequest.mutate(ids);
	}

	return isLoadingRequests || isLoadingUsers || !Array.isArray(requests) ? (
		<Loader />
		) : (
			<>
				<h2 className={"h2"}>
					{"Requests"}
				</h2>
				{
					showCheckmarkButton && (
						<Stack direction="row" spacing={2} alignContent={"center"} justifyContent={"center"}>
							<Button 
								variant="contained" 
								color="success"
								onClick={doneCheckedRequests}
							>
								Done	
							</Button>
							<Button 
								variant="contained" 
								color="error"
							>
								Remove
							</Button>
						</Stack>
					)
				}
				<TableContainer 
					component={Paper}
					className={classNames(cl.RequestsList, {}, [className])}
				>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
						<TableRow>
							<TableCell align="center" color='alert'>Check</TableCell>
							<TableCell align="center" color='alert'>Processed</TableCell>
							<TableCell align="center">Date</TableCell>
							<TableCell align="center">User name</TableCell>
							<TableCell align="center" color='success'>Phone</TableCell>
							<TableCell align="center" color='alert'>Amount</TableCell>
							<TableCell align="center" color='alert'>Remove</TableCell>
						</TableRow>
						</TableHead>
						<TableBody>
							{
								sortedRequests.map( (request:TRequestResponse,i:number) => {
									const user = usersRefBook[request.user] ?? {
										firstname: 'unknown',
										lastname: 'unknown'
									};
									const date = moment(request.time)
									const initialRequest = typeof request.request == "string" ? JSON.parse(request.request) : request.request;
									const menu = initialRequest.menu;
									const common = initialRequest.common;
									const amount = (common ?? []).reduce( (sum:number,c:any) => sum + c.count, 0) + menu.reduce( (sum:number, cat:any ) => {
										return sum + cat.entities.reduce( (sum:number, ent:any) => sum + ent.count, 0)
									}, 0);
								 	return (
										<TableRow
											key={request.id}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
											className={cl['link-row']}
										>
											<TableCell padding="checkbox">
												<Checkbox
													color="primary"
													checked={checked[i]}
													onChange={checkRequest(i)}
													inputProps={{ 'aria-label': 'select all desserts', }}
												/>
											</TableCell>
											<TableCell 
												component="th" 
												scope="row"
												padding='checkbox'
												align='center'
											>
												{
													request.processed ? <DoneOutlineIcon /> : <HourglassTopIcon />
												}
											</TableCell>
											<TableCell 
												component="th" 
												scope="row"
												className={cl['link-cell']}
												onClick={() => navigate(`/request/${request.id}`, {replace: false})}
											>
												{date.fromNow()}
											</TableCell>
											<TableCell 
												align="center"
												className={cl['link-cell']}
												onClick={() => navigate(`/request/${request.id}`, {replace: false})}
											>
												{`${user.firstname} ${user.lastname}`}
											</TableCell>
											<TableCell 
												align="center"
												className={cl['link-cell']}
												onClick={() => navigate(`/request/${request.id}`, {replace: false})}
											>
												{user.phone}
											</TableCell>
											<TableCell 
												align="center"
												className={cl['link-cell']}
												onClick={() => navigate(`/request/${request.id}`, {replace: false})}
											>
												{amount}
											</TableCell>
											<TableCell align="center">
												<Button 
													onClick={() => mutationRequest.mutate(request.id)}
												>
													 <DeleteForeverIcon/>
												</Button>
											</TableCell>
										</TableRow>
									) 
								} )
							}
						</TableBody>
					</Table>
				</TableContainer>
			</>
		)
}