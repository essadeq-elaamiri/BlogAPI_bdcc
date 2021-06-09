import View_c from "./view_c.js";

export default class extends View_c {
  constructor() {
    super();
    this.setTitle("About");
  }

  async getHTMLContent() {
    return `<h1>Hi there this is About</h1>`;
  }
}
