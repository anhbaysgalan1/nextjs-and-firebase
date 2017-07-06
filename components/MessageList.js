import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Actions } from '../lib/store';

const MessageList = ({ messages, removeMessage }) =>
  (<div>
    {messages &&
      Object.keys(messages).map((key) => {
        const message = messages[key];
        return (
          <div key={key}>
            <button
              onClick={() => {
                removeMessage(message.id);
              }}
            >
              Remove From Queue
            </button>
            <div>Text: {message.text}</div>
            <div>To: {message.phoneNumber}</div>
            <div>Sending On: {`${new Date(message.sendTime)}`}</div>
          </div>
        );
      })}
  </div>);

MessageList.propTypes = {
  messages: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,
      sendTime: PropTypes.number.isRequired,
    })
  ),
  removeMessage: PropTypes.func.isRequired,
};

MessageList.defaultProps = {
  messages: [],
};

const mapStateToProps = state => ({
  messages: state.messages,
});

const mapDispatchToProps = dispatch => ({
  removeMessage: (messageId) => {
    dispatch(Actions.removeMessage(messageId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
