import React from "react";
import "./ChatUser.css";
import { useDispatch } from "react-redux";
import { setCurrentChatId, setIsOpenMessages } from "../../features/appSlice";
import accountCircle from "../../assets/account-circle.png";

function ChatUser({ name, id, pfp, chatId }) {

	const dispatch = useDispatch();

	const openMessages = () => {
		dispatch(setCurrentChatId({name, id, pfp, chatId}));
		dispatch(setIsOpenMessages(true));
	}

	return (
		<div 
			className="chatUser"
			onClick={openMessages}
		>
			<div className="chatUser__left">
				<img 
					src={pfp ? pfp : accountCircle}
					alt=""
					className={pfp ? "" : "chatUser__left__emptyImg"}
				/>
			</div>
			<div className="chatUser__right">
				{ name }
			</div>
		</div>
	)
}

export default ChatUser;