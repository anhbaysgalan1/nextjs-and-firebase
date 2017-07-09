import withRedux from 'next-redux-wrapper';
import { createStore, applyMiddleware } from 'redux';
import moment from 'moment';
import thunk from 'redux-thunk';
import firebase from 'firebase';

const watchers = [];

export class Actions {
  // Standard Action Creators
  // ------------------------

  static setUser(user) {
    return { type: 'SET_USER', user };
  }

  static updateDraftMessage(message) {
    return (dispatch, getState) => {
      dispatch({ type: 'UPDATE_DRAFT_MESSAGE', message });

      const draftMessage = getState().draftMessage;

      const sendTime = moment(
        `${draftMessage.date} ${draftMessage.time}`,
        'YYYY-MM-DD HH:mm'
      ).valueOf();

      if (sendTime < new Date()) {
        dispatch({
          type: 'SET_GLOBAL_WARNING',
          text: 'Send time is in the past, so this message will send immediately.',
        });
      } else {
        dispatch({
          type: 'SET_GLOBAL_WARNING',
          text: null,
        });
      }
    };
  }

  // Thunks
  // ------

  static removeMessage(id) {
    return () => {
      firebase.database().ref(`messages/${id}`).remove();
    };
  }

  static watchMessagesForUser(uid) {
    return (dispatch) => {
      const ref = firebase.database().ref('messages').orderByChild('user').equalTo(uid);

      watchers.push(ref);

      ref.on('value', async (snap) => {
        const messages = await snap.val();
        dispatch({
          type: 'LOADED_MESSAGES_FOR_USER',
          messages,
        });
      });
    };
  }

  static unwatchMessages() {
    return (dispatch) => {
      watchers.forEach((ref) => {
        ref.off();
      });

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
          .equalTo(uid)
          .once('value');

        dispatch({
          type: 'LOADED_MESSAGES_FOR_USER',
          messages: messages.val(),
        });

        resolve();
      });
  }

  static addMessageToQueue(message) {
    return dispatch =>
      new Promise(async (resolve) => {
        const date = new Date().getTime();

        firebase.database().ref(`messages/${date}`).set({
          id: date,
          text: message.text,
          phoneNumber: message.phoneNumber,
          user: message.user.uid,
          sendTime: message.sendTime,
          sending: false,
          sent: false,
        });

        dispatch({ type: 'CLEAR_DRAFT_MESSAGE' });

        resolve();
      });
  }
}

const defaultDraftMessage = {
  date: '',
  time: '',
  message: '',
  phoneNumber: '',
  composedMessage: '',
};

const reducer = (
  state = {
    globalWarning: null,
    user: null,
    messages: {},
    isLoading: false,
    draftMessage: Object.assign({}, defaultDraftMessage),
  },
  action
) => {
  switch (action.type) {
    case 'SET_GLOBAL_WARNING':
      return { ...state, globalWarning: action.text };
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'LOADED_MESSAGES_FOR_USER':
      return { ...state, messages: action.messages || {} };
    case 'UNLOAD_MESSAGES':
      return { ...state, messages: {} };
    case 'UPDATE_DRAFT_MESSAGE':
      return { ...state, draftMessage: Object.assign({}, state.draftMessage, action.message) };
    case 'CLEAR_DRAFT_MESSAGE':
      return {
        ...state,
        draftMessage: Object.assign({}, defaultDraftMessage, {
          date: moment().format('YYYY-MM-DD'),
          time: moment().add(5, 'minutes').format('HH:mm'),
        }),
      };
    default:
      return state;
  }
};

const makeStore = initialState => createStore(reducer, initialState, applyMiddleware(thunk));

export const wrapPageInRedux = component =>
  withRedux(makeStore, state => ({ user: state.user, foo: state.foo, messages: state.messages }))(
    component
  );
