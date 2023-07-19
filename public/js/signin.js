// Set up the sign-in button
document.getElementById('signInButton').addEventListener('click', event => {
    event.preventDefault();
  
    const provider = new firebase.auth.GoogleAuthProvider();
  
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // Redirect to index.html after sign in
        window.location.href = 'index.html';
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        // ...
      });
  });