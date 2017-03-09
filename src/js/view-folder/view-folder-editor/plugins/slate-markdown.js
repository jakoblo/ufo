import React from 'react'
import Prism from 'prismjs'
import {Set} from 'immutable'
import {Mark, Character} from 'slate'
require('prismjs/components/prism-markdown');

import {Block, Selection} from 'slate'
import * as c from '../folder-editor-constants'

export default function MarkdownPlugin(options) {

  /**
   * Define a Prism.js decorator for markdown blocks.
   *
   * @param {Text} text
   * @param {Block} block
   */
  function markdownDecorator (text, node) {
    let characters = text.characters.asMutable()
    const language = "markdown"
    const string = text.text
    const grammar = Prism.languages[language]
    const tokens = Prism.tokenize(string, grammar)
    let offset = 0
    characters = mergePrismTokensInCharacters(characters, tokens, offset)

    return characters.asImmutable()
  }

  function mergePrismTokensInCharacters(characters, tokens, offset = 0) {    
    tokens.forEach((token) => {
      
      if (typeof token == 'string') {
        offset += token.length
        return // No token, skip the string
      }

      const length = offset + token.length
      const type = getTokenType(token)
      characters = applyMarksToCharacters(characters, offset, length, type)
      if(Array.isArray(token.content)) {
        characters = mergePrismTokensInCharacters(characters, token.content, offset)
      }
      offset = length
    })
    return characters
  }

  function getTokenType(token) {
    if(token.type == "title") {
      if(token.content[0].type == "punctuation") {
        return token.type+'-'+token.content[0].length
      }
    }
    return token.type
  }


  function applyMarksToCharacters(characters, offset, length, markType) {
    for (let i = offset; i < length; i++) {
      let char = characters.get(i)
      let { marks } = char
      marks = marks.add(Mark.create({ type: markType }))
      char = char.merge({ marks })
      characters = characters.set(i, char)
    }
    return characters
  }

  return {
    schema: {
      rules: [{
        match: () => true,
        decorate: markdownDecorator
      }],
      marks: {
        'title-1': {
          fontSize: '25px',
          margin: "20px 0 10px 0",
          display: "inline-block"
        },
        'title-2': {
          fontSize: '16px',
          margin: "10px 0 0px 0",
          display: "inline-block"
        },
        'title-3': {
          textTransform: 'uppercase'
        },
        'bold': {
          fontWeight: 'bold'
        },
        'italic': {
          fontStyle: 'italic'
        },
        'punctuation': {
          opacity: 0.5
        },
        'list': {
          paddingLeft: '10px',
          lineHeight: '10px',
          fontSize: '20px'
        },
        'hr': {
          borderBottom: '2px solid #000',
          display: 'block',
          opacity: 0.5
        }
      }
    }
  }
}