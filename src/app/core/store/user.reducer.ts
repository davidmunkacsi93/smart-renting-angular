import { User } from "../model/user";
import { AppActions, ActionType, AddUserAction } from "../actions";

export function userReducer(state: User, action: AppActions) {
  switch (action.type) {
    case ActionType.ADD_USER:
      const addUserAction: AddUserAction = action as AddUserAction;
      return {
        ...state,
        Username: addUserAction.payload.Username,
        Address: addUserAction.payload.Address,
        BalanceInEur: addUserAction.payload.BalanceInEur,
        BalanceInEth: addUserAction.payload.BalanceInEth
      };

    case ActionType.CLEAR_UESR:
      return {};
    default:
      return state;
  }
}
