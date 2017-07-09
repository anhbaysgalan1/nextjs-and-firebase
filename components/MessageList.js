import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { Actions } from '../lib/store';
import {
  SectionTitle,
  QueuedMessageList,
  QueuedMessage,
  WarningButton,
  MessageInformation,
  QueuedMessageText,
  QueuedMessageCaption,
} from '../styles/components';

const MessageList = ({ messages, removeMessage }) => {
  const messageKeys = Object.keys(messages);

  messageKeys.sort((a, b) => (messages[a].sendTime < messages[b].sendTime ? 1 : -1));

  return (
    <QueuedMessageList>
      {messageKeys.length > 0 && <SectionTitle>Your Queue</SectionTitle>}
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
          <QueuedMessage key={key} {...message}>
            <WarningButton
              squared
              onClick={() => {
                removeMessage(message.id);
              }}
            >
              Delete Message
            </WarningButton>
            <MessageInformation>
              <QueuedMessageText>&ldquo;{message.text}&rdquo;</QueuedMessageText>
              <QueuedMessageCaption>
                To: {message.phoneNumber}
              </QueuedMessageCaption>
              <QueuedMessageCaption>
                {sentText} {`${moment(message.sendTime).fromNow()}`}
              </QueuedMessageCaption>
            </MessageInformation>
          </QueuedMessage>
        );
      })}
    </QueuedMessageList>
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

const mapStateToProps = state => ({
  messages: state.messages,
});

const mapDispatchToProps = dispatch => ({
  removeMessage: (messageId) => {
    dispatch(Actions.removeMessage(messageId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
