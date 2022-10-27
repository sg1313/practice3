import React, { useEffect, useState } from "react";
import AppRouter from "./components/Router";
import { authService } from "./fbase"; // 유저 로그인 여부 판단
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false); // 아직 초기화 되지 X. firebase가 초기화 되길 기다림. 초기화해서 isLoggedIn 바뀌게 해야함 -> 작업해서 init을 true값으로 바꿔줘야함
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // 현재 로그인 여부. firebase가 아직 시작안됐기 때매 로그아웃 되어있는거라고 생각함. 그래서 초기값 false
  const [userObj, setUserObj] = useState(null);

  // console.log(authService.currentUser);
  // //authService.currentUser 에서는 실제로 로그인된건지 로그아웃한 건지 잘 모른다.
  // // 결과는 null 라고 뜨는데 사용자가 >>로그인되지 않은 상태임.<<

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      //onauthStateChanged : 사용자의 로그인 상태의 변화를 관찰하는 관찰자. 현재 로그인한 사용자 가져오기!!
      // ★로그인 되면 이게 호출됨★ 그래서 로그인한 user를 받는다. ★로그인,로그아웃 할 때&App.js가 초기화될 때 일어남!!
      if (user) {
        // create account를 클릭시
        // ＊ isLoggedIn={isLoggedIn} 없애주고 boolean으로 바꿔줘서 setIsLoggedIn(true); 도 노쓸모
        setUserObj({
          displayName: authService.currentUser.displayName
            ? authService.currentUser.displayName
            : "Anonymous", // 이름값이 null 일때 이름을 'Anonymous'로 설정
          uid: user.uid,
          updateProfile: (
            args // 사용자 프로필 업데이트
          ) => updateProfile(user, { displayName: user.displayName }),
        }); // setUserObj(user) 하지 않고 필요한 정보만 갖고옴
      } else {
        setUserObj(null); // ★ 이걸 넣어줘야 로그아웃시 로그인화면으로 가는구나,.,.,
      }
      setInit(true); // 초기화 되었다면 밑에 있는 라우터를 보여준다.
    });
  }, []);
  // (user) => console.log(user) 했을 때 실제로 로그인이 되었는지 안 되었는지 알 수 있다. 새로고침하면 1초? 뒤에 UserImpl뜸
  // 그래서  console.log(user) 지우고 if else 문 써줌..
  const refreshUser = () => {
    // user 새로고침
    // firebase에 있는 profile업데이트 후 react.js에 있는 프로필 업데이트 시킴
    // user 새로고침 하면 profile을 업데이트 해주는데, navigations 에서 보면 profile은 firebase가 연결되어 있지 않고 userobj에 연결되어 있다.
    // 즉, firebase의 정보를 가지고 react.js를 업데이트 해줘야 한다 . 그 역할이 refreshUser 함수임
    setUserObj(authService.currentUser);
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser} // 여기로 보내서 프로필이 업데이트 할 수 있게 해줌 (★ Router.js에 props로 refreshUser 연결해주기)
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <hr />
      <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
