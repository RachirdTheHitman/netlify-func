import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import axios from "axios";
import { ApiResponse, RequestBody, ResponseBody, ResultCode, State } from "../types";
import { dateValidate } from "../utils/dateValidate";

const API_URL =
  "https://australia-southeast1-reporting-290bc.cloudfunctions.net/driverlicence";

export const handler = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
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

  try {
    const { data } = await axios.post<ApiResponse>(
      API_URL,
      JSON.parse(event.body!),
      {
        headers: {
          Authorization: process.env.API_KEY,
        },
      }
    );

    if (data.verificationResultCode === ResultCode.Y) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          kycResult: true,
        } as ResponseBody),
      };
    } else if (data.verificationResultCode === ResultCode.N) {
      return {
        statusCode: 200,
        body: JSON.stringify({ kycResult: false } as ResponseBody),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify(
          data.verificationResultCode === ResultCode.D
            ? ({
                code: ResultCode.D,
                error: { message: "Document Error" },
              } as ResponseBody)
            : ({
                code: ResultCode.S,
                error: { message: "Server Error" },
              } as ResponseBody)
        ),
      };
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.response.data),
    };
  }
};
