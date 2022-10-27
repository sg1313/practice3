import React, { useEffect, useState } from "react";
import { authService } from "../fbase";
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { getAuth } from "firebase/auth";
import Nweet from "components/Nweet";
import { dbService } from "../fbase";

// --------------------------------------------------------프로필화면----------------------------------------------------------
const Profile = ({ refreshUser, userObj, nweetObj }) => {
  const Navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [mytweets, setMytweets] = useState([]);

  const onLogOutClick = () => {
    authService.signOut();
    Navigate("/");
    // window.location.reload();
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser(); //profile 새로고침
    }
  };

  // ------------------ 내 트윗 가져오기 -----------------------------------------
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc"),
      where("creatorId", "==", userObj.uid)
    );
    onSnapshot(
      q,
      (snapshot) => {
        const nweetArray = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));
        setMytweets(nweetArray);
        console.log(nweetArray); // 콘솔에 내 트윗 배열 상태로 보기
      },
      []
    ); // ------------------ 내 트윗 가져오기 끝 ---------------------------------
  }, [userObj.uid]);

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <label type="text" className="profile_label">
          <span>닉네임 수정</span>
        </label>
        <input
          type="text"
          placeholder="display name"
          onChange={onChange}
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="update profile"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      {/* --------------내트윗보기-------------------------------------------- */}
      <label type="text" className="profile_label">
        <span>내 트윗 보기</span>
      </label>
      <div>
        {mytweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid} // 수정삭제버튼 나옴
          />
        ))}
      </div>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
