const DB_NAME = 'Cluster0';

const UserRolesEnum = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};
const AvailableUserRoles = Object.values(UserRolesEnum);

const UserLoginType = {
  EMAIL_PASSWORD: 'EMAIL_PASSWORD',
  GOOGLE: 'GOOGLE',
};

const AvailableSocialLogins = Object.values(UserLoginType);

const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes

const USER_OTP_EXPIRY = 2;

module.exports = {
  DB_NAME,
  UserRolesEnum,
  AvailableUserRoles,
  UserLoginType,
  AvailableSocialLogins,
  USER_TEMPORARY_TOKEN_EXPIRY,
  USER_OTP_EXPIRY,
};
