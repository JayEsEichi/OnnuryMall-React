import { defaultInstance, authInstance } from "../utils/axiosApiUtil";

export const loginMember = async (loginData) => {
  try {
    const loginSuccess = await defaultInstance.post("/api/member/login", {
      loginId: loginData.loginId,
      password: loginData.password,
    });

    // 로그인 정보 기억하기 체크 시, localStorage 에 토큰 정보 저장장
    if (loginData.remember) {
      // LocalStorage
      // 탭을 끄거나 창을 닫아도 저장된 데이터들이 남아있으므로
      // 로그인 화면에서 remember me 를 체크할 경우 SessionStorage를 사용할 것것
      const localStorage = window.localStorage;
      localStorage.setItem("Authorization", loginSuccess.headers.authorization);
      localStorage.setItem("RefreshToken", loginSuccess.headers.refreshToken);
      localStorage.setItem(
        "AccessTokenExpireTime",
        loginSuccess.headers.accessTokenExpireTime
      );

      console.log(localStorage.getItem("Authorization"));
      console.log(localStorage.getItem("RefreshToken"));
      console.log(localStorage.getItem("AccessTokenExpireTime"));
    } else {
      // 로그인 정보 기억하기 체크하지 않았을 시, sessionStorage 에 토큰 정보 저장장

      // SessionStorage
      // 탭을 끄거나 창을 닫으면 저장된 데이터들이 사라지므로
      // 로그인 화면에서 remember me 를 체크하지 않을 시에는 이 SessionStorage를 사용하여 토큰 저장
      const sessionStorage = window.sessionStorage;
      sessionStorage.setItem(
        "Authorization",
        loginSuccess.headers.authorization
      );
      sessionStorage.setItem("RefreshToken", loginSuccess.headers.refreshToken);
      sessionStorage.setItem(
        "AccessTokenExpireTime",
        loginSuccess.headers.accessTokenExpireTime
      );

      console.log(sessionStorage.getItem("Authorization"));
      console.log(sessionStorage.getItem("RefreshToken"));
      console.log(sessionStorage.getItem("AccessTokenExpireTime"));
    }

    return loginSuccess.data.data;
  } catch (error) {
    console.dir(error);
  }
};
