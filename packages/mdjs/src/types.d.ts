export interface MarkdownResult {
  html: string;
  jsCode: string;
  stories: Story[];
}

export interface Story {
  key: string;
  name: string;
  code: string;
}

export interface ParseResult {
  contents: string;
  data: {
    stories: Story[];
    jsCode: string;
  };
}
