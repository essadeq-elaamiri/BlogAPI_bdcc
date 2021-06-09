import Home from "./home_c.js";
import Dashboard from "./dashbord_c.js";
import About from "./about_c.js";

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
  ]; //["Home", "Dashboard", "About"];

  //testing if match with lcation.pathname
  const testMatch = routes.map((route) => {
    return {
      route,
      isMatches: location.pathname === route.path,
    };
  });

  let match = testMatch.find((testMatch) => testMatch.isMatches);
  //console.log(match);
  if (!match) {
    match = {
      route: routes[0],
      isMatches: true,
    };
  }

  const view = new match.route.view();
  //injectiong the html
  document.querySelector("#main_app").innerHTML = await view.getHTMLContent();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      //co
      navigateTo(e.target.href);
    }
  });
  router();
});
