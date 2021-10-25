import React from "react";
import "./Navbar.css";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { IoMdChatbubbles } from "react-icons/io";
import { BiImages } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { useHistory } from "react-router-dom";

function Navbar() {
	const history = useHistory();

	return (
		<div className="navbar">
			<div onClick={() => history.push("/")}>
				<AiFillHome />
			</div>
			<div onClick={() => history.push("/search")}>
				<AiOutlineSearch />
			</div>
			<div onClick={() => history.push("/chats")}>
				<IoMdChatbubbles />
			</div>
			<div onClick={() => history.push("/myImageGallery")}>
				<BiImages />
			</div>
			<div onClick={() => history.push("/settings")}>
				<FiSettings />
			</div>
		</div>
	)
}

export default Navbar;