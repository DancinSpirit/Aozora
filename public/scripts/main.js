/* STATES */
let state = "login";
let song;

const reset = function () {
  if (state === "login") {
    $("#login").css("transform", "translate(-100%,-40px)");
    $("#login-buttons").addClass("invisible");
  }
  if (state === "register") {
    $("#register").css("transform", "translateY(calc(100% - 40px))");
    $("#login-buttons").addClass("invisible");
  }
  if (state === "story") {
    $("#nav-buttons").css("transform", "translateX(-200%)");
    $("#slide-bar").css("transform", "skew(-40deg, 0deg) translateX(-150%)");
    $("#story").css("transform", "translate(-100%, -40px)")
  }
  if (state === "files") {
    $("#nav-buttons").css("transform", "translateX(-200%)");
    $("#slide-bar").css("transform", "skew(-40deg, 0deg) translateX(-150%)");
    $("#files").css("transform", "translate(200%, -40px)")
  }
  if (state === "players") {
    $("#nav-buttons").css("transform", "translateX(-200%)");
    $("#slide-bar").css("transform", "skew(-40deg, 0deg) translateX(-150%)");
    $("#players").css("transform", "translateY(calc(100% - 40px))")
  }
  if (state === "games") {
    $("#games").css("transform", "translate(200%, -40px)");
  }
  if (state === "account" || state==="profile") {
    $("#account").css("transform", "translateY(calc(200% - 40px))");
  }
}

const login = function () {
  reset();
  $("#main-buttons").addClass("invisible");
  $("#login").css("transform", "translate(0%,-40px)")
  $("#login-buttons").removeClass("invisible");
  $("#edit-title").addClass("invisible");
  $("#game-name-input").addClass("invisible");
  state = "login";
}

const register = function () {
  reset();
  $("#main-buttons").addClass("invisible");
  $("#register").css("transform", "translateY(-40px)");
  $("#login-buttons").removeClass("invisible");
  $("#edit-title").addClass("invisible");
  $("#game-name-input").addClass("invisible");
  state = "register";
}

const storyState = function () {
  $.ajax({
    method: "GET",
    url: `${window.location.href}/story`,
    success: function (res) {
      $("#story-box").html(res);
    }
  })
  reset();
  $("#main-buttons").removeClass("invisible");
  $("#nav-buttons").css("transform", "translate(0%)");
  $("#slide-bar").css("transform", "skew(-40deg, 0deg) translateX(0%)");
  $("#title").addClass("invisible");
  $("#edit-title").removeClass("invisible");
  $("#game-name-input").removeClass("invisible");
  if (window.localStorage.getItem("game")) {
    game = JSON.parse(window.localStorage.getItem("game"));
  }
  $("#game-name-input").val(game.name);
  $("#story").css("transform", "translate(0%, -40px)")
  state = "story";
}

const files = function () {
  $.ajax({
    method: "GET",
    url: `${window.location.href}/files`,
    success: function (res) {
      $("#files-box").html(res);
      $(".fill").each(function(){
        if($(this).height()<1){
          $(this).remove();
        }
      })
      $(".file-delete-button").on("click",function(event){
        event.stopPropagation();
        const name = $(this).attr("id").replace("-delete",'');
        const type = $(this).attr("type");
        $(`#files-box-box`).html(`<section class="delete-message"><p class="delete-text">Are you sure you want to delete ${name}?</p><section class="delete-buttons"><button id="yes-button">Yes</button><button id="no-button">No</button></section></section>`)
        $("#yes-button").on("click",function(){
          $.ajax({
            method: "POST",
            url: `files/${type}/${name}/delete`,
            success: function(res){
              location.reload();
            }
          })
        })
        $("#no-button").on("click",function(){
           files();
        })
      })
      $(".music-play").on("click", function(){
        if(song){
          song.pause();
        }
        song = document.getElementById($(this).attr('id').replace("-button",""));
        console.log(song);
        song.volume = 0.2;
        song.play();
      })
    }
  })
  reset();
  $("#main-buttons").removeClass("invisible");
  $("#nav-buttons").css("transform", "translate(0%)");
  $("#slide-bar").css("transform", "skew(-40deg, 0deg) translateX(0%)");
  $("#title").addClass("invisible");
  $("#edit-title").removeClass("invisible");
  $("#game-name-input").removeClass("invisible");
  if (window.localStorage.getItem("game")) {
    game = JSON.parse(window.localStorage.getItem("game"));
  }
  $("#game-name-input").val(game.name);
  $("#files").css("transform", "translate(0%, -40px)")
  state = "files";
}

const players = function () {
  $.ajax({
    method: "GET",
    url: `${window.location.href}/players`,
    success: function (res) {
      $("#players-box").html(res);
    }
  })
  reset();
  $("#main-buttons").removeClass("invisible");
  $("#nav-buttons").css("transform", "translate(0%)");
  $("#slide-bar").css("transform", "skew(-40deg, 0deg) translateX(0%)");
  $("#title").addClass("invisible");
  $("#edit-title").removeClass("invisible");
  $("#game-name-input").removeClass("invisible");
  if (window.localStorage.getItem("game")) {
    game = JSON.parse(window.localStorage.getItem("game"));
  }
  $("#game-name-input").val(game.name);
  $("#players").css("transform", "translate(0%, -40px)")
  state = "players";
}

const games = function () {
  $.ajax({
    method: "GET",
    url: "/games/games",
    success: function (res) {
      $("#games-box").html(res);
      $(".game-button").on("click", function (event) {
        game = {
          _id: $(this).attr('id'),
          name: $(this).attr('name')
        };
        window.localStorage.setItem('game', JSON.stringify(game));
        window.history.pushState("story", '', `/game/${game._id}/story`);
        storyState();
      })
      /* PLAYER PROFILE */
      $(".player-box").on("click", function(event){
        event.stopPropagation();
        const id = $(this).attr('id');
        $.ajax({
          method: "GET",
          url: `profile/info/${id}`,
          success: function(res){
            window.history.pushState("profile",'',`profile/${id}`)
            $("#account-box").html(res);
            reset();
            $("#main-buttons").removeClass("invisible");
            $("#account").css("transform", "translateY(-40px)");
            $("#title").removeClass("invisible");
            $("#edit-title").addClass("invisible");
            $("#game-name-input").addClass("invisible");
            state = "account";
          }
        })
      })
      /* DELETE GAME ROUTE */
      $(".delete-button").on("click",function(event){
        event.stopPropagation();
        const id = $(this).attr("id").replace("-delete",'');
        const originalHtml = $(`#${id}`).html();
        $(`#${id}`).html(`<section class="delete-message"><p class="delete-text">Are you sure you want to delete ${$(`#${id}`).attr("name")}?</p><section class="delete-buttons"><button id="yes-button">Yes</button><button id="no-button">No</button></section></section>`)
        $(".game-button").unbind("click");
        $("#yes-button").on("click",function(){
          $.ajax({
            method: "POST",
            url: `/games/${id}/delete`,
            success: function(res){
              location.reload();
            }
          })
        })
        $("#no-button").on("click",function(){
           games();
        })
      })
      /* CREATE GAME ROUTE */
      $("#create-game-form").submit(function (event) {
        event.preventDefault();
        const formData = $(this).serialize();
        $.ajax({
          method: "POST",
          url: "/games/create",
          data: formData,
          success: function (res) {
              window.localStorage.setItem('game', JSON.stringify(res))
              window.history.pushState("story", '', `/game/${res._id}/story`)
              storyState();
          }
        })
      })
      $("#join-game-form").submit(function (event) {
        event.preventDefault();
        const formData = $(this).serialize();
        $.ajax({
          method: "POST",
          url: `/games/join/${user.id}`,
          data: formData,
          success: function (res) {
              window.localStorage.setItem('game', JSON.stringify(res))
              window.history.pushState("story", '', `/game/${res._id}/story`)
              storyState();
          }
        })
      })
    }
  })
  reset();
  $("#main-buttons").removeClass("invisible");
  $("#games").css("transform", "translateY(-40px)");
  $("#title").removeClass("invisible");
  $("#edit-title").addClass("invisible");
  $("#game-name-input").addClass("invisible");
  state = "games";
}

const account = function () {
  $.ajax({
    method: "GET",
    url: "/profile/info",
    success: function (res) {
      $("#account-box").html(res);
      /* Image Upload */
      $("#account-avatar").on("click", () => {
        $("#file").click();
      })
      $("#file").change(function () {
        $("#file-submit").click();
      })
    }
  })
  reset();
  $("#main-buttons").removeClass("invisible");
  $("#account").css("transform", "translateY(-40px)");
  $("#title").removeClass("invisible");
  $("#edit-title").addClass("invisible");
  $("#game-name-input").addClass("invisible");
  state = "account";
}

const profile = function () {
  const id = window.location.href.substr(window.location.href.lastIndexOf("/")+1);
  console.log(id);
  $.ajax({
    method: "GET",
    url: `/profile/info/${id}`,
    success: function(res){
      window.history.pushState("profile",'',`${id}`)
      $("#account-box").html(res);
    }
  })
  reset();
  $("#main-buttons").removeClass("invisible");
  $("#account").css("transform", "translateY(-40px)");
  $("#title").removeClass("invisible");
  $("#edit-title").addClass("invisible");
  $("#game-name-input").addClass("invisible");
  state = "profile";
}

/*State Management*/
window.addEventListener('popstate', (event) => {
  newState = event.state;
  load(newState);
})

/* Auth */
const load = function (newState) {
  console.log(newState);
  if (newState === "account") {
    if (user) {
      account();
    } else {
      window.history.pushState("login", '', "/login");
      login();
    }
  }
  if (newState === "profile") {
    if (user) {
      profile();
    } else {
      window.history.pushState("login", '', "/login");
      login();
    }
  }
  if (newState === "games") {
    if (user) {
      games();
    } else {
      window.history.pushState("login", '', "/login");
      login();
    }
  }
  if (newState === "login") {
    if (user) {
      window.history.pushState("games", '', "/games");
      games();
    } else {
      login();
    }
  }
  if (newState === "register") {
    if (user) {
      window.history.pushState("games", '', "/games");
      games();
    } else {
      register();
    }
  }
  if (newState === "story") {
    if (user) {
      storyState();
    } else {
      window.history.pushState("login", '', "/login");
      login();
    }
  }
  if (newState === "files") {
    if (user) {
      files();
    } else {
      window.history.pushState("login", '', "/login");
      login();
    }
  }
  if (newState === "players") {
    if (user) {
      players();
    } else {
      window.history.pushState("login", '', "/login");
      login();
    }
  }
}

/* Home Page Front-End Routing */
if (sentState) {
  if (sentState === "home-games") {
    window.history.pushState("games", '', '/games');
    games();
  } else if (sentState === "home-login") {
    window.history.pushState("login", '', '/login');
    login();
  } else {
    load(sentState);
  }
}

/* ACCOUNT AJAX ROUTE */
$("#account-button").on("click", () => {
  window.history.pushState("account", '', "/profile");
  account();
})

/* REGISTER AJAX ROUTE */
$("#registration-form").submit(function (event) {
  event.preventDefault();
  const formData = $(this).serialize();
  $.ajax({
    method: "POST",
    url: "/register",
    data: formData,
    success: function (res) {
      $("#response-message").html(res);
      if (res === "Registration Successful!") {
        window.history.pushState("games", '', "/games")
        games();
      } else {
        /* Error */
      }
    }
  })
})

/* NAME CHANGE AJAX ROUTE*/
$("#game-name-input").focusout(function () {
  $.ajax({
    method: "POST",
    url: `/game/${game._id}/name`,
    data: {
      name: $("#game-name-input").val()
    },
    success: function (res) {
      game.name = res;
      window.localStorage.setItem('game', JSON.stringify(game));
      console.log("Name changed!");
    }
  })
})

/* If User Hits Enter While Editing Name */
$("#title-form").submit(function (event) {
  event.preventDefault();
  $("#game-name-input").blur();
})

/* LOGIN AJAX ROUTE */
$("#login-form").submit(function (event) {
  event.preventDefault();
  const formData = $(this).serialize();
  $.ajax({
    method: "POST",
    url: "/login",
    data: formData,
    success: function (res) {
      $("#response-message").html(res);
      if (res === "Login Successful!") {
        window.history.pushState("games", '', "/games")
        games();
      } else {
        /* Error */
      }
    }
  })
})

/* LOGOUT AJAX ROUTE */
$("#logout-button").on("click", function (event) {
  $.ajax({
    method: "POST",
    url: "/logout",
    success: function (res) {
      user = false;
      window.history.pushState("login", '', "/login")
      login();
    }
  })
})

/* BUTTON TRIGGERS */
$("#login-button").on("click", () => {
  window.history.pushState("login", '', "/login");
  login();
})
$("#register-button").on("click", () => {
  window.history.pushState("register", '', "/register");
  register();
})
$("#games-button").on("click", () => {
  window.history.pushState("games", '', "/games");
  games();
})
$("#story-button").on("click", () => {
  window.history.pushState("story", '', `story`);
  storyState();
})
$("#files-button").on("click", () => {
  window.history.pushState('files', '', `files`);
  files();
})
$("#players-button").on("click", () => {
  window.history.pushState('players', '', `players`);
  players();
})
$(".fa-edit").on("click", () => {
  $("#game-name-input").focus();
})

/* RESIZE ANIMATION STOPPER */
let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});
