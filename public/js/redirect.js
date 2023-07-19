// Check if user is signed in
firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      // User is not signed in. Redirect to sign in page
      window.location.href = 'signin.html';
    }
  });
  