'use strict';

// Basic Auth Lambda@Edge for CloudFront
// Credentials are set as environment variables in the Lambda config
// Or hardcoded here for simplicity (change before deploying)
const CREDENTIALS = {
  username: 'trustdb',
  password: 'scorecard-2026', // CHANGE THIS before deploying
};

exports.handler = (event, _context, callback) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  const authHeader = headers.authorization || headers.Authorization;

  if (!authHeader || !authHeader[0]) {
    return callback(null, {
      status: '401',
      statusDescription: 'Unauthorized',
      headers: {
        'www-authenticate': [{ key: 'WWW-Authenticate', value: 'Basic realm="TrustDB Scorecard"' }],
        'content-type': [{ key: 'Content-Type', value: 'text/plain' }],
      },
      body: 'Unauthorized',
    });
  }

  const encoded = authHeader[0].value.split(' ')[1];
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
  const [username, password] = decoded.split(':');

  if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
    return callback(null, request);
  }

  return callback(null, {
    status: '403',
    statusDescription: 'Forbidden',
    headers: {
      'content-type': [{ key: 'Content-Type', value: 'text/plain' }],
    },
    body: 'Invalid credentials',
  });
};
