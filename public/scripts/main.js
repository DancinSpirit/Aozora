/* ACCOUNT AJAX ROUTE */
$("#account-button").on("click",function(event){
  $.ajax({
    method: "GET",
    url: "/profile",
    success: function(res){
      $("#account-box").html(res);
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
    $("#account-box").css("transform", "translateY(100%)");
    $("#account-box").css("visibility", "hidden");
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
  $("#account-box").css("visibility", "visibile");
  $("#account-box").css("transform", "translateY(0%)");
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
  login();
})
$("#register-button").on("click", ()=>{
  register();
})
$("#account-button").on("click", ()=>{
  account();
})