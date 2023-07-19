firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in, perform database operations here
    const db = firebase.firestore();

    // Populate the batch select field
    const batchSelect = document.getElementById('batch');
    db.collection('batches').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const option = document.createElement('option');
        option.text = doc.data().batchId;
        option.value = doc.id;
        batchSelect.add(option);
      });
    });

    document.getElementById('weightForm').addEventListener('submit', event => {
      event.preventDefault();

      const materialTypeInput = document.getElementById('materialType');
      const materialTypeValue = materialTypeInput.value;

      const weightInput = document.getElementById('weight');
      const weightValue = weightInput.value;

      const batchValue = batchSelect.value;

      // Add error handling for weight
      if (weightValue <= 0) {
        alert('Weight must be greater than 0.');
        return;
      } else if (weightValue % 10 !== 0) {
        if (!confirm('The weight is not divisible by 10. Are you sure you want to proceed?')) {
          return;
        }
      }

      let addedAfterFinished = false;

      // Check if the batch is finished
      db.collection('batches').doc(batchValue).get().then((doc) => {
        if (doc.exists) {
          if (doc.data().batchFinished) {
            if (confirm('This batch has been finished, are you sure you want to add this weight?')) {
              addedAfterFinished = true;
            } else {
              return;
            }
          }
        } else {
          console.log('No such document!');
        }
      }).catch((error) => {
        console.log('Error getting document:', error);
      });

      db.collection('weights').add({
        materialType: materialTypeValue,
        weight: weightValue,
        batch: batchValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        addedAfterFinished: addedAfterFinished
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
        weightInput.value = '';
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    });
  } else {
    // User is not signed in. Redirect to sign in page
    window.location.href = '../signin.html';
  }
});
