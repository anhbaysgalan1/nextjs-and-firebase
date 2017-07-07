import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { FirebaseManager } from '../lib/firebase';

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background: green;
  color: white;
  padding: 16px;
`;

const UserControls = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const UserName = styled.div`
  margin-right: 8px;
`;

const LoginStateButton = styled.button`
`;

const MessageQueuer = ({ user }) =>
  (<HeaderBar>
    <h1>MessageQueue</h1>
    <UserControls>
      {user && <UserName>User: {user.displayName}</UserName>}
      {user
        ? <LoginStateButton onClick={FirebaseManager.handleLogout}>Logout</LoginStateButton>
        : <LoginStateButton onClick={FirebaseManager.handleLogin}>Login</LoginStateButton>}
    </UserControls>
  </HeaderBar>);

MessageQueuer.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(MessageQueuer);
