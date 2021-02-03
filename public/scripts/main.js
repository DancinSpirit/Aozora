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

/* STATES */
let state = "login";
const reset = function(){
  if(state==="login"){
    $("#login").css("transform","translateX(-100%)");
    $("#login").css("visibility", "hidden");
  }
  if(state==="register"){
    $("#register").css("transform","translateY(100%)");
    $("#register").css("visibility", "hidden");
  }
  if(state==="home"){
    $("#nav-buttons").css("transform","translateX(-200%)");
    $("#nav-buttons").css("visibility", "hidden");
    $("#slide-bar").css("transform","skew(-40deg, 0deg) translateX(-150%)");
    $("#slide-bar").css("visibility", "hidden");
  }
  $(".hidable").css("visibility","hidden");
}
const login = function(){
  reset();
  $("#login").css("visibility","visible");
  $("#login").css("transform","translateX(0%)")  
  state="login";
}

const register = function(){
  reset();
  $("#register").css("visibility","visible");
  $("#register").css("transform","translateY(0%)");
  state="register";
}

const home = function(){
  reset(); 
  $("#nav-buttons").css("visibility", "visible");
  $("#nav-buttons").css("transform","translateX(0%)");
  $("#slide-bar").css("visibility", "visible");
  $("#slide-bar").css("transform","skew(-40deg, 0deg) translateX(0%)");
  state="home"; 
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