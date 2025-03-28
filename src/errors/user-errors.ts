export class EmailInUseError extends Error {
  constructor() {
    super('Email already in use');
    this.name = 'EmailInUseError';
  }
}

export class UserAuthError extends Error {
  constructor() {
    super('Invalid credentials');
    this.name = 'UserAuthError';
  }
}
