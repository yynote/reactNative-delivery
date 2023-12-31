'use strict';

import { SCREEN_WIDTH } from "../../../constants/AppConstants";

const autoHeightHtml0 = `<p style="font-weight: 400;font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;"><a href="https://github.com/iou90/react-native-autoheight-webview">Tags</a> are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. <span style="background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));">If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn't only tag the piece with "moving". I’d also use the <a href="http://x-squad.com">tags</a> "pets", "marriage", "career change", and "travel tips".</span></p>`;

const autoHeightHtml1 = `Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with "moving".`;

const style0 = `
    p {
        font-family: sans-serif;
        padding: 50px;
        box-sizing: border-box;
    }
`;

const style1 = `
    p {
        font-size: 12px !important;
        box-sizing: border-box;
    }
`;

const inlineBodyStyle = `
    body {
        display: inline-block;
    }
`;

const tableBordered = `
table {
  border-collapse: collapse;
  border-spacing: 0;
}

.table .table {
  background-color: #fff;
}

.table {
  width: 100%;
  margin-bottom: 20px;
}

.table-bordered, .table-bordered>tbody>tr>td, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>td, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>thead>tr>th {
  border: 1px solid #e7ecf1;
  text-align: center;
  padding: 5px;
}
`

// https://medium.com/@elhardoum/opening-external-links-in-browser-in-react-native-webview-18fe6a66312a
const autoDetectLinkScript = `
(function() {
  var links = document.querySelectorAll('a[href]');
  if (links) {
    for (var index = 0; index < links.length; index++) {
      links[index].addEventListener('click', function(event) {
        event.preventDefault();
        window.ReactNativeWebView.postMessage(JSON.stringify({ url: this.href }));
      });
    }
  }
})();
`;

const autoHeightScript = `
var styleElement = document.createElement('style');
styleElement.innerHTML = '${style1.replace(/\'/g, "\\'").replace(/\n/g, '\\n')}';
document.head.appendChild(styleElement);
document.body.style.background = 'cornflowerblue';
`;

const autoWidthHtml0 = `
<html>
<head>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
</head>
<p class="localStyle" style="display: inline;background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;padding-top:0;padding-bottom:0;">hey</p>
</html>
`;

const autoWidthHtml1 = `
<p style="display: inline;background-color: transparent !important;">easy</p>
`;

const autoWidthScript = `
var styleElement = document.createElement('style');
styleElement.innerHTML = '${style1.replace(/\'/g, "\\'").replace(/\n/g, '\\n')}';
document.head.appendChild(styleElement);
`;

const autoWidthImagesScript = `
var contentWidth = ` + (SCREEN_WIDTH-36) + `


var images = document.getElementsByTagName("img");
var maxWidth = 0;
for (var i = 0; i < images.length; i++) {
    if (maxWidth < parseInt(images[i].style.width)) {
        maxWidth = parseInt(images[i].style.width);
    }
}
if (maxWidth > 0) {
    var ratio = contentWidth / maxWidth;   // 40: horizontal padding 
    for (var i = 0; i < images.length; i++) {
        images[i].style.width = (parseInt(images[i].style.width) * ratio) + "px";
        images[i].style.height = (parseInt(images[i].style.height) * ratio) + "px";
    }
}


images = document.getElementsByTagName("video");
maxWidth = 0;
for (var i = 0; i < images.length; i++) {
    if (maxWidth < parseInt(images[i].attributes.getNamedItem("width").value)) {
        maxWidth = parseInt(images[i].attributes.getNamedItem("width").value);
    }
}
if (maxWidth > 0) {
    var ratio = contentWidth / maxWidth;   // 40: horizontal padding 
    for (var i = 0; i < images.length; i++) {
        images[i].attributes.getNamedItem("width").value = (parseInt(images[i].attributes.getNamedItem("width").value) * ratio) + "px";
        images[i].attributes.getNamedItem("height").value = (parseInt(images[i].attributes.getNamedItem("height").value) * ratio) + "px";
    }
}


document.body.style.width = contentWidth + "px";
`;

export {
  autoHeightHtml0,
  autoHeightHtml1,
  style0,
  autoHeightScript,
  autoWidthHtml0,
  autoWidthHtml1,
  autoWidthScript,
  inlineBodyStyle,
  autoDetectLinkScript,

  autoWidthImagesScript,
  tableBordered,
};
