import React, { useState, useEffect } from "react";
import "./Image.css";
import { AiFillHeart, AiOutlineComment, AiOutlineSend } from "react-icons/ai";
import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";

function Image({ img, id, userCred, isMe, likes }) {
	const [comment, setComment] = useState('');

	const [myInfo, setMyInfo] = useState(null);
	useEffect(() => {
		if (userCred) {
			onSnapshot(doc(db, "users", userCred.uid), snapshot => {
				setMyInfo(snapshot.data())
			})
		}
	}, [userCred])

	const postComment = (e) => { 
		e.preventDefault();
		if (isMe) {
			const albumId = window.location.href.split("/")[4];
			addDoc(collection(db, "users", userCred.uid, "albums", albumId, "images", id, "comments"), {
				commentInfo: myInfo,
				comment,
				timestamp: serverTimestamp()
			}).then(() => {
				setComment("")
			});
		} else {
			const userId = window.location.href.split("/")[4];
			const albumId = window.location.href.split("/")[6];
			console.log(userId, albumId);
			addDoc(collection(db, "users", userId, "albums", albumId, "images", id, "comments"), {
				commentInfo: myInfo,
				comment,
				timestamp: serverTimestamp()
			}).then(() => {
				setComment("");
			})
		}
	}

	const [comments, setComments] = useState([]);
	const [postLikes, setPostLikes] = useState(likes ? likes : []);
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		if (userCred && likes) {
			const index = likes.findIndex(id => id === userCred.uid);
			if (index >= 0) {
				setLiked(true);
			} else {
				setLiked(false);
			}
		}
	}, [userCred, likes])

	useEffect(() => {
		if (isMe) {
			const albumId = window.location.href.split("/")[4];
			if (userCred) {
				onSnapshot(query(collection(db, "users", userCred.uid, "albums", albumId, "images", id, "comments"), orderBy("timestamp", "desc")), snapshot => {
					setComments(snapshot.docs.map(doc => ({ id: doc.id, comment: doc.data() })))
				})
			}
		} else {
			const userId = window.location.href.split("/")[4];
			const albumId = window.location.href.split("/")[6];
			onSnapshot(query(collection(db, "users", userId, "albums", albumId, "images", id, "comments"), orderBy("timestamp", "desc")), snapshot => {
				setComments(snapshot.docs.map(doc => ({ id: doc.id, comment: doc.data() })))
			})
		}
	}, [userCred, isMe]);

	const likePost = () => {
		if (isMe) {
			const albumId = window.location.href.split("/")[4];
			if (liked) {
				const newLikesArray = likes.filter(like => like !== userCred.uid);
				updateDoc(doc(db, "users", userCred.uid, "albums", albumId, "images", id), {
					likes: newLikesArray
				})
			} else {
				const newLikesArray = likes ? [...likes, userCred.uid] : [userCred.uid];
				updateDoc(doc(db, "users", userCred.uid, "albums", albumId, "images", id), {
					likes: newLikesArray
				})
			}
		} else {
			const userId = window.location.href.split("/")[4];
			const albumId = window.location.href.split("/")[6];
			if (liked) {
				const newLikesArray = likes.filter(like => like !== userCred.uid);
				updateDoc(doc(db, "users", userId, "albums", albumId, "images", id), {
					likes: newLikesArray
				})
			} else {
				const newLikesArray = likes ? [...likes, userCred.uid] : [userCred.uid];
				updateDoc(doc(db, "users", userId, "albums", albumId, "images", id), {
					likes: newLikesArray
				})
			}
		}
	}

	return (
		<div className="image">
			<div className="image__header">
				<img 
					src={img.img}
					alt=""
					className="image__header__image"
				/>
				<div className="image__header__options">
					<div className="image__header__option">
						<AiFillHeart 
							className={`image__header__option__icon ${liked ? "image__header__option__Likedicon" : ""}`} 
							onClick={likePost}
						/>
						<p className="image__header__option__helperTxt"> {likes ? likes.length : "0"} likes </p>
					</div>
					<div className="image__header__option">
						<AiOutlineComment 
							className="image__header__option__icon"
						/>
					</div>
				</div>
				<div className="image__header__imgCaption"> { img.caption } </div>
			</div>
			<div className="image__body">
				<div className="image__body__comments">	
					{
						comments.map(({id, comment}) => (
							<div 
								className="image__body__comment"
								key={id}
							>
								<img 
									src={comment?.commentInfo?.pfp ? comment.commentInfo.pfp : "https://www.pixsy.com/wp-content/uploads/2021/04/ben-sweet-2LowviVHZ-E-unsplash-1.jpeg"}
									alt=""
									className="image__body__comment__img"
								/>
								<div className="image__body__comment__right">
									<div className="image__body__comment__name"> { comment?.commentInfo?.name } </div>
									<div className="image__body__comment__content"> { comment?.comment } </div>
								</div>
							</div>
						))
					}
				</div>
				<form 
					className="image__body__postComment"
				>
					<input 
						type="text"
						placeholder="write a comment"
						value={comment}
						onChange={e => setComment(e.target.value)}
					/>
					<button 
						onClick={postComment}
						disabled={!comment.length}
					> 
						<AiOutlineSend /> 
					</button>
				</form>
			</div>
		</div>
	)
}

export default Image;