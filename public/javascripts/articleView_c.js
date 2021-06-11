import View_c from "./view_c.js";

export default class extends View_c {
  constructor(articleId) {
    super();
    this.articleId = articleId;
    this.setTitle("Article");
  }

  async getHTMLContent() {
    return `<h1>Hi there this is Article ${this.articleId}</h1>`;
  }
}

async function getArticle(id) {
  return {};
}
