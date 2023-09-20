import GlobalState from "../mobx/GlobalState";
import { Platform } from "react-native";
import { SCREEN_WIDTH, SERVER_URL, UPLOAD_URL } from "../constants/AppConstants";
import moment from "moment";
import "moment/min/locales";
//import qs from 'qs';
import Strings from "../constants/Strings";
import dynamicLinks from "@react-native-firebase/dynamic-links";

export default {
  isInvalid(p_value) {
    return (p_value == undefined || p_value == null || p_value.length == 0);
  },

  isValidArray(array) {
    return array !== undefined && array !== null && array.filter(it => it != undefined && it != null).length > 0;
  },

  
  getThumbList(image_list) {
    var res = [];
    if (image_list) {
      image_list.split("#").forEach(element => {
        const image_url = SERVER_URL + "/" + element;
        const ext = image_url.substr(image_url.lastIndexOf("."));
        res.push(image_url.replace(ext, `_thumb${ext}`));
      });
    }
    return res;
  },

  // "image_list": "uploads/1.jpg#uploads/2.jpg#uploads/3.jpg",
  //  => ["http://serverurl//uploads/1.jpg", "http://serverurl//uploads/2.jpg", "http://serverurl//uploads/3.jpg"]
  getImageList(image_list) {
    var res = [];
    if (image_list) {
      if (image_list instanceof Array) {
        image_list.forEach(element => {
          res.push(UPLOAD_URL + "/" + element);
        });
      } else {
        res = [UPLOAD_URL + "/" + image_list];
      }
    }
    return res;
  },

  getVideoThumbUrl(video_url) {
    if (video_url == null || video_url === "") {
      return "";
    }

    const ext = video_url.split(".").pop();
    return UPLOAD_URL + "/" + video_url.replace(ext, "jpg");
  },

  //
  //  19790105 => 40
  //
  getAgeFromBirthday(p_item) {
    p_item = p_item + "";
    if (this.isInvalid(p_item) || p_item == "0")
      return "";
    return (new Date().getFullYear()) - p_item.substring(0, 4) + 1;
  },

  //
  //  
  //
  getBirthYearFromAge(p_item) {
    p_item = p_item + "";
    if (this.isInvalid(p_item) || p_item == "0")
      return "";
    return (new Date().getFullYear()) - p_item;
  },

  //
  
  //
  getPastDays(p_item) {
    p_item = p_item + "";
    if (this.isInvalid(p_item) || p_item == "0")
      return "";
    return Math.abs(parseInt((new Date().getTime() - (new Date(p_item.substring(0, 10))).getTime()) / 1000 / 3600 / 24));
  },

  diffCount(startDate, endDate, unit) {
    if (!moment(startDate).isValid()) {
      return 0;
    }

    return Math.abs(moment(startDate).diff(endDate, unit)) + 1;
  },

  reserveDayDiffCount(startDate, endDate) {
    if (!moment(startDate).isValid()) {
      return 0;
    }

    const start = this.getDateTime(startDate, "YYYY-MM-DD 00:00:00");
    const end = this.getDateTime(endDate, "YYYY-MM-DD 00:00:00");

    return Math.abs(moment(start).diff(end, "day"));
  },

  //

  //
  getRelativeDate(p_time) {
    moment.locale("ko");
    return moment(p_time).fromNow();
  },

  getDateTime(p_time, format = "YYYY.MM.DD HH:mm:ss") {
    moment.locale("ko");
    return moment(p_time).format(format);
  },

  //
  //  1 => Male, 0 => Female
  //
  getGenderString(p_item) {
    if (isNaN(p_item)) {
      return p_item;
    } else {
      return p_item == 1 ? Strings.male_short : Strings.female_short;
    }
  },

  // console.info(formatNumber(2665)) // 2,665
  formatNumber(num) {
    if (num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } else {
      return num;
    }
  },

  formatPhone(num) {
    if (num) {
      return num.toString().replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else {
      return num;
    }
  },

  formatBusiness(num) {
    if (num) {
      return num.toString().replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
    } else {
      return num;
    }
  },

  extractNumber(num) {
    return num.toString().replace(/[^\d\.]/g, "");
  },

  now(format = "YYYY-MM-DD HH:mm:ss") {
    return moment().format(format);
  },

  currentTicks() {
    return moment().valueOf().toString();
  },

  //

  //
  birth2age(p_time) {
    return moment().diff(moment(p_time), "month") + 1;
  },

  // async sendReportEmail(subject, body, options = {}) {
  //     const { cc, bcc } = options;
  //     const to = C.APP_URL.cs_mail_addr;
  //
  //     let url = `mailto:${to}`;
  //
  //     // Create email link query
  //     const query = qs.stringify({
  //         subject: subject,
  //         body: body,
  //         cc: cc,
  //         bcc: bcc
  //     });
  //
  //     if (query.length) {
  //         url += `?${query}`;
  //     }
  //
  //     // check if we can use this link
  //     const canOpen = await Linking.canOpenURL(url);
  //
  //     if (!canOpen) {
  //         throw new Error('Provided URL can not be handled');
  //     }
  //
  //     return Linking.openURL(url);
  // },

  petBreedName(breedId) {
    let breedInfo = GlobalState.pet_breed_list.filter(it => {
      return it._id === breedId;
    });
    if (breedInfo.length === 1) {
      return breedInfo[0].name;
    }
    return "";
  },
  petBreedInfo(breedId) {
    let breedInfo = GlobalState.pet_breed_list.filter(it => {
      return it._id === breedId;
    });
    if (breedInfo.length === 1) {
      return breedInfo[0];
    }
    return null;
  },
  getPhotoUrl(photoUrl) {
    return UPLOAD_URL + "/" + photoUrl;
  },
  getHourFromMinutes(minutes) {
    var hour = minutes / 60;
    if (hour < 10) {
      hour = "0" + hour;
    }
    var min = minutes % 60;
    if (min < 10) {
      min = "0" + min;
    }
    return hour + ":" + min;
  },
  getMinutesFromSeconds(seconds) {
    let sec = seconds % 60;
    let min = (seconds - sec) / 60;
    if (min < 10) {
      min = "0" + min;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    return min + ":" + sec;
  },


  payMethodName(methodCode) {
    let payMethod = Strings.book_purchase_method_list.filter(it => {
      return it.code === methodCode;
    });
    if (payMethod.length === 1) {
      return payMethod[0].name;
    }
    return "";
  },

  async buildLink(params) {
    const link = await dynamicLinks().buildLink({
      link: "https://www.daengcut.kr/&" + params,
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: "https://dangcut.page.link",
      // optional set up which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      // analytics: {
      //     campaign: 'banner',
      // },
      // "androidInfo": {
      //     "androidPackageName": "com.dangcut"
      // },
    });
    const shortLink = await dynamicLinks().buildShortLink({
      link: link,
      domainUriPrefix: "https://dangcut.page.link",
      "androidInfo": {
        "androidPackageName": "com.dangcut",
      },
      "iosInfo": {
        "iosBundleId": "com.dangcut",
      },
    }, dynamicLinks.ShortLinkType.UNGUESSABLE);

    return shortLink;
  },

  check_validation_id(id) {
    var id_regEx = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,12}$/;
    return id_regEx.test(id);
  },

  check_validation_pwd(pwd) {
    var pwd_regEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*.,;`+=-])(?=.*[0-9]).{8,20}$/;
    return pwd_regEx.test(pwd);
  },

  check_validation_email(email) {
    var pregEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
    return pregEx.test(email);
  },

  number_formart(number) {
    if (number == undefined || number == null || number == "") return 0;
    if (number < 1000) {
      return number.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else if (number < 1000000) {
      return (number / 1000).toFixed(1) + "K";
    } else {
      return (number / 1000000).toFixed(1) + "M";
    }
  },

  tag_format(tag) {
    if (tag == undefined || tag == null || tag == "") return "";
    return "#" + tag.split(",").join("# ");
  },

  cal_width(colNum) {
    return (SCREEN_WIDTH - 40) / colNum - 20;
  },

  get_device_type() {
    return Platform.OS;
  },

  get_styled_number(number) {
    if (number < 10) {
      return "0" + number.toString();
    } else {
      number.toString();
    }
  },

  check_new_item(productName) {
    let result = true;
    GlobalState.order.forEach((order, index) => {
      if (productName === order.name) {
        result = false;
      }
    });
    return result;
  }
};
