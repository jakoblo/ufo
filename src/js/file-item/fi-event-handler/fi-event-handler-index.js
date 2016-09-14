import * as dragndrop from './fi-event-handler-dragndrop'
import * as click from './fi-event-handler-click'
import * as rename from './fi-event-handler-rename'

export default {getRename, getClick, getDragnDrop}

/**
 * @param  {Object} this - React File-Item Component
 * @param  {Function} dispatch
 * @param  {Object} Immuteable File
 * @returns {Object} eventHandler
 */
function getRename(that) {
  return autoBind(rename, that)
}

/**
 * @param  {Object} this - React File-Item Component
 * @param  {Function} dispatch
 * @param  {Object} Immuteable File
 * @returns {Object} eventHandler
 */
function getClick(that) {
  return autoBind(click, that)
}

/**
 * @param  {Object} this - React File-Item Component
 * @param  {Function} dispatch
 * @param  {Object} Immuteable File
 * @returns {Object} eventHandler
 */
function getDragnDrop(that) {
  return autoBind(dragndrop, that)
}

/**
 * Bind needed
 * @param  {Object} eventHandler
 * @param  {Object} that > this
 * @param  {Function} dispatch
 * @param  {Object} Immuteable file
 * @returns {Object} eventHandler
 */
function autoBind (functions, that) {
  let bound = {}
  Object.keys(functions).forEach((key) => {
    if((typeof functions[key] === "function")) {
      bound[key] = functions[key].bind(that)
    }
  });
  return bound
}
