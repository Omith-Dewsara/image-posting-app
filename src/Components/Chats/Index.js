import React, { useState, useEffect } from "react";
import "./Index.css";
import Navbar from "../Navbar";
import Chat from "./Chat";
import FriendReq from "./FriendReq";
import { db } from "../../firebase";
import { onSnapshot, collection } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";

function Chats() {
	const [isChats, setIsChats] = useState(true);
	const [friendRequests, setFriendRequests] = useState([]);

	const user = useSelector(selectUser);
	const [userCred, setUserCred] = useState(null);

	useEffect(() => {
		if (user) {
			setUserCred(JSON.parse(user))
		}
	}, [user]);

	useEffect(() => {
		if (userCred) {
			onSnapshot(collection(db, "users", userCred.uid, "friendReq"), snapshot => {
				setFriendRequests(snapshot.docs.map(doc => ({ id: doc.id, req: doc.data() })))
			})
		}
	}, [userCred])

	return (
		<div className="chats">	
			<div className="chats__header">
				<div	
					className={isChats ? "chats__header__chatsAtive" : ""}
					onClick={() => setIsChats(true)}
				> 
					Chats 
				</div>
				<div
					className={isChats ? "" : "chats__header__friendReqActive"}
					onClick={() => setIsChats(false)}
				>
					Friend Requests 
				</div>
			</div>
			{
				isChats ? (
					<Chat />
				) : (
					<div className="chats__friendRequests">
						{
							friendRequests.map(friendReq => (
								<FriendReq 
									userData={friendReq}
									key={friendReq.id + "kdkslkl"}
								/>
							))
						}
					</div>
				)
			}
			<Navbar />
		</div>
	)	
}

export default Chats;