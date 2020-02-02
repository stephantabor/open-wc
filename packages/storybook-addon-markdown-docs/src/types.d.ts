import { Visitor, types } from '@babel/core';

type File = types.File;

export interface Story {
  key: string;
  name: string;
  codeAst: File;
  displayedCode: string;
}

export type MarkdownToMdxVisitor = Visitor<{
  opts: { jsAst: File; stories: Story[] };
}>;
