import React, { useState, useEffect } from "react";
import "./Index.css";
import Navbar from "../Navbar";
import { AiFillCamera } from "react-icons/ai";
import countries from "./countries.json";
import { db, storage } from "../../firebase";
import { onSnapshot, doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import accountCircle from "../../assets/account-circle.png";

function Index() {
	const [name, setName] = useState('');
	const [aboutMe, setAboutMe] = useState('');
	const [country, setCountry] = useState('SC');
	const [selectedPfp, setSelectedPfp] = useState(null);
	const [userPfp, setUserPfp] = useState(null);

	const user = useSelector(selectUser);

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setSelectedPfp({ file: e.target.files[0], imgUrl: URL.createObjectURL(e.target.files[0]) })
		}
	}

	const [userCred, setUserCred] = useState(null);
	const [userDetails, setUserDetails] = useState(null);

	useEffect(() => {
		if (user) {
			setUserCred(JSON.parse(user))
		}
	}, [user])

	useEffect(() => {
		if (userCred) {
			onSnapshot(doc(db, "users", userCred.uid), snapshot => {
				console.log(snapshot.data())
				setName(snapshot.data().name ? snapshot.data().name : "");
				setAboutMe(snapshot.data().aboutMe ? snapshot.data().aboutMe : "");
				setCountry(snapshot.data().country ? snapshot.data().country : "");
				setUserPfp(snapshot.data().pfp ? snapshot.data().pfp : "");
			})
		}
	}, [userCred]);

	const [nameErr, setNameErr] = useState(false);
	const [processing, setProcessing] = useState(false);

	const saveChanges = () => {
		if (!name.length) {
			setNameErr(true);
		}
		if (name.length) {
			setNameErr(false);
			setProcessing(true);
			if (selectedPfp) {
				uploadBytes(ref(storage, "users", userCred.uid, "pfp"), selectedPfp.file).then(snapshot => {
					getDownloadURL(snapshot.ref).then(imgUrl => {
						updateDoc(doc(db, "users", userCred.uid), {
							name,
							aboutMe,
							country,
							pfp: imgUrl
						}).then(() => {
							setProcessing(false);
						})
					});
				})
			} else {
				updateDoc(doc(db, "users", userCred.uid), {
					name,
					aboutMe,
					country
				}).then(() => {
					setProcessing(false)
				})
			}
		}
	}

	return (
		<div className="settings">
			<div className="settings__pfpPrimaryContainer">
				<label 
					className="settings__pfp__container"
					htmlFor="settings-pfp"
				>
					<img 
						src={selectedPfp ? selectedPfp.imgUrl : userPfp ? userPfp : accountCircle}
						alt=""
						className="settings__pfp"
					/>
					<div className="settings__pfp--coverContainer">
						<AiFillCamera />
					</div>
				</label>
				<div className="settings__pfpPrimaryContainer__userName"> { name } </div>
			</div>
			<input 
				type="file"
				id="settings-pfp"
				style={{ display: "none" }}
				onChange={handleChange}
			/>
			<div className="settings__editProfile">
				<h1 className="settings__eidtProfile__title"> Edit profile </h1>
				<div className="settings__editProfile__container">
					<label htmlFor="settings-name"> Name </label>
					<input 
						type="text"
						placeholder="Name"
						id="settings-name"
						value={name}
						onChange={e => setName(e.target.value)}
					/>
					<label> About me </label>
					<textarea
						placeholder="About me"
						value={aboutMe}
						onChange={e => setAboutMe(e.target.value)}
					>

					</textarea>
					<label htmlFor="settings-country"> Country </label>
					<select
						id="settings-country"
						value={country}
						onChange={e => setCountry(e.target.value)}
					>
						<option value="SC"> Select your country </option>
						{
							countries.map(country => (
								<option
									key={country.name}
									value={country.name}
								> 
									{ country.name } 
								</option>
							))
						}
					</select>
				</div>
				<button 
					className="settings__saveChangesBtn"
					onClick={saveChanges}
					disabled={processing}
				> 
					{ processing ? "Saving changes" : "Save changes"} 
				</button>
			</div>
			<Navbar />
		</div>
	)
}

export default Index;