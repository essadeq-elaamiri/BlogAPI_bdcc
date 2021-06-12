import View_c from "./view_c.js";

export default class extends View_c {
  constructor(id) {
    super();
    this.articleId = id;
    this.setTitle("Article");
  }

  async getHTMLContent() {
    let article = await this.getArticle(this.articleId).then((data) => data);
    let author = await this.getAuthor(article[0].UserId).then((data) => data);
    let commentsArray = await this.getComments(this.articleId).then(
      (data) => data
    );
    let comments = await this.renderCommentsHtml(commentsArray);
    return `
    <div class="container">
      <article class="mt-5 mb-5 pt-5 pb-5 border-bottom">
              <header>
                  <h1 class="headline">${article[0].title}</h1>
                  <div class="byline mb-5">
                      <address class="author">By <a rel="author" data-link href="/author">${
                        author[0].username
                      }</a></address> 
                      on <time pubdate datetime="${new Date(
                        article[0].createdAt
                      ).toLocaleDateString()} title="">${new Date(
      article[0].createdAt
    ).toLocaleDateString()}
                      </time>
                  </div>
              </header>

              <div class="article-content">
                <p class="lead">${article[0].content}</p>
              </div>
        </article>
        <!-- ********************** -->
        <section class="comments mb-5">
          <h3>Comments</h3>
          ${comments}
        </section>
    </div>
          `;
  }

  async getArticle(articleId) {
    let articleLink = `http://localhost:3000/articles/${articleId}`;
    let result = await fetch(articleLink);
    return result.json();
  }

  async getAuthor(userId) {
    let userLink = `http://localhost:3000/users/${userId}`;
    let result = await fetch(userLink);
    return result.json();
  }

  async renderCommentsHtml(commentsArray) {
    let comments = "";
    if (commentsArray.length == 0) {
      comments = "<h6 class='text-center'>No Comments</h6>";
    } else {
      commentsArray.forEach((comment) => {
        comments += this.renderComment(comment);
      });
    }
    return comments;
  }
  async getComments(articleId) {
    let commentsByArticleLink =
      "http://localhost:3000/comments/commentByArticle/" + articleId;
    var result = await fetch(commentsByArticleLink);
    return result.json();
  }
  renderComment(comment) {
    return `
      <div class="card mb-3" >
        <div class="card-body">
          <!--<h5 class="card-title">Card title</h5>-->
          <h6 class="card-subtitle mb-2 text-muted">${new Date(
            comment.createdAt
          ).toLocaleDateString()}</h6>
          <p class="card-text">${comment.content}</p>
          <a href="#" class="card-link btn btn-outline-success" data-link >
            <i class="fas fa-thumbs-up"></i>
          </a>
          <a href="#" class="card-link btn btn-outline-danger" data-link >
            <i class="fas fa-thumbs-down"></i>
          </a>
        </div>
      </div>
    `;
  }
}
