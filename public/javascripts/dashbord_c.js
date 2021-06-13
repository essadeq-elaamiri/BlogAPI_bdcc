import View_c from "./view_c.js";
import { navigateTo } from "./main.js";
export default class extends View_c {
  constructor() {
    super();
    this.setTitle("Dashboard");
  }

  async getHTMLContent() {
    let usersLink = "http://localhost:3000/users?offset=0&limit=130";
    let users = await getUsersData(usersLink).then((data) => data);
    let usersRows = await renderUsersTable(users.rows);
    let HTMLContent = await renderHtmlContent(usersRows, users.count);
    return HTMLContent;
  }
}

async function getUsersData(link) {
  let result = await fetch(link);
  return result.json();
}

async function renderUsersTable(usersArray) {
  let html = "";
  usersArray.forEach((user) => {
    html += renderSingleUserRow(user);
  });
  return html;
}

function renderSingleUserRow(user) {
  return `
        <tr>
          <th scope="row">${user.id}</th>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${new Date(user.createdAt).toLocaleDateString()} at ${new Date(
    user.createdAt
  ).getHours()}:${new Date(user.createdAt).getMinutes()}</td>
          <td>${new Date(user.updatedAt).toLocaleDateString()} at ${new Date(
    user.updatedAt
  ).getHours()}:${new Date(user.updatedAt).getMinutes()}</td>
          <td>
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal-${user.id}"
              >
                <i class="fas fa-edit"></i>
              </button>
            
              <button type="button" class="btn btn-danger delete_btn" data-userId=${
                user.id
              }  >
              <i class="fas fa-user-minus"></i>
              </button>
              ${renderModal(user)}
          </td>
        </tr>
          `;
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches(".delete_btn")) {
      e.preventDefault();
      deleteUser(e.target);
    }
    if (e.target.matches("#add_btn")) {
      e.preventDefault();
      addUser();
    }
    if (e.target.matches(".edit_btn")) {
      e.preventDefault();
      let userId = e.target.getAttribute("data-userId");
      // console.log(userId);
      editUserDB(userId);
    }
  });
});

function renderModal(user) {
  return `
  <div
    class="modal fade"
    id="exampleModal-${user.id}"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel-${user.id}">
            <!--  -->
            <div id="edit_alert-${user.id}">Modifier un utilisateur</div>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1-${user.id}">
              <i class="fas fa-user"></i>
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
              id="edit_username-${user.id}"
              value = '${user.username}'
            />
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1-${user.id}">
              <i class="fas fa-at"></i>
            </span>
            <input
              type="email"
              class="form-control"
              placeholder="Email"
              aria-label="Email"
              aria-describedby="basic-addon1"
              id="edit_email-${user.id}"
              value = '${user.email}'
            />
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1-${user.id}">
              <i class="fas fa-key"></i>
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Password"
              aria-label="Password"
              aria-describedby="basic-addon1"
              id="edit_password-${user.id}"
              value = '${user.password}'
            />
          </div>
          <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupSelect01">
              <i class="fas fa-user-tag"></i>
            </label>
            <select class="form-select" id="edit_role-${user.id}">
              <option >Choisir...</option>
              <option ${
                user.role == "admin" ? "selected" : ""
              } value="admin">Admin</option>
              <option ${
                user.role == "author" ? "selected" : ""
              } value="author">Author</option>
              <option ${
                user.role == "guest" ? "selected" : ""
              } value="guest">Guest</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            class="close_and_reload_btn"
            id= "delete_btn-${user.id}"
          >
            Fermer
          </button>
          <button type="button" class="btn btn-primary edit_btn" data-userId="${
            user.id
          }">
            Enregistrer
          </button>
        </div>
  `;
}

async function renderHtmlContent(records, userCount) {
  return `
  <div class="container pt-5">
        <h1 class="mb-3">
          Gestion des utiliasteurs
        </h1>
        <h4><span class="badge bg-info" id="count_badge">Nombre des utilisateurs: ${userCount}</span></h4>

        <div class="add_user mt-3 mb-5">
          <!-- Button trigger modal -->
          <div class="row">
            <div class="col">
              <button
                type="button"
                class="btn btn-outline-dark"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Ajouter un utilisateur
              </button>
            </div>
            <div class="col" id="alerts_label"></div>
          </div>
          <!-- Modal -->
          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    <!--  -->
                    <div id="adding_alert">Ajouter un utilisateur</div>
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <!-- </form action="/users" method="post"> -->
                <div class="modal-body">
                  <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">
                      <i class="fas fa-user"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Username"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      id="username_in"
                    />
                  </div>
                  <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">
                      <i class="fas fa-at"></i>
                    </span>
                    <input
                      type="email"
                      class="form-control"
                      placeholder="Email"
                      aria-label="Email"
                      aria-describedby="basic-addon1"
                      id="email_in"
                    />
                  </div>
                  <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">
                      <i class="fas fa-key"></i>
                    </span>
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Password"
                      aria-label="Password"
                      aria-describedby="basic-addon1"
                      id="password_in"
                    />
                  </div>
                  <div class="input-group mb-3">
                    <label class="input-group-text" for="inputGroupSelect01">
                      <i class="fas fa-user-tag"></i>
                    </label>
                    <select class="form-select" id="role_in">
                      <option selected>Choisir...</option>
                      <option value="admin">Admin</option>
                      <option value="author">Author</option>
                      <option value="guest">Guest</option>
                    </select>
                  </div>
                </div>

                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    id="close_and_reload_btn"
                  >
                    Fermer
                  </button>
                  <button type="button" class="btn btn-primary" id="add_btn">
                    Ajouter
                  </button>
                </div>
                <!-- </form> -->
              </div>
            </div>
          </div>
        </div>

        <div class="users_table">
          <table class="table table-striped table-hover" id="users_table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nom complet</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Date de creation</th>
                <th scope="col">Date de modification</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody data-page="1">
              <!-- <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>
                  <button type="button" class="btn btn-secondary">
                    Modifier
                  </button>
                  <button type="button" class="btn btn-danger">
                    Supprimer
                  </button>
                </td>
              </tr> -->
              ${records}
            </tbody>
          </table>
        </div>

        <!-- Pgination ********-->
        <nav aria-label="Page navigation example" id="pagination">
          <ul class="pagination justify-content-center">
            <li class="page-item disabled">
              <a
                class="page-link"
                href="#"
                tabindex="-1"
                aria-disabled="true"
                data-page-num="-1"
                >Previous</a
              >
            </li>
            <li class="page-item">
              <a class="page-link" href="#" data-page-num="1">1</a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#" data-page-num="2">2</a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#" data-page-num="3">3</a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#" data-page-num="+1">Next</a>
            </li>
          </ul>
        </nav>
      </div>
  `;
}

function sendAlert(type = 1, message = "hello :)", duration) {
  alerts_label.innerHTML = `
    <div class="alert alert-${type == 1 ? "success" : "danger"}" role="alert">
      ${message}
    </div>
  `;
  setTimeout(() => {
    alerts_label.innerHTML = "";
  }, duration);
}

/**yyyyyyyy */

//var alerts_label = document.querySelector("#alerts_label");
var link_adding = "http://localhost:3000/users";

function addUser() {
  var adding_alert = document.querySelector("#adding_alert");
  var username_in = document.querySelector("#username_in");
  var email_in = document.querySelector("#email_in");
  var password_in = document.querySelector("#password_in");
  var role_in = document.querySelector("#role_in");
  var userToAdd = {
    username: username_in.value,
    email: email_in.value,
    password: password_in.value,
    role: role_in.value,
  };
  // console.log(userToAdd);
  if (validateInputs(userToAdd)) {
    addUser_toDb(link_adding, userToAdd);
  } else {
    adding_alert.classList.add("text-danger");
    adding_alert.textContent = "Validation Error!";
    setTimeout(function () {
      adding_alert.classList.remove("text-danger");
      adding_alert.textContent = "Ajouter un utilisateur";
    }, 2000);
  }
}

function validateInputs(userObj) {
  if (
    userObj.username == "" ||
    userObj.password == "" ||
    userObj.email == "" ||
    userObj.role == ""
  )
    return false;
  if (
    userObj.role != "admin" &&
    userObj.role != "author" &&
    userObj.role != "guest"
  )
    return false;
  return true;
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
      let close_and_reload_btn = document.querySelector(
        "#close_and_reload_btn"
      );
      close_and_reload_btn.click();
      // getDataAndRender("http://localhost:3000/users");
      navigateTo();
      sendAlert(1, "L'utisateur a été ajouté !", 2000);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function updateUserToDB(link, user) {
  let result = await fetch(link, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return result.json();
}

function editUserDB(userId) {
  var edit_username = document.querySelector(`#edit_username-${userId}`); //
  var edit_email = document.querySelector(`#edit_email-${userId}`);
  var edit_password = document.querySelector(`#edit_password-${userId}`);
  var edit_role = document.querySelector(`#edit_role-${userId}`);
  var edit_alert = document.querySelector(`#edit_alert-${userId}`);
  var delete_btn = document.querySelector(`#delete_btn-${userId}`);

  var userToEdit = {
    id: userId,
    username: edit_username.value,
    email: edit_email.value,
    password: edit_password.value,
    role: edit_role.value,
  };
  let link = "http://localhost:3000/users";
  if (validateInputs(userToEdit)) {
    updateUserToDB(link, userToEdit)
      .then((result) => {
        //close the modal
        delete_btn.click();
        sendAlert(1, result.message, 2000);
        // getDataAndRender(link);
        navigateTo();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    edit_alert.classList.add("text-danger");
    edit_alert.textContent = "Validation Error!";
    setTimeout(function () {
      edit_alert.classList.remove("text-danger");
      edit_alert.textContent = "Modifier un utilisateur";
    }, 2000);
  }
}

function deleteUser(event) {
  let userId = event.getAttribute("data-userId");
  //console.log(userId);
  let confirmed = confirm(
    "Are you sure ? want to delete the user id: ",
    userId
  );
  if (confirmed) {
    deleteUserFromDB(userId)
      .then((rs) => {
        // getDataAndRender("http://localhost:3000/users");
        navigateTo();
        sendAlert(1, "L'utisateur a été supprimé !", 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

async function deleteUserFromDB(userId) {
  let link = `http://localhost:3000/users/${userId}`;
  let result = await fetch(link, {
    method: "DELETE",
  });
  return result.json();
}
