import React from "react";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "../fbase";
import AuthForm from "./AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
  const onSocialClick = async (e) => {
    const {
      currentTarget: { name },
    } = e;

    let provider;

    if (name === "google") {
      provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(authService, provider);
  };

  return (
    <div className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 20 }}
      />
      <span className="signIn">오늘 트위터에 가입하세요.</span>
      <AuthForm />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};

export default Auth;
