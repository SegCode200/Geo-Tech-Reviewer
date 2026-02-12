import { AppDispatch } from "../store/store";
import { loginInternalUser, refreshSession, logoutAdmin } from "../api/authApi";
import { setUser, logoutState } from "../store/authSlice";

export const login = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    const data = await loginInternalUser({ email, password });
    dispatch(setUser(data.user));
    console.log(data)
  } catch (err: any) {
    throw err.response?.data?.message || "Login failed";
  }
};

export const refreshUser = () => async (dispatch: AppDispatch) => {
  try {
    const data = await refreshSession();
    dispatch(setUser(data.user));
  } catch {
    dispatch(setUser(null));
  }
};


export const logout = () => async (dispatch: AppDispatch) => {
  await logoutAdmin();
  dispatch(logoutState());
};
