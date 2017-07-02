import { Component } from 'react';
import firebase from 'firebase';
import FetchPonyfill from 'fetch-ponyfill';
import clientCredentials from '../credentials/client';

const { fetch, Headers } = FetchPonyfill({});

export default class FirebasePage extends Component {
  static handleLogin() {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  static handleLogout() {
    firebase.auth().signOut();
  }

  componentDidMount() {
    firebase.initializeApp(clientCredentials);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });

        return user
          .getToken()
          .then(token =>
            fetch('/api/login', {
              method: 'POST',
              headers: new Headers({ 'Content-Type': 'application/json' }),
              credentials: 'same-origin',
              body: JSON.stringify({ token }),
            }),
          )
          .then(() => this.onFirebaseLogin());
      }

      this.setState({ user: null });

      return fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
      }).then(() => this.onFirebaseLogout());
    });
  }

  onFirebaseLogin() {}
  onFirebaseLogout() {}
}
