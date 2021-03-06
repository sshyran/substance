'use strict';

import AbstractConfigurator from './AbstractConfigurator'
import FontAwesomeIconProvider from '../ui/FontAwesomeIconProvider'

// Setup default label provider
import LabelProvider from '../ui/DefaultLabelProvider'

/*
  Default Configurator for most Substance apps

  If you need app-specific API's just extend
  and configure your custom configurator.
*/
function Configurator() {
  AbstractConfigurator.call(this);
}

Configurator.Prototype = function() {

  this.getIconProvider = function() {
    return new FontAwesomeIconProvider(this.config.icons);
  };

  this.getLabelProvider = function() {
    return new LabelProvider(this.config.labels);
  };

};

AbstractConfigurator.extend(Configurator);

export default Configurator;
