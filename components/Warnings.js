import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

const WarningsContainer = styled.div`
  display: ${props => (props.active ? 'flex' : 'none')};
  justify-content: space-between;
  flex-wrap: wrap;
  background: red;
  color: white;
  padding: 16px;
`;

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
