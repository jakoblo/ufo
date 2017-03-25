//@flow
import type { Element } from "react";
import { suffixTypes } from "../vf-constants";
import RenderEditor from "./render-editor";
import RenderImage from "./render-image";
import RenderHTML from "./render-html";
import RenderDOCX from "./render-docx";
import RenderPDF from "./render-pdf";
import RenderUnavailable from "./render-unavailable";
/**
 * @param  {string} suffix .html, .txt
 * @return {react-component}
 */
export default function getRenderer(suffix: string): any {
  suffix = suffix.toLowerCase();
  let type = null;

  for (var fileType in suffixTypes) {
    if (suffixTypes[fileType].indexOf(suffix) > -1) {
      type = fileType;
    }
  }

  switch (type) {
    case "image":
      return RenderImage;
    case "html":
      return RenderHTML;
    case "plainText":
      return RenderEditor;
    case "doc":
      return RenderDOCX;
    case "pdf":
      return RenderPDF;
    default:
      return RenderUnavailable;
  }
}
