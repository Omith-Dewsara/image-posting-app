import React, { useState, useEffect } from "react";
import "./Index.css";
import googleIcon from "../../assets/google-icon.png";
import microsoftIcon from "../../assets/microsoft-icon.png";
import playGamesIcon from "../../assets/google-play-games.png" 
import { MdOutlineClose } from "react-icons/md";
import { auth, db, googleAuthProvider, microsoftAuthProvider } from "../../firebase";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { useHistory } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";

function Auth() {
	const [isSignIn, setIsSignIn] = useState(false);
	const [errorMsg, setErrMsg] = useState('');

	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');

	const [emailErr, setEmailErr] = useState(false);
	const [nameErr, setNameErr] = useState(false);
	const [passwordErr, setPasswordErr] = useState(false);
	const [processing, setProcessing] = useState(false);

	const history = useHistory();

	const googleAuth = () => {
		alert("Authentication method not allowed");
	}

	const microsoftAuth = () => {
		alert("Authentication method not allowed");
	}

	const playGamesAuth = () => {
		alert("Authentication method not allowed");
	}

	const signup = () => {
		if (!email.length) {
			setEmailErr(true);
		}
		if (email.length) {
			setEmailErr(false);
		}
		if (!name.length) {
			setNameErr(true);
		}
		if (name.length) {
			setNameErr(false);
		}
		if (!password.length) {
			setPasswordErr(true);	
		}
		if (password.length) {
			setPasswordErr(false);
		}
		if (email.length && name.length && password.length) {;
			setProcessing(true);
			const date = new Date();
			createUserWithEmailAndPassword(auth, email, password).then((userCred) => {
				setDoc(doc(db, "users", userCred.user.uid), {
					name: name,
					created: `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`
				}).then(() => {
					setProcessing(false);
					history.push("/");
				})
			})
			.catch(err => {
				setErrMsg(err.message);
				setProcessing(false);
			})
		}
	}

	const signIn = () => {
		if (!email.length) {
			setEmailErr(true);
		}
		if (email.length) {
			setEmailErr(false);
		}
		if (!password.length) {
			setPasswordErr(true);
		}
		if (password.length) {
			setPasswordErr(false);
		}

		if (password.length && email.length) {
			setProcessing(true)
			signInWithEmailAndPassword(auth, email, password).then(userCred => {
				setProcessing(false);
				history.push("/");
			})
			.catch(err => {
				setErrMsg(err.message);
				setProcessing(false);
			})
		}
	}

	return (
		<div className="auth">
			<div 
				className="auth__errModel"
				style={{display: errorMsg.length ? "block" : "none"}}
			>
				<div className="auth__errModel__errMsg"> Error </div>
				<div>
					{ errorMsg }
				</div>
				<MdOutlineClose 
					className="auth__errModel__closeIcon"
					onClick={() => setErrMsg('')}
				/>
			</div>
			{
				isSignIn ? (
					<div className="auth__signup">
						<div className="auth__signup__left">
							<div className="auth__signup__left__coverscreen"> </div>
							<h1 className="auth__signup__left__title"> Welcome! </h1>
							<p className="auth__signup__left__message"> Don't have an account on our website? </p>
							<button 
								className="auth__signup__left__button"
								onClick={() => {
									setEmail("")
									setPassword("");
									setEmailErr(false);
									setNameErr(false);
									setPasswordErr(false);
									setIsSignIn(false)
								}}
							> 
								Sign up 
							</button>
						</div>
						<div className="auth__signup__right">
							<h1 className="auth__signup__right__title"> Sign in </h1>
							<div className="auth__signup__right__registrationContainer">
								<input 
									placeholder="Email Address"
									type="email"
									onChange={e => setEmail(e.target.value)}
									value={email}
									className={emailErr ? "auth__signup__right__registrationContainer__errInput" : ""}
								/>
								<input 
									placeholder="Password"
									type="password"
									onChange={e => setPassword(e.target.value)}
									value={password}
									className={passwordErr ? "auth__signup__right__registrationContainer__errInput" : ""}
								/>

								<button 
									className="auth__signup__right__registrationContainer__btn"
									onClick={signIn}
									disabled={processing}
								> 
									{ processing ? "Signing in" : "Sign in" }
								</button>
							</div>
							<div className="signup__right__optionsContainer">
								<div className="signup__right__options__textContainer">
									<div className="signup__right__options__textLine"> </div>	
									<div className="signup__right__options__text"> Or Sign in with </div>
									<div className="signup__right__options__textLine"> </div>	
								</div>
								<div className="signup__right__options">
									<div 
										className="signup__right__option"
										onClick={googleAuth}
									>
										<img 
											src={googleIcon}
											alt=""
										/>
									</div>
									<div 
										className="signup__right__option"
										onClick={microsoftAuth}
									>
										<img 
											src={microsoftIcon}
											alt=""
										/>
									</div>
									<div 
										className="signup__right__option"
										onClick={playGamesAuth}
									>
										<img 
											src={playGamesIcon}
											alt=""
										/>
									</div>
								</div>
							</div>
							<div className="signup__right__mobileSignInMsgContainer">
								Don't have an account? 
								<span 
									onClick={e => {
										setEmail("")
										setPassword("");
										setEmailErr(false);
										setPasswordErr(false);
										setNameErr(false);
										setIsSignIn(false)
									}}
									> 
										Sign up 
									</span>
							</div>
						</div>	
					</div>
				) : (
					<div className="auth__signup">
						<div className="auth__signup__left">
							<div className="auth__signup__left__coverscreen"> </div>
							<h1 className="auth__signup__left__title"> Welcome back! </h1>
							<p className="auth__signup__left__message"> Already have an account on our website? </p>
							<button 
								className="auth__signup__left__button"
								onClick={() => {
										setNameErr(false);
										setEmail("")
										setPassword("");
										setEmailErr(false);
										setPasswordErr(false);
										setIsSignIn(true)
								}}
							> 
								Sign in 
							</button>
						</div>
						<div className="auth__signup__right">
							<h1 className="auth__signup__right__title"> Create Account </h1>
							<div className="auth__signup__right__registrationContainer">
								<input 
									placeholder="Name"
									type="text"
									value={name}
									onChange={e => setName(e.target.value)}
									className={nameErr ? "auth__signup__right__registrationContainer__errInput" : ""}
								/>
								<input 
									placeholder="Email Address"
									type="email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									className={emailErr ? "auth__signup__right__registrationContainer__errInput" : ""}
								/>
								<input 
									placeholder="Password"
									type="password"
									value={password}
									onChange={e => setPassword(e.target.value)}
									className={passwordErr ? "auth__signup__right__registrationContainer__errInput" : ""}
								/>

								<button 
									className="auth__signup__right__registrationContainer__btn"
									onClick={signup}
									disabled={processing}
								> 
									{ processing ? "Signing up" : "Sign up" }  
								</button>
							</div>
							<div className="signup__right__optionsContainer">
								<div className="signup__right__options__textContainer">
									<div className="signup__right__options__textLine"> </div>	
									<div className="signup__right__options__text"> Or Sign up with </div>
									<div className="signup__right__options__textLine"> </div>	
								</div>
								<div className="signup__right__options">
									<div 
										className="signup__right__option"
										onClick={googleAuth}
									>
										<img 
											src={googleIcon}
											alt=""
										/>
									</div>
									<div 
										className="signup__right__option"
										onClick={microsoftAuth}
									>
										<img 
											src={microsoftIcon}
											alt=""
										/>
									</div>
									<div 
										className="signup__right__option"
										onClick={playGamesAuth}
									>
										<img 
											src={playGamesIcon}
											alt=""
										/>
									</div>
								</div>
							</div>
							<div className="signup__right__mobileSignInMsgContainer">
								Already have an account? 
								<span
									onClick={e => {
										setNameErr(false);
										setEmail("")
										setPassword("");
										setEmailErr(false);
										setPasswordErr(false);
										setIsSignIn(true)
									}}
								> 
									Sign in 
								</span>
							</div>
						</div>	
					</div>
				)
			}
		</div>
	)
}

export default Auth;