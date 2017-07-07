import React from 'react';
import styled from 'styled-components';

import { FirebaseComponent } from '../lib/firebase';
import { Actions, wrapPageInRedux } from '../lib/store';

import Header from '../components/Header';
import MessageQueuer from '../components/MessageQueuer';
import MessageList from '../components/MessageList';

// Base styles.
const Page = styled.div`
  font-family: 'PT Sans', sans-serif;
`;

const Content = styled.div`
  padding: 16px;
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
            <MessageQueuer />
            <MessageList />
          </Content>}
      </Page>
    );
  }
}

export default wrapPageInRedux(Index);
