/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/notification.js":
/*!**************************************!*\
  !*** ./resources/js/notification.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */


var zPushModule = function () {
  var applicationServerPublicKey = 'BNb81jQeyJvKpUYWy3MA3tXrkAv7qcZ1V9Jr3hiHvLqQzZ5w_9UutVCI43nqe3kOBnV1I3z-ktUEV74Hf6X2f-o'; // const pushButton = document.querySelector('#push-messaging-btn') || document.createElement('button');

  var pushButton = document.querySelector('#push-messaging-btn') || document.createElement('button');
  var isSubscribed = false;
  var swRegistration = null;
  var isBlocked = false;

  var updateUI = function updateUI() {};

  var autoSubscribe = true;
  var subscriptionDetails = document.querySelector('.js-subscription-details');
  var currentDomain = 'ww.zakon.kz';
  var updateResult = {};

  function urlB64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  function updateBtn() {
    if (Notification.permission === 'denied') {
      pushButton.textContent = 'Push Messaging Blocked.';
      pushButton.disabled = true;
      isBlocked = true;
      updateSubscriptionOnServer(null);
      return;
    }

    isBlocked = false;

    if (isSubscribed) {
      pushButton.textContent = 'Disable Push Messaging';
    } else {
      pushButton.textContent = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
    updateUI();
  }

  function initializeUI() {
    pushButton.addEventListener('click', function () {
      pushButton.disabled = true;

      if (isSubscribed) {
        //TODO: Unsubscribe user
        _unsubscribeUser();
      } else {
        _subscribeUser();
      }
    }); // Set the initial subscription value

    /*swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
      isSubscribed = !(subscription === null);
       // updateSubscriptionOnServer(subscription);
       if(isSubscribed) {
        console.log('User IS subscribed.');
      } else {
        console.log('User is NOT subscribed.');
         if (typeof(Storage) !== "undefined") {
          console.log('test auto ', localStorage.getItem("znews_unsubscribed_v1"));
          if(autoSubscribe && !localStorage.getItem("znews_unsubscribed_v1")) {
            console.log('must autoSubscribe');
            if(!isSubscribed) {
              subscribeUser();
            }
          }
        }
      }
       updateBtn();
    });*/
  }

  function _unsubscribeUser() {
    swRegistration.pushManager.getSubscription().then(function (subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })["catch"](function (err) {
      console.log('Error unsubscribing', err);
    }).then(function () {
      updateSubscriptionOnServer(null);
      console.log('User is unsubscribed.');
      isSubscribed = false;
      updateBtn();
    });
  }

  function _subscribeUser() {
    var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    }).then(function (subscription) {
      console.log('User is subscribed.');
      updateSubscriptionOnServer(subscription);
      isSubscribed = true;
      updateBtn();
    })["catch"](function (err) {
      console.log('Failed to subscribe the user: ', err);
      updateBtn();
    });
  }

  function updateSubscriptionOnServer(subscription) {
    //TODO: Send subscription to application server
    if (subscriptionDetails) {
      if (subscription) {
        console.log(JSON.stringify(subscription));
        subscriptionDetails.classList.remove('is-invisible');
      } else {
        subscriptionDetails.classList.add('is-invisible');
      }
    } else {
      console.log(JSON.stringify(subscription));
    }

    if (subscription) {
      postAjax('/subscribe_on_push2.php', {
        action: 'add',
        endpoint: subscription.endpoint,
        'subscription': JSON.stringify(subscription),
        'hostname': currentDomain
      }, function (s, data) {
        // console.log('post reqest result', s, data);
        var saved = false;
        updateResult = {};

        if (s === 'success') {
          try {
            var json = JSON.parse(data);
            updateResult = json;

            if (json['status'] === 'success') {
              subscriptionDetails.classList.remove('push-details-error');
              subscriptionDetails.classList.add('push-details-success');
              subscriptionDetails.textContent = json['msg'];
              saved = true;
            } else {
              subscriptionDetails.classList.remove('push-details-success');
              subscriptionDetails.classList.add('push-details-error');
              subscriptionDetails.textContent = json['msg'];
            }
          } catch (e) {
            console.log('invalid json', e);
            updateResult = {
              status: 'fail',
              msg: 'invalid json'
            };
          }
        } else {
          updateResult = {
            status: 'fail',
            msg: ''
          };

          if (data == 'Not Found') {
            updateResult['msg'] = data;
          } else {
            updateResult['msg'] = data;
          }
        }

        if (!saved) {
          _unsubscribeUser();
        }

        updateUI();
        updateResult = {};
      });
      /*fetch('/', {
        method: "POST",
        body: formData
      }).then(response => {
        response.json().then(json => {
          let data = json;
          console.log('fetch', json)
        });
      }).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
      });*/
    }
  }

  function postAjax(url, jsonData, callback) {
    var xhr = new XMLHttpRequest();
    var body = new FormData();

    for (var index in jsonData) {
      if (jsonData.hasOwnProperty(index)) {
        body.append(index, jsonData[index]);
      }
    }

    xhr.open("POST", url, true);

    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          callback('success', this.responseText);
        } else {
          callback('error', this.statusText);
        }
      }
    };

    xhr.send(body);
  }

  return {
    initialized: false,
    init: function init(opts) {
      if (!opts) return; // this.initialized = true;

      var selfy = this;
      currentDomain = window.location.hostname;
      var button_id = null;
      var msg_box_id = null;
      if ('button_id' in opts) button_id = opts['button_id'];
      if ('msg_box_id' in opts) msg_box_id = opts['msg_box_id'];
      pushButton = document.querySelector(button_id) || document.createElement('button');
      subscriptionDetails = document.querySelector(msg_box_id) || document.createElement('div');
      if ('updateUI' in opts) updateUI = opts['updateUI'];

      if ('initialSubscribe' in opts) {
        initialSubscribe = opts['initialSubscribe'];
      }

      if ('serviceWorker' in navigator && 'PushManager' in window) {
        /*navigator.serviceWorker.register('/static_zakon/push-notification1/sw.js')
        .then(function(swReg) {
          // console.log('Service Worker is registered', swReg);
           if (typeof(Storage) !== "undefined") {
            if(autoSubscribe) {
              let udate = localStorage.getItem("znews_unsubscribed_v1");
              udate = parseInt(udate) + (1000 * 60 * 60 * 24 * 180);
              if(udate < Date.now()) {
                localStorage.removeItem("znews_unsubscribed_v1");
              }
            }
          }
           swRegistration = swReg;
          initializeUI();
           selfy.initialized = true;
        })
        .catch(function(err) {
          console.error('Service Worker Error', err);
        });*/
      } else {
        console.warn('Push messaging is not supported');
        pushButton.textContent = 'Push Not Supported';
      }
    },
    subscribeUser: function subscribeUser() {
      if (this.initialized) {
        if (!isSubscribed) {
          _subscribeUser();
        } else {
          updateBtn();
          console.log("already subscribed on notifications");
        }
      }
    },
    unsubscribeUser: function unsubscribeUser() {
      if (this.initialized) {
        _unsubscribeUser();

        if (typeof Storage !== "undefined") {
          localStorage.setItem("znews_unsubscribed_v1", Date.now());
        }
      }
    },
    getCurrentDomain: function getCurrentDomain() {
      return currentDomain;
    },
    checkSubscribe: function checkSubscribe() {
      if (!this.initialized) return true;else return isSubscribed;
    },
    checkBlocked: function checkBlocked() {
      if (!this.initialized) return true;else return isBlocked;
    },
    getStatus: function getStatus() {
      return pushButton.textContent;
    },
    getUpdateResult: function getUpdateResult() {
      return updateResult;
    },
    getSubscription: function getSubscription() {
      if (this.initialized) {
        return swRegistration.pushManager.getSubscription();
      }
    }
  };
}();

/***/ }),

/***/ 3:
/*!********************************************!*\
  !*** multi ./resources/js/notification.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /var/www/covid/blog/resources/js/notification.js */"./resources/js/notification.js");


/***/ })

/******/ });