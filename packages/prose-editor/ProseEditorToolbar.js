'use strict';

import Toolbar from '../../ui/Toolbar'

function ProseEditorToolbar() {
  ProseEditorToolbar.super.apply(this, arguments);
}

ProseEditorToolbar.Prototype = function() {

  this.getClassNames = function() {
    return 'sc-prose-editor-toolbar';
  };

};

Toolbar.extend(ProseEditorToolbar);

export default ProseEditorToolbar;
