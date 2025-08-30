import Notes from "../components/Notes";


export const Home = () => {
	return (
		<div className="row mx-5">
			<div className="col-md-4">
				<Notes />
				<Notes />
				<Notes />
			</div>
			<div className="col-md-4">
				<Notes />
				<Notes />
				<Notes />
			</div>
			<div className="col-md-4">
				<Notes />
				<Notes />
				<Notes />
			</div>


		</div>
	);
}