import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { WarningsContainer } from '../styles/components';

const Warnings = ({ globalWarning }) =>
  (<WarningsContainer active={!!globalWarning}>
    Warning: {globalWarning}
  </WarningsContainer>);

Warnings.propTypes = {
  globalWarning: PropTypes.string,
};

const mapStateToProps = state => ({
  globalWarning: state.globalWarning,
});

export default connect(mapStateToProps)(Warnings);
