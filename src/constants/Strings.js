// import ko from './../assets/locales/ko.js'
import en from './../assets/locales/en.js'

import LocalizedStrings from 'react-native-localization';
const Strings = new LocalizedStrings({ ko });

Strings.setLanguage('en');

export default Strings;
