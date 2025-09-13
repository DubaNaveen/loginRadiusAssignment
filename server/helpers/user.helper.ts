import UserModel from "../../server/models/user.model";
import { RESPONSES } from "../constants/response";
import { MESSAGES } from "../constants/messages";
import UserSignInModel from "../models/userSignIn.model";
import FailedLoginAttemptModel from "../models/failedLoginAttemps.model";
import { Op } from "sequelize";
import BlockedIpModel from "../models/BlockedIp.model";
import { error } from "console";

class UserHelper {
  public async addUser(user: { email: string; password: string }) {
    try {
      const createUser = await UserModel.create(user);
      if (createUser) {
        return {
          error: false,
        };
      }
      return {
        error: true,
      };
    } catch (err: any) {
      return {
        error: true,
        message: MESSAGES.USER.REGISTER.SUCCESS,
      };
    }
  }

  public async getUserInfoByEmail(email: string) {
    try {
      const data = await UserModel.findOne({
        where: {
          email: email,
        },
        raw: true,
      });
      return {
        error: false,
        data: data,
      };
    } catch (err: any) {
      return {
        error: true,
        message: MESSAGES.USER.FETCH.FAIL,
      };
    }
  }

  public async addWrongPasswordCounter(email: string) {
    try {
      let wrongPasswordCount;
      const getUserSignInDetails: any = await UserSignInModel.findOne({
        where: { email: email },
        raw: true,
      });
      if (!getUserSignInDetails) {
        const addCount = await UserSignInModel.create({
          email: email,
          count: wrongPasswordCount,
        });
        if (addCount) {
          return {
            error: false,
          };
        }
      } else {
        const wrongLoginEntryTime = new Date(getUserSignInDetails.updatedAt);
        const now = new Date();
        const diffMs = now.getTime() - wrongLoginEntryTime.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        if (diffMinutes >= 5) {
          wrongPasswordCount = 1;
        } else {
          wrongPasswordCount = getUserSignInDetails?.count + 1;
        }
        if (getUserSignInDetails.count != 4) {
          const updateCount = await UserSignInModel.update(
            { count: wrongPasswordCount },
            { where: { email: email } }
          );
          if (updateCount) {
            return {
              error: false,
            };
          }
        } else {
          const blockUser = await this.blockOrUnblockUser(email, true);
          if (blockUser) {
            return {
              error: false,
            };
          }
        }
      }
      return {
        error: true,
      };
    } catch (err: any) {
      return {
        error: true,
        message: err.message,
      };
    }
  }

  public async blockOrUnblockUser(email: string, blockStatus: boolean) {
    try {
      const updateBlockStatus = await UserModel.update(
        {
          blocked: blockStatus,
          userBlockedTime: blockStatus ? new Date() : null,
        },
        { where: { email: email } }
      );
      if (updateBlockStatus) {
        return {
          error: false,
        };
      }
      return {
        error: true,
      };
    } catch (err: any) {
      return {
        error: true,
        message: MESSAGES.USER.UPDATE_BLOCK_USER_ERROR,
      };
    }
  }

  public async checkUserBlocked(email: string) {
    try {
      const getUserDetails: any = await this.getUserInfoByEmail(email);
      if (getUserDetails.data.blocked) {
        const userBlockedTime = new Date(getUserDetails.data.userBlockedTime);
        const now = new Date();
        const diffMs = now.getTime() - userBlockedTime.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        console.log(diffMinutes, "---------");
        if (diffMinutes >= 15) {
          const unblockUser = await this.blockOrUnblockUser(email, false);
          return {
            error: false,
          };
        } else {
          return {
            error: true,
            message: `User blocked due to failed login attempts.Try after ${
              15 - diffMinutes
            } minutes`,
          };
        }
      }
      return {
        error: false,
      };
    } catch (err: any) {
      return {
        error: true,
        message: MESSAGES.USER.CHECK_BLOCK_ERROR,
      };
    }
  }

  public async addIp(ip: any) {
    try {
      const createUser = await FailedLoginAttemptModel.create({ ip: ip });
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const getIpCount = await FailedLoginAttemptModel.count({
        where: {
          ip: ip,
          createdAt: {
            [Op.gte]: fiveMinutesAgo,
          },
        },
      });
      if (getIpCount >= 15) {
        const blockIp = await BlockedIpModel.create({ ip: ip });
      }
      if (createUser) {
        return {
          error: false,
        };
      }
      return {
        error: true,
      };
    } catch (err: any) {
      return {
        error: true,
        message: MESSAGES.USER.IP_ADD_ERROR,
      };
    }
  }
}

export default new UserHelper();
