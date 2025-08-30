import { Link } from "react-router-dom";
import NewNote from "./NewNote";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container d-flex">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto d-flex">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>

					</Link>
					<NewNote/> {/* BOTON DE CREAR NUEVA NOTA-PAULO*/}
				</div>
			</div>
		</nav>
	);
};