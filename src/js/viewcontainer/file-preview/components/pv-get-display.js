import {suffixTypes} from '../pv-constants'
import DisplayEditor from './pv-display-editor'
import DisplayImage from './pv-display-image'
import DisplayHTML from './pv-display-html'
import DisplayDocx from './pv-display-docx'
import DisplayPdf from './pv-display-pdf'
import DisplayPsd from './pv-display-psd'
import DisplayUnavailable from './pv-display-unavailable'
/**
 * @param  {string} suffix .html, .txt
 * @return {react-component}
 */
export default function getDisplayType(suffix) {
    
    suffix = suffix.toLowerCase()
    let type = null

    for (var fileType in suffixTypes) {
      if(suffixTypes[fileType].indexOf(suffix) > -1) {
        type = fileType
      }
    }
    
    switch (type) {
      case "image":
        return DisplayImage
      case 'html':
        return DisplayHTML
      case 'plainText':
        return DisplayEditor
      case 'doc':
        return DisplayDocx
      case 'pdf':
        return DisplayPdf
      case 'psd':
        return DisplayPsd
      default:
        return DisplayUnavailable
    }
}