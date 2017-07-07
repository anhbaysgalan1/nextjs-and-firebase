import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import styled from 'styled-components';

import { Actions } from '../lib/store';

const Message = styled.div`
  display: flex;
  margin-bottom: 8px;
  padding: 8px;
  background: yellow;
  background: ${props => props.sending && 'red'};
  background: ${props => props.sent && 'green'};
  transition: all 1s;
`;

const DeleteButton = styled.button`
  max-width: 200px;
  height: 3rem;
  margin: 0 8px 8px 0;
  padding: 8px;
  color: black;
  border: 4px solid white;
  border-radius: 4px;
  background: white;
  flex: 1;
  transition: background 350ms;

  &:hover,
  &:focus {
    background: red;
    outline: none;
  }
`;

const Information = styled.div`
  flex: 2;
`;

const MessageList = ({ messages, removeMessage }) => {
  const messageKeys = Object.keys(messages);

  messageKeys.sort((a, b) => messages[a].sendTime < messages[b].sendTime);

  return (
    <div>
      {messageKeys.map((key) => {
        const message = messages[key];
        let sentText = '';

        if (message.sent) {
          sentText = 'Was sent';
        } else if (moment().isBefore(message.sendTime)) {
          sentText = 'Will be sent';
        } else {
          sentText = 'Should have been sent';
        }

        return (
          <Message key={key} {...message}>
            <DeleteButton
              onClick={() => {
                removeMessage(message.id);
              }}
            >
              Delete Message
            </DeleteButton>
            <Information>
              <div>Message: {message.text}</div>
              <div>To: {message.phoneNumber}</div>
              <div>{sentText} {`${moment(message.sendTime).fromNow()}`}</div>
            </Information>
          </Message>
        );
      })}
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,
      sendTime: PropTypes.number.isRequired,
      sent: PropTypes.bool.isRequired,
      sending: PropTypes.bool.isRequired,
    })
  ),
  removeMessage: PropTypes.func.isRequired,
};

MessageList.defaultProps = {
  messages: {},
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
