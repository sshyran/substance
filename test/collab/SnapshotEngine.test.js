'use strict';
/* eslint-disable consistent-return */

var test = require('../test').module('collab/SnapshotEngine');

var DocumentStore = require('../../collab/DocumentStore');
var SnapshotStore = require('../../collab/SnapshotStore');
var ChangeStore = require('../../collab/ChangeStore');
var SnapshotEngine = require('../../collab/SnapshotEngine');

var Configurator = require('../../util/Configurator');
var TestArticle = require('../model/TestArticle');
var TestMetaNode = require('../model/TestMetaNode');
 
var testSnapshotEngine = require('./testSnapshotEngine');
var testSnapshotEngineWithStore = require('./testSnapshotEngineWithStore');
var documentStoreSeed = require('../fixtures/documentStoreSeed');
var changeStoreSeed = require('../fixtures/changeStoreSeed');
var snapshotStoreSeed = require('../fixtures/snapshotStoreSeed');

// Setup store instances

var configurator = new Configurator();
configurator.defineSchema({
  name: 'prose-article',
  ArticleClass: TestArticle,
  defaultTextType: 'paragraph'
});
configurator.addNode(TestMetaNode);

var documentStore = new DocumentStore();
var changeStore = new ChangeStore();
var snapshotEngine = new SnapshotEngine({
  configurator: configurator,
  documentStore: documentStore,
  changeStore: changeStore,
});
var snapshotStore = new SnapshotStore();
var snapshotEngineWithStore = new SnapshotEngine({
  configurator: configurator,
  documentStore: documentStore,
  changeStore: changeStore,
  snapshotStore: snapshotStore
});

function setup(cb, t) {
  // Make sure we create a new seed instance, as data ops
  // are performed directly on the seed object
  var newDocumentStoreSeed = JSON.parse(JSON.stringify(documentStoreSeed));
  var newChangeStoreSeed = JSON.parse(JSON.stringify(changeStoreSeed));
  var newSnapshotStoreSeed = JSON.parse(JSON.stringify(snapshotStoreSeed));

  documentStore.seed(newDocumentStoreSeed, function(err) {
    if (err) return console.error(err);
    changeStore.seed(newChangeStoreSeed, function(err) {
      if (err) return console.error(err);
      snapshotStore.seed(newSnapshotStoreSeed, function(err) {
        if (err) return console.error(err);
        cb(t);
      });
    });
  });
}

function setupTest(description, fn) {
  test(description, function (t) {
    setup(fn, t);
  });
}

// Run the generic testsuite with an engine that does not have a store attached
testSnapshotEngine(snapshotEngine, setupTest);
// Run the same testsuite but this time with a store
testSnapshotEngine(snapshotEngineWithStore, setupTest);

// Run tests that are only relevant when a snapshot store is provided to the engine
testSnapshotEngineWithStore(snapshotEngineWithStore, setupTest);
