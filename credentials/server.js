module.exports = {
  type: process.env.FIREBASE_SERVER_TYPE,
  project_id: process.env.FIREBASE_SERVER_PROJECT_ID,
  private_key_id: process.env.FIREBASE_SERVER_PRIVATE_KEY_ID,
  // Handle escaped newlines with `heroku local`.
  private_key: process.env.FIREBASE_SERVER_PRIVATE_KEY.replace(/\\n/gi, '\n'),
  client_email: process.env.FIREBASE_SERVER_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_SERVER_CLIENT_ID,
  auth_uri: process.env.FIREBASE_SERVER_AUTH_URI,
  token_uri: process.env.FIREBASE_SERVER_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_SERVER_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_SERVER_CLIENT_CERT_URL,
};
