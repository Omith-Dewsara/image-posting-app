import React, { useState, useEffect } from "react";
import "./Index.css";
import Navbar from "../Navbar";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { db } from "../../firebase";
import { onSnapshot, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { MdOutlineClose } from "react-icons/md";
import accountCircle from "../../assets/account-circle.png";
import homeRightSvg from "../../assets/home-right.svg";

function Home({ isMe }) {

	const [msgModelOpen, setMsgModelOpen] = useState(false);
	const history = useHistory();
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		document.addEventListener("click", e => {
			if (e.target.classList[0] === "home__msgMeModel") {
				setMsgModelOpen(false)
			} 
		})
	}, [])

	const visitImgGallery = () => {
		if (isMe) {
			history.push("/myImageGallery")
		} else {
			const id = window.location.href.split("/")[4];
			history.push(`/imageGallery/${id}`)
		}
	}

	const user = useSelector(selectUser);
	const [userDetails, setUserDetails] = useState(null);

	useEffect(() => {
		if (isMe) {
			setUserDetails(JSON.parse(user));
		} else {
			const userId = window.location.href.split("/")[4];
			onSnapshot(doc(db, "users", userId), snapshot => {
				setUserData(snapshot.data());
			})
		}
	}, [user, isMe]);


	useEffect(() => {
			if (userDetails) {
				const unsub = onSnapshot(doc(db, "users", userDetails.uid), snapshot => {
					setUserData(snapshot.data())
				})
			}
	}, [userDetails])

	console.log(userData?.pfp);

	const [myData, setMyData] = useState(null);
	const [myInfo, setMyInfo] = useState(null);
	const [processing, setProcessing] = useState(false)

	useEffect(() => {
		if (user) {
			setMyData(JSON.parse(user));
		}
	}, [user])

	useEffect(() => {
		if (myData) {
			onSnapshot(doc(db, "users", myData.uid), snapshot => {
				setMyInfo(snapshot.data());
			})
		}
	}, [myData])

	const [message, setMessage] = useState("");
	const [errMsg, setErrMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState(false);

	const sendMessage = () => {
		if (!isMe) {
			setProcessing(true)
			const userId = window.location.href.split("/")[4];
			if (userData) {
				setDoc(doc(db, "users", userId, "friendReq", myData.uid), {
					friendData: myInfo,
					message,
					timestamp: serverTimestamp()
				}).then(() => {
					setMessage("");
					setProcessing(false);
					setMsgModelOpen(false);
					setSuccessMsg(true);
				})
				.catch(err => {
					setMessage("");
					setErrMsg("There was a problem while sending the message please try again later");
					setProcessing(false);
					setMsgModelOpen(false);
				})
			}
		}
		if (isMe) {
			alert("You can't send messages to yourself");
			setMsgModelOpen(false);
		}
	}

	return (
		<div className="home">
			<div 
				className="home__successMsg"
				style={{display: successMsg ? "block" : "none"}}
			>
				<div className="home__successMsg__title"> Success </div>
				<div> Message sent successfully </div>
				<MdOutlineClose
					className="home__successMsg__closeIcon"
					onClick={() => setSuccessMsg(false)}
				/>
			</div>
			<div 
				className="home__errMsg"
				style={{display: errMsg.length ? "block" : "none"}}
			>
				<div className="home__errMsg__title"> Error </div>
				<div> { errMsg } </div>
				<MdOutlineClose
					className="home__errMsg__closeIcon"
					onClick={() => setErrMsg("")}
				/>
			</div>
			<div 
				className="home__msgMeModel"
				style={{display: msgModelOpen ? "flex" : "none"}}
			>
				<div className="home__msgMeModel__msgContainer">
					<div className="home__msgMeModel__msgHeader">
						<img 
							src={userData?.pfp ? userData.pfp : accountCircle}
							alt=""
							className="home__msgMeModel__msgHeader__pfp"
						/>
						<h2> Message { userData?.name } </h2>
					</div>
					<div className="home__msgMeModel__msgBody">
						<textarea
							placeholder="Type a message"
							value={message}
							onChange={e => setMessage(e.target.value)}
						>

						</textarea>
						<button 
							onClick={sendMessage}
							disabled={processing}
						> 
							{ processing ? "Sending message" : "Send message" } 
						</button>
					</div>
				</div>
			</div>
			<div className="home__main">
				<div className="home__main__left">
					<div className="home__header">
						<div className="home__header__pfpContainer">
							<img 
								src={userData?.pfp ? userData.pfp : accountCircle}
								alt=""
								className="home__header__pfp"
							/>
						</div>
						<div 
							className={userData ? "home__header__name" : "home__header__name--loading"}
						>
							{ userData?.name }
						</div>
					</div>
					<div className="home__main__left__info">
						<div className={userData ? "" : "home__main__left__info--loading"}> { userData?.aboutMe } </div>
						<div className={userData ? "" : "home__main__left__info--loading"}> { userData?.created ? `Member since ${userData.created}` : "" } </div>
					</div>
					<div className="home__main__buttons">
						<button 
							className="home__main__buttons__imgGllryBtn"
							onClick={visitImgGallery}
						> 
							My Image Gallery 
						</button>
						<button 
							className="home__main__buttons__msgMeBtn"
							onClick={() => setMsgModelOpen(true)}
						> 
							Message me 
						</button>
					</div>
				</div>
				<div className="home__main__right">
					<img 
						src={homeRightSvg}
						alt=""
						className="home__main__right__img"
					/>
				</div>
			</div>
			<Navbar />	
		</div>
	)
}

export default Home;