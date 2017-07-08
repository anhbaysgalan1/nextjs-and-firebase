const Twilio = require('twilio');
const moment = require('moment');
const twilioConfig = require('../credentials/twilio');

const twilioClient = new Twilio(twilioConfig.accountSid, twilioConfig.authToken);

class TwilioInterface {
  initialize({ firebase }) {
    this.firebase = firebase;

    setInterval(() => {
      this.checkForMessages();
    }, 10000);
  }

  checkForMessages() {
    this.firebase
      .database()
      .ref('messages')
      .orderByChild('sent')
      .equalTo(false)
      .once('value')
      .then((messages) => {
        this.sendMessages(messages.val());
      });
  }

  sendMessages(messages) {
    Object.keys(messages).forEach((key) => {
      // Don't send if it isn't time yet.
      if (messages[key].sendTime > moment()) {
        return;
      }

      this.firebase.database().ref(`messages/${key}`).transaction(
        (currentData) => {
          // First, set sending property to true to lock the record.
          if (currentData.sending === false) {
            return Object.assign({}, currentData, { sending: true });
          }
          // Must return undefined to abort the transaction.
          return undefined;
        },
        (error, committed, snapshot) => {
          const sendingData = snapshot.val();
          const messageRef = this.firebase.database().ref(`messages/${sendingData.id}`);

          // This logic means that *this* transaction was the one that actually locked
          // the message. If we were to horizontally scale this app, this would prevent
          // multiple instances from attempting to send the same message.
          if (!error && committed) {
            twilioClient.messages
              .create({
                body: sendingData.text,
                to: `+1${sendingData.phoneNumber}`,
                from: twilioConfig.twilioPhoneNumber,
              })
              .then(() => {
                // Done! Mark as sent.
                messageRef.child('sent').set(true).then(() => {
                  // Housekeeping, mark as done sending.
                  messageRef.child('sending').set(false);
                });
              })
              .catch(() => {
                // If there was an error, remove sending lock so that we can retry.
                messageRef.child('sending').set(false);
              });
          }
        }
      );
    });
  }
}

module.exports = new TwilioInterface();
