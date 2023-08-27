import { classNames } from "src/shared/lib/classNames/classNames"
import cl from './Login.module.scss'
import { useState, type PropsWithChildren, useEffect } from 'react'
import { useForm } from "src/shared/lib/hooks/useForm"
import { useAppDispatch, useAppSelector } from "src/shared/lib/hooks/redux"
import { userAuth, userGetAll } from "src/app/actions/userActions"
import { dummyUser } from "src/shared/api/data"
import { useNavigate } from "react-router-dom"

interface LoginProps {
	className?: string;
}

export function Login(props: PropsWithChildren<LoginProps>) {

	const { className } = props;
	const dispatch = useAppDispatch()

	const { currentUser, auth} = useAppSelector( state => state.user )
	const navigate = useNavigate()

	const { values: {login, password}, handleChange } = useForm({
		login: dummyUser.login,
		password: dummyUser.password,
	})

	const handleSubmit = function(event: React.FormEvent) {
		event.preventDefault();
		dispatch(userAuth({login, password}))
		// dispatch(userGetAll());
	}

	//const { data, isLoading, isError } = useQuery('users', API.getAllUsers )

	useEffect(() => {
		if (auth && currentUser.role !== "admin") {
			navigate('/requests', {replace: true})
		}
	}, [currentUser.role, auth])

	return (
		<div 
			className={classNames(cl.Login, {}, [className])}
		>
			<form 
				onSubmit={handleSubmit}
				className={cl["Login__form"]}
			>
				<label>
					Login:
					<input 
						type="text" 
						value={login} 
						onChange={handleChange} 
						name={"login"}
					/>
				</label>
				<label>
					Pasword:
					<input 
						type="text" 
						value={password} 
						onChange={handleChange} 
						name={"password"}
					/>
				</label>
				<input type="submit" value="Submit" />
			</form>
		</div>
	)
}