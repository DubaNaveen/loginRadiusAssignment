import { Request, Response } from "express";
import { RESPONSES } from "../../constants/response";
import { MESSAGES } from "../../constants/messages";
import UserHelper from "../../helpers/user.helper";

export class Controller {
  constructor() {}

  userLogin = async (req: Request, res: Response) => {
    try {
      const ip = req.ip;
      const reqBody: { email: string; password: string } = req.body;
      const getUserInfoByEmail: any = await UserHelper.getUserInfoByEmail(
        reqBody.email
      );
      const checkUserBlockedStatus = await UserHelper.checkUserBlocked(
        reqBody.email
      );
      if (checkUserBlockedStatus.error) {
        return res.status(RESPONSES.BADREQUEST).send({
          message: checkUserBlockedStatus.message,
          error: true,
        });
      }

      if (getUserInfoByEmail.data.password !== reqBody.password) {
        const handleWrongPasswordCount =
          await UserHelper.addWrongPasswordCounter(reqBody.email);
        const storeIp = await UserHelper.addIp(ip);
        return res.status(RESPONSES.BADREQUEST).send({
          error: false,
          message: MESSAGES.USER.LOGIN.WRONG_PASSWORD,
        });
      }
      return res.status(RESPONSES.SUCCESS).send({
        error: true,
        message: MESSAGES.USER.LOGIN.SUCCESS,
      });
    } catch (error: any) {
      return res.status(RESPONSES.BADREQUEST).send({
        message: MESSAGES.USER.LOGIN.FAILED,
        error: true,
      });
    }
  };

  userSignup = async (req: Request, res: Response) => {
    try {
      const reqBody: { email: string; password: string } = req.body;
      const user = {
        email: reqBody.email,
        password: reqBody.password,
      };
      const addUser = await UserHelper.addUser(user);
      if (addUser) {
        return res.status(RESPONSES.SUCCESS).send({
          message: MESSAGES.USER.REGISTER.SUCCESS,
          error: false,
        });
      }
      return res.status(RESPONSES.BADREQUEST).send({
        error: true,
        message: MESSAGES.USER.REGISTER.REGISTRATION_FAILED,
      });
    } catch (error: any) {
      return res.status(RESPONSES.BADREQUEST).send({
        message:MESSAGES.USER.REGISTER.ALREADY_REGISTERED,
        error: true,
      });
    }
  };
}

export default new Controller();
