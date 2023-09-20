import { getStatusBarHeight } from "react-native-status-bar-height";
import { Dimensions } from "react-native";

export const IS_DEV_MODE = true;
export const IS_UI_MODE = false;
export const SERVER_URL = IS_DEV_MODE ? "http://192.168.0.104:8001" : "http://api.made.me";
export const UPLOAD_URL = "http://192.168.0.103:8083";
export const API_BASE_URL = SERVER_URL;

export const IMAGE_FOO_URL = "http://192.168.0.176/doc/w3school/2016/www.w3schools.com/css/img_fjords.jpg";
export const IMAGE_FOO_URL2 = "http://192.168.0.176/doc/w3school/2016/www.w3schools.com/css/img_chania.jpg";
export const IMAGE_FOO_URL3 = "http://192.168.0.176/doc/w3school/2016/www.w3schools.com/css/img_forest.jpg";

export const SCREEN_HEIGHT = Dimensions.get("screen").height;
export const ITEM_HEIGHT = Dimensions.get("screen").height - 80;
export const SCREEN_WIDTH = Dimensions.get("screen").width;
export const STATUSBAR_HEIGHT = getStatusBarHeight();

export default {
  IS_OFFLINE_MODE: true,

  APP_VERSION: "1.0.0",

  APP_URL: {
    cs_mail_addr: "help@dancut.com",
  },

  CONTACT_US: "010-5503-1167",
  TOPBAR_HEIGHT: 60, // 
  ITEMS_PER_PAGE: 30,

  KAKAO_REST_API_KEY: "c60ce884393311e65958f7e5c8719aa7",
  KAKAO_MAP_LINK: "http://3.37.80.207/kakaoMap.html",
  IMP_UID: "imp66401251",

  SHARE_TYPE: {
    KAKAO: "kakaotalk",
    FACEBOOK: "facebook",
    INSTAGRAM: "instagram",
    LINK: "link",
  },

  SHARE_LINK_PARAMS: {
    DESIGNER_ID: "designer_id",
  },

  NAVIGATION_PARAMS: {
    ARTIST_TYPE: 1,
    ARTIST_IDX: 0,
    BRAND_IDX: 0,
    LOGIN_PARAM: {},
  },

  EVENT_PARAMS: {
    TOKEN_EXPIRED: "token_expired",
    PROFILE_CHANGED: "profile_changed",
    ADDRESS_SELECT: "address_select",
    APT_SELECT: "apt_select",
    REVIEW_ADD: "review_add",
    ADDRESS_ADD: "address_add",
    ORDER_ADD: "order_add",
    ITEM_ADD: "item_add",
    GLOBAL_CHANGE: "global_change",
    CARD_REGISTER: "card_register",
    BOOKMARK_CHANGE: "bookmark_change",
  },

  ASYNC_PARAM: {
    USER_ID: "user_id",
    LOGIN_TYPE: "login_type",
    USER_NAME: "user_name",
    USER_PHONE: "user_phone",
    USER_EMAIL: "user_email",
    USER_PWD: "user_pwd",
    APP_TOKEN: "app_token",
    APP_VERSION: "app_version",
    AUTO_LOGIN: "auto_login",
    REQUEST: "request",
    REQUEST_AUTO: "request_auto",
    KEYWORD: "keyword",
  },

  TERMS: {
    USAGE: "https://daengcut.com/blogPost/policytypeservice",
    PRIVACY: "https://daengcut.com/blogPost/policytypeprivacy",
    LOCATION: "https://daengcut.com/blogPost/policytypelocation",
    PROFILE: "https://daengcut.com/blogPost/policytypeprivacy",
  },

  PUSH_TYPES: {
    PUSH_NOTICE_USER: 301,
    PUSH_INQUIRY_ANSWER: 303,
    PUSH_REVIEW_ANSWER: 305,
    PUSH_ORDER_CHANGE: 307,
  },

};

export const API_RES_CODE = {
  SUCCESS: 0,
  ERR_API: -1,
  TOKEN_EMPTY: -2,
  TOKEN_EXPIRED: -3,
  ERR_PARAM: -4,
  ERR_OTHER_DEVICE_LOGIN: -7,
  RESULT_CERT_ANSWER: -8,
  RESULT_STATUS_CHANGED_LOGIN: -9,
};
