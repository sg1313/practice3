import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";

const Home = ({ userObj }) => {
  // app.js -> router.js -> 여기로도 userobj 연걸

  // -------------------------트윗들(nweets) 가져오기 ------------------------------
  const [nweets, setNweets] = useState([]); // 기본값이 비어있는 배열로 설정

  useEffect(() => {
    // cloud firestore로 실시간 업데이트 가져오는 함수
    // 컴포넌트가 amout되면 useEffect 사용
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(
      q,
      (snapshot) => {
        const nweetArr = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));
        setNweets(nweetArr); // array 만들어주고 setNweet값에 새로만든 array 넣어줌
        // console.log(nweetArr);
      },
      []
    ); // ------------------ 트윗들(nweets) 가져오기 끝 --------------------------
  }, []);

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet // ★Nweet은 우리가 만든 컴포넌트,
            key={nweet.id}
            nweetObj={nweet} //★ nweetObj는 nweet의 모든 데이터
            isOwner={nweet.creatorId === userObj.uid} // 트윗을 누가 썼는지 알아내기 위함임. cloud.FB 가면 creatorId 있음
          /> // nweet 만든 사람 === 글 작성한 사람. userObj는 저 위에 Home의 props에 옴( →Router.js로 흘러가고)
        ))}
      </div>
    </div>
  );
};

export default Home;
