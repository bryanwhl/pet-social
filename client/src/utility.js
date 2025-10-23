/**
 * Utility functions for Pet Social application
 * Contains helper functions for formatting user data, dates, and times
 */

/**
 * Formats user's display name based on their preference
 * @param {Object} user - User object with name and settings
 * @param {Object} user.name - User's name object with givenName and familyName
 * @param {Object} user.settings - User's settings object
 * @param {boolean} user.settings.familyNameFirst - Whether to display family name first
 * @returns {string} Formatted display name
 */
export const displayName = (user) => {
    return user.settings.familyNameFirst ? (user.name.familyName + " " + user.name.givenName)
      : (user.name.givenName + " " + user.name.familyName)
}

/**
 * Converts Unix timestamp to localized date string
 * @param {number} unixDate - Unix timestamp in milliseconds
 * @returns {string} Formatted date string in UK locale
 */
export const convertDate = (unixDate) => {
  const normalDate = new Date(unixDate).toLocaleDateString("en-uk");
  return normalDate;
}

/**
 * Converts Unix timestamp to localized time string
 * @param {number} unixDate - Unix timestamp in milliseconds
 * @returns {string} Formatted time string in UK locale
 */
export const convertTime = (unixDate) => {
  const normalDate = new Date(unixDate).toLocaleTimeString("en-uk");
  return normalDate;
}