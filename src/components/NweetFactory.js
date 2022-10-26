import React, { useState, useRef } from "react";
import { storageService, dbService, authService } from "../fbase";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // uuid는 기본적으로 어떤 특별한 식별자를 랜덤으로 생성해줌. 사진에 이름 붙이기 위해 설치해줌.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  //---------------nweets 생성----------------------//
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState(""); //트윗할 때 텍스트만 입력시 이미지 url ""로 비워두기 위함

  const onSubmit = async (e) => {
    if (nweet === "") {
      return;
    }
    e.preventDefault();
    let attachmentURL = ""; // 사진이 없다면 첨부파일주소는 빈 값. 사진 첨부하면 storage에서 다운받은 URL로 업데이트
    if (attachment !== "") {
      // 사진 첨부했을 때
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`); //  파일 경로 참조 만들기
      // ※ firebase.storage.Reference는 파일을 업로드,다운,지우기 할수있게 만들어줌, 사진 url을 알고 있기 때문에 아래처럼 코딩해줌
      const response = await uploadString(
        // storage 참조 경로로 파일 업로드 하기
        attachmentRef,
        attachment,
        "data_url" // data_url은 readAsDataURL에서 한거임
      );
      attachmentURL = await getDownloadURL(response.ref); //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
    }

    const todayTime = () => {
      let now = new Date();
      let year = now.getFullYear();
      let todayMonth = now.getMonth() + 1;
      let todayDate = now.getDate();
      let hours = now.getHours();
      let minutes = now.getMinutes();

      return (
        year +
        "년 " +
        todayMonth +
        "월 " +
        todayDate +
        "일 " +
        hours +
        "시 " +
        minutes +
        "분"
      );
    };

    // 트윗 오브젝트
    const nweetObj = {
      text: nweet, // 우리의 document의 key
      createdAt: todayTime(),
      creatorId: userObj.uid,
      attachmentURL,
      author: authService.currentUser.displayName,
    };

    await addDoc(collection(dbService, "nweets"), nweetObj);
    // 트윗 누르면 새로운 docu 생성해서 nweets collection에 넣음!!

    setNweet(""); // form 비우기
    setAttachment(""); // 파일 미리보기 img src 비워주기
  };

  const onChange = ({ target: { value } }) => {
    // event 안에 있는 target 안에 있는 value를 달라고 하는거임
    setNweet(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e; // event 안에서 target 안으로 가서 파일 받아옴
    const theFile = files[0];
    console.log("첨부파일 정보 : ", theFile);
    const reader = new FileReader(); // FileReader API를 통해 파일을 읽음.
    reader.onloadend = (finishedEvent) => {
      // 파일 읽기가 끝나면 finishedEvent를 받는다.
      const {
        target: { result },
      } = finishedEvent;
      setAttachment(result); // 위의 finishedEent의 result를 setAttachment로 설정. 그럼 이제 state 값에 담겨 있다~!
    };
    reader.readAsDataURL(theFile); // 그담에 reader.readAsDataURL 실행, 데이터 텍스트 얻는다.
  };

  const fileInput = useRef();

  const onClearAttachment = () => {
    setAttachment(""); // clear누르면 attachment지우고
    fileInput.current.value = ""; // 선택했던 첨부파일명 없애기
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="factoryForm">
        <div className="factoryInput__container">
          <input
            className="factoryInput__input"
            value={nweet}
            onChange={onChange}
            autoFocus
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
          />
          <input type="submit" value="&rarr;" className="factoryInput__arrow" />
        </div>
        {/* 사진 첨부하기*/}
        <label htmlFor="attach-file" className="factoryInput__label">
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{
            opacity: 0,
          }}
        />
        {/* attachment가 있을 때 사진 첨부 미리보기*/}
        {attachment && (
          <div className="factoryForm__attachment">
            <img
              src={attachment} // 위에서 state값에 담긴걸 여기에 갖다붙여주기
              style={{
                backgroundImage: attachment,
              }}
              alt="file"
            />
            <div className="factoryForm__clear" onClick={onClearAttachment}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NweetFactory;
