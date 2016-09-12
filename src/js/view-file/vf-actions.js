import * as t from './vf-actiontypes'

export function showPreview(filePath) {
  return {
    type: t.SHOW_PREVIEW,
    payload: {
      path : filePath
    }
  }
}
