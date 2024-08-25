import "../../App.css";
import { Outlet } from "react-router-dom";
import { auth, provider } from "../../config/firebase.js";
import { signInWithPopup, signOut } from "firebase/auth";
import PropTypes from "prop-types";

function NavBar({ isAuth, setAuth }) {
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setAuth(true);
        console.log({ auth });
        const credential = provider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log({ result, auth, token, user });
      })
      .catch((error) => {
        console.error(error.code);
        console.error(error.message);
        console.error(error.customData.email);
      });
  };

  const signOutUser = () => {
    signOut(auth).then(() => {
      setAuth(false);
    });
  };

  return (
    <>
      <nav className="navbar">
        <img src="src/assets/logo.png"></img>
        <ul>
          {isAuth && <li>User: {auth.currentUser.displayName}</li>}
          <li>
            {!isAuth ? (
              <button onClick={signIn}>Login</button>
            ) : (
              <button onClick={signOutUser}>Log Out</button>
            )}
          </li>
          <li>
            <a href="https://www.themindcafe.sg/wp-content/uploads/1970/01/Buyword.pdf">
              Rules
            </a>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

NavBar.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  setAuth: PropTypes.func.isRequired,
};

export default NavBar;
