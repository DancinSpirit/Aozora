/* STATES */
let state = "login";

const reset = function(){
  if(state==="login"){
    $("#login").css("transform","translate(-100%,-40px)");
    $("#login-buttons").addClass("invisible");
  }
  if(state==="register"){
    $("#register").css("transform","translateY(calc(100% - 40px))");
    $("#login-buttons").addClass("invisible");
  }
  if(state==="story"){
    $("#nav-buttons").css("transform","translateX(-200%)");
    $("#slide-bar").css("transform","skew(-40deg, 0deg) translateX(-150%)");
    $("#story").css("transform","translate(-100%, -40px)")
  }
  if(state==="games"){
    $("#games").css("transform", "translate(200%, -40px)");
  }
  if(state==="account"){
    $("#account").css("transform", "translateY(calc(200% - 40px))");
    
  }
}

const login = function(){
  reset();
  $("#main-buttons").addClass("invisible");
  $("#login").css("transform","translate(0%,-40px)")  
  $("#login-buttons").removeClass("invisible");
  $("#edit-title").addClass("invisible");
  $("#game-name-input").addClass("invisible");
  state="login";
}

const register = function(){
  reset();
  $("#main-buttons").addClass("invisible");
  $("#register").css("transform","translateY(-40px)");
  $("#login-buttons").removeClass("invisible");
  $("#edit-title").addClass("invisible");
  $("#game-name-input").addClass("invisible");
  state="register";
}

const storyState = function(){
  $.ajax({
    method: "GET",
    url: `${window.location.href}/story`,
    success: function(res){
      $("#story-box").html(res);
    }
  }) 
  reset(); 
  $("#main-buttons").removeClass("invisible");
  $("#nav-buttons").css("transform","translate(0%)");
  $("#slide-bar").css("transform","skew(-40deg, 0deg) translateX(0%)");
  $("#title").addClass("invisible");
  $("#edit-title").removeClass("invisible");
  $("#game-name-input").removeClass("invisible");
  if(window.localStorage.getItem("game")){
    game = JSON.parse(window.localStorage.getItem("game"));
  }
  $("#game-name-input").val(game.name);
  $("#story").css("transform","translate(0%, -40px)")
  state="story"; 
}

const games = function(){
  $.ajax({
    method: "GET",
    url: "/games/games",
    success: function(res){
      $("#games-box").html(res);
      $(".game-button").on("click", function(){
        game = {_id: $(this).attr('id'), name: $(this).attr('name')};
        window.localStorage.setItem('game', JSON.stringify(game));
        window.history.pushState("story", '', `/game/${game._id}/story`);
        storyState();
      })
    }
  }) 
  reset();
  $("#main-buttons").removeClass("invisible");
  $("#games").css("transform", "translateY(-40px)");
  $("#title").removeClass("invisible");
  $("#edit-title").addClass("invisible");
  $("#game-name-input").addClass("invisible");
  state="games";
}

const account = function(){
  $.ajax({
    method: "GET",
    url: "/profile/info",
    success: function(res){
      $("#account-box").html(res);
        /* Image Upload */
      $("#account-avatar").on("click", ()=>{
        $("#file").click();
      })
      $("#file").change(function(){
        $("#file-submit").click();
      })
    }
  }) 
  reset();
  $("#main-buttons").removeClass("invisible");
  $("#account").css("transform", "translateY(-40px)");
  state="account";
}

/*State Management*/
window.addEventListener('popstate', (event)=>{
  newState = event.state;
  load(newState);
})

const load = function(newState){
  console.log(newState);
  if(newState==="account"){
    if(user){
      account();
    }else{
      window.history.pushState("login", '', "/login");
      login();
    }
  }
  if(newState==="games"){
    if(user){
      games();
    }else{
      window.history.pushState("login", '', "/login");
      login();
    }
  }
  if(newState==="login"){
    if(user){
      window.history.pushState("games", '', "/games");
      games();
    }else{
      login();
    }
  }
  if(newState==="register"){
    if(user){
      window.history.pushState("games", '', "/games");
      games();
    }else{
      register();
    }
  }
  if(newState==="story"){
    if(user){
      storyState();
    }else{
      window.history.pushState("login", '', "/login");
      login();
    }
  }
}

if(sentState){
  if(sentState ==="home-games"){
    window.history.pushState("games", '', '/games');
    games();
  }else if(sentState === "home-login"){
    window.history.pushState("login", '', '/login');
    login();
  }else{
  load(sentState);
  }
}

/* ACCOUNT AJAX ROUTE */
$("#account-button").on("click", ()=>{
  window.history.pushState("account", '', "/profile");
  account();
})

/* REGISTER AJAX ROUTE */
$("#registration-form").submit(function(event){
    event.preventDefault();
    const formData = $(this).serialize();
    $.ajax({
      method: "POST",
      url: "/register",
      data: formData,
      success: function(res){
        $("#response-message").html(res);
        if(res==="Registration Successful!"){
          window.history.pushState("games", '', "/games")
          games();
        }
        else{
          /* Error */
        }
      }
    }) 
  })

/* NAME CHANGE AJAX ROUTE*/
$("#game-name-input").focusout(function(){
  $.ajax({
    method: "POST",
    url: `/game/${game._id}/name`,
    data: {name: $("#game-name-input").val()},
    success: function(res){
      console.log("Name changed!");
    }
  })
})

$("#title-form").submit(function(event){
  event.preventDefault();
  $("#game-name-input").blur();
})

/* LOGIN AJAX ROUTE */
$("#login-form").submit(function(event){
    event.preventDefault();
    const formData = $(this).serialize();
    $.ajax({
      method: "POST",
      url: "/login",
      data: formData,
      success: function(res){
        $("#response-message").html(res);
        if(res==="Login Successful!"){
          window.history.pushState("games", '', "/games")
          games();
        }
        else{
          /* Error */
        }
      }
    }) 
  })

/* LOGOUT AJAX ROUTE */
$("#logout-button").on("click",function(event){
  $.ajax({
    method: "POST",
    url: "/logout",
    success: function(res){
      user=false;
      window.history.pushState("login", '', "/login")
      login();
    }
  })
})

/* BUTTON TRIGGERS */
$("#login-button").on("click", ()=>{
  window.history.pushState("login", '', "/login");
  login();
})
$("#register-button").on("click", ()=>{
  window.history.pushState("register", '', "/register");
  register();
})
$("#games-button").on("click",()=>{
  window.history.pushState("games", '', "/games");
  games();
})
$(".fa-edit").on("click",()=>{
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