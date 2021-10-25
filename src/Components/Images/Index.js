import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import "./Index.css";
import { AiFillFolderAdd } from "react-icons/ai";
import addAlbum from "../../assets/add-album.svg";
import { MdOutlineClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { db, storage } from "../../firebase";
import { addDoc, collection, onSnapshot, serverTimestamp, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useHistory } from "react-router-dom";

function ImgGalleryHome({ isMe }) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		document.addEventListener("click", e => {
			if (e.target.classList[0] === "imgGalleryHome__addAlbumModel") {
				setOpen(false);
			}
		})
	}, []);

	const [selectedImg, setSelectedImg] = useState(null);

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setSelectedImg({ img: e.target.files[0], imgUrl: URL.createObjectURL(e.target.files[0]) })
			console.log(e.target.files[0])
		}
	}

	const [albumName, setAlbumName] = useState('');
	const [albumErr, setAlbumErr] = useState(false);

	const user = useSelector(selectUser);
	const [userCred, setUserCred] = useState(null)
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		if (user) {
			setUserCred(JSON.parse(user));
		}
	}, [user])

	const [albums, setAlbums] = useState([]);

	useEffect(() => {
		if (isMe) {
			if (userCred) {
				onSnapshot(query(collection(db, "users", userCred.uid, "albums"), orderBy("timestamp", "desc")), snapshot => {
					setAlbums(snapshot.docs.map(doc => ({ id: doc.id, album: doc.data() })))
				})
			}
		} else {
			const userId = window.location.href.split("/")[4];
			onSnapshot(query(collection(db, "users", userId, "albums"), orderBy("timestamp", "desc")), snapshot => {
				setAlbums(snapshot.docs.map(doc => ({ id: doc.id, album: doc.data() })))
			})
		}
	}, [userCred, isMe]);

	const history = useHistory();

	const visitAlbum = (id) => {
		if (isMe) {
			history.push(`/album/${id}`)
		} else {
			const userId = window.location.href.split("/")[4];
			history.push(`/user/${userId}/album/${id}`)
		}
	}

	const addAlbum = () => {
		if (!albumName.length) {
			setAlbumErr(true)
		}
		if (albumName.length) {
			setAlbumErr(false);
			setProcessing(true);
			if (selectedImg) {
				uploadBytes(ref(storage, `images/${selectedImg.img.name}`), selectedImg.img).then(snapshot => {
					getDownloadURL(snapshot.ref).then(url => {
						addDoc(collection(db, "users", userCred.uid, "albums"), {
							albumName,
							albumImg: url,
							timestamp: serverTimestamp()
						}).then(() => {
							setProcessing(false);
							setOpen(false);
							setSelectedImg(null);
							setAlbumName("")
						})			
					})
				})
			} else {
				addDoc(collection(db, "users", userCred.uid, "albums"), {
					albumName,
					timestamp: serverTimestamp()
				}).then(() => {
					setProcessing(false);
					setOpen(false);
					setSelectedImg(null);
					setAlbumName("")
				})
			}
		}
	}

	return (
		<div className="imgGalleryHome">
			<h1> My Image Gallery </h1>
			<div className="imgGalleryHome__albums">
				{
					albums.map(({id, album}) => (
						<div 
							className="imgGalleryHome__album"
							key={id}
							onClick={() => visitAlbum(id)}
						>
							<div className="imgGalleryHome__album__header">
								<img 
									src={album.albumImg ? album.albumImg : "https://www.commonwealthfund.org/sites/default/files/styles/countries_hero_desktop/public/country_image_Canada.jpg?h=f2fcf546&itok=HpXJ6X1n"}
									alt=""
									className="imgGalleryHome__album__header__img"
								/>
							</div>
							<div className="imgGalleryHome__album__main">
								<div className="imgGalleryHome__album__main__name"> { album.albumName } </div>
							</div>
						</div>
					))
				}
			</div>
			<div 
				className="imgGalleryHome__addNewAlbumBtn"
				onClick={() => setOpen(true)}
				style={{display: isMe ? "grid" : "none"}}
			>
				<AiFillFolderAdd
					className="imgGalleryHome__addNewAlbumBtn__icon"
				/>
			</div>
			<div 
				className="imgGalleryHome__addAlbumModel"
				style={{display: open ? "flex" : "none"}}
			>
				<div className="imgGalleryHome__addAlbumModel__primaryContainer">
					<MdOutlineClose 
						className="imgGalleryHome__addAlbumModel__primaryContainer__closeIcon"
						onClick={() => setOpen(false)}
					/>
					<div className="imgGalleryHome__addAlbumModel__header">
						<h1 
							className="imgGalleryHome__addAlbumModel__header__title"
						> 
							Create new album
						</h1>
						<div className="imgGalleryHome__addAlbumModel__header__hr"> </div>
					</div>
					<div className="imgGalleryHome__addAlbumModel__container">
						<div className="imgGalleryHome__addAlbumModel__container__left">
							<div className="imgGalleryHome__addAlbumModel__container__left__albumImgContainer">
								{
									selectedImg ? (
										<img 
											src={selectedImg.imgUrl}
											alt=""
										/>
									) : (
										<> </>
									)
								}
							</div>
							<br />
							<label 
								className="imgGalleryHome__addAlbumModel__container__left__uploadImgBtn"
								htmlFor="add-album-input"
							>
									Upload 
								</label>
							<input 
								type="file"
								id="add-album-input"
								style={{display: "none"}}
								onChange={handleChange}
							/>
							<br />
							<br />
							<label 
								className="imgGalleryHome__addAlbumModel__container__left__label"
								htmlFor="img-gallary-input"
							> 
								Name your new album
							</label>
							<br />
							<input 
								type="text"
								className={`imgGalleryHome__addAlbumModel__container__left__input ${albumErr ? "imgGalleryHome__addAlbumModel__container__left__errInput" : ""}`}
								id="img-gallary-input"
								value={albumName}
								onChange={e => setAlbumName(e.target.value)}
							/>
							<button 
								className="imgGalleryHome__addAlbumModel__container__left__addAlbumBtn"
								onClick={addAlbum}
								disabled={processing}
							> 
								{ processing ? "Adding Album" : "Add Album"}
							</button>
						</div>
						<div className="imgGalleryHome__addAlbumModel__container__right">
							<img 
								src="https://net2phone.com/wp-content/uploads/2019/08/laptop-illustration.svg"
								alt=""
								className="imgGalleryHome__addAlbumModel__container__right__img"
							/>
						</div>
					</div>
				</div>
			</div>
			<Navbar />
		</div>
	)
}

export default ImgGalleryHome;