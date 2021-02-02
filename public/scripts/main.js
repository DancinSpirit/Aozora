
console.log("TEST");

/* REGISTER AJAX ROUTE */
$("#registration").submit(function(event){
    event.preventDefault();
    const formData = $(this).serialize();
    $.ajax({
      method: "POST",
      url: "/register",
      data: formData,
      success: function(res){
        $("#response-message").html(res);
        if(res==="Registration Successful!"){
        }
        else{
          error();
        }
      }
    }) 
  })