import React, { useEffect, useState } from 'react';
import Home from "./Components/Home/Index";
import Search from "./Components/Search/Index";
import Chats from "./Components/Chats/Index";
import ImgGallery from "./Components/Images/ImgGallery";
import AddImg from "./Components/Images/AddImg";
import Auth from "./Components/Auth/Index";
import Settings from "./Components/Settings/Index";
import ImgGalleryHome from "./Components/Images/Index";
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUser } from "./features/userSlice";

function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(useSelector(selectUser));
  console.log(user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(JSON.stringify(user)))
        setIsLoading(false);
      } else {
        dispatch(setUser(null))
        setIsLoading(false);
      }
    })
  }, [])

  return (
    <div className="app">
      <Router>
          {
            user && !isLoading ? (
              <Switch>
                <Route path="/settings">
                  <Settings />
                </Route>
                <Route path="/user/:id/album/:id">
                  <ImgGallery 
                    isMe={false}
                  />
                </Route>
                <Route path="/imageGallery/:id">
                  <ImgGalleryHome 
                    isMe={false}
                  />
                </Route>
                <Route path="/user/:id">
                  <Home 
                    isMe={false}
                  />
                </Route>
                <Route path="/addImg/:id">
                  <AddImg />
                </Route>
                <Route path="/album/:id">
                  <ImgGallery 
                    isMe={true}
                  />
                </Route>
                <Route path="/myImageGallery">
                  <ImgGalleryHome 
                    isMe={true}
                  />
                </Route>
                <Route path="/chats">
                  <Chats />
                </Route>
                <Route path="/search">
                  <Search />
                </Route>
                <Route path="/">
                  <Home 
                    isMe={true}
                  />
                </Route>
              </Switch>
            )  : !isLoading && (
              <Switch>
                <Route path="/">
                  <Auth />
                </Route>
              </Switch>
            )
          }
      </Router>
    </div>
  );
}

export default App;