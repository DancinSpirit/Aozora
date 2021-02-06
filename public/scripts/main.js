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
  if(state==="game"){
    $("#nav-buttons").css("transform","translateX(-200%)");
    $("#slide-bar").css("transform","skew(-40deg, 0deg) translateX(-150%)");
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
  state="login";
}

const register = function(){
  reset();
  $("#main-buttons").addClass("invisible");
  $("#register").css("transform","translateY(-40px)");
  $("#login-buttons").removeClass("invisible");
  state="register";
}

const game = function(){
  reset(); 
  $("#main-buttons").removeClass("invisible");
  $("#nav-buttons").css("transform","translate(0%)");
  $("#slide-bar").css("transform","skew(-40deg, 0deg) translateX(0%)");
  state="game"; 
}

const games = function(){
  reset();
  $("#main-buttons").removeClass("invisible");
  state="games";
  $("#games").css("transform", "translateY(-40px)");
}

const account = function(){
  /* Image Upload */
  $("#account-avatar").on("click", ()=>{
    $("#file").click();
  })
  $("#file").change(function(){
    console.log("TEST");
    $("#file-submit").click();
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
      $.ajax({
        method: "GET",
        url: "/game/games",
        success: function(res){
          $("#games-box").html(res);
          games();
        }
      }) 
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
  if(newState==="game"){
    if(user){
      game();
    }else{
      window.history.pushState("login", '', "/login");
      login();
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
          $.ajax({
            method: "GET",
            url: "/game/games",
            success: function(res){
              $("#games-box").html(res);
              games();
            }
          }) 
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