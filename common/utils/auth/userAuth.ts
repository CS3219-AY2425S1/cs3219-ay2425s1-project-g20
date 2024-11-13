// import {
//   extractedUserSchema,
//   ExtractedUser,
//   LoginFormValue,
// } from "@common/shared-types";
// import axios, { AxiosResponse } from "axios";
// import { USER_SERVICE_URL } from "../constants";
// import { StatusCodes } from "http-status-codes";

// export async function verifyUser(token: string): Promise<ExtractedUser | null> {
//   try {
//     let verificationResponse: AxiosResponse = await axios.get(
//       "/auth/verify-token",
//       {
//         baseURL: USER_SERVICE_URL,
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       }
//     );
//     if (verificationResponse.status !== StatusCodes.OK) {
//       return null;
//     }

//     let jsonBody: any = verificationResponse.data; // Expect object containing message, data
//     let rawUser: unknown = jsonBody.data;
//     let extractedUser = extractedUserSchema.safeParse(rawUser);

//     if (!extractedUser.success) {
//       return null;
//     }
//     return extractedUser.data;
//   } catch (error) {
//     console.error(`Error verifying user token: ${error}`);
//     if (error instanceof Error) {
//       console.error(error.stack);
//     }
//     return null;
//   }
// }

// export async function login(loginValue: LoginFormValue) {
//   try {
//     const response = await axios.post("/auth/login", loginValue, {
//       baseURL: USER_SERVICE_URL,
//     });

//     if (!response) {
//       throw new Error(
//         "Error authenticating collaboration service for auth token"
//       );
//     }

//     return response.data.data;
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error(error.stack);
//     }
//     return null;
//   }
// }
