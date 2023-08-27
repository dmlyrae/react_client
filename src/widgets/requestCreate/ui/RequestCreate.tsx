import { classNames } from 'src/shared/lib/classNames/classNames'
import cl from './RequestCreate.module.scss';
import React, { useReducer, type PropsWithChildren, useState, useEffect } from 'react';
import { FormGroup, Box, TextField, MenuItem, Button, List, ListSubheader, Collapse, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { useForm } from 'src/shared/lib/hooks/useForm';
import { TCategory, TEntity } from 'src/app/types/IMenu';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useQuery } from 'react-query';
import api from 'src/shared/api/api';
import { getErrorMessage } from 'src/shared/api/getErrorMessage';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

const defaultCat = {
	name: "",
	label: "",
	entities: [],
}

const defaultEnt = {
	name: "",
	label: "",
	category: "",
	max: 100,
}

interface RequestCreateProps {
	className?: string;
}

export function RequestCreate(props: PropsWithChildren<RequestCreateProps>) {

	const { className } = props;

	const reducer = (state:TCategory[], action: {type: string, payload: TEntity | TCategory | TCategory[]}) => {
		const { type, payload } = action;
		if ("category" in payload) {
			const categoryIndex = state.findIndex( category => category.name === payload.category )
			switch (type) {
				case "add":
					if (categoryIndex > -1) {
						return state.map( (c,i) => {
							if (i === categoryIndex) {
								return {
									...c,
									entities: [...c.entities, payload]
								}
							}
							return c;
						})
					} 
					return state;
				case "remove":
					if (categoryIndex > -1) {
						return state.map( (c,i) => {
							if (i === categoryIndex) {
								return {
									...c,
									entities: c.entities.filter( e => e.name === payload.name)
								}
							}
							return c;
						})
					}
					return state;
			}
		}
		if ("entities" in payload) {
			switch (type) {
				case "add":
					return [...state, payload];
				case "remove":
					return state.filter( c => c.name !== payload.name )
			}
		}
		if (type === "fill" && Array.isArray(payload)) return [...payload];
		return state;
	}

	const [ menu, dispatchMenu ] = useReducer(reducer, [])

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		console.log('---', e.currentTarget)
	}

	const [ newCat, setNewCat ] = useState<TCategory>({...defaultCat});
	const [ newEntity, setNewEntity ] = useState<TEntity>({...defaultEnt})

	const changeCatValue = function (name: string) {
		return function (e: React.ChangeEvent<HTMLInputElement>) {
			const value = e?.currentTarget?.value ?? e?.target?.value ?? undefined;
			if (typeof value === "undefined") return;
			setNewCat( prev => ({
				...prev,
				[name]: value,
			}))
		}
	}
	
	const changeEntityValue = function (name: string) {
		return function (e: React.ChangeEvent<HTMLInputElement>) {
			e.preventDefault()
			// console.log('name', name)
			// console.log('target', e.target)
			// console.log('target', e.currentTarget)
			// console.log('value', e.currentTarget.value)
			setNewEntity( prev => ({
				...prev,
				[name]: e?.currentTarget?.value ?? e.target.value
			}))
		}
	}

	const catAdd = (e: React.FormEvent | React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		dispatchMenu({
			type: "add",
			payload: newCat
		});
		setNewCat({...defaultCat})
	}

	const endAdd = (e: React.FormEvent | React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		dispatchMenu({
			type: "add",
			payload: newEntity
		})
		// console.log('menu', menu)
		setNewEntity({...defaultEnt})
	}

	const [ openList, setOpenList ] = useState<boolean[]>([]);
	const { data:currentMenu, isLoading } = useQuery('menu', api.currentMenuGet)

	useEffect(() => {
		if (!currentMenu) return;
		const cm:{id: string, menu: TCategory[]} = Array.isArray(currentMenu) ? currentMenu[0] : currentMenu;
		let parsedMenu:TCategory[] = [];
		try {
			if (typeof cm.menu === "string") {
				parsedMenu = JSON.parse(cm.menu);
			} else {
				if (Array.isArray(cm.menu)) {
					parsedMenu = cm.menu;
				}
			}
		} catch (e) {
			console.error(getErrorMessage(e))
		} finally {
			dispatchMenu({type: "fill", payload: parsedMenu})
		}
	}, [currentMenu])

	const save = async (e: React.MouseEvent) => {
		e.stopPropagation();
		const result = await api.currentMenuUpdate({
			id: currentMenu?.id,
			menu: menu, 
		});
		console.log('saved', result);
	}

	return (
	<>
		<h1 className={"h1"}>Category List</h1>
		<Box
			alignContent={"center"}
			width={"100%"}
		>
			<List
				sx={{ width: '100%', bgcolor: 'background.paper' }}
				component="nav"
				aria-labelledby="nested-list-subheader"
				subheader={
					<ListSubheader component="div" id="nested-list-subheader">
						{"Category List"}
					</ListSubheader>
				}
			>
				{
					menu.map( (category,i) => (
						<React.Fragment key={i}>

							<Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">

								<Button 
									onClick={ () => dispatchMenu({type: "remove", payload: category}) } 
								>
									<ListItemIcon>
										<DeleteForeverIcon />
									</ListItemIcon>
								</Button>	

								<ListItemButton onClick={() => setOpenList( prev => menu.map( (_,bi) => i === bi ? !(prev[bi]) : Boolean(prev[bi]) ) )}>
									<ListItemIcon>
										<CategoryIcon />
									</ListItemIcon>
									<ListItemText primary={category.label} />
									{openList[i] ? <ExpandLess /> : <ExpandMore />}
								</ListItemButton>	
							</Stack>


							<Collapse in={openList[i]} timeout="auto" unmountOnExit>
								<List component="div" disablePadding>
									{
										category.entities.map( (entity,ii) => (
											<Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">

												<Button 
													onClick={ () => dispatchMenu({type: "remove", payload: entity}) } 
												>
													<ListItemIcon>
														<DeleteForeverIcon />
													</ListItemIcon>
												</Button>	

												<ListItemButton 
													sx={{ pl: 4 }}
													key={ii}
												>
													<ListItemIcon>
														<SubdirectoryArrowRightIcon />
													</ListItemIcon>
													<ListItemText primary={entity.label} />
												</ListItemButton>

											</Stack>
										) )
									}
								</List>
							</Collapse>
						</React.Fragment>
					))	
				}
			</List>
		</Box>
		<FormGroup 
			className={classNames(cl.RequestCreate, {}, [className])}
			onSubmit={catAdd}
		>
			<h2 className={"h2"}>{"Add Category"}</h2>
			<Box
				component="form"
				sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, }}
				noValidate
				autoComplete="off"
			>
				<div>
					<TextField
						id="category"
						name='category'
						label="Display name"
						value={newCat.label}
						onChange={changeCatValue("label")}
						helperText="Category Display Name"
					/>
					<TextField
						id="category"
						name='category'
						label="Server name"
						value={newCat.name}
						onChange={changeCatValue("name")}
						helperText="Category Server Name"
					/>
					<Button 
						variant="outlined" 
						color="secondary" 
						type="submit"
						onSubmit={catAdd}
						onClick={catAdd}
					>
						{"Category Add"}
					</Button>
				</div>
			</Box>
		</FormGroup>
		<FormGroup 
			className={classNames(cl.RequestCreate, {}, [className])}
			onSubmit={endAdd}
		>
			<h2 className={"h2"}>{"Add Entity"}</h2>
			<Box
				component="form"
				sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, }}
				noValidate
				autoComplete="off"
			>
				<div>
					<TextField
						id="entitylabel"
						name='entitylabel'
						label="Add entity"
						value={newEntity.label}
						onChange={changeEntityValue("label")}
						helperText="Entity Display Name"
					/>
					<TextField
						id="entityname"
						name='entityname'
						label="Add entity"
						value={newEntity.name}
						onChange={changeEntityValue("name")}
						helperText="Entity Server Name"
					/>
					<TextField
						id="entitycat"
						select
						name='entitycat'
						label="Add entity"
						value={newEntity.category}
						onChange={changeEntityValue("category")}
						helperText="Entity Category"
					>
						{menu.map((cat) => (
							<MenuItem 
								key={cat.name} 
								value={cat.name}
							>
								{cat.label}
							</MenuItem>
						))}
					</TextField>
					<TextField
						id="emax"
						name="emax"
						label="Max value"
						value={newEntity.max}
						onChange={changeEntityValue("max")}
						helperText="Max input value"
					/>
					<Button 
						variant="outlined" 
						color="secondary" 
						type="submit"
						onClick={endAdd}
						onSubmit={endAdd}
					>
						{"Entity Add"}
					</Button>
				</div>
			</Box>
		</FormGroup>
		<Button 
			variant="contained"
			onClick={save}
		>
			{"Save"}
		</Button>
	</>
	)
}