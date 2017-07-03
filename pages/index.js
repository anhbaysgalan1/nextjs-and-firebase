import React from 'react';
import firebase from 'firebase';

import { FirebaseManager, FirebaseComponent } from '../lib/firebase';
import { Actions, wrapPageInRedux } from '../lib/store';

import Test from '../components/Test';

class Index extends FirebaseComponent {
  static async getInitialProps({ req, store }) {
    const user = req && req.session ? req.session.decodedToken : null;

    // Prepopulate the store for server rendering.
    if (req && user) {
      await store.dispatch(Actions.setUser(user));
      await store.dispatch(Actions.loadMessagesForUser(user.uid, req.firebaseServer));
    }

    return {};
  }

  firebaseDidAuthenticate() {
    this.props.dispatch(Actions.watchMessagesForUser(this.props.user.uid));
  }

  firebaseDidDeauthenticate() {
    this.props.dispatch(Actions.unwatchMessages());
  }

  handleSubmit(event) {
    event.preventDefault();

    const element = event.target.elements[0];
    const date = new Date().getTime();

    firebase.database().ref(`messages/${date}`).set({
      id: date,
      text: element.value,
      user: this.props.user.uid,
    });

    element.value = '';
  }

  removeMessage(id) {
    firebase.database().ref(`messages/${id}`).remove();
  }

  render() {
    const { user, messages, value } = this.props;

    return (
      <div>
        {user && <div>user: {user.uid}</div>}
        <div>foo: {this.props.foo}</div>
        <Test />

        {user
          ? <button onClick={FirebaseManager.handleLogout}>Logout</button>
          : <button onClick={FirebaseManager.handleLogin}>Login</button>}

        {user &&
          <div>
            <form onSubmit={e => this.handleSubmit(e)}>
              <input
                type={'text'}
                onChange={this.handleChange}
                placeholder={'add message'}
                value={value}
              />
            </form>
            <ul>
              {messages &&
                Object.keys(messages).map(key =>
                  (<div key={key}>
                    <button
                      onClick={() => {
                        this.removeMessage(messages[key].id);
                      }}
                    >
                      {messages[key].text}
                    </button>
                  </div>),
                )}
            </ul>
          </div>}
      </div>
    );
  }
}

export default wrapPageInRedux(Index);
