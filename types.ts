export enum State {
  NSW,
  QLD,
  SA,
  TAS,
  VIC,
  WA,
  ACT,
  NT,
}

export enum ResultCode {
  Y = "Y",
  N = "N",
  D = "D",
  S = "S",
}

export interface RequestBody {
  birthDate: string;
  givenName: string;
  middleName?: string;
  familyName: string;
  licenceNumber: string;
  stateOfIssue: State;
  expiryDate?: string;
}

export type FieldError = {
  field?: string;
  message: string;
};

export interface ResponseBody {
  code?: ResultCode;
  error?: FieldError;
  kycResult?: boolean;
}

export interface ApiResponse {
  varifyDocumentResult: { type: string };
  verificationRequestNumber: number;
  verificationResultCode: ResultCode;
}
