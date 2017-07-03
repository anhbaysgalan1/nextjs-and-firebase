import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  woo: state.foo,
});

const mapDispatchToProps = dispatch => ({
  newFoo: () => {
    dispatch({ type: 'FOO', payload: Math.random() });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(props =>
  <button onClick={props.newFoo}>NewFoo: {props.woo}</button>,
);
