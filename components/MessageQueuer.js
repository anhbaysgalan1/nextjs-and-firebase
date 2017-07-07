import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Actions } from '../lib/store';

const SMS_MAX_LENGTH = 160;

const Title = styled.h1`
  color: red;
  font-size: 2rem;
`;

const MessageFormLabel = styled.label`
  display: flex;
`;

const MessageFormInput = styled.input`
  width: 100%;
  text-align: left;
  font-size: 1.5rem;
`;

const handleSubmit = (addMessageToQueue, user, draftMessage) => {
  const sendTime = new Date(`${draftMessage.date} ${draftMessage.time}`).getTime();

  if (sendTime < new Date()) {
    // TODO: Trigger error state
    return;
  }

  addMessageToQueue({
    text: draftMessage.composedMessage,
    user,
    phoneNumber: draftMessage.phoneNumber,
    sendTime,
  });

  // Defocus form.
  if (document.activeElement) {
    document.activeElement.blur();
  }
};

const MessageQueuer = ({ addMessageToQueue, user, draftMessage, updateDraftMessage }) =>
  (<div>
    <Title>Queue a Message</Title>
    <form
      name="queue_form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(addMessageToQueue, user, draftMessage);
      }}
    >
      <MessageFormLabel htmlFor="draft-date">
        Date to send message:
      </MessageFormLabel>
      <MessageFormInput
        required
        type="date"
        id="draft-date"
        value={draftMessage.date}
        onChange={(e) => {
          updateDraftMessage({ date: e.target.value });
        }}
      />

      <MessageFormLabel htmlFor="draft-time">
        Time to send message:
      </MessageFormLabel>
      <MessageFormInput
        required
        type="time"
        id="draft-time"
        value={draftMessage.time}
        onChange={(e) => {
          updateDraftMessage({ time: e.target.value });
        }}
      />

      <MessageFormLabel htmlFor="draft-phone-number">
        Phone number (ex. 4155555555):
      </MessageFormLabel>
      <MessageFormInput
        required
        type="tel"
        id="draft-phone-number"
        value={draftMessage.phoneNumber}
        pattern="^\d{10}$"
        onChange={(e) => {
          updateDraftMessage({ phoneNumber: e.target.value });
        }}
      />

      <MessageFormLabel htmlFor="draft-message">
        Message text:
      </MessageFormLabel>
      <MessageFormInput
        required
        type="text"
        id="draft-message"
        value={draftMessage.message}
        maxLength={
          draftMessage.message
            ? SMS_MAX_LENGTH - (draftMessage.composedMessage.length - draftMessage.message.length)
            : SMS_MAX_LENGTH
        }
        onChange={(e) => {
          updateDraftMessage({
            message: e.target.value,
            composedMessage: `${e.target.value} [From ${user.displayName}]`,
          });
        }}
      />

      <MessageFormInput type="submit" value="Submit" />
    </form>

    {draftMessage.message &&
      <div>
        <h2>Preview</h2>
        <p>{`"${draftMessage.composedMessage}"`}</p>
        <p>
          {draftMessage.composedMessage && draftMessage.composedMessage.length}/{SMS_MAX_LENGTH}
        </p>
      </div>}
  </div>);

MessageQueuer.propTypes = {
  addMessageToQueue: PropTypes.func.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
  draftMessage: PropTypes.shape({
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    composedMessage: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
  }).isRequired,
  updateDraftMessage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  draftMessage: state.draftMessage,
  isLoading: state.isLoading,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  addMessageToQueue: (messagePayload) => {
    dispatch(Actions.addMessageToQueue(messagePayload));
  },
  updateDraftMessage: (messageInputValues) => {
    dispatch(Actions.updateDraftMessage(messageInputValues));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageQueuer);
