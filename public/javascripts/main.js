var users_table = document.querySelector("#users_table tbody");
var t_row_template;
var table_content;
var page;
var pagination_ul = document.querySelector("#pagination ul");
var count_badge = document.querySelector("#count_badge");
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
  users_table.innerHTML = "";
  fetch(link)
    .then((response) => response.json())
    .then((data) => {
      users_table.setAttribute("data-page", data.currentPage);
      count_badge.textContent = data.count;
      data.rows.forEach((user) => {
        t_row_template = `
        <th scope="row">${user.id}</th>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${user.createdAt}</td>
        <td>${user.updatedAt}</td>
        <td>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal-${user.id}"
            >
              <i class="fas fa-edit"></i>
            </button>
          
            <button type="button" class="btn btn-danger" data-userId=${
              user.id
            } class="delete_btn" onclick='deleteUser(this)'>
            <i class="fas fa-user-minus"></i>
            </button>
            ${renderModal(user)}
        </td>
          `;
        let t_row = document.createElement("tr");
        t_row.innerHTML = t_row_template;
        users_table.appendChild(t_row);
      });
    })
    .catch((arr) => {
      count_badge.classList.remove("bg-success");
      count_badge.classList.remove("bg-danger");
      count_badge.textContent = "Error!";
      console.log(err);
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
//console.log(close_and_reload_btn);

add_btn.onclick = addUser;
function addUser() {
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
      close_and_reload_btn.click();
      getDataAndRender("http://localhost:3000/users");
      sendAlert(1, "L'utisateur a été ajouté !", 2000);
    })
    .catch((err) => {
      console.log(err);
    });
}

/********************** DELETE USER */
/*
var delete_buttons = document.querySelectorAll(".delete_btn");
console.log(delete_buttons);
if (delete_buttons) {
  delete_buttons.forEach((editBtn) => {
    editBtn.addEventListener("click", function () {
      alert(editBtn.getAttribute("data-userId"));
    });
  });
}
*/
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
        getDataAndRender("http://localhost:3000/users");
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

/********************** Edit user USER */

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
        getDataAndRender(link);
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
          <button type="button" class="btn btn-primary" id="edit_btn-${
            user.id
          }" onclick='editUserDB(${user.id})'>
            Enregistrer
          </button>
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
