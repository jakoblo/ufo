// @flow

import React from "react";
import { Mark, Character } from "slate";
import Prism from "prismjs";
import MarkdownLink from "./components/slate-markdown-link";
import * as c from "../../folder-editor-constants";

require("prismjs/components/prism-markdown");

// Existing Languages: http://prismjs.com/#languages-list
const language = "markdown";
const grammar = Prism.languages[language];
// Extend Default Prism Markdown
grammar.plainURL = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/;

/**
 * Define a Prism.js decorator
 * Prism is a syntax highlighter.
 * http://prismjs.com
 *
 * @param {Text} text
 * @param {Block} block
 */

function prismDecorator(text: any, block: any) {
  let characters = text.characters.asMutable();
  const string = text.text;

  // Prism will split the string in nested tokes
  // These tokens contain the information to style the characters
  const tokens = Prism.tokenize(string, grammar);

  // Current Token position in the string
  const offset = 0;

  characters = mergePrismTokensInCharacters(characters, tokens, offset);

  return characters.asImmutable();
}

/**
 * Define Marks by the Prism tokens and add them to the characters
 *
 * @param {Characters} characters
 * @param {Array<PrimsTokens>} tokens
 * @param {number} [offset=0]
 * @returns
 */

function mergePrismTokensInCharacters(characters, tokens, offset = 0) {
  tokens.forEach(token => {
    if (typeof token == "string") {
      // It not a token, just is string to indicate the content of the Parent token
      // Nothing to do here
      offset += token.length;
      return;
    }

    const length = offset + token.length;

    // The Type of the Mark
    // This has to be styled in Schema.marks
    const type = getTokenType(token);

    characters = applyMarksToCharacters(characters, offset, length, type);

    if (Array.isArray(token.content)) {
      // This Tokens has child tokens, same again
      characters = mergePrismTokensInCharacters(
        characters,
        token.content,
        offset
      );
    }
    offset = length;
  });

  return characters;
}

/**
 * Adds Marks to the characters in the given range
 *
 * @param {Characters} characters
 * @param {number} offset
 * @param {number} length
 * @param {string} markType
 * @returns {Characters}
 */

function applyMarksToCharacters(characters, offset, length, markType) {
  for (let i = offset; i < length; i++) {
    let char = characters.get(i);
    let { marks } = char;
    marks = marks.add(Mark.create({ type: markType }));
    char = char.merge({ marks });
    characters = characters.set(i, char);
  }
  return characters;
}

function getTokenType(token) {
  if (token.type == "title") {
    if (token.content[0].type == "punctuation") {
      return token.type + "-" + token.content[0].length;
    }
  }
  return token.type;
}

const MarkdownPlugin = {
  schema: {
    rules: [
      {
        match: (node: any) => !node.isVoid,
        decorate: prismDecorator
      }
    ],
    marks: {
      "title-1": {
        fontSize: "18px",
        margin: "20px 0 10px 0",
        display: "inline-block"
      },
      "title-2": {
        fontSize: "16px",
        margin: "10px 0 0px 0",
        display: "inline-block"
      },
      "title-3": {
        textTransform: "uppercase"
      },
      bold: {
        fontWeight: "bold"
      },
      italic: {
        fontStyle: "italic"
      },
      punctuation: {
        opacity: 0.5
      },
      list: {
        paddingLeft: "10px",
        paddingRight: "10px",
        color: "#000"
      },
      hr: {
        borderBottom: "2px solid #000",
        display: "block",
        opacity: 0.5
      },
      url: (props: any) => {
        const { node } = props;
        const { data } = node;
        const urlWithBrackets = node.text.match(/\(.*\)/)[0];
        const url = urlWithBrackets.substring(1, urlWithBrackets.length - 1);
        return (
          <MarkdownLink url={url}>
            {props.children}
          </MarkdownLink>
        );
      },
      plainURL: (props: any) => {
        const { node } = props;
        return (
          <MarkdownLink url={node.text}>
            {props.children}
          </MarkdownLink>
        );
      }
    }
  }
};

export default MarkdownPlugin;
