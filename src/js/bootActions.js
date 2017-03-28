//@flow

let actions = [];

export function register(callback: Function) {
  actions.push(callback);
}

export function call(dispatch: Function) {
  actions.forEach(action => {
    dispatch(action());
  });
}
