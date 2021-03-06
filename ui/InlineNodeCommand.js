'use strict';

import Command from './Command'
import insertInlineNode from '../model/transform/insertInlineNode'

function InlineNodeCommand() {
  InlineNodeCommand.super.apply(this, arguments);

  this.nodeType = this.params.nodeType;

  if (!this.params.nodeType) {
    throw new Error("Every AnnotationCommand must have an 'nodeType'");
  }
}

InlineNodeCommand.Prototype = function() {

  /**
    Get the type of an annotation.

    @returns {String} The annotation's type.
   */
  this.getNodeType = function() {
    return this.nodeType;
  };

  // legacy
  this.getAnnotationType = function() {
    console.warn('DEPRECATED: ust InlineNodeCommand.getNodeType() instead.');
    return this.getNodeType();
  };

  this.getCommandState = function(props, context) {
    var sel = context.documentSession.getSelection();
    var newState = {
      disabled: true,
      active: false,
      node: undefined
    };

    if (sel && !sel.isNull() && sel.isPropertySelection()) {
      newState.disabled = false;
    }

    var annos = this._getAnnotationsForSelection(props, context);
    if (annos.length === 1 && annos[0].getSelection().equals(sel)) {
      newState.active = true;
      newState.node = annos[0];
    }

    return newState;
  };

  this._getAnnotationsForSelection = function(props) {
    return props.selectionState.getAnnotationsForType(this.getNodeType());
  };

  this.execute = function(props, context) {
    var state = this.getCommandState(props, context);
    if (state.disabled) return;
    var surface = context.surface ||context.surfaceManager.getFocusedSurface();
    if (surface) {
      surface.transaction(function(tx, args) {
        return this.insertInlineNode(tx, args);
      }.bind(this));
    }
    return true;
  };

  this.insertInlineNode = function(tx, args) {
    args.node = this.createNodeData(tx, args);
    return insertInlineNode(tx, args);
  };

  this.createNodeData = function(tx, args) { // eslint-disable-line
    return {
      type: this.constructor.type
    };
  };

};

Command.extend(InlineNodeCommand);

export default InlineNodeCommand;
