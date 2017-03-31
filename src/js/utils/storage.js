//@flow
import { remote } from "electron";
import fs from "fs";
import nodePath from "path";
import * as types from "../types";
const app = remote.app;

type Task = {
  name: string,
  path: string,
  fetchFromStore: () => Object | boolean,
  dispatchToStore: (Object | boolean) => types.Action | Function
};

const userDir = app.getPath("userData");
const suffix = ".json";
let storeTasks: Array<Task> = [];

/**
 * Register Task to store and load on window open/close
 */
export function register(
  name: string,
  fetchFromStore: (state: any) => Object | boolean,
  dispatchToStore: (Object | boolean) => types.Action | Function
) {
  storeTasks.push({
    name,
    path: nodePath.join(userDir, name + suffix),
    fetchFromStore,
    dispatchToStore
  });
}

export function loadAll(dispatch: Function) {
  storeTasks.forEach(Task => {
    let data = false;
    try {
      data = JSON.parse(fs.readFileSync(Task.path, "utf-8"));
    } catch (e) {
      if (e) {
        data = false;
      }
    }
    dispatch(Task.dispatchToStore(data));
  });
}

export function saveAll(state: any) {
  storeTasks.forEach(Task => {
    const data = Task.fetchFromStore(state);
    console.log(data);
    if (data) {
      fs.writeFileSync(Task.path, JSON.stringify(data));
    }
  });
}
