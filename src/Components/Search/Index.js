import React, { useState, useEffect } from "react";
import "./Index.css";
import Navbar from "../Navbar";
import User from "./User";
import { AiOutlineSearch } from "react-icons/ai";
import { useHistory } from "react-router-dom";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import accountCircle from "../../assets/account-circle.png";

function Search() {
	const [searchTerm, setSearchTerm] = useState('');
	const history = useHistory();
	const [users, setUsers] = useState([]);

	useEffect(() => {
		document.addEventListener("click", e => {
			if (e.target.classList[0] === "search__header__users" || e.target.classList[0] === "search__header__users__userContainer" || e.target.classList[0] === "search__header__searchField" || e.target.classList[0] === "search__header__searchBtn" || e.target.classList === "search__header") {

			} else {
				setSearchTerm("");
			}
		})
	}, []);

	useEffect(() => {
		onSnapshot(collection(db, "users"), snapshot => {
			setUsers(snapshot.docs.map(doc => ({ id: doc.id, user: doc.data() })))
		})
	}, [])

	return (
		<div className="search">
			<div 
				className={`search__header ${searchTerm.length ? "search__headerActive" : ""}`}
			>
				<input 
					type="text"
					placeholder="Search users"
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className="search__header__searchField"
				/>
				<button
					className="search__header__searchBtn"
				>
					<AiOutlineSearch />
				</button>
				<div 
					className="search__header__users"
					style={{display: searchTerm.length ? "block" : "none"}}
				>
					{
						users?.filter((user) => {
							if (searchTerm.length) {
								if (user.user.name.toLowerCase().includes(searchTerm.toLowerCase())) {
									return user
								}
							} else {
								return user
							}
						}).map((user) => (
							<div 
								key={user.id}
								className="search__header__users__userContainer"
								onClick={() => history.push(`/user/${user.id}`)}
							> 
								<div className="search__header__users__userContainer__left">
									<img 
										src={user.user.pfp ? user.user.pfp : accountCircle}
										alt=""
									/>
								</div>
								<div className="search__header__users__userContainer__right">
									{ user.user.name } 
								</div>
							</div>
						))
					}
				</div>
			</div>
			<h2 className="search__subTopic"> People you may know </h2>
			<div className="search__users">
				{
					users.map(user => (
						<User
							name={user.user.name}
							pfp={user.user.pfp}
							id={user.id}
							key={user.id + "lfjjsdfkl"}
						/>
					))
				}
			</div>
			<Navbar />
		</div>
	)
}

export default Search;