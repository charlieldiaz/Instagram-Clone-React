import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import Post from "./components/Post";
import { auth, db } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input, Modal } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";
import InstagramEmbed from "react-instagram-embed";

//// Styles for the Login modal ////////////////////////
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  plus: {
    position: "absolute",
    width: 200,
    height: 100,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
///////////////////////////   ////////////////////////

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    }, []);

    return () => {
      //peform some cleanup actions
      unsubscribe();
    };
  }, [user, userName]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, [posts]);

  const SignUpHandler = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({ displayName: userName });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const SignInHandler = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  const plusUploadButton = (
    <img
      src="./images/addpost.png"
      alt=""
      className="app__uploadImage"
      onClick={() => setOpenUpload(true)}
    />
  );
  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt=""
                className="app__headerImage"
              />
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={SignUpHandler} type="submit">
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      {/* ///////////////////////Open Upload /////////////////////// */}
      <Modal open={openUpload} onClose={() => setOpenUpload(false)}>
        <div style={modalStyle} className={classes.plus}>
          <form className="app__signup">
            <center>
              <div className="uploadarea">
                {user?.displayName ? (
                  <ImageUpload username={user.displayName} />
                ) : (
                  <h3>
                    {" "}
                    Sorry you need to Sign up or Login to make posts. Join us!
                  </h3>
                )}
              </div>
            </center>
          </form>
        </div>
      </Modal>
      {/* ///////////////////////////////////// */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt=""
                className="app__headerImage"
              />
            </center>

            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={SignInHandler} type="submit">
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      {/* /////////////////////////////////// */}
      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt=""
          className="app__headerImage"
        />

        {user ? (
          <div className="app__logoutContainer">
            {plusUploadButton}
            <Button onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ) : (
          <div className="app__loginContainer">
            {" "}
            {plusUploadButton}
            <Button onClick={() => setOpenSignIn(true)}>Log In</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            // clientAccessToken="123|456"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
