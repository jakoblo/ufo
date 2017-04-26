//@flow

export const BLOCK_TYPES = {
  QUOTE: {
    type: "QUOTE",
    short: "“",
    className: "quote"
  },
  HEADING_ONE: {
    type: "HEADING_ONE",
    short: "H1",
    className: "heading-one"
  },
  HEADING_TWO: {
    type: "HEADING_TWO",
    short: "H2",
    // deserialize: (element, depth, next) => {
    //   if (element.type == "heading" && element.depth == 2) {
    //     return {
    //       kind: "block",
    //       type: "HEADING_TWO",
    //       nodes: next(element.children)
    //     };
    //   }
    // },
    // matchMarkdown: /(^\s*)##(?!#.) ?/,
    // addMarkdown: (text: string) => "## " + text,
    className: "heading-two"
  },
  HEADING_THREE: {
    type: "HEADING_THREE",
    short: "H3",
    className: "heading-three"
  },
  LIST_ITEM: {
    type: "LIST_ITEM",
    short: "•",
    className: "list-item"
  },
  PARAGRAPH: {
    type: "PARAGRAPH",
    short: "p",
    className: "paragraph"
  }
};

export const INLINE_TYPES = {
  LINK: {
    type: "LINK",
    short: "a",
    className: "link"
  }
};

export const DEFAULT_NODE = BLOCK_TYPES.PARAGRAPH;

export const MARK_TYPES = {
  BOLD: {
    type: "BOLD",
    // matchMarkdown: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    // removeMarkdown: (text: string) => text.replace(/(\*\*)|(__)/g, ""),
    // addMarkdown: (text: string) => "**" + text + "**",
    className: "bold"
  },
  // CODE: {
  //   type: "CODE",
  //   className: "code"
  // },
  ITALIC: {
    type: "ITALIC",
    className: "italic"
  },
  UNDERLINE: {
    type: "UNDERLINE",
    className: "underline"
  }
};
