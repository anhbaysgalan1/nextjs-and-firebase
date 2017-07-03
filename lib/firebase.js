import { Component } from 'react';
import firebase from 'firebase';
import FetchPonyfill from 'fetch-ponyfill';

import clientCredentials from '../credentials/client';
import { Actions } from './store';

const { fetch, Headers } = FetchPonyfill({});

export class FirebaseManager {
  static initializeClient({ dispatch, onLogin, onLogout }) {
    firebase.initializeApp(clientCredentials);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
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
          .then(() => {
            dispatch(Actions.setUser(user));
          })
          .then(onLogin);
      }

      return fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
      })
        .then(() => {
          dispatch(Actions.setUser(null));
        })
        .then(onLogout);
    });
  }

  static closeClient() {
    firebase.app().delete();
  }

  static handleLogin() {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  static handleLogout() {
    firebase.auth().signOut();
  }
}

export class FirebaseComponent extends Component {
  componentDidMount() {
    FirebaseManager.initializeClient({
      dispatch: this.props.dispatch,
      onLogin: () => this.firebaseDidAuthenticate(),
      onLogout: () => this.firebaseDidDeauthenticate(),
    });
  }

  componentWillUnmount() {
    FirebaseManager.closeClient();
  }

  firebaseDidAuthenticate() {}
  firebaseDidDeauthenticate() {}
}
