import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import axios from "axios";
import {
  ApiResponse, ResponseBody,
  ResultCode
} from "../types";
import { validateRequest } from "../utils/validateRequest";

const API_URL =
  "https://australia-southeast1-reporting-290bc.cloudfunctions.net/driverlicence";

export const handler = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {

  const errors = validateRequest(event);

  if(errors) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: errors,
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
      body: JSON.stringify({error: 'internal server error'}),
    };
  }
};
