'use strict';

window.zPushModule = (function() {

    const applicationServerPublicKey = 'AAAAqHe4Kg0:APA91bEX9XJ5dXxFrldoz3-VLQyOAQJ_870BgPTCRs5w0aEQGt0BoAHPIGH-3onRv3HXsTHvR4AJW6y2r71mkaD1tTGZTplsXjTu6T09NJ8Ggm_UhrYjDrlcStQLWPS-WNYvu3cGSI6q';

    // const pushButton = document.querySelector('#push-messaging-btn') || document.createElement('button');
    let pushButton = document.querySelector('#push-messaging-btn') || document.createElement('button');

    let isSubscribed = false;
    let swRegistration = null;

    let isBlocked = false;

    let updateUI = function(){};
    let autoSubscribe = true;

    let subscriptionDetails = document.querySelector('.js-subscription-details');

    let currentDomain = 'shakidev.com';

    let updateResult = {};

    function urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    function updateBtn() {
        if(Notification.permission === 'denied') {
            pushButton.textContent = 'Push Messaging Blocked.';
            pushButton.disabled = true;
            isBlocked = true;
            updateSubscriptionOnServer(null);
            return;
        }

        isBlocked = false;

        if(isSubscribed) {
            pushButton.textContent = 'Disable Push Messaging';
        } else {
            pushButton.textContent = 'Enable Push Messaging';
        }

        pushButton.disabled = false;
        updateUI();
    }

    function initializeUI() {
        pushButton.addEventListener('click', function() {
            pushButton.disabled = true;
            if(isSubscribed){
                //TODO: Unsubscribe user
                unsubscribeUser();
            } else {
                subscribeUser();
            }
        });

        // Set the initial subscription value
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

    function unsubscribeUser() {
        swRegistration.pushManager.getSubscription()
            .then(function(subscription) {
                if(subscription) {
                    return subscription.unsubscribe();
                }
            })
            .catch(function(err) {
                console.log('Error unsubscribing', err);
            })
            .then(function() {
                updateSubscriptionOnServer(null);

                console.log('User is unsubscribed.');
                isSubscribed = false;

                updateBtn();
            });
    }

    function subscribeUser() {
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
            .then(function(subscription) {
                console.log('User is subscribed.');

                updateSubscriptionOnServer(subscription);

                isSubscribed = true;

                updateBtn();
            })
            .catch(function(err) {
                console.log('Failed to subscribe the user: ', err);

                updateBtn();
            });
    }

    function updateSubscriptionOnServer(subscription) {
        //TODO: Send subscription to application server

        if(subscriptionDetails) {
            if(subscription) {
                console.log(JSON.stringify(subscription));
                subscriptionDetails.classList.remove('is-invisible');
            } else {
                subscriptionDetails.classList.add('is-invisible');
            }
        } else {
            console.log(JSON.stringify(subscription));
        }

        if(subscription) {
            postAjax('/subscribe_on_push2.php', { action: 'add', endpoint: subscription.endpoint, 'subscription': JSON.stringify(subscription), 'hostname': currentDomain},
                function(s, data) {
                    // console.log('post reqest result', s, data);
                    let saved = false;

                    updateResult = {};
                    if(s === 'success') {
                        try {
                            let json = JSON.parse(data);

                            updateResult = json;

                            if(json['status'] === 'success') {
                                subscriptionDetails.classList.remove('push-details-error');
                                subscriptionDetails.classList.add('push-details-success');
                                subscriptionDetails.textContent = json['msg'];

                                saved = true;
                            } else {
                                subscriptionDetails.classList.remove('push-details-success');
                                subscriptionDetails.classList.add('push-details-error');
                                subscriptionDetails.textContent = json['msg'];
                            }

                        } catch(e){
                            console.log('invalid json', e);
                            updateResult = {status: 'fail', msg: 'invalid json'};
                        }
                    } else {
                        updateResult = {status: 'fail', msg: ''};
                        if(data == 'Not Found') {
                            updateResult['msg'] = data;
                        } else {
                            updateResult['msg'] = data;
                        }
                    }

                    if(!saved) {
                        unsubscribeUser();
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

        let body = new FormData();
        for(var index in jsonData) {
            if (jsonData.hasOwnProperty(index)) {
                body.append(index, jsonData[index]);
            }
        }

        xhr.open("POST", url, true);

        xhr.onreadystatechange = function() {
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

        init: function(opts) {
            if(!opts) return;
            // this.initialized = true;
            let selfy = this;
            currentDomain = window.location.hostname;
            let button_id = null;
            let msg_box_id = null;
            if('button_id' in opts) button_id = opts['button_id'];
            if('msg_box_id' in opts) msg_box_id = opts['msg_box_id'];
            pushButton = document.querySelector(button_id) || document.createElement('button');

            subscriptionDetails = document.querySelector(msg_box_id) || document.createElement('div');

            if('updateUI' in opts) updateUI = opts['updateUI'];

            if('initialSubscribe' in opts) {
                initialSubscribe = opts['initialSubscribe'];
            }

            if('serviceWorker' in navigator && 'PushManager' in window) {
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

        subscribeUser: function() {
            if(this.initialized) {
                if(!isSubscribed) {
                    subscribeUser();
                } else {
                    updateBtn();
                    console.log("already subscribed on notifications");
                }
            }
        },
        unsubscribeUser: function() {
            if(this.initialized) {
                unsubscribeUser();
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("znews_unsubscribed_v1", Date.now());
                }
            }
        },

        getCurrentDomain: function() {
            return currentDomain;
        },

        checkSubscribe: function() {
            if(!this.initialized) return true; else return isSubscribed;
        },

        checkBlocked: function() {
            if(!this.initialized) return true; else return isBlocked;
        },

        getStatus: function() {
            return pushButton.textContent;
        },

        getUpdateResult: function() {
            return updateResult;
        },

        getSubscription: function() {
            if(this.initialized) {
                return swRegistration.pushManager.getSubscription();
            }
        }
    };
})();