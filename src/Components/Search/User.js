import React from "react";
import "./User.css";
import { useHistory } from "react-router-dom";
import accountCircle from "../../assets/account-circle.png";

function User({ name, pfp, id }) {
	const history = useHistory();

	const handleClick = () => {
		history.push(`/user/${id}`);
	}

	return (
		<div 
			className="user"
			onClick={handleClick}
		>
			<div className="user__header">
				<img 
					src={pfp ? pfp : accountCircle}
					alt=""
					className={pfp ? "" : "user__header__emptyPfp"}
				/>
			</div>
			<div className="user__body">
				<div className="user__body__name"> { name } </div>
			</div>
		</div>
	)
}


export default User;