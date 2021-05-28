export const displayName = (user) => {
    console.log("Display name: ", user)
    return user.otherSettings.familyNameFirst ? (user.name.familyName + " " + user.name.givenName)
      : (user.name.givenName + " " + user.name.familyName)
}