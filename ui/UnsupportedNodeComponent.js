'use strict';

import Component from './Component'

function UnsupportedNodeComponent() {
  Component.apply(this, arguments);
}

UnsupportedNodeComponent.Prototype = function() {

  this.render = function($$) {
    return $$('pre')
      .addClass('content-node unsupported')
      .attr({
        'data-id': this.props.node.id,
        contentEditable: false
      })
      .append(
        JSON.stringify(this.props.node.properties, null, 2)
      );
  };
};

Component.extend(UnsupportedNodeComponent);

export default UnsupportedNodeComponent;
