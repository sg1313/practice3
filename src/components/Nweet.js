/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false); // 수정모드 용
  const [newNweet, setNewNweet] = useState(nweetObj.text); // newNweet은 input에 있는 text (수정할거)

  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);

  const onDeleteClick = async () => {
    // async 쓰는 이유?삭 제함수가 비동기 함수이기 때문에 async와 await을 붙여 동기적으로 실행시켜 빠르게 처리하기 위해서.... 라네
    const ok = window.confirm("트윗을 지우시겠습니까?");
    if (ok) {
      try {
        await deleteDoc(NweetTextRef); // documentPath의 위치가 nweets (firebase에 있는 nweets말함). 파이어스토어에서 트윗 삭제
        if (nweetObj.attachmentURL !== "") {
          // 삭제하려는 트윗에 이미지 파일이 있는 경우 이미지 파일을 스토리지에서 삭제
          const desertRef = ref(storageService, nweetObj.attachmentURL);
          await deleteObject(desertRef);
        }
      } catch (error) {
        window.alert("삭제 실패!");
      }
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev); // 수정input박스 뜨면서 수정할 내용 가져옴
  // 입력한 현재의 상태 값을 반전시켜줌
  const onSubmit = async (e) => {
    // async await 빼니까 수정내용 안뜨노
    e.preventDefault();
    console.log(nweetObj, newNweet); // 수정했을 때 콘솔 찍어보기
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
    setEditing(false);
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e; // 이걸 안하면 인풋박스 안에있는 글자가 안지워짐,,
    setNewNweet(value);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              {/* --------- 수정하기 -------*/}
              <form onSubmit={onSubmit} className="container nweetEdit">
                <input
                  type="text"
                  placeholder="Edit your nweet"
                  value={newNweet}
                  required
                  onChange={onChange}
                />
                <input type="submit" value="Update Nweet" className="formBtn" />
              </form>
              <span onClick={toggleEditing} className="formBtn cancelBtn">
                Cancel
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <h5>작성자 : {nweetObj.author}</h5>
          <h5>{nweetObj.createdAt}</h5>
          {nweetObj.attachmentURL && <img src={nweetObj.attachmentURL} />}
          {/* attachmentURL이 있을 때만 실행됨 */}
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <div className="nweet__actions">
              <button onClick={toggleEditing}>수정</button>
              <button onClick={onDeleteClick}>삭제</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
