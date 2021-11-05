import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { ResponseBody, RequestBody, State, FieldError } from "../types";
import { dateValidate } from "./dateValidate";

export const validateRequest = (event: HandlerEvent): FieldError | null => {
  if (event.httpMethod !== "POST") {
    return {
      field: "http request method error",
      message: "only post method allowed!",
    };
  }

  const {
    birthDate,
    givenName,
    middleName,
    familyName,
    licenceNumber,
    stateOfIssue,
    expiryDate,
  } = JSON.parse(event.body!) as RequestBody;

  if (!birthDate) {
    return {
      field: "Birthdate",
      message: "Birthdate cannot be empty",
    };
  } else if (!dateValidate(birthDate)) {
    console.log(dateValidate(birthDate));
    return {
      field: "Birthdate",
      message: "Birthdate must be in format YYYY-MM-DD and valid",
    };
  }

  if (!givenName) {
    return {
      field: "GivenName",
      message: "GivenName cannot be empty",
    };
  } else if (givenName.length >= 100) {
    return {
      field: "GivenName",
      message: "GivenName is 100 characters long at most",
    };
  }

  if (middleName && middleName.length >= 100) {
    return {
      field: "middleName",
      message: "middleName is 100 characters long at most",
    };
  }

  if (!familyName) {
    return {
      field: "FamilyName",
      message: "FamilyName cannot be empty",
    };
  } else if (familyName.length >= 100) {
    return {
      field: "FamilyName",
      message: "FamilyName is 100 characters long at most",
    };
  }

  if (!licenceNumber) {
    return {
      field: "LicenceNumber",
      message: "LicenceNumber cannot be empty",
    };
  }

  if (!stateOfIssue) {
    return {
      field: "StateOfIssue",
      message: "StateOfIssue cannot be empty",
    };
  }

  if (expiryDate && !dateValidate(expiryDate)) {
    return {
      field: "ExpiryDate",
      message: "ExpiryDate must be in format YYYY-MM-DD and valid",
    };
  }

  if (!Object.values(State).includes(stateOfIssue)) {
    return {
      field: "StateOfIssue",
      message: "StateOfIssue must be one of NSW,QLD,SA,TAS,VIC,WA,ACT,NT",
    };
  }

  return null;
};
