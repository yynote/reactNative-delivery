import { createStackNavigator, TransitionPresets } from "react-navigation-stack";
import Splash from "../screens/auth/SplashScreen";
import Login from "../screens/auth/LoginScreen";
import Main from "../screens/MainScreen";
import Intro from "../screens/auth/IntroScreen";
import Event from "../screens/my/EventScreen";
import EventDetail from "../screens/my/EventDetailScreen";
import Inquiry from "../screens/my/InquiryScreen";
import Faq from "../screens/my/FaqScreen";
import Point from "../screens/my/PointScreen";
import Notice from "../screens/NoticeScreen";
import NoticeDetail from "../screens/NoticeDetailScreen";
import Center from "../screens/CenterScreen";
import Signup from "../screens/auth/SignupScreen";
import UserTerm from "../screens/auth/UserTermScreen";
import Find from "../screens/auth/FindScreen";
import ChangeInfo from "../screens/auth/ChangeInfoScreen";
import InquiryDetail from "../screens/InquiryDetailScreen";
import Withdrawal from "../screens/WithdrawalScreen";
import MyPage from "../screens/my/MyPageScreen";
import Setting from "../screens/SettingScreen";
import Review from "../screens/my/ReviewScreen";
import ReviewDetail from "../screens/my/ReviewDetail";
import Home from "../screens/HomeScreen";
import OrderDetail from "../screens/OrderDetailScreen";
import OrderHistory from "../screens/OrderHistoryScreen";
import PayManage from "../screens/PayManageScreen";
import CardRegister from "../screens/CardRegisterScreen";
import Bookmark from "../screens/my/BookmarkScreen";
import SelectApart from "../screens/auth/SelectApartScreen";
import SearchAddress from "../screens/auth/SearchAddressScreen";
import FreeDelivery from "../screens/FreeDeliveryScreen";
import FastDelivery from "../screens/FastDeliveryScreen";
import SearchFood from "../screens/SearchFoodScreen";
import AddressManage from "../screens/AddressManageScreen";
import Order from "../screens/OrderScreen";
import Basket from "../screens/BasketScreen";
import OrderPayment from "../screens/OrderPaymentScreen";
import Detail from "../screens/DetailScreen";
import SetAddress from "../screens/SetAddressScreen";
import SelectAddress from "../screens/SelectAddressScreen";
import Store from "../screens/StoreScreen";
import Notification from "../screens/NotificationScreen";

const AuthStackNavigator = createStackNavigator({
    Splash,
    Login,
    Main,
    Intro,
    Event,
    EventDetail,
    Inquiry,
    Faq,
    Point,
    Notice,
    NoticeDetail,
    Signup,
    Center,
    InquiryDetail,
    Find,
    Withdrawal,
    UserTerm,
    ChangeInfo,
    MyPage,
    Setting,
    Review,
    ReviewDetail,
    Home,
    OrderDetail,
    OrderHistory,
    PayManage,
    Bookmark,
    CardRegister,
    SelectApart,
    SearchAddress,
    FreeDelivery,
    FastDelivery,
    SearchFood,
    AddressManage,
    Order,
    Basket,
    OrderPayment,
    Detail,
    SetAddress,
    SelectAddress,
    Store,
    Notification,
  },
  {
    headerMode: "screen ",
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  });

export default AuthStackNavigator;
