import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { ResponseBody, RequestBody, State } from "../types";
import { dateValidate } from "./dateValidate";

export const validateRequest = (
  event: HandlerEvent
): HandlerResponse | void => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: {
          field: "http request method error",
          message: "only post method allowed!",
        },
      } as ResponseBody),
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
      statusCode: 400,
      body: JSON.stringify({
        error: {
          field: "Birthdate",
          message: "Birthdate cannot be empty",
        },
      } as ResponseBody),
    };
  } else if (!dateValidate(birthDate)) {
    console.log(dateValidate(birthDate));
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          field: "Birthdate",
          message: "Birthdate must be in format YYYY-MM-DD and valid",
        },
      } as ResponseBody),
    };
  }

  if (!givenName) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          field: "GivenName",
          message: "GivenName cannot be empty",
        },
      } as ResponseBody),
    };
  } else if (givenName.length >= 100) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          field: "GivenName",
          message: "GivenName is 100 characters long at most",
        },
      } as ResponseBody),
    };
  }

  if (middleName && middleName.length >= 100) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          field: "middleName",
          message: "middleName is 100 characters long at most",
        },
      } as ResponseBody),
    };
  }

  if (!familyName) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          field: "FamilyName",
          message: "FamilyName cannot be empty",
        },
      } as ResponseBody),
    };
  } else if (familyName.length >= 100) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          field: "FamilyName",
          message: "FamilyName is 100 characters long at most",
        },
      } as ResponseBody),
    };
  }

  if (!licenceNumber) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          field: "LicenceNumber",
          message: "LicenceNumber cannot be empty",
        },
      } as ResponseBody),
    };
  }

  if (!stateOfIssue) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          field: "StateOfIssue",
          message: "StateOfIssue cannot be empty",
        },
      } as ResponseBody),
    };
  }

  if (expiryDate && !dateValidate(expiryDate)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          field: "ExpiryDate",
          message: "ExpiryDate must be in format YYYY-MM-DD and valid",
        },
      } as ResponseBody),
    };
  }

  if (!Object.values(State).includes(stateOfIssue)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          field: "StateOfIssue",
          message: "StateOfIssue must be one of NSW,QLD,SA,TAS,VIC,WA,ACT,NT",
        },
      } as ResponseBody),
    };
  }
};
