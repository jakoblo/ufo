import * as t from './pv-actiontypes'

export function showPreview(filePath) {
  return {
    type: t.SHOW_PREVIEW,
    payload: {
      path : filePath
    }
  }
}
