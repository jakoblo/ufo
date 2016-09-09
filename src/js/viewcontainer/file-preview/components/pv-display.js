"use strict"
import Utils from '../../utils'
import React from 'react'

// All Preview Displays
import DisplayEditor from './preview-display-editor'
import DisplayImage from './preview-display-image'
import DisplayHTML from './preview-display-html'
import DisplayDocx from './preview-display-docx'
import DisplayPdf from './preview-display-pdf'
import DisplayPsd from './preview-display-psd'
import DisplayUnavailable from './preview-display-unavailable'
import FileObj from '../../File'

export function getDisplayType(suffix) {
    
    let type = Utils.Path.suffixType(suffix)
    
    // Image
    if(type == "image") {
      return DisplayImage
    }
    
    // html
    if(type == 'html') {
      return DisplayHTML
    }
    
    // plainText
    if(type == "plainText") {
      return DisplayEditor
    }
    
    // doc/docx
    if(type == "doc") {
      return DisplayDocx
    }
    
    // PDF
    if(type == "pdf") {
      return DisplayPdf
    }
    
    // PDF
    if(type == "psd") {
      return DisplayPsd
    }
    
    return DisplayUnavailable
}