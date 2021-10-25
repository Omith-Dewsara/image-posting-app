import React, { useState, useEffect } from 'react';
import ChatUser from "./ChatUser";
import "./Chat.css";
import { BiSend } from "react-icons/bi";
import { MdArrowBack } from "react-icons/md";
import { setCurrentChatId, selectCurrentChatId, selectIsOpenMessages, setIsOpenMessages } from "../../features/appSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { db } from "../../firebase";
import { onSnapshot, collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import selectFriendSvg from "../../assets/select-contact.svg";
import accountCircle from "../../assets/account-circle.png";

function Chat() {
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');


	const user = useSelector(selectUser);
	const [userCred, setUserCred] = useState(null);
	const [friends, setFriends] = useState([]);

	useEffect(() => {
		if (user) {
			setUserCred(JSON.parse(user))
		}
	}, [user])

	useEffect(() => {
		if (userCred) {
			onSnapshot(collection(db, "users", userCred.uid, "friends"), snapshot => {
				setFriends(snapshot.docs.map(doc => ({ id: doc.id, friend: doc.data() })))
			})
		}
	}, [userCred]);

	const dispatch = useDispatch();
	const currentChatId = useSelector(selectCurrentChatId);

	const isOpenMessages = useSelector(selectIsOpenMessages);

	useEffect(() => {
		if (userCred && currentChatId) {
			onSnapshot(query(collection(db, "chats", currentChatId?.chatId, "messages"), orderBy("timestamp")), snapshot => {
				setMessages(snapshot.docs.map(doc => ({ id: doc.id, msg: doc.data() })))
				const messagesContainer = document.querySelector(".chat__right__chatMsgsContainer");
				let xH = messagesContainer.scrollHeight;
        		messagesContainer.scrollTo(0, xH);
			})
		}
	}, [currentChatId, userCred])

	const sendMessage = (e) => {
		e.preventDefault();
		if (userCred && currentChatId) {
			addDoc(collection(db, "chats", currentChatId?.chatId, "messages"), {
				message,
				uid: userCred.uid,
				timestamp: serverTimestamp()
			}).then(() => {
				setMessage("");
			})
		}
	}

	return (
		<div className="chat">
			<div className="chat__left">
				{
					friends.map(({id, friend}) => (
						<ChatUser 
							name={friend.friendInfo.name}
							id={id}
							pfp={friend.friendInfo.pfp}
							chatId={friend.chatId}
							key={id}
						/>
					))
				}
			</div>	
			<div 
				className={`chat__right ${isOpenMessages ? "chat__rightActive" : ""}`}
			>
				<div className="chat__right__header">
					<MdArrowBack 
						className="chat__right__header__backBtn"
						onClick={() => dispatch(setIsOpenMessages(false))}
					/>
					<img 
						src={currentChatId?.pfp ? currentChatId?.pfp : accountCircle}
						alt=""
					/>
					<div className="chat__right__header__name"> { currentChatId?.name } </div>
				</div>

				<div className="chat__right__chatMsgsContainer">
					{
						messages.map(({id, msg}) => (
							<div 
								className={msg.uid === userCred?.uid ? "chat__right__myChatMsg" : "chat__right__chatMsg"}
							>
								{ msg.message }
							</div>
						))
					}
					{
						!currentChatId && (
							<div className="chat__right__chatMsgsContainer__imgContainer">
								<img 
									src={selectFriendSvg}
									alt=""
									className="chat__right__chatMsgsContainer__img"
								/>
								<div className="chat__right__chatMsgsContainer__selectText"> Select a contact to start texting </div>
							</div>
						) 
					}
				</div>

				<form className="chat__right__sendMsg">
					<input 
						type="text"
						placeholder="Type a message"
						value={message}
						onChange={e => setMessage(e.target.value)}
					/>
					<button 
						onClick={sendMessage}
						disabled={!message.length}
					>
						<BiSend />
					</button>
				</form>	
			</div>
		</div>
	)
}

export default Chat;