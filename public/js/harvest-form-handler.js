firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in, perform database operations here
    document.getElementById('harvestForm').addEventListener('submit', event => {
      event.preventDefault();

      const roomNumberInput = document.getElementById('roomNumber');
      const roomNumberValue = roomNumberInput.value;
      const db = firebase.firestore();

      // Generate the harvest ID
      const date = new Date();
      const year = String(date.getFullYear()).slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const harvestId = `${month}${day}${year}R${roomNumberValue}`;

      db.collection("harvests").add({
        room: roomNumberValue,
        harvestId: harvestId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        harvestFinished: false
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);

        // Check if the harvest is finished
        const finishedCheckbox = document.getElementById('finishedCheckbox');
        if (finishedCheckbox.checked) {
          if (confirm('Are you sure you want to finish this harvest? This can\'t be undone.')) {
            db.collection("harvests").doc(docRef.id).update({
              harvestFinished: true,
              harvestFinishedTimestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
          }
        }
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
    });
  } else {
    // User is not signed in. Redirect to sign in page
    window.location.href = 'signin.html';
  }
});
