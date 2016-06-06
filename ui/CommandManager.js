'use strict';

var oo = require('../util/oo');
var extend = require('lodash/extend');
var each = require('lodash/each');
var Registry = require('../util/Registry');

/*
  Listens to changes on the document and selection and updates registered tools accordingly.

  @class
*/
function CommandManager(context, commands) {
  if (!context.documentSession) {
    throw new Error('DocumentSession required.');
  }
  this.documentSession = context.documentSession;
  this.context = extend({}, context, {
    // for convenienve we provide access to the doc directly
    doc: this.documentSession.getDocument()
  });

  // Set up command registry
  this.commandRegistry = new Registry();
  each(commands, function(CommandClass) {
    var cmd = new CommandClass();
    this.commandRegistry.add(CommandClass.static.name, cmd);
  }.bind(this));

  this.updateCommandStates();
  this.documentSession.on('update', this.updateCommandStates, this);
}

CommandManager.Prototype = function() {

  this.dispose = function() {
    this.documentSession.off(this);
  };

  this.getCommandContext = function() {
    return this.context;
  };

  /*
    Compute new command states object
  */
  this.updateCommandStates = function() {
    var commandStates = {};
    var commandContext = this.getCommandContext();
    var props = this._getCommandProps();
    this.commandRegistry.forEach(function(cmd) {
      commandStates[cmd.getName()] = cmd.getCommandState(props, commandContext);
    });
    this.commandStates = commandStates;
  };

  /*
    Exposes the current commandStates object
  */
  this.getCommandStates = function() {
    return this.commandStates;
  };

  /*
    Execute a command, given a context and arguments
  */
  this.executeCommand = function(commandName, props) {
    var cmd = this.commandRegistry.get(commandName);
    if (!cmd) {
      console.warn('command', commandName, 'not registered');
      return;
    }
    props = extend(this._getCommandProps(), props);
    var info = cmd.execute(props, this.getCommandContext());
    // TODO: why do we required commands to return a result?
    if (info === undefined) {
      console.warn('command ', commandName, 'must return either an info object or true when handled or false when not handled');
    }
    return info;
  };

  // TODO: while we need it here this should go into the flow thingie later
  this._getCommandProps = function() {
    var documentSession = this.context.documentSession;
    var sel = documentSession.getSelection();
    var surface = this.context.surfaceManager.getFocusedSurface();
    return {
      documentSession: documentSession,
      surface: surface,
      selection: sel,
    };
  };

};

oo.initClass(CommandManager);

module.exports = CommandManager;
