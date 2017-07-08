import React from 'react';
import styled from 'styled-components';

import { FirebaseComponent } from '../lib/firebase';
import { Actions, wrapPageInRedux } from '../lib/store';

import Header from '../components/Header';
import Warnings from '../components/Warnings';
import MessageQueuer from '../components/MessageQueuer';
import MessageList from '../components/MessageList';

// Base styles.
const Page = styled.div`
  font-family: 'PT Sans', sans-serif;
`;

const Content = styled.div`
  display: flex;
  padding: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LoginPrompt = styled.div`
  width: 50%;
  background: green;
  color: white;
  border-radius: 24px;
  text-align: center;
  font-size: 3rem;
  padding: 24px;

  @media (max-width: 600px) {
    width: auto;
  }
`;

class Index extends FirebaseComponent {
  static async getInitialProps({ req, store }) {
    const user = req && req.session ? req.session.decodedToken : null;

    // Prepopulate the store for server rendering.
    if (req && user) {
      // `firebase.UserInfo` differs from decodedToken Google auth provides, so I need to map
      // the values to the right key. I assume this would vary depending on auth provider, so
      // that's something that might require a bit of a refactor.
      await store.dispatch(
        Actions.setUser({
          ...user,
          displayName: user.name,
          photoUrl: user.picture,
        })
      );

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

  render() {
    const { user } = this.props;

    return (
      <Page>
        <Header />
        {user &&
          <Content>
            <Warnings />
            <MessageQueuer />
            <MessageList />
          </Content>}
        {!user &&
          <Content>
            <LoginPrompt>
              Hey, you should log in!
            </LoginPrompt>
          </Content>}
      </Page>
    );
  }
}

export default wrapPageInRedux(Index);
