import Home from "./home_c.js";
import Dashboard from "./dashbord_c.js";
import About from "./about_c.js";
import ArticleView from "./articleView_c.js";
/*
//regular expression fro placeholder
const pathToRegEx = (path) => {
  //extract regular expression from the patht
  // parameter "/posts/:55"
  // return "^\/postes\/(.)$"
  /**
   * /
^\/postes\/(.)$
/
^ asserts position at start of the string
\/ matches the character / literally (case sensitive)
postes matches the characters postes literally (case sensitive)
\/ matches the character / literally (case sensitive)
1st Capturing Group (.)
.
matches any character (except for line terminators)
+ matches the previous token between one and unlimited times, as many times as possible, giving back as needed (greedy)
$ asserts position at the end of the string
   
  return new RegExp(
    "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$"
  );
};
*/
var ARTICLE_ID;

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};
const router = async () => {
  const routes = [
    {
      path: "/",
      view: Home,
    },
    {
      path: "/dashboard",
      view: Dashboard,
    },
    {
      path: "/about",
      view: About,
    },
    {
      path: "/article",
      view: ArticleView,
    },
  ]; //["Home", "Dashboard", "About"];

  //testing if match with lcation.pathname
  const testMatch = routes.map((route) => {
    //test if pathname correspand routes and return all
    return {
      route,
      isMatches: location.pathname === route.path,
      //result: location.pathname.match(route.path),
    };
  });

  let match = testMatch.find((testMatch) => testMatch.isMatches); //get the result
  //console.log(match);
  if (!match) {
    //if the path does not exixt inthe routes list
    match = {
      route: routes[0],
      isMatches: true,
    };
  }

  //PASS parameters
  const view = new match.route.view(ARTICLE_ID);
  //injectiong the html
  document.querySelector("#main_app").innerHTML = await view.getHTMLContent();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  var article_id = 1;
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      //co
      navigateTo(e.target.href);
    }
    if (e.target.matches(".readArticleBtn")) {
      article_id = e.target.getAttribute("data-articleId");
      ARTICLE_ID = article_id;
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
});

export { navigateTo };
