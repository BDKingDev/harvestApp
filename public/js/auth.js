// Get a reference to the Firebase Auth service
var auth = firebase.auth();

// Create a new Google Auth provider
var provider = new firebase.auth.GoogleAuthProvider();

// Function to sign in with Google
function signInWithGoogle() {
  auth.signInWithRedirect(provider);
}

// Function to sign out
function signOut() {
  auth.signOut().then(() => {
    console.log('User signed out');
  });
}

// Track the Auth state
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in
    console.log('User signed in');
  } else {
    // No user is signed in
    console.log('No user is signed in');
  }
});
