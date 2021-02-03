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
const reset = function(){
  $(".hidable").css("visibility","hidden");
}
const login = function(){
  reset();
  $("#login").css("visibility","visible");
}

const register = function(){
  reset();
  $("#register").css("visibility","visible");
}

const home = function(){
  reset();  
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