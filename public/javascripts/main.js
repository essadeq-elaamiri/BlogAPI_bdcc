var users_table = document.querySelector("#users_table tbody");
var t_row_template;
var table_content;
var page;
var pagination_ul = document.querySelector("#pagination ul");

//on load
var link = "http://localhost:3000/users";
getDataAndRender(link);
/*
var li_parination = pagination_ul.children;
for (let i = 0; i < li_parination.length; i++) {
  console.log(li_parination[i].firstElementChild);
  var data_page_num =
    li_parination[i].firstElementChild.getAttribute("data-page-num");
  li_parination[i].firstElementChild.addEventListener("click", function () {
    var link_ = `http://localhost:3000/users/?offset=${
      (data_page_num - 1) * 5
    }&limit=${5}`;
    getDataAndRender(link_);
  });
}
*/
function getDataAndRender(link) {
  fetch(link)
    .then((response) => response.json())
    .then((data) => {
      users_table.setAttribute("data-page", data.currentPage);
      data.rows.forEach((user) => {
        t_row_template = `
        <th scope="row">${user.id}</th>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${user.createdAt}</td>
        <td>${user.updatedAt}</td>
        <td>
            <button type="button" class="btn btn-secondary">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="btn btn-danger">
                <i class="fas fa-user-minus"></i>
            </button>
        </td>
          `;
        let t_row = document.createElement("tr");
        t_row.innerHTML = t_row_template;
        users_table.appendChild(t_row);
      });
    });
}

/********************** ADD USER */
var add_btn = document.querySelector("#add_btn");
var close_and_reload_btn = document.querySelector("#close_and_reload_btn");
var username_in = document.querySelector("#username_in");
var email_in = document.querySelector("#email_in");
var password_in = document.querySelector("#password_in");
var role_in = document.querySelector("#role_in");
var alerts_label = document.querySelector("#alerts_label");
var adding_alert = document.querySelector("#adding_alert");
var link_adding = "http://localhost:3000/users";
//add_btn.addEventListener('click', addUser):

close_and_reload_btn.click = () => {
  location.reload();
};
//console.log(close_and_reload_btn);

add_btn.onclick = addUser;
function addUser() {
  var userToAdd = {
    username_in: username_in.value,
    email_in: email_in.value,
    password_in: password_in.value,
    role_in: role_in.value,
  };
  // console.log(userToAdd);
  addUser_toDb(link_adding, userToAdd);
  /*
  setTimeout(function () {
    adding_alert.classList.add("sucess_added");
    adding_alert.textContent = "User Added !";
  }, 0);
  setTimeout(function () {
    adding_alert.classList.remove("sucess_added");
    adding_alert.textContent = "Ajouter un utilisateur";
  }, 3000);
  // location.reload(); //reload the page
  */
}

function addUser_toDb(link, user) {
  fetch(link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((resData) => {
      console.log(resData);
    })
    .catch((err) => {
      console.log(err);
    });
}
