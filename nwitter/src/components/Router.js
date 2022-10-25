import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./Auth";
import Home from "../routes/Home";
import Navigation from "./Navigation";
import Profile from "../routes/Profile";

const AppRouter = ({ refreshUser, isLoggedIn, userObj, nweetObj }) => {
  // app.js에서 맨 밑에 userObj 연결해줘서 App.js에 의해 userObj 받는다
  return (
    <div
      style={{
        maxWidth: 890,
        width: "100%",
        margin: "80px auto 0px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Router>
        {isLoggedIn && <Navigation userObj={userObj} />}
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home userObj={userObj} />} />
              {/* home이 userobj를 가짐*/}
              <Route
                path="/profile"
                element={
                  <Profile
                    userObj={userObj}
                    refreshUser={refreshUser}
                    nweetObj={nweetObj}
                  />
                }
              />
              {/* 프로필에게 사용자가 누군지(나=userObj) 알려주기*/}
            </>
          ) : (
            <>
              <Route path="/" element={<Auth />} />
            </>
          )}
          ;
        </Routes>
      </Router>
    </div>
  );
};

export default AppRouter;
