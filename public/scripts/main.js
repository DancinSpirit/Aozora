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
    $("#login-buttons").addClass("invisible");
  }
  if(state==="game"){
    $("#nav-buttons").css("transform","translateX(-200%)");
    $("#nav-buttons").css("visibility", "hidden");
    $("#slide-bar").css("transform","skew(-40deg, 0deg) translateX(-150%)");
    $("#slide-bar").css("visibility", "hidden");
  }
  if(state==="games"){
    
  }
  if(state==="account"){
    $("#account").css("transform", "translateY(200%)");
    
  }
}

const login = function(){
  reset();
  $("#main-buttons").addClass("invisible");
  $("#login").css("visibility","visible");
  $("#login").css("transform","translateX(0%)")  
  $("#login-buttons").removeClass("invisible");
  state="login";
}

const register = function(){
  reset();
  $("#main-buttons").addClass("invisible");
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

const games = function(){
  reset();
  $("#main-buttons").removeClass("invisible");
  state="games";
}

const account = function(){
  reset();
  $("#main-buttons").removeClass("invisible");
  $("#account").css("visibility", "visibile");
  $("#account").css("transform", "translateY(0%)");
  state="account";
}

/*State Management*/
window.addEventListener('popstate', (event)=>{
  newState = event.state;
  load(newState);
  console.log(user);
})

const load = function(newState){
  console.log(newState);
  if(newState==="account"){
    if(user){
      $.ajax({
        method: "GET",
        url: "/profile/info",
        success: function(res){
          $("#account-box").html(res);
          account();
        }
      })
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
}
if(sentState){
  load(sentState);
}
/* ACCOUNT AJAX ROUTE */
$("#account-button").on("click", ()=>{
  $.ajax({
    method: "GET",
    url: "/profile/info",
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
          window.history.pushState("games", '', "/games")
          games();
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
          window.history.pushState("games", '', "/games")
          games();
          user=true;
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

/* RESIZE ANIMATION STOPPER */
let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});