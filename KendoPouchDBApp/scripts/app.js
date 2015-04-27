/* global PouchDB, pouchCollate, products */

(function () {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app;

    // create an object to store the models for each view
    window.APP = {
        models: {
            home: new kendo.data.ObservableObject({
                title: 'Home',
                dataSource: null
            }),
            contacts: new kendo.data.ObservableObject({
                title: 'Contacts',
                ds: new kendo.data.DataSource({
                    data: [{ href: "mailto:npm@terikon.com?subject=Question about KendoPouchDBApp", name: 'email npm@terikon.com' }, { href: "https://github.com/terikon/kendo-pouchdb", name: 'kendo-pouchdb homepage' }]
                }),
                openLink: function (e) {
                    window.open(e.data.href, "_system");
                }
            })
        }
    };

    var setupDb = function () {
            couchbaseSetup()
                .then(pouchDBSetup)
                .then(kendoPouchDBSetup)
                .then(kendoGridSetup)
                .then(function (dataSource) {
                    window.APP.models.home.set("dataSource", dataSource);
                });
        },

        couchbaseSetup = function () {
            console.log("Initializing Couchbase Lite database...");

            var deferred = new $.Deferred();

            window.cblite.getURL(function (err, url) {
                if (err) {
                    console.log("CouchbaseLite Initilization error " + JSON.stringify(err));
                    deferred.fail(err);
                }
                //alert("url:" + url);
                deferred.resolve(url + "my-database");
            });
            return deferred.promise();
        },

        autoincrement = products.length + 100,

        pouchDBSetup = function (url) {
            console.log("Initializing PouchDB connection...");

            var deferred = new $.Deferred();

            new PouchDB(url)
                .then(function (db) {
                    db.allDocs({ limit: 0 })
                        .then(function (result) {
                            if (result.total_rows === 0) {
                                return fillData(db);
                            }
                            autoincrement = result.total_rows + 100;
                        })
                        .then(function () {
                            deferred.resolve(db);
                        });
                })
                .catch(function (error) {
                    console.log("PouchDB database creation error:" + JSON.stringify(error.message));
                    throw error;
                });
            return deferred.promise();
        },

        //Will fill database with demo data
        fillData = function (db) {
            console.log("Creating demo data...");
            $.each(products, function (_, product) { product._id = pouchCollate.toIndexableString(product.ProductID); });
            return db.bulkDocs(products);
        },

        kendoPouchDBSetup = function (db) {

            console.log("Initializing kendo-pouchdb adapter...");

            var dataSource = new kendo.data.PouchableDataSource({
                    type: "pouchdb",
                    transport: {
                        pouchdb: {
                            db: db,
                            idField: "ProductID"
                        }
                    },
                    schema: {
                        model: {
                            //Do not specify id here, id:"_id" will be used.
                            fields: {
                                ProductID: { editable: false, nullable: true },
                                ProductName: { validation: { required: true } },
                                UnitPrice: { type: "number", validation: { required: true, min: 1 } },
                                Discontinued: { type: "boolean" },
                                UnitsInStock: { type: "number", validation: { min: 0, required: true } }
                            }
                        }
                    },
                    change: function (e) {
                        console.log("change!");
                        if (e.action == "add") {
                            var item = e.items[0];
                            item.ProductID = autoincrement;
                            autoincrement++;
                        }
                    }
                });

            return dataSource;

        },

        kendoGridSetup = function (dataSource) {
            $("#grid").kendoGrid({
               dataSource: dataSource,
                height: 550,
                toolbar: ["create"],
                columns: [
                    { field: "ProductName", title: "Product Name", width: "120px" },
                    { field: "UnitPrice", title: "Unit Price", format: "{0:c}", width: "120px" },
                    { field: "UnitsInStock", title: "Units In Stock", width: "120px" },
                    { field: "Discontinued", width: "120px" },
                    { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
                ],
                editable: "inline"
            });
            return dataSource;
        };

    var init = function () {

    };

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {

        // hide the splash screen as soon as the app is ready. otherwise
        // Cordova will wait 5 very long seconds to do it for you.
        navigator.splashscreen.hide();

        setupDb();

        app = new kendo.mobile.Application(document.body, {

            // comment out the following line to get a UI which matches the look
            // and feel of the operating system
            skin: 'material',

            // the application needs to know which view to load first
            initial: 'views/home.html',

            init: init
        });

    }, false);


}());