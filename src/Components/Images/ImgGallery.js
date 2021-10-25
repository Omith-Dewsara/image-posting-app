import React, { useState, useEffect } from "react";
import "./ImgGallery.css";
import Navbar from "../Navbar";
import Image from "./Image";
import { BsFillGridFill, BsFilePost, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { MdOutlineClose, MdOpenInNew } from "react-icons/md";
import { BiImageAdd } from "react-icons/bi";
import { useHistory } from "react-router-dom";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";

function ImgGallery({ isMe }) {
	const [isPostMode, setIsPostMode] = useState(true);
	const [isFullScreen, setIsFullScreen] = useState(false);

	const history = useHistory();

	const addImg = () => {
		const id = window.location.href.split("/")[4];
		history.push(`/addImg/${id}`)
	}

	const [images, setImages] = useState([]);
	const user = useSelector(selectUser);
	const [userCred, setUserCred] = useState(null);

	useEffect(() => {
		if (user) {
			setUserCred(JSON.parse(user));
		}
	}, [user])

	useEffect(() => {	
		if (isMe) {
			const albumId = window.location.href.split("/")[4];
			if (userCred) {
				onSnapshot(query(collection(db, "users", userCred.uid, "albums", albumId, "images"), orderBy("timestamp", "desc")), snapshot => {
					setImages(snapshot.docs.map(doc => ({ id: doc.id, img: doc.data() })))
				})
			}
		} else {
			const userId = window.location.href.split("/")[4];
			const albumId = window.location.href.split("/")[6];
			onSnapshot(query(collection(db, "users", userId, "albums", albumId, "images"), orderBy("timestamp", "desc")), snapshot => {
				setImages(snapshot.docs.map(doc => ({ id: doc.id, img: doc.data() })))
			})
		}
	}, [isMe, userCred])

	const [accessiblePics, setAccessiblePics] = useState([]);
	const [currentPic, setCurrentPic] = useState('');
	const [currentPicNumber, setCurrentPicNumber] = useState(0);

	useEffect(() => {	
		if (isMe) {
			setAccessiblePics(images);
		} else {
			for (let i = 0; i < images.length; i++) {
				for (let j = 0; j < images[i].img.selectedUsers.length; j++) {
					if(images[i].img.selectedUsers[j].id === userCred.uid) {
						accessiblePics.push(images[i]);
					}
				}
			}
		}
	}, [images])

	console.log("accessiblePics", accessiblePics)

	const selectPic = (imgDetails) => {
		const index = accessiblePics.findIndex(pic => pic.id === imgDetails.id);
		console.log(index);
		console.log(imgDetails);
		if (index >= 0) {
			setCurrentPic(accessiblePics[index]);
			setCurrentPicNumber(index);
			setIsFullScreen(true)
		}
	}

	const nextPic = () => {
		if (currentPicNumber < accessiblePics.length) {
			setCurrentPicNumber(currentPicNumber + 1);
			setCurrentPic(accessiblePics[currentPicNumber + 1]);
		}
	}

	const prevPic = () => {
		if (currentPicNumber > 0) {
			setCurrentPicNumber(currentPicNumber - 1);
			setCurrentPic(accessiblePics[currentPicNumber - 1]);
		}
	}

	return (
		<div className="imgGallery">
			<div 
				className="imgGallery__viewFullScreenImgModel"
				style={{ display: isFullScreen ? "flex" : "none" }}
			>
				<MdOutlineClose 
					className="imgGallery__viewFullScreenImgModel__closeIcon"
					onClick={() => setIsFullScreen(false)}
				/>
				<BsChevronLeft 
					className="imgGallery__viewFullScreenImgModel__icon"
					onClick={prevPic}
				/>	
					<img 
						src={currentPic?.img?.img}
						alt=""
						className="imgGallery__viewFullScreenImgModel__img"
					/>
				<BsChevronRight 
					className="imgGallery__viewFullScreenImgModel__icon"
					onClick={nextPic}
				/>
			</div>
			<div className="imgGallery__header">
				<h1 className="imgGallery__title"> My Image Gallery </h1>
				<div className="imgGallery__options">
					<BsFillGridFill 
						className={`imgGallery__options__imagesOption ${isPostMode ? "" : "imageGallery__activeOption"}`}
						onClick={() => setIsPostMode(false)}
					/>
					<BsFilePost
						className={isPostMode ? "imageGallery__activeOption" : ""}
						onClick={() => setIsPostMode(true)}
					/>
				</div>
			</div>
			<div 
				className="imageGallery__addImgBtn"
				onClick={addImg}
				style={{display: isMe ? "grid" : "none"}}
			>
				<BiImageAdd />
			</div>
			{
				isPostMode ? (
					<div className="imgGallery__images">
						{
							isMe ? (
								<>
									{
										images.map(img => (
											<Image 
												key={img.id}
												img={img.img}
												id={img.id}
												userCred={userCred}
												isMe={isMe}
												likes={img.img.likes}
											/>
										))
									}
								</>
							) : (
								<>
									{
										images.map(img => (
											img.img.selectedUsers.map(user => user.id === userCred.uid ? (
												<Image 
													key={img.id}
													img={img.img}
													id={img.id}
													userCred={userCred}
													isMe={isMe}
													likes={img.img.likes}
												/>
											) : <> </>)
										))	
									}
								</>
							)
						}
					</div>
				) : (
					<div className="imageGallery__onlyImages">
						{
							isMe ? (
								<>
									{
										images.map(img => (
											<div 
												className="imageGallery__onlyImages__imgContainer"
											>
												<img 
													src={img.img.img}
													alt=""
													className="imageGallery__onlyImages__img"
												/>
												<MdOpenInNew 
													className="imageGallery__onlyImages__imgContainer__enterFullScreenIcon"
													onClick={() => selectPic(img)}
												/>
											</div>
										))
									}
								</>
							) : (
								<>
									{
										images.map(img => (
											img.img.selectedUsers.map(user => user.id === userCred.uid ? (
												<div className="imageGallery__onlyImages__imgContainer">
													<img 
														src={img.img.img}
														alt=""
														className="imageGallery__onlyImages__img"
													/>
													<MdOpenInNew 
														className="imageGallery__onlyImages__imgContainer__enterFullScreenIcon"
														onClick={() => selectPic(img)}
													/>
												</div>
											) : <> </>)
										))	
									}
								</>
							)
						}
					</div>
				)
			}
			<Navbar />
		</div>
	)
}

export default ImgGallery;