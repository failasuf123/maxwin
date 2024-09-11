// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqYRI5mXRqGxR6cIwHQbJeF3ZOdVaeW2c",
  authDomain: "tripio-ef511.firebaseapp.com",
  projectId: "tripio-ef511",
  storageBucket: "tripio-ef511.appspot.com",
  messagingSenderId: "981426667033",
  appId: "1:981426667033:web:1f2fc7d82745632d40f488",
  measurementId: "G-D03D87NGGL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

3. To host your site with Firebase Hosting, you need the Firebase CLI (a command line tool).

Run the following npm command to install the CLI or update to the latest CLI version.

npm install -g firebase-tools
Doesn't work? Take a look at the Firebase CLI reference or change your npm permissions


4. Deploy to Firebase Hosting
You can deploy now or later. To deploy now, open a terminal window, then navigate to or create a root directory for your web app.

Sign in to Google
firebase login
Initiate your project
Run this command from your app's root directory:

firebase init
When you're ready, deploy your web app
Put your static files (e.g., HTML, CSS, JS) in your app's deploy directory (the default is "public"). Then, run this command from your app's root directory:

firebase deploy
After deploying, view your app at tripio-ef511.web.app

Need help? Check out the Hosting docs