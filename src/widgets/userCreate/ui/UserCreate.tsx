import { classNames } from 'src/shared/lib/classNames/classNames'
import cl from './UserCreate.module.scss';
import type { PropsWithChildren } from 'react';
import { Box, TextField, MenuItem, Button, FormControl, FormGroup } from '@mui/material';
import React from 'react';
import { useForm } from 'src/shared/lib/hooks/useForm';
import api from 'src/shared/api/api';
import { useMutation, useQueryClient } from 'react-query';
import { INewUser } from 'src/app/types/IUser';
import { useAppDispatch } from 'src/shared/lib/hooks/redux';
import { adminSlice } from 'src/app/reducers/AdminSlice';

const roles = [
	{
		value: "admin",
		label: "Admin",
	}, 
	{
		value: "user",
		label: "Simple user",
	}, 
	{
		value: "anonymous",
		label: "Anonymous",
	}, 
] as const;

interface UserCreateProps {
	className?: string;
}
export function UserCreate(props: PropsWithChildren<UserCreateProps>) {

	const { className } = props;
	const queryClient = useQueryClient()
	const dispatch = useAppDispatch()

	const { values: {login, role, password, firstname, lastname, address, phone }, handleChange  } = useForm({
		role: "user",
		login: "",
		password: "",
		firstname: "",
		lastname: "",
		address: "",
		phone: "",
	})

	const mutation = useMutation( 
		(newUser:INewUser) => api.createUser(newUser),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["users"])
				dispatch(adminSlice.actions.changeTab(1))
			}
		}
	)

	const sendRequest = () => {
		const data = {
			login,
			role, 
			password,
			firstname,
			lastname,
			address,
			phone,
		}
		mutation.mutate(data);
	}

	const onSubmit = (e: React.FormEvent<any>) => {
		e.preventDefault()
		e.stopPropagation()
		sendRequest()
	}

	const onClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation()
		sendRequest()
	}

	return (
		<FormGroup 
			className={classNames(cl.UserCreate, {}, [className])}
			onSubmit={onSubmit}
		>
			<h2 className={"h2"}>{"Create User"}</h2>
			<Box
				component="form"
				sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, }}
				noValidate
				autoComplete="off"
			>
				<div>
					<TextField
						id="role"
						name='role'
						select
						label="User role"
						defaultValue={"user"}
						value={role}
						onChange={handleChange}
						helperText="Select role"
					>
						{roles.map((role) => (
							<MenuItem 
								key={role.value} 
								value={role.value}
							>
								{role.label}
							</MenuItem>
						))}
					</TextField>
					<TextField
						id="login"
						name="login"
						label="Login"
						value={login}
						onChange={handleChange}
						helperText="Input login"
					/>
				</div>
				<div>
					<TextField
						id="firstname"
						name="firstname"
						label="First Name"
						helperText="Input name"
						value={firstname}
						onChange={handleChange}
					/>
					<TextField
						id="lastname"
						name="lastname"
						label="Last Name"
						helperText="Input name"
						value={lastname}
						onChange={handleChange}
					/>
				</div>
				<div>
					<TextField
						id="password"
						name="password"
						style={{width: '52ch'}}
						label="Password"
						helperText="Password"
						value={password}
						onChange={handleChange}
					/>
				</div>
				<div>
					<TextField
						id="address"
						name="address"
						style={{width: '52ch'}}
						label="Address"
						helperText="Address"
						multiline
						rows={2}
						maxRows={4}
						value={address}
						onChange={handleChange}
					/>
				</div>
				<div>
					<TextField
						id="phone"
						name="phone"
						style={{width: '52ch'}}
						label="Phone"
						helperText="+7 ___ ___ __ __"
						defaultValue={"+7"}
						maxRows={4}
						value={phone}
						onChange={handleChange}
					/>
				</div>
				<Button 
					variant="outlined" 
					color="secondary" 
					type="submit"
					onClick={onClick}
				>
					{"Create"}
				</Button>
			</Box>		
		</FormGroup>
	)
}