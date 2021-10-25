import React, { useState, useEffect } from "react";
import "./FriendReq.css";
import { FaUserCheck, FaUserMinus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { db } from "../../firebase";
import { deleteDoc, doc, setDoc, onSnapshot } from "firebase/firestore";

function FriendReq({ userData }) {
	const user = useSelector(selectUser);
	const [userCred, setUserCred] = useState(null);
	const [myInfo, setMyInfo] = useState(null);

	useEffect(() => {
		setUserCred(JSON.parse(user));
	}, [user])

	useEffect(() => {
		if (userCred) {
			onSnapshot(doc(db, "users", userCred.uid), snapshot => {
				setMyInfo(snapshot.data())
			})
		}
	}, [userCred])

	const acceptFriendReq = () => {
		if (userCred && myInfo) {
			setDoc(doc(db, "users", userCred.uid, "friends", userData.id), {
				id: userData.id,
				friendInfo: userData.req.friendData,
				chatId: userCred.uid + userData.id
			}).then(() => {
				deleteDoc(doc(db, "users", userCred.uid, "friendReq", userData.id))
			})
			setDoc(doc(db, "users", userData.id, "friends", userCred.uid), {
				id: userCred.uid,
				friendInfo: myInfo,
				chatId: userCred.uid + userData.id
			})
		}		
	}

	const declineFriednReq = () => {
		deleteDoc(doc(db, "users", userCred.uid, "friendReq", userData.id))
	}

	return (
		<div className="friendReq">
			<div className="friendReq__header">
				<img 
					src={userData.req.friendData.pfp ? userData.req.friendData.pfp : "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/White_Ghost/phpx9hRH3.jpeg"}
					alt=""
				/>
			</div>
			<div className="friendReq__body">
				<div className="friendReq__body__left">
					<div className="friendReq__body__userNamme"> { userData.req.friendData.name } </div>
					<div className="friendReq__body__message"> { userData.req.message } </div>
				</div>
				<div className="friendReq__body__right">
					<div
						className="friendReq__body__right__addFriendReq"
						onClick={acceptFriendReq}
					> 
						<FaUserCheck />  
					</div>
					<div
						className="friendReq__body__right__removeFriendReq"
						onClick={declineFriednReq}
					> 
						<FaUserMinus /> 
					</div>
				</div>
			</div>
		</div>
	)
}

export default FriendReq;