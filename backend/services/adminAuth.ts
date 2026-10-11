export const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@noctisurbano.com',
  password: process.env.ADMIN_PASSWORD || 'admin1234',
  token: process.env.ADMIN_AUTH_TOKEN || 'noctis_auth_token_989338_secure',
};

export const ADMIN_COOKIE_NAME = 'noctis_admin_session';
