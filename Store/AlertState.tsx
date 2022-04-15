interface IAlertState {
  USER_ALREADY_EXISTS: string;
  ID_SHORT: string;
  PASSWORD_SHORT: string;
  SERVER_NOT_RESPONSE: string;
  WELCOME_SIGNUP: string;
  USER_NOT_EXISTS: string;
  REQUEST_NOT_AUTHORIZE: string;
  PROJECT_SHORT: string;
  PROJECT_DESCRIPTION_SHORT: string;
  PROJECT_CREATED: string;
  PROJECT_ALREADY_EXISTS: string;
  DESCRIPTION_SHORT: string;
  IMG_EMPTY: string;
}

export const AlertState: IAlertState = {
  USER_ALREADY_EXISTS: "해당 계정은 이미 사용되고있습니다.",
  ID_SHORT: "계정을 5글자 이상 작성해주세요.",
  PASSWORD_SHORT: "비밀번호를 5글자 이상 작성해주세요.",
  SERVER_NOT_RESPONSE: "서버가 응답하지 않습니다.",
  WELCOME_SIGNUP: "회원이 되신것을 환영합니다!",
  USER_NOT_EXISTS: "존재하지 않는 계정이거나 비밀번호가 다릅니다.",
  REQUEST_NOT_AUTHORIZE: "접근 권한이 만료되었습니다",
  PROJECT_SHORT: "프로젝트 이름을 5글자 이상 작성해주세요.",
  PROJECT_DESCRIPTION_SHORT: "프로젝트 설명을 5글자 이상 작성해주세요.",
  PROJECT_CREATED: "프로젝트가 성공적으로 생성되었습니다!",
  PROJECT_ALREADY_EXISTS: "해당 프로젝트명은 이미 사용되고있습니다.",
  DESCRIPTION_SHORT: "게시글 내용을 한 글자 이상 작성해주세요.",
  IMG_EMPTY: "이미지를 업로드하셔야 합니다",
};
