'use strict';

import Component from '../../ui/Component'
import TextPropertyEditor from '../../ui/TextPropertyEditor'

function TextCellContent() {
  TextCellContent.super.apply(this, arguments);
}

TextCellContent.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-text-cell');

    var path;
    if (this.props.node) {
      path = this.props.node.getTextPath();
    } else {
      path = this.props.path;
    }

    el.append($$(TextPropertyEditor, {
      path: path,
      disabled: this.props.disabled
    }).ref('editor'));

    return el;
  };

};

Component.extend(TextCellContent);

export default TextCellContent;
