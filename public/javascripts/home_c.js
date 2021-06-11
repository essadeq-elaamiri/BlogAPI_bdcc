import View_c from "./view_c.js";

export default class extends View_c {
  constructor() {
    super();
    this.setTitle("Home");
  }

  async getHTMLContent() {
    let ArticlesLink = "http://localhost:3000/articles?offset=0&limit=130";
    let TagsLink = "http://localhost:3000/tags";
    let articles = await getArticlesData(ArticlesLink).then((data) => data);
    let tags = await getTagsData(TagsLink).then((data) => data);
    let HTMLContent;
    let articlesHTML = await renderArticlesHtml(articles.rows);
    let tagsHTML = await renderTagsHtml(tags);

    HTMLContent = `
    <!-- Page header with logo and tagline-->
        <header class="py-5 bg-light border-bottom mb-4">
            <div class="container">
                <div class="text-center my-5">
                    <h1 class="fw-bolder">Welcome to BLOGESS!</h1>
                    <p class="lead mb-0">A Blog where you can find everything feeds your curiosity!!</p>
                </div>
            </div>
        </header>
        <div class="tags border-bottom mb-4">
          <div class="container">
            <div class="row">
                    <!-- Search widget-->
                    <div class="col">
                      <div class="card mb-4">
                        <div class="card-header">Search</div>
                        <div class="card-body">
                            <div class="input-group">
                                <input class="form-control" type="text" placeholder="Enter search term..." aria-label="Enter search term..." aria-describedby="button-search" />
                                <button class="btn btn-primary" id="button-search" type="button">Go!</button>
                            </div>
                        </div>
                    </div>
                    </div>
                    <!-- Categories widget-->
                   <div class="col">
                     <div class="card mb-4">
                        <div class="card-header">Tags</div>
                        <div class="card-body">
                            <div class="row">
                                <!-- Put tags here **** -->
                                ${tagsHTML}
                                <!-- end tags here -->
                            </div>
                        </div>
                    </div>
                   </div>
                </div>
          </div>
        </div>
      <div class="articles">
          <div class="container">
            <div class="row">
                <!-- Blog entries-->
                ${articlesHTML} 
            </div>
          </div>
      </div>
    `;
    return HTMLContent;
  }
}

async function getArticlesData(link) {
  let result = await fetch(link);
  return result.json();
}
async function getTagsData(link) {
  let result = await fetch(link);
  return result.json();
}
function renderArticle(article) {
  return `
    <div class="col-4">
      <div class="card mb-4">
        <a href="#!"><img class="card-img-top" src="https://picsum.photos/600/300?random=${
          article.id
        }" alt="Image : ${article.title}" /></a>
          <div class="card-body">
            <div class="small text-muted">${article.updatedAt}</div>
            <h2 class="card-title h4">${article.title}</h2>
            <p class="card-text">${article.content.substring(0, 130)}</p>
            <button class="btn btn-primary readArticleBtn" data-articleLink=${
              article.id
            } data-link >Read more →</button>
          </div>
      </div>
    </div>

    `;
}

async function renderArticlesHtml(articlesArray) {
  let articles = "";
  articlesArray.forEach((article) => {
    articles += renderArticle(article);
  });
  return articles;
}
//renderTagsHtml
function renderTags(tag) {
  return `<div class="col">
            <a data-link data-tagId="${tag.id}" href="#">
              <span class="badge rounded-pill bg-secondary p-2 mb-3">${tag.name}</span>
            </a>
          </div>
          `;
}
async function renderTagsHtml(tagsArray) {
  let tags = "";
  tagsArray.forEach((tag) => {
    tags += renderTags(tag);
  });
  return tags;
}
