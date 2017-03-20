// @flow

"use strict";
import React from "react";
import _ from "lodash";
import os from "os";

import type { KeyMap, keyEntry } from "./key-types.d.js";

declare function keyActionCallback(
  action: string,
  event: SyntheticKeyboardEvent
): any;

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
export function keyEventToActionMapper(
  keyMap: KeyMap,
  callback: keyActionCallback
) {
  return (event: SyntheticKeyboardEvent) => {
    let eventString = keyEventToString(event);
    let action = _.findKey(keyMap, value => {
      switch (typeof value) {
        case "string":
          return value == eventString;
        case "object":
          return value[os.platform()] == eventString;
        default:
          return false;
      }
    });
    if (action) {
      event.preventDefault();
      event.stopPropagation();
      callback(action, event);
    }
  };
}

function keyEventToString(event: SyntheticKeyboardEvent): string {
  let keys = [];
  // Modifiers
  if (event.ctrlKey) {
    keys.push("Control");
  }
  if (event.shiftKey) {
    keys.push("Shift");
  }
  if (event.metaKey) {
    keys.push("Meta");
  }
  keys.push(event.key); // Main Key
  return _.uniq(keys).join("+");
}
