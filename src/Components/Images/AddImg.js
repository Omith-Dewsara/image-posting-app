import React, { useState, useEffect } from "react";
import "./AddImg.css";
import uploadPicsSvg from "../../assets/upload-pics.svg";
import { MdOutlineClose } from "react-icons/md";
import users from "../../users.json";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { db, storage } from "../../firebase";
import { onSnapshot, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useHistory } from "react-router-dom";

function AddImg() {
	const [isSelectingUsers, setIsSelectingUsers] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState([]); 
	const [file, setFile] = useState(null);

	useEffect(() => {
		document.addEventListener("click", e => {
			if (e.target.classList[0] === "addImg__selectUsersModel") {
				setIsSelectingUsers(false);
			}
		})
	}, [])

	const addUsers = (person) => {
		const index = selectedUsers.findIndex(user => user.id === person.id);
		if (index >= 0) {
			setSelectedUsers(selectedUsers.filter(user => user.id !== person.id));
		} else {
			setSelectedUsers([...selectedUsers, person]);
		}
	}

	const handleImgChange = (e) => {
		if (e.target.files[0]) {
			setFile({img: e.target.files[0], imgUrl: URL.createObjectURL(e.target.files[0])});
		}
	}

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

	const [caption, setCaption] = useState('');
	const [processing, setProcessing] = useState(false);

	const history = useHistory();

	const addPost = () => {
		if (!file) {
			alert("Please select an image to upload");
		} else if (!selectedUsers.length) {
			alert("Please select the users who can view this post");
		} else {
			const albumId = window.location.href.split("/")[4];
			setProcessing(true)
			uploadBytes(ref(storage, `images/${file.img.name}`), file.img).then(snapshot => {
				getDownloadURL(snapshot.ref).then(url => {
					addDoc(collection(db, "users", userCred.uid, "albums", albumId, "images"), {
						img: url,
						caption,
						selectedUsers,
						timestamp: serverTimestamp()
					}).then(() => {
						setProcessing(false);
						setFile(null);
						setCaption("");
						setSelectedUsers([]);
						history.push(`/album/${albumId}`);
					})
				})
			})
		}
	}

	return (
		<div className="addImg">
			<div 
				className={`addImg__selectUsersModel ${isSelectingUsers ? "addImg__selectUsersModelActive" : ""}`}
			>
				<div className="addImg__selectUsersModel__usersContainer">
					<div className="addImg__selectUsersModel__usersContainer__title"> Select the people who you want to share this post with </div>
					<div className="addImg__selectUsersModel__usersContainer__users">
						{
							friends.map((user) => (
								<div className="addImg__selectUsersModel__usersContainer__user">
									<div className="addImg__selectUsersModel__usersContainer__left">
										<img 
											src={user.friend.friendInfo.pfp ? user.friend.friendInfo.pfp : "data:image/jpeg;base64,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"}
											alt=""
											className="addImg__selectUsersModel__usersContainer__user__pfp"
										/>
										<div className="addImg__selectUsersModel__usersContainer__user__name"> 
											{ user.friend.friendInfo.name }
										</div>
									</div>
									<input 
										type="checkbox"
										className="addImg__selectUsersModel__usersContainer__user__input"
										onClick={() => addUsers(user)}
									/>
								</div>
							))
						}
					</div>
					<button 
						className="addImg__selectUsersModel__addUsersBtn"
						onClick={() => setIsSelectingUsers(false)}
					> 
						Add users 
					</button>
				</div>
			</div>
			<h1 className="addImg__title"> Add an image </h1>
			<label 
				className="addImg__selectImgBtn"
				htmlFor="add-img-file-input"
			> 
				Select an image 
			</label>
			<input 
				type="file"
				id="add-img-file-input"
				className="addImg__fileInput"
				style={{display: "none"}}
				onChange={handleImgChange}
			/>
			<div className="addImg__imgPreview">
				{
					file ? (
						<img 
							src={file.imgUrl}
							alt=""
							className="addImg__imgPreview__img"
						/>
					) : (
						<img 
							src={uploadPicsSvg}
							alt=""
							className="addImg__imgPreview__empty"
						/>
					)
				}
			</div>
			<input 
				type="text"
				placeholder="Add a caption (optional)"
				className="addImg__captionInput"
				value={caption}
				onChange={e => setCaption(e.target.value)}
			/>
			<br />

			<div className="addImg__whoCanViewPost">
				<div className="addImg__whoCanViewPost__title"> Who can view this post? </div>
			</div>
			<button 
				className="addImg__addPersonBtn"
				onClick={() => setIsSelectingUsers(true)}
			> 
				Add person 
			</button>
			<div className="addImg__viewList">
				{
					selectedUsers.map((user) => (
						<div className="addImg__viewList__contact">
							<img 
								src={user.friend.friendInfo.pfp ? user.friend.friendInfo.pfp : "data:image/jpeg;base64,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"}
								alt=""
								className="addImg__viewList__contact__pfp"
							/>
							<div className="addImg__viewList__contact__name"> { user.friend.friendInfo.name } </div>
							<MdOutlineClose 
								className="addImg__viewList__contact__removeContact"
								onClick={() => addUsers(user)}
							/>
						</div>
					))
				}
			</div>
			<div className="addImg__postImgBtnContainer">
				<button 
					className="addImg__postImgBtn"
					disabled={processing}
					onClick={addPost}
				> 
					{ processing ? "Posting image" : "Post image" } 
				</button>
			</div>
		</div>
	)
}

export default AddImg;