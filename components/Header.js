import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FirebaseManager } from '../lib/firebase';
import { HeaderBar, UserControls, UserName, GenericButton } from '../styles/components';

const Header = ({ user }) =>
  (<HeaderBar>
    <h1>MessageQueue</h1>
    <UserControls>
      {user && <UserName>User: {user.displayName}</UserName>}
      {user
        ? <GenericButton onClick={FirebaseManager.handleLogout}>Logout</GenericButton>
        : <GenericButton onClick={FirebaseManager.handleLogin}>Login</GenericButton>}
    </UserControls>
  </HeaderBar>);

Header.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }),
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Header);
