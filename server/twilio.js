class TwilioInterface {
  initialize({ firebase }) {
    this.firebase = firebase;

    setInterval(() => {
      this.checkForMessages();
    }, 2500);
  }

  checkForMessages() {
    this.firebase
      .database()
      .ref('messages')
      .orderByChild('sent')
      .equalTo(false)
      .once('value')
      .then((messages) => {
        console.log(messages.val());
      });
  }
}

module.exports = new TwilioInterface();
