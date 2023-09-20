import { observable } from "mobx";
import { Strings } from "../constants";

const GlobalState = observable({

  myLatitude: 37.715133,
  myLongitude: 127.169311,
  myAddress: "OOO OOO 369",
  dev_token: "",
  access_token: "",
  app_last_version: "",
  app_current_version: "",
  term: "",
  isLoading: false,
  tabIndex: "home", // home / history / profile
  tabSubIndex: 0,
  page_cnt: 0,
  main_banner: [],
  category_banner: [],
  categoryList: [],
  keywordList: [],
  storeLink: "",
  delivery_status:[
    Strings.order_accepted,
    Strings.delivery_prepare,
    Strings.delivery_complete,
    Strings.cancel_request,
    Strings.cancel_complete,
  ],
  shop_detail: {
    fee: "",
    minOrder: "",
    reviewCnt: "",
    reviewBossCnt: "",
    detailOrderInfo: "",
    image: "",
    starNum: "",
    shopName: "",
    storePhone: "",
    likeCnt: "",
    intro: "",
    deliveryArea: "",
    operatingTime: "",
    holiday: "",
    shopPosition: "",
    representative: "",
    businessName: "",
    businessAddress: "",
    companyNumber: "",
    reviewList: "",
    is_like: "",
    shop_uid:""
  },
  me: {
    uid: 0,
    google_connected: 0,
    facebook_connected: 0,
    point: 0,
    apart_id: "",
    pwd: "",
    login_type: "",
    phone: "",
    apart: undefined,
    email: "",
    name: "",
    intro: "",
    profile: "",
    alarm_push: "",
    alarm_sms: "",
    search_address: "",
    search_latitude: 0,
    search_longitude: 0,
    auto_login: "",
    sns_id: "",
    delivery_address: undefined,
    request: '',
    request_auto: false
  },
  order: [],
  total_price: 0,
  product_cnt:0,

  me_initial: {
    id: "",
    pwd: "",
    phone: "",
    email: "",

    pet_selected_no: 0,
    pet_list: [],

    search_address: "",
    search_latitude: 0,
    search_longitude: 0,
  },

}, {});


export default GlobalState;
