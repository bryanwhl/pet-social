export const displayName = (user) => {
    return user.settings.familyNameFirst ? (user.name.familyName + " " + user.name.givenName)
      : (user.name.givenName + " " + user.name.familyName)
}