import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Actions } from '../lib/store';

import {
  GenericButton,
  SectionTitle,
  MessageForm,
  MessageFormLabel,
  MessageFormInput,
  MessagePreview,
  MessagePreviewTitle,
  MessagePreviewText,
} from '../styles/components';

const SMS_MAX_LENGTH = 160;

const handleSubmit = (addMessageToQueue, user, draftMessage) => {
  const sendTime = moment(
    `${draftMessage.date} ${draftMessage.time}`,
    'YYYY-MM-DD HH:mm'
  ).valueOf();

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

class MessageQueuer extends Component {
  componentDidMount() {
    const { updateDraftMessage } = this.props;

    // You could do this on the server (in the default store) for pre-rendering, but
    // it'd render the server's timezone (typically UTC).
    updateDraftMessage({
      date: moment().format('YYYY-MM-DD'),
      time: moment().add(5, 'minutes').format('HH:mm'),
    });
  }

  render() {
    const { addMessageToQueue, user, draftMessage, updateDraftMessage } = this.props;
    return (
      <MessageForm
        name="queue_form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(addMessageToQueue, user, draftMessage);
        }}
      >
        <SectionTitle>Queue a Message</SectionTitle>
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

        {draftMessage.message &&
          <MessagePreview>
            <MessagePreviewTitle>Preview</MessagePreviewTitle>
            <MessagePreviewText>
              {`"${draftMessage.composedMessage}"`}
            </MessagePreviewText>
            {draftMessage.composedMessage &&
              <p>
                [{draftMessage.composedMessage.length}/{SMS_MAX_LENGTH}]
              </p>}
          </MessagePreview>}

        <GenericButton type="submit">Submit</GenericButton>
      </MessageForm>
    );
  }
}

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
