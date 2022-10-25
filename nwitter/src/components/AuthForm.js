import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value); // 여기서 value는 키보드를 통해 입력된 값임!
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      const auth = getAuth();
      // Create Account 버튼을 눌렀을 때, form 이 제출 되면 계정 생성(newAccount 값을 true로 만듦)
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password); // 이메일, 비밀번호로 회원가입
      } else {
        data = await signInWithEmailAndPassword(auth, email, password); // 이메일, 비밀번호로 로그인
      }
      // console.log(data); // 위에서 얻은 data가 뭔지 확인해본다
    } catch (error) {
      // console.log(error);
      if (error.code === "auth/wrong-password") {
        setError("비밀번호가 틀렸습니다.");
      } else if (error.code === "auth/email-already-in-use") {
        setError("이미 동일한 계정이 있습니다.");
      } else if (error.code === "auth/weak-password") {
        setError("비밀번호는 최소 6자리 이상이어야 합니다.");
      }
      // setError(
      //   "아이디/비밀번호가 일치하지 않거나 이미 동일한 계정이 있습니다."
      // );
    }
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
    setError("");
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="container">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className="authInput"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          className="authInput"
        />

        <input
          type="submit"
          className="authInput authSubmit"
          value={newAccount ? "Create Account" : "Log In"}
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <br />
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount
          ? "계정이 있으면 여기를 눌러 로그인 하세요."
          : "계정 만들기"}
      </span>
    </div>
  );
};

export default AuthForm;
