/*State History Management*/
window.addEventListener('popstate', (event)=>{
  newState = event.state;
  if(newState==="account"){
    account();
  }
  if(newState==="home"){
    home();
  }
  if(newState==="login"){
    login();
  }
  if(newState==="register"){
    register();
  }
})

/* ACCOUNT AJAX ROUTE */
$("#account-button").on("click", ()=>{
  $.ajax({
    method: "GET",
    url: "/profile",
    success: function(res){
      $("#account-box").html(res);
      window.history.pushState("account", '', "/profile");
      account();
    }
  }) 
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
          window.history.pushState("home", '', "/home")
          home();
        }
        else{
          /* Error */
        }
      }
    }) 
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
          window.history.pushState({state: "home"}, '', "/home")
          home();
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
      login();
    }
  })
})


/* STATES */
let state = "login";

const reset = function(){
  if(state==="login"){
    $("#login").css("transform","translateX(-100%)");
    $("#login").css("visibility", "hidden");
    $("#login-buttons").addClass("invisible");
  }
  if(state==="register"){
    $("#register").css("transform","translateY(100%)");
    $("#register").css("visibility", "hidden");
  }
  if(state==="game"){
    $("#nav-buttons").css("transform","translateX(-200%)");
    $("#nav-buttons").css("visibility", "hidden");
    $("#slide-bar").css("transform","skew(-40deg, 0deg) translateX(-150%)");
    $("#slide-bar").css("visibility", "hidden");
  }
  if(state==="home"){
    $("#home-buttons").addClass("invisible");
  }
  if(state==="account"){
    $("#account").css("transform", "translateY(200%)");
    $("#account").css("visibility", "hidden");
  }
}

const login = function(){
  reset();
  $("#login").css("visibility","visible");
  $("#login").css("transform","translateX(0%)")  
  $("#login-buttons").removeClass("invisible");
  state="login";
}

const register = function(){
  reset();
  $("#register").css("visibility","visible");
  $("#register").css("transform","translateY(0%)");
  $("#login-buttons").removeClass("invisible");
  state="register";
}

const game = function(){
  reset(); 
  $("#nav-buttons").css("visibility", "visible");
  $("#nav-buttons").css("transform","translateX(0%)");
  $("#slide-bar").css("visibility", "visible");
  $("#slide-bar").css("transform","skew(-40deg, 0deg) translateX(0%)");
  state="game"; 
}

const home = function(){
  reset();
  $("#home-buttons").removeClass("invisible");
  state="home";
}

const account = function(){
  reset();
  $("#home-buttons").removeClass("invisible");
  $("#account").css("visibility", "visibile");
  $("#account").css("transform", "translateY(0%)");
  state="account";
}

/* LOGGED IN STATE TRIGGER */
if(user){
    home();
}else{
    login();
}


/* BUTTON TRIGGERS */
$("#home-button").on("click", ()=>{
  home();
})
$("#login-button").on("click", ()=>{
  window.history.pushState("login", '', "/login");
  login();
})
$("#register-button").on("click", ()=>{
  window.history.pushState("register", '', "/register");
  register();
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