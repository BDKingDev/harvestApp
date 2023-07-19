const admin = require('firebase-admin');

try {
  var serviceAccount = require('./harvest-app-49943-firebase-adminsdk-6ktnr-fe731dabbb.json');
} catch (error) {
  process.stderr.write('Error loading service account: ' + error + '\n');
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  process.stderr.write('Error initializing app: ' + error + '\n');
  process.exit(1);
}

// Get a reference to the user you want to add a role to
admin.auth().getUserByEmail('bailey@greendragon.com')
  .then((user) => {
    // Set custom claims
    return admin.auth().setCustomUserClaims(user.uid, { roles: ['OWNER'] });
  })
  .then(() => {
    process.stdout.write('Custom claims set for user\n');
  })
  .catch((error) => {
    process.stderr.write('Error adding custom claims: ' + error + '\n');
  });
