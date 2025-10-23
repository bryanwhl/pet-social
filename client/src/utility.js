export const displayName = (user) => {
    return user.settings.familyNameFirst ? (user.name.familyName + " " + user.name.givenName)
      : (user.name.givenName + " " + user.name.familyName)
}

export const convertDate = (unixDate) => {
  const normalDate = new Date(unixDate).toLocaleDateString("en-uk");
  return normalDate;
}

export const convertTime = (unixDate) => {
  const normalDate = new Date(unixDate).toLocaleTimeString("en-uk");
  return normalDate;
}