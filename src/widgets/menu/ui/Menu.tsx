import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import React, { useState } from 'react';
import cl from "./Menu.module.scss"
import MenuIcon from '@mui/icons-material/Menu';
import { useAppDispatch, useAppSelector } from 'src/shared/lib/hooks/redux';
import MicrowaveIcon from '@mui/icons-material/Microwave';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArchiveIcon from '@mui/icons-material/Archive';
import { adminSlice } from 'src/app/reducers/AdminSlice';
import { useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import LogoutIcon from '@mui/icons-material/Logout';
import { userSlice } from 'src/app/reducers/UsersSlice';

const icons = {
	"Create User": <PersonAddIcon />,
	"Users List": <GroupIcon />,
	"Create Menu": <MicrowaveIcon />,
	"Requests": <ChecklistRtlIcon />,
	"Statistics": <ArchiveIcon />,
	"Charts": <ArchiveIcon />,
	"Archive": <MailIcon />,
	"Logout": <LogoutIcon />,
} as const;

type TIconsNames = keyof typeof icons;

export function Menu() {

	const { currentUser, auth } = useAppSelector( state => state.user )
	const { tab } = useAppSelector( state => state.admin )
	const dispatch = useAppDispatch()
	const [state, setState] = useState<boolean>(false);
	const navigate = useNavigate()

	const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event && event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' ||
			(event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}

		setState( prev => !prev )
	}

	const toggleAdminTab = (n:number) => {
		if (n === 7) {
			dispatch(userSlice.actions.logout())
			return;
		} 
		dispatch(adminSlice.actions.changeTab(n))
		navigate('/admin')
	}

	return auth && currentUser.role === "admin" ? (
		<>
			<Button 
				onClick={toggleDrawer}
				// className={classNames(cl["admin-menu"], {}, [])}
				className={cl["admin-menu"]}
			>
				<MenuIcon 
					className={cl["admin-menu__icon"]}
				/>
				<span>
					{"Admin Menu"}
				</span>
			</Button>
			<SwipeableDrawer
				open={state}
				onClose={toggleDrawer}
				onOpen={toggleDrawer}
			>
				<Box
					// sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
					role="presentation"
					onClick={toggleDrawer}
					onKeyDown={toggleDrawer}
				>
					<List>
						{
							Object.keys(icons).map( 
								(key, index) => (
									<React.Fragment key={index}>
										<ListItem 
											key={index} 
											disablePadding 
											style={{
												backgroundColor: tab === index ? "darkgrey" : "transparent",
												color: tab === index ? "white" : "inherit",
											}}
										>
											<ListItemButton
												onClick={() => toggleAdminTab(index) }
											>
												<ListItemIcon>
													{icons[key as TIconsNames]}
												</ListItemIcon>
												<ListItemText primary={key} />
											</ListItemButton>
										</ListItem>
										{
											(index === 3 || index === 6) && (
												<Divider />
											)
										}
									</React.Fragment>
								)
							)
						}
					</List>
				</Box>
			</SwipeableDrawer>
		</>
	) : (
		<></>
	)
}