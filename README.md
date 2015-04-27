# kendo-pouchdb-app

KendoPouchDBApp - POC application that shows 
[kendo-pouchdb](<https://github.com/terikon/kendo-pouchdb>) connected to [Couchbase Mobile](<http://www.couchbase.com/nosql-databases/couchbase-mobile>).

To achieve this, [PouchDB](<http://pouchdb.com/>) is used.

## Status

Currently, because of some bug in db.put method, create/update/delete operations are not functional. Read works and displays
data in Kendo Grid.

## The code

Actually, all the interesting code is in [app.js](<https://github.com/terikon/kendo-pouchdb-app/blob/master/KendoPouchDBApp/scripts/app.js>) file. 

## Install

[APK file for Android](<https://github.com/terikon/kendo-pouchdb-app/raw/master/KendoPouchDBApp/KendoPouchDBApp.apk>) (unsigned).


## Manual build

Install [bower](<http://bower.io/#install-bower>) and 
[AppBuilder CLI](<http://docs.telerik.com/platform/appbuilder/running-appbuilder/running-the-cli/downloading-and-installing-cli>), if not already installed.

Run in KendoPouchDBApp folder:

```
bower install
appbuilder build android --download --release
```

