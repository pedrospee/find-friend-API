export class OrgAlreadyExistsError extends Error {
  constructor() {
    super('An organization with this email already exists.')
  }
}
