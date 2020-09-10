'use strict';

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');

    if(event.data) {
        console.log(`[Service Worker] Push data: "${event.data.text()}"`);

        let title = 'Новое уведомление 2 shakidev.com';
        let options = {
            body: 'Вышла новость. Читайте свежие новости на нашем сайте.',
            tag: 'shakidev-news-v1',
            // vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
            icon: 'https://shakidev.com/images/map-point.png',
            data: {
                title: title,
                url: 'https://www.shakidev.com'
            }
        }

        // try {
        let json = event.data.json();
        if(json['v'] == 1) {
            title = json['msg']['title'];
            options['body'] = json['msg']['msg'];
            options['icon'] = json['msg']['icon'];
            if(json['msg']['image']) {
                options['image'] = json['msg']['image'];
            }
            options['tag'] = json['msg']['tag'];
            options['data']['url'] = json['msg']['url'];
            options['badge'] = json['msg']['badge'];
        }
        // } catch (e) {
        // }
        console.log("notify options:", options);
        // event.waitUntil(self.registration.showNotification(title, options));
        const notificationPromise = self.registration.showNotification(title, options);
        event.waitUntil(notificationPromise);
    } else {
        if (!(self.Notification && self.Notification.permission === 'granted')) {
            console.log("PushNotification permission problem");
            return;
        }
        let data = {};

        let sendNotification = function(title, message, icon, tag, url) {
            //		self.refreshNotifications();

            //title = title || 'Новостной сайт Закон.кз';
            //message = message || 'Читайте свежие новости на нашем сайте';
            // Stupid Firefox see file as ISO cyrillic
            title = title || 'shakidev.com';
            message = message || 'Новое уведомление';
            icon = icon || 'https://shakidev.com/images/map-point.png';
            tag = tag || 'shakidev.com-maps';
            url = url || 'http://shakidev.com';

            return self.registration.showNotification(title, {
                body: message,
                icon: icon,
                tag: tag,
                data: {
                    title: title,
                    url: url
                }
            });
        };
        fetch('/last.php').then(function (response) {
            if (response.status !== 200) {
                throw new Error();
            }

            // Examine the text in the response
            return response.json().then(function (data) {
                //console.log("Fetch response data:");
                //console.log(data);
                if (data.error || !data.notification) {
                    console.log("must throw error");
                    throw new Error();
                }

                return sendNotification(data.title, data.msg, data.icon, data.tag, data.url);
                /*		event.waitUntil(
                            sendNotification(data.title, data.msg, data.icon, data.tag, data.url)
                        );*/
            });
        }).catch(function (error) {
            console.log("Some error at fetch:");
            console.log(error);
            // return sendNotification();
        });
    }
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    var url = event.notification.url;
    if(event.notification.data) {
        url = url || event.notification.data.url;
    }
    url = url || 'https://www.shakidev.com/';
    console.log('[Service Worker] Notification click url:', url)
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
            .then(function(windowClients) {
                for(var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    if(client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if(clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});