import { classNames } from 'src/shared/lib/classNames/classNames'
import cl from './Requests.module.scss';
import { useMemo, type PropsWithChildren, useState, useReducer, useEffect } from 'react';
import { Loader } from 'src/shared/ui/loader/Loader';
import { useQuery } from 'react-query';
import api from 'src/shared/api/api';
import { TCategory, TCommonWish, TRequest, TRequestCategory, TRequestEntity } from 'src/app/types/IMenu';
import { getErrorMessage } from 'src/shared/api/getErrorMessage';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import { Box, List, ListSubheader, Stack, Button, ListItemIcon, ListItemButton, ListItemText, Collapse, TextField } from '@mui/material';
import React from 'react';
import { useAppDispatch } from 'src/shared/lib/hooks/redux';
import CategoryIcon from '@mui/icons-material/Category';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SendIcon from '@mui/icons-material/Send';
import LoopIcon from '@mui/icons-material/Loop';
import AddCommentIcon from '@mui/icons-material/AddComment';

const initialState:TRequest = {
	menu: [],
	common: [],
}

type dispatchNames = "increment" | "decrement" | "add" | "remove" | "fill" | "reset";

interface RequestsProps {
	className?: string;
}
export function Requests(props: PropsWithChildren<RequestsProps>) {

	const { className } = props;
	const dispatch = useAppDispatch();
	const { data:lastMenu, isLoading } = useQuery('menu', api.currentMenuGet)
	const [ openList, setOpenList ] = useState<boolean[]>([]);

	const reducer = (state:TRequest, action: {type: dispatchNames, payload: TRequestEntity | [number, TCommonWish] | TCategory[] | null}):TRequest => {
		const { type, payload } = action;
		if (type === "reset" || payload === null) return {...initialState};
		if ("category" in payload) {
			const categoryIndex = state.menu.findIndex( category => category.name === payload.category )
			switch (type) {
				case "increment":
				case "decrement":
					if (categoryIndex > -1) {
						const inc = type === "increment" ? 1 : -1;
						let entities = state.menu[categoryIndex]["entities"];
						const entityIndex = entities.findIndex( entity => entity.name === payload.name )
						entities = entities.map( (e,i) => {
							return i === entityIndex ? {...e, count: (e.count ?? 0) + inc} : e;
						});
						return {
							...state,
							menu: state.menu.map( (c,i) => {
								if (i === categoryIndex) {
									return {
										...c,
										entities: entities,
									}
								}
								return c;
							})
						} 
					}
					return state;
			}
		}
		if (Array.isArray(payload)) {
			const index = payload[0] as number;
			const newWish = payload[1] as TCommonWish;
			switch (type) {
				case "add":
					return {
						...state,
						common: Array.prototype.concat.call([], state.common, newWish),
					}
				case "remove":
					return {
						...state,
						common: state.common.filter( (_,i) => i !== index ),
					}
				case "increment":
				case "decrement":
					const inc = type === "increment" ? 1 : -1;
					return {
						...state,
						common: state.common.map( (c,i) => {
							if (i === index) {
								return { ...c, count: c.count + inc }
							}
							return c;
						} ).filter ( c => c.count > 0 )
					}
				case "fill":
					const adminMenu = payload as TCategory[]
					return {
						common: [],
						menu: adminMenu.map( (category)=> ({
							...category,
							entities: category.entities.map( entity => ({
								...entity,
								count: 0,
							}))
						}))
					}
			}
		}
		return state;
	}

	const [ request, dispatchRequest ] = useReducer(reducer, { ...initialState })

	const menu = useMemo(() => {
		if (lastMenu?.menu) {
			let parsedMenu:TCategory[] = [];
			try {
				if (typeof lastMenu.menu === "string") {
					parsedMenu = JSON.parse(lastMenu.menu);
				} else {
					if (Array.isArray(lastMenu.menu)) {
						parsedMenu = lastMenu.menu;
					}
				}
			} catch (e) {
				console.error(getErrorMessage(e))
			} finally {
				return parsedMenu;
			}
		}
		return [];
	}, [lastMenu]) 

	useEffect(() => {
		if (menu.length) {
			dispatchRequest({
				type: "fill",
				payload: menu,
			})
		}
	}, [menu])


	const [ isSending, setIsSending ] = useState<boolean>(false);
	const [ error, setError ] = useState<string>("");

	const sendRequest = async (e: React.MouseEvent) => {
		e.stopPropagation()
		e.preventDefault()
		if (isSending) return;
		setIsSending(true);
		const result = await api.createRequest(request);
		setIsSending(false);
		setError( () => result.error ?? "");
		if (!error) {
			dispatchRequest({type: "reset", payload: null})
		}
	}

	const [commonWish, setCommonWish ] = useState<string>("");

	const addCommonWish = (e: React.MouseEvent | React.FormEvent<HTMLDivElement>) => {
		e.stopPropagation();
		const newValue = commonWish.trim();
		if (newValue) {
			dispatchRequest({type: "add", payload: [-1, {
				count: 1,
				text: newValue,	
			}]})
			setCommonWish("")
		}
	}


	return isLoading || !Array.isArray(request?.menu) ? (
		<Loader />
	) : (
	<>
		<h1 className={"h1"}>Category List</h1>
		<Box
			alignContent={"center"}
			width={"100%"}
			className={cl["Requests"]}
		>
			{/* MAIN FORM LIST */}

			<List
				sx={{ width: '100%', bgcolor: 'background.paper' }}
				component="nav"
				aria-labelledby="nested-list-subheader"
				subheader={
					<ListSubheader 
						component="div" 
						style={{alignItems: "center", display: "flex", justifyContent: "center"}} 
					>
						{"Menu items"}
					</ListSubheader>
				}
			>
				{
					request.menu.map( (category,i) => (

						<React.Fragment key={i}>

							<Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">

								<ListItemButton onClick={() => setOpenList( prev => menu.map( (_,bi) => i === bi ? !(prev[bi]) : Boolean(prev[bi]) ) )}>
									<ListItemIcon>
										<CategoryIcon />
									</ListItemIcon>
									<ListItemText primary={category.label} />
									{openList[i] ? <ExpandLess fontSize='large' /> : <ExpandMore fontSize='large' />}
								</ListItemButton>	

							</Stack>

							<Collapse in={openList[i]} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
									{
										category.entities.map( (entity,ii) => (
											<Stack 
												spacing={{ xs: 1, sm: 2 }} 
												direction="row" 
												useFlexGap 
												flexWrap="wrap"
												key={ii}
											>

												<Button 
													onClick={ () => {dispatchRequest({type: "decrement", payload:entity })} } 
													className={cl["count-button"]}
												>
													<ListItemIcon>
														<RemoveCircleIcon fontSize='large'/>	
													</ListItemIcon>
												</Button>	

												<ListItemButton 
													sx={{ pl: 4 }}
													key={ii}
												>
													<ListItemText primary={entity.label} />
													<ListItemText primary={entity.count} />
												</ListItemButton>

												<Button 
													onClick={ () => {dispatchRequest({type: "increment", payload:entity })} } 
													className={cl["count-button"]}
												>
													<ListItemIcon>
														<AddCircleIcon fontSize='large' />
													</ListItemIcon>
												</Button>	

											</Stack>
										) )
									}
								</List>
							</Collapse>

						</React.Fragment>
					))	
				}
			</List>

			{/* COMMON WISHES LIST */}
			 
			<List
				sx={{ 'width': '100%', bgcolor: 'background.paper' }}
				component="nav"
				aria-labelledby="nested-list-subheader"
				subheader={
					<ListSubheader 
						component="div" 
						style={{alignItems: "center", display: "flex", justifyContent: "center"}} 
					>
						{"Common wishes"}
					</ListSubheader>
				}
			>
				{
					request.common.map( (commonWish,ii) => (
						<Stack 
							spacing={{ xs: 1, sm: 2 }} 
							direction="row" 
							useFlexGap 
							flexWrap="wrap"
							key={ii}
						>

							<Button 
								onClick={ () => {dispatchRequest({type: "decrement", payload: [ii, commonWish] })} } 
								className={cl["count-button"]}
							>
								<ListItemIcon>
									<RemoveCircleIcon fontSize='large'/>	
								</ListItemIcon>
							</Button>	

							<ListItemButton 
								sx={{ pl: 4 }}
								key={ii}
							>
								<ListItemText primary={commonWish.text} />
								<ListItemText primary={commonWish.count} />
							</ListItemButton>

							<Button 
								onClick={ () => {dispatchRequest({type: "increment", payload: [ii, commonWish] })} } 
								className={cl["count-button"]}
							>
								<ListItemIcon>
									<AddCircleIcon fontSize='large' />
								</ListItemIcon>
							</Button>	

						</Stack>
					))
				}
			</List>
			<Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
				<TextField
					id="category"
					name='category'
					label="Common wish"
					multiline
					rows={2}
					maxRows={4}
					value={commonWish}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommonWish(e.currentTarget.value.trim())}
					onSubmit={addCommonWish}
					helperText="Common wish"
				/>
				<Button 
					onClick={addCommonWish}
					className={cl["count-button"]}
				>
					<ListItemIcon>
						<AddCommentIcon fontSize='large' />
					</ListItemIcon>
				</Button>	
			</Stack>
			<Button 
				variant="contained" 
				endIcon={isSending ? <LoopIcon /> : <SendIcon />}
				onClick={sendRequest}
				style={{
					marginTop: 30
				}}
			>
        		Send
      		</Button>
		</Box>
	</>
	)
}