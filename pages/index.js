import React from 'react';
import firebase from 'firebase';
import FirebasePage from '../components/FirebasePage';

const getMessagesReference = (firebaseInstance, user) =>
  firebaseInstance
    .database()
    .ref('messages')
    .orderByChild('user')
    .startAt(user && user.uid)
    .endAt(user && user.uid);

export default class Index extends FirebasePage {
  static async getInitialProps({ req }) {
    const user = req && req.session ? req.session.decodedToken : null;
    const messages = req && (await getMessagesReference(req.firebaseServer, user).once('value'));

    return { user, messages: req ? messages.val() : {} };
  }

  constructor(props) {
    super(props);

    // Initialize state.
    this.state = {
      user: this.props.user,
      messages: this.props.messages,
      value: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFirebaseLogin = this.onFirebaseLogin.bind(this);
  }

  onPartialViewmodelUpdate(partialViewModel) {
    this.setState(partialViewModel);
  }

  onFirebaseLogin() {
    getMessagesReference(firebase, this.state.user).on('value', async (snap) => {
      const messages = await snap.val();
      if (messages) this.setState({ messages });
    });
  }

  onFirebaseLogout() {
    firebase.database().ref('messages').off();
    this.setState({ messages: {} });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const date = new Date().getTime();

    firebase.database().ref(`messages/${date}`).set({
      id: date,
      text: this.state.value,
      user: this.state.user.uid,
    });

    this.setState({ value: '' });
  }

  removeMessage(id) {
    firebase.database().ref(`messages/${id}`).remove();
  }

  render() {
    const { user, value, messages } = this.state;

    return (
      <div>
        {user && <div>user: {user.uid}</div>}

        {user
          ? <button onClick={FirebasePage.handleLogout}>Logout</button>
          : <button onClick={FirebasePage.handleLogin}>Login</button>}

        {user &&
          <div>
            <form onSubmit={this.handleSubmit}>
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
