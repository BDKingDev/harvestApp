firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in, perform database operations here
    const db = firebase.firestore();

    // Populate the strain select field
    const strainSelect = document.getElementById('strain');
    db.collection('strains').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const option = document.createElement('option');
        option.text = doc.data().name;
        option.value = doc.id;
        strainSelect.add(option);
      });
    });

    // Populate the harvest select field
    const harvestSelect = document.getElementById('harvest');
    db.collection('harvests').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const option = document.createElement('option');
        option.text = doc.data().harvestId;
        option.value = doc.id;
        harvestSelect.add(option);
      });
    });

    document.getElementById('batchForm').addEventListener('submit', event => {
      event.preventDefault();

      const strainValue = strainSelect.value;
      const plantCountInput = document.getElementById('plantCount');
      const plantCountValue = plantCountInput.value;

      // Add error handling for plant count
      if (plantCountValue <= 0) {
        alert('Plant count must be greater than 0.');
        return;
      }

      const harvestValue = harvestSelect.value;

      // Generate the batch ID
      const date = new Date();
      const year = String(date.getFullYear()).slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      let batchId;

      // Get the strain abbreviation and the room number from the selected strain and harvest
      db.collection('strains').doc(strainValue).get().then((doc) => {
        const strainAbbr = doc.data().abbr;
        db.collection('harvests').doc(harvestValue).get().then((doc) => {
          const roomNumber = doc.data().room;
          batchId = month + day + year + "R" + roomNumber + strainAbbr;

          db.collection('batches').add({
            strain: strainValue,
            plantCount: plantCountValue,
            harvest: harvestValue,
            batchId: batchId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            batchFinished: false
          })
          .then((docRef) => {
            console.log('Document written with ID: ', docRef.id);

            // Check if the batch is finished
            const finishedCheckbox = document.getElementById('finishedCheckbox');
            if (finishedCheckbox.checked) {
              if (confirm('Are you sure you want to finish this batch? This can\'t be undone.')) {
                db.collection('batches').doc(docRef.id).update({
                  batchFinished: true,
                  batchFinishedTimestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
              }
            }
          })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
        });
      });
    });
  } else {
    // User is not signed in. Redirect to sign in page
    window.location.href = '../signin.html';
  }
});
