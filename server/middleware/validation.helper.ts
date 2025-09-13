import { NextFunction, Request, Response } from "express";
import { RESPONSES } from "../constants/response";
import Joi from "joi";
import { MESSAGES } from "../constants/messages";
import UserModel from "../../server/models/user.model";
import BlockedIpModel from "../models/BlockedIp.model";
const dnsPromises = require("dns2");

export const options = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

const dns = new dnsPromises(options);

const joiOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
};

export class ValidationHandler {
  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let reqBody = req.body;
      if (reqBody.email) {
        const emailInfo = await this.emailValidation(reqBody.email);
        if (emailInfo.error) {
          return res.status(RESPONSES.BADREQUEST).send({
            message: emailInfo.message,
            error: true,
          });
        }
      }
      let transSchema = Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().required(),
      });
      const { error } = transSchema.validate(reqBody, joiOptions);
      if (error)
        throw {
          message: error.details[0].message,
        };
      const userRegOtpDetails = await UserModel.findOne({
        where: [{ email: req.body.email }],
      });

      if (userRegOtpDetails) {
        return res.status(RESPONSES.BADREQUEST).send({
          error: true,
          message: MESSAGES.USER.REGISTER.ALREADY_REGISTERED,
        });
      }
      return next();
    } catch (error: any) {
      res.status(error.status ? error.status : RESPONSES.BADREQUEST).send({
        message: error.message,
        error: true,
      });
    }
  };

  signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const checkIpBlocked = await BlockedIpModel.count({
        where: { ip: req.ip },
      });
      if (checkIpBlocked === 1) {
        return res.status(RESPONSES.BADREQUEST).send({
          message:MESSAGES.USER.IP_BLOCKED,
          error: true,
        });
      }
      const reqBody = req.body;
      if (reqBody.email) {
        const emailInfo = await this.emailValidation(reqBody.email);
        if (emailInfo.error) {
          return res.status(RESPONSES.BADREQUEST).send({
            message: emailInfo.message,
            error: true,
          });
        }
      }
      let transSchema = Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().required(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions);
      if (error)
        throw {
          message: error.details[0].message,
        };

      return next();
    } catch (error: any) {
      res.status(error.status ? error.status : RESPONSES.BADREQUEST).send({
        message: error.message,
        error: true,
      });
    }
  };

  emailValidation = async (email: string): Promise<any> => {
    try {
      let domainValidate = email.substring(email.lastIndexOf("@") + 1);
      const responseHostmane: any = await this.hostnameExists(domainValidate);
      if (!responseHostmane.exists) {
        throw {
          message: MESSAGES.USER.REGISTER.MAIL_VALIDATION_FAIL,
        };
      }
      return {
        error: false,
        message: MESSAGES.USER.REGISTER.MAIL_VALIDATION_SUCCESS,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      return {
        error: true,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
        message: error.message,
      };
    }
  };

  private hostnameExists = async (hostname: string): Promise<any> => {
    try {
      const result = await dns.resolveA(hostname);
      return { exists: result.answers.length };
    } catch (_) {
      return { exists: false };
    }
  };
}

export default new ValidationHandler();
