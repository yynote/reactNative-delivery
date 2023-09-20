import { API_BASE_URL, IS_DEV_MODE } from "../constants/AppConstants";
import GlobalState from "../mobx/GlobalState";
import { Alert, Platform } from "react-native";
import Strings from "../constants/Strings";

async function request(options, content_type = "application/x-www-form-urlencoded;charset=UTF-8") {
  let headers = {
    "Content-Type": content_type,
    Accept: "application/hal+json",
    "X-Access-Token": GlobalState.access_token,
  };

  let defaults = { headers: headers };
  const options1 = Object.assign({}, defaults, options);
  if (
    
    true
    /*options1.url !== Net.setting.sta
  && options1.url !== Net.member.setting.getScoreData
  && options1.url !== Net.comment.getList*/
  ) {
    GlobalState.isLoading = true;
  }

  let firstResponse = await fetch(options1.url, options1).catch(error => {
    GlobalState.isLoading = false;
    if (__DEV__) {
      console.log("@@@ HTTP FAILED START >>>>>>>>>>>>>>>>>>>>");
      console.log(options1.url + String(options1.body));
      console.log(error);
      console.log("@@@ HTTP FAILED END >>>>>>>>>>>>>>>>>>>>");
    }
    Alert.alert(
      Strings.app_name,
      "[" + options1.method + "] url: " + options1.url + "\n" + Strings.msg_server_error,
    );
    throw Error(error);
  });
  GlobalState.isLoading = false;

  let result = await firstResponse.json().catch(error => {
    if (IS_DEV_MODE) {
      Alert.alert(
        Strings.app_name,
        "[" + options1.method + "] url: " + options1.url + "\n" + error,
      );
    } else {
      Alert.alert(
        Strings.app_name,
        "[" + options1.method + "] url: " + options1.url + "\n" + Strings.msg_server_error,
      );
    }

    throw Error(error);
  });

  if (__DEV__) {
    let resultTxt = await firstResponse.clone().text();
    console.log(options1.method, options1.url, options1.body ? String(options1.body) : "");
    console.log("@@@@@@@@Response: " + resultTxt);
  }

  if (firstResponse.ok) {
    return result;
  } else {
    if (IS_DEV_MODE) {
      Alert.alert(
        Strings.app_name,
        "[" + options1.method + "] url: " + options1.url + "\n" + "result: " + firstResponse.status,
      );
    } else {
      Alert.alert(
        Strings.app_name,
        Strings.formatString(Strings.msg_connection_failed, firstResponse.status),
      );
    }
    throw Error(`${firstResponse.status} Error`);
  }
}

export function requestGet(url, param = null) {
  let queryString = new URLSearchParams();
  if (param !== undefined && param != null)
    for (let key in param) {
      queryString.append(key, param[key]);
    }

  let options = {
    url: url + "?" + queryString.toString(),
    method: "GET",
  };
  return request(options);
}

export function requestPost(url, param = null) {
  let options = {
    url: url,
    method: "POST",
  };

  if (param !== undefined && param != null) {
    options.body = Object.keys(param).map(key => encodeURIComponent(key) + "=" +
      encodeURIComponent(param[key])).join("&");
  }

  return request(options);
}

export function requestDelete(url, param = null) {
  let queryString = new URLSearchParams();
  if (param !== undefined && param != null)
    for (let key in param) {
      queryString.append(key, param[key]);
    }

  let options = {
    url: url + "?" + queryString.toString(),
    method: "DELETE",
  };

  return request(options);
}

export function requestPut(url, param = null) {
  let options = {
    url: url,
    method: "PUT",
  };

  if (param !== undefined && param != null) {
    options.body = Object.keys(param).map(key => encodeURIComponent(key) + "=" +
      encodeURIComponent(param[key])).join("&");
  }

  return request(options);
}

export function requestPutFormData(url, param = null) {
  let options = {
    url: url,
    method: "PUT",
  };

  if (param !== undefined && param != null)
    options.body = param;

  return request(options, "multipart/form-data");
}

export function requestPostFormData(url, param = null) {
  let options = {
    url: url,
    method: "POST",
  };

  if (param !== undefined && param != null)
    options.body = param;

  return request(options, "multipart/form-data");
}

export async function requestUpload(file_uri, category = "user") {
  let formData = new FormData();

  if (Array.isArray(file_uri)) {
    file_uri.forEach(uri => {
      let fileType = uri.substring(uri.lastIndexOf(".") + 1);
      let file = {
        fileName: uri.replace(/^.*[\\\/]/, ""),
        type: `image/jpeg`,
        uri: uri, // file:///storage/emulated/0/Pictures/Hire/hire_34852646.jpg
      };

      formData.append("upload_file", {
        name: file.fileName,
        type: file.type,
        uri: Platform.OS === "android" ? "file://" + file.uri : file.uri.replace("file://", ""),
      });
    });
  } else {
    let fileType = file_uri.substring(file_uri.lastIndexOf(".") + 1);
    let file = {
      fileName: file_uri.replace(/^.*[\\\/]/, ""),
      type: `image/jpeg`,
      uri: file_uri, // file:///storage/emulated/0/Pictures/Hire/hire_34852646.jpg
    };

    formData.append("upload_file", {
      name: file.fileName,
      type: file.type,
      uri: Platform.OS === "android" ? "file://" + file.uri : file.uri.replace("file://", ""),
    });
  }

  let options = {
    url: Net.home.upload_file,
    method: "POST",
    body: formData,
  };

  let headers = {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  };

  let defaults = { headers: headers };
  const options1 = Object.assign({}, defaults, options);
  GlobalState.isLoading = true;
  let firstResponse = await fetch(options1.url, options1).catch(error => {
    GlobalState.isLoading = false;
    if (__DEV__) {
      console.log("@@@ HTTP FAILED START >>>>>>>>>>>>>>>>>>>>");
      console.log(options1.url + String(options1.body));
      console.log(error);
      console.log("@@@ HTTP FAILED END >>>>>>>>>>>>>>>>>>>>");
    }
    Alert.alert(Strings.app_name, Strings.msg_server_error);
    throw Error(error);
  });
  GlobalState.isLoading = false;
  let result = await firstResponse.json().catch(error => {
    if (IS_DEV_MODE) {
      Alert.alert(Strings.app_name, "url: " + options1.url + "\n" + error);
    } else {
      Alert.alert(Strings.app_name, Strings.msg_server_error);
    }

    throw Error(error);
  });
  if (__DEV__) {
    console.log(">>>");
    console.log(options1.method + " " + options1.url + (options1.body ? String(options1.body) : ""));
    if (firstResponse.ok) {
      console.log(result);
    } else {
      console.log("status " + firstResponse.status);
    }
  }

  if (firstResponse.ok) {
    return result;
  } else {
    if (IS_DEV_MODE) {
      Alert.alert(Strings.app_name, "url: " + options1.url + "\n" + "result: " + firstResponse.status);
    } else {
      Alert.alert(Strings.app_name, Strings.formatString(Strings.msg_request_error_detail, result.code, result.detail));
    }
    throw Error(result.result_msg);
  }
}

export const Net = {
  upload: API_BASE_URL + "/upload",
  auth: {
    basic: API_BASE_URL + "/auth/basic",
    verify: API_BASE_URL + "/auth/basic/verify",
    get_code: API_BASE_URL + "/api/User/request_auth_key",
    check_cert_key: API_BASE_URL + "/api/User/check_cert_key",
    signup: API_BASE_URL + "/api/User/signup",
    double_check: API_BASE_URL + "/api/User/id_check",
    login: API_BASE_URL + "/api/User/login",
    change_info: API_BASE_URL + "/api/User/change_info",
    home_event: API_BASE_URL + "/api/App/homeEvent",


  },
  alarm: {
    list: API_BASE_URL + "/alarm/list",
  },
  search: {
    bookmark_list: API_BASE_URL + "/api/Shop/like_list",
  },
  home: {
    list: API_BASE_URL + "/home/list",
    event_list: API_BASE_URL + "/api/App/event_list",
    notice_list: API_BASE_URL + "/api/App/notice_list",
    inquiry_list: API_BASE_URL + "/api/App/inquiry_list",
    area_list: API_BASE_URL + "/api/App/area_list",
    apart_list: API_BASE_URL + "/api/App/apart_list",
    app_info: API_BASE_URL + "/api/App/app_info",
    faq_list: API_BASE_URL + "/api/App/faq_list",
    inquiry_add: API_BASE_URL + "/api/App/inquiry_add",
    upload_file: API_BASE_URL + "/api/Upload/upload_file",
    category_list: API_BASE_URL + "/api/Product/category_list",
    my_review_list: API_BASE_URL + "/api/Shop/my_review_list",
    card_register: API_BASE_URL + "/api/User/card_register",
    card_list: API_BASE_URL + "/api/User/card_list",
    set_card: API_BASE_URL + "/api/User/set_card",
    del_card: API_BASE_URL + "/api/User/del_card",
    set_alarm: API_BASE_URL + "/api/User/set_alarm",
    set_apart: API_BASE_URL + "/api/User/set_apart",
    find_id: API_BASE_URL + "/api/User/find_id",
    find_password: API_BASE_URL + "/api/User/find_password ",
    review_add: API_BASE_URL + "/api/Shop/review_add",
    review_del: API_BASE_URL + "/api/Shop/review_del",
    address_add: API_BASE_URL + "/api/User/address_add",
    address_list: API_BASE_URL + "/api/User/address_list",
    address_set: API_BASE_URL + "/api/User/address_set",
    address_del: API_BASE_URL + "/api/User/address_del",
    product_list: API_BASE_URL + "/api/Product/product_list",
    shop_detail: API_BASE_URL + "/api/Shop/detail",
    like: API_BASE_URL + "/api/Shop/like",
    order: API_BASE_URL + "/api/Order/add",
    order_history: API_BASE_URL + "/api/Order/user_order_list",
    user_apart_order: API_BASE_URL + "/api/Order/user_apart_order",
    point_history: API_BASE_URL + "/api/User/point_history",
    review_detail: API_BASE_URL + "/api/Shop/review_detail",
    withdraw: API_BASE_URL + "/api/User/withdraw"


  },
  member: {
    sns_login: API_BASE_URL + "/member/sns_login",
    interests: API_BASE_URL + "/member/interests",
    find_id: API_BASE_URL + "/member/find_id",
    reset_password: API_BASE_URL + "/member/reset_password",
    check_user: API_BASE_URL + "/member/check_user",
    change_profile: API_BASE_URL + "/member/change_profile",
    change_password: API_BASE_URL + "/member/change_password",
    signout: API_BASE_URL + "/member/signout",
    profile: API_BASE_URL + "/member/profile",
    alarm_setting: API_BASE_URL + "/member/alarm_setting",
    set_alarm: API_BASE_URL + "/member/set_alarm",
    upload_image: API_BASE_URL + "/member/upload_image",
  },
  my: {
    profile_info: API_BASE_URL + "/my/profile_info",
    get_terms: API_BASE_URL + "/my/get_terms",
  },
};
