import LambdaTester from "lambda-tester";
const myHandler = require("./kyc-func").handler;

// jest.spyOn(global.Math, "random").mockReturnValue(0.5);

describe("kyc function handler", function () {
  it("should return error message indicating corresponding field cannot be empty", async function () {
    await LambdaTester(myHandler)
      .event({
        birthDate: "",
        givenName: "James1",
        middleName: "Robert",
        familyName: "Smith",
        licenceNumber: "94977000",
        stateOfIssue: "NSW",
        expiryDate: "2020-01-01",
      })
      .expectResolve((result: any) => {
        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(
          JSON.stringify({
            error: {
              field: "Birthdate",
              message: "Birthdate cannot be empty",
            },
          })
        );
      });
  });
});
