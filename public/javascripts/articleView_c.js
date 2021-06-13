import View_c from "./view_c.js";
import { navigateTo } from "./main.js";

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
    let commentsCount = await this.getCommentsCount(this.articleId);
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
          <h3>Comments <span class="badge bg-warning text-dark">${commentsCount}</span> </h3>
          <div class="mb-2">
              <div class="input-group mb-3">
                <input type="text" class="form-control" id="commentIn" placeholder="Leave a comment" aria-label="Leave a comment" aria-describedby="addCmnt_btn">
                <button class="btn btn-outline-secondary" type="button" id="addCmnt_btn" data-articleID="${
                  this.articleId
                }">Comment</button>
              </div>
          </div>
          ${comments}
        </section>
    </div>
          `;
  }

  async getCommentsCount(articleId) {
    let countLink = `http://localhost:3000/comments/commentsCount/${articleId}`;
    let result = await fetch(countLink);
    return result.json();
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
          ).toLocaleDateString()} at ${new Date(
      comment.createdAt
    ).getHours()}:${new Date(comment.createdAt).getMinutes()}</h6>
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

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("#addCmnt_btn")) {
      /*
      id="commentIn" data-articleID
      */
      let comment = document.querySelector("#commentIn").value;
      let artID = e.target.getAttribute("data-articleID");

      if (!comment || !artID || comment.length == 0)
        alert("Comment can not be empty !");
      else {
        let commentToSend = { content: comment, ArticleId: artID };
        let link = "http://localhost:3000/comments";
        fetch(link, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(commentToSend),
        })
          .then((res) => res.json())
          .then((data) => {
            alert("Comment Added !");
            navigateTo();
          })
          .catch((err) => console.log(err));
      }
    }
  });
});
