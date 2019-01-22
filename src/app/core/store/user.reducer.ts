import { User } from "../model/user";
import { AppActions, ActionType, AddUserAction, RefreshBalanceAction } from "../actions";

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
    case ActionType.REFRESH_BALANCE:
      const refreshBalanceAction: RefreshBalanceAction = action as RefreshBalanceAction;
      return {
        ...state,
        BalanceInEur: refreshBalanceAction.payload.balanceInEur,
        BalanceInEth: refreshBalanceAction.payload.balanceInEth
      };
    case ActionType.CLEAR_USER:
      return {};
    default:
      return state;
  }
}
