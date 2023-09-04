import { classNames } from 'src/shared/lib/classNames/classNames'
import cl from './SingleRequest.module.scss';
import React, { useMemo, type PropsWithChildren } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TCommonWish, TRequestCategory, TRequestEntity, TRequestResponse } from 'src/app/types/IMenu';
import { useQuery } from 'react-query';
import api from 'src/shared/api/api';
import { Loader } from 'src/shared/ui/loader/Loader';
import { IUser } from 'src/app/types/IUser';
import { Box, List, ListItem, ListItemText, Divider, Paper, Button } from '@mui/material';

interface SingleRequestProps {
	className?: string;
	request?: TRequestResponse;
	user?: IUser;
}

interface TFullRequest extends Omit<TRequestResponse, "user"> {
	user: IUser;
}

export function SingleRequest(props: PropsWithChildren<SingleRequestProps>) {

	const { className, request, user } = props;
	const params = useParams();
	const navigate = useNavigate();

	const getRequest = async () => {
		if (request) return [request];
		if (!params.id) return [];
		return await api.getSingleRequest(params.id); 
	}

	const { data: dbRequests, isSuccess: isSuccessRequest } = useQuery(["requests"], getRequest)

	const trueRequest:TFullRequest|undefined = useMemo(() => {
		if (!params.id) return undefined;
		console.log('dbRequests', dbRequests)
		let r!:TFullRequest;
		if (Array.isArray(dbRequests)) {
			r = dbRequests.find( req => req.id == params.id);
		} else {
			r = dbRequests;
		}
		// console.log('dbRequests', dbRequests)
		// console.log('dbRequests', dbRequests.find( (req:any) => req.id === params.id))
		if (!r) return undefined;
		return {
			...r,
			request: typeof r.request === "string" ? JSON.parse(r.request) : r.request,
		} 
	}, [params.id, dbRequests ]) 

	const trueUser:IUser|undefined = useMemo(() => {
		if (user) return user;
		if (!trueRequest) return undefined;
		return trueRequest.user;
	}, [params.id, trueRequest, user]) 

	// console.log('trueRequest', trueRequest)
	// console.log('trueUser', trueUser)

	return isSuccessRequest && trueRequest && trueUser ? (
		<>
			<Box 
				sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
				className={classNames(cl.SingleRequest, {}, [className])}
			>
				<Paper 
					elevation={3} 
					className={cl["user"]}
				>
					<h2 className={"h2"}>
						{`${trueUser?.firstname} ${trueUser?.lastname}`}
					</h2>
					<p>
						{`Phone: ${trueUser?.phone}`}
					</p>
					<p>
						{`Address: ${trueUser?.address}`}
					</p>
				</Paper>
			</Box>
			<Box 
				sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
				className={classNames(cl.SingleRequest, {}, [className])}
			>
				{
					// @ts-ignore
					trueRequest.request.menu.map( (cat:TRequestCategory,i:number) => (
						<React.Fragment key={i}>
							<h3 className={"h3"}>
								{cat.label}
							</h3>
							<List>
								{
									cat.entities.map((ent:TRequestEntity,ii:number) => (
										<ListItem key={ii}>
											<ListItemText 
												primary={ent.label} 
												secondary={ent.count}
											/>
										</ListItem>
									))
								}
							</List>
	  						<Divider />
						</React.Fragment>
					) )
				}
				{
					//@ts-ignore
					trueRequest.request.common.lenth && (
						<React.Fragment>
							<h3 className={"h3"}>
								{"Common wishes"}
							</h3>
							<List>
								{
									//@ts-ignore
									trueRequest.request.common.map((com:TCommonWish,i:number) => (
										<ListItem key={i} >
											<ListItemText 
												primary={com.text} 
												secondary={com.count}
											/>
										</ListItem>
									))
								}
							</List>
							<Divider />
						</React.Fragment>
					)
				}
			</Box>
			<Button
				variant='contained'
				color="success"
				onClick={() => navigate(-1)}
			>{"Back"}</Button>
		</>
	) : (
		<Loader />
	)
}