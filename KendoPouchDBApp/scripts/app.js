
(function () {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app;

    // create an object to store the models for each view
    window.APP = {
        models: {
            home: {
                title: 'Home'
            },
            contacts: {
                title: 'Contacts',
                ds: new kendo.data.DataSource({
                    data: [{ href: "mailto:npm@terikon.com?subject=Question about KendoPouchDBApp", name: 'email npm@terikon.com' }, { href: "https://github.com/terikon/kendo-pouchdb", name: 'kendo-pouchdb homepage' }]
                }),
                openLink: function (e) {
                    window.open(e.data.href, "_system");
                }
            }
        }
    };

    var couchbaseSetup = function () {
        window.cblite.getURL(function (err, url) {
            if (err) {
                alert("CouchbaseLite Initilization error " + JSON.stringify(err));
            }
            alert("url:" + url);
        });
    };

    var init = function () {

    };

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {

        // hide the splash screen as soon as the app is ready. otherwise
        // Cordova will wait 5 very long seconds to do it for you.
        navigator.splashscreen.hide();

        couchbaseSetup();

        app = new kendo.mobile.Application(document.body, {

            // comment out the following line to get a UI which matches the look
            // and feel of the operating system
            skin: 'flat',

            // the application needs to know which view to load first
            initial: 'views/home.html',

            init: init
        });

    }, false);


}());