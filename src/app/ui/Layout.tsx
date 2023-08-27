import { classNames } from "src/shared/lib/classNames/classNames";
import cl from "./Layout.module.scss"
import { Menu } from "src/widgets/menu";

const Layout = ({ children }:any) => {
	return (
		<>
			<Menu />
			<div className={classNames(cl.Layout, {}, ['page-content'])}>
				{children}
			</div>
		</>
	)
}

export default Layout;