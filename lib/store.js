import withRedux from 'next-redux-wrapper';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import firebase from 'firebase';

export class Actions {
  // Standard Action Creators
  // ------------------------

  static setUser(user) {
    return { type: 'SET_USER', user };
  }

  // Thunks
  // ------

  static watchMessagesForUser(uid) {
    return dispatch =>
      firebase
        .database()
        .ref('messages')
        .orderByChild('user')
        .startAt(uid)
        .endAt(uid)
        .on('value', async (snap) => {
          const messages = await snap.val();
          if (messages) {
            dispatch({
              type: 'LOADED_MESSAGES_FOR_USER',
              messages,
            });
          }
        });
  }

  static unwatchMessages() {
    return (dispatch) => {
      firebase.database().ref('messages').off();

      dispatch({
        type: 'UNLOAD_MESSAGES',
      });
    };
  }

  static loadMessagesForUser(uid, firebaseInstance = firebase) {
    return dispatch =>
      new Promise(async (resolve) => {
        const messages = await firebaseInstance
          .database()
          .ref('messages')
          .orderByChild('user')
          .startAt(uid)
          .endAt(uid)
          .once('value');

        dispatch({
          type: 'LOADED_MESSAGES_FOR_USER',
          messages: messages.val(),
        });

        resolve();
      });
  }
}

const reducer = (state = { user: null, foo: 'abc', messages: {} }, action) => {
  switch (action.type) {
    case 'FOO':
      return { ...state, foo: action.payload };
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'LOADED_MESSAGES_FOR_USER':
      return { ...state, messages: action.messages };
    case 'UNLOAD_MESSAGES':
      return { ...state, messages: {} };
    default:
      return state;
  }
};

const makeStore = initialState => createStore(reducer, initialState, applyMiddleware(thunk));

export const wrapPageInRedux = component =>
  withRedux(makeStore, state => ({ user: state.user, foo: state.foo, messages: state.messages }))(
    component,
  );
