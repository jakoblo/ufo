// @flow

declare var identifier: string;

export type KeyMap = {
  [id: string]: keyEntry
};

export type keyEntry =
  | string
  | {
      darwin?: string,
      windows?: string,
      linux?: string
    };
