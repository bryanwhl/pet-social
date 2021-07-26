/* Utilities test */
import { displayName, convertDate, convertTime } from '../client/src/utility.js'
jest.useFakeTimers()

test("A sample test", () => {
  expect(2).toBe(2);
});

test("convertDate test: Edge case", () => {
  expect(convertDate(0)).toBe("1/1/1970");
});

test("convertDate test: Standard use case", () => {
  expect(convertDate(1626825600000)).toBe("7/21/2021");
});

test("convertDate test: Standard use case", () => {
  expect(convertDate('1626825600000')).toBe("Invalid Date");
});

test("displayName test: familyName first", () => {
  expect(displayName({settings: {familyNameFirst: true}, name: {familyName: "Bryan", givenName:"Wong"}})).toBe("Bryan Wong");
});

test("displayName test: givenName first", () => {
  expect(displayName({settings: {familyNameFirst: false}, name: {familyName: "Bryan", givenName:"Wong"}})).toBe("Wong Bryan");
});

test("displayName test: empty string", () => {
  expect(displayName({settings: {familyNameFirst: true}, name: {familyName: "", givenName:""}})).toBe(" ");
});
