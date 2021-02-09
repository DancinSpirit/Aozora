const socket = io();
let listenerAdded = false;
let index = -1;
let song;

/* Socket Reciever */
socket.on('nextLine', function(text){
    story.push(text);
    if($("#user-input").length){
        $("#user-input").remove();
        listenerAdded = false;
        index--;
    }
})

const specialCommand = function(text){
      if(text.startsWith("[MUSIC]")){
        song = document.getElementById(text.replace('[MUSIC]',""));
        song.volume = 0.2;
        song.play();
        nextLine();
        $("#gamemaster-bottom").append(`<form id="edit-form" action="/game/${game._id}/story/${story._id}/${index}" method="POST"><input id="edit-input" type="text" name="story" value='${text}'></form>`);
        return "";
      }
      if(text.startsWith("[SCENE TRANSITION]")){
        let url;
        for(let x=0; x<images.length; x++){
            if(images[x].name===text.replace('[SCENE TRANSITION]',"")){
                url = images[x].url;
                break;
            }
        }
        $("body").css("background-image", `url('${url}')`);
        $("#gamemaster-bottom").append(`<form id="edit-form" action="/game/${game._id}/story/${story._id}/${index}" method="POST"><input id="edit-input" type="text" name="story" value='${text}'></form>`);
        nextLine();
        return "";
      }
}

const addText = function(){
    if(index<=story.length){
        index++;
    }
    if(index==story.length){
        $("#gamemaster-box").after(`<form id="user-input"><input type="text" name="user-input" class="boxtext" action="/game/:${game._id}/story/:${storyId}/" method="POST"><input type="submit" value="Submit" id="submit"></form>`)
        return '';
    }
    else if(index<story.length){
        if(!story[index].startsWith("[")){
            return story[index];
        }
        else{
            return specialCommand(story[index]);
        }
    }
    return '';
}

const nextLine = function(){
    console.log(index);
    let returnedText = "";
    if(index!==story.length){
    returnedText = addText();
    }
    if(returnedText!==""){
        $("#player-bottom").append(`<p class='boxtext'>${returnedText}</p>`);
        $("#gamemaster-bottom").append(`<form id="edit-form" action="/game/${game._id}/story/${story._id}/${index}" method="POST"><input id="edit-input" type="text" name="story" value='${returnedText}'></form>`);
    }   

    if(!listenerAdded){
        if($("#user-input").length){
        $("#user-input").submit(function(event){
            listenerAdded = false;
            event.preventDefault();
            let formData = $(this).serialize();
            formData = formData.substring(11);
            if(formData)
                $.ajax({
                    method: "POST",
                    url: `/game/${game._id}/story/${storyId}/${formData}`,
                    success: function(res){
                        socket.emit('nextLine',res);
                        $("#user-input").remove();
                        listenerAdded = false;
                        index--;
                    }
                })
            else{
                console.log("Empty");
                listenerAdded = true;
            }
        })
        listenerAdded = true;
        }
    }
    $(".textbox").scrollTop($(".textbox").prop("scrollHeight"));
    $("#gamemaster-box").scrollTop($("#gamemaster-box").prop("scrollHeight"));
}

$(".textbox").on("click", nextLine);

$("body").on("keydown", function(e){
    if(e.keyCode == 17){
      nextLine();
    }
  })

$("body").on("keypress", function(e){
    if(e.keyCode == 13){
      nextLine();
    }
})

$("#gamemaster-tab").on("click", function(){
    $("#gamemaster-box").removeClass("invisible");
    $("#player-box").addClass("invisible");
    $("#player-tab").addClass("unselected");
    $("#gamemaster-tab").removeClass("unselected");
    $("#gamemaster-box").scrollTop($("#gamemaster-box").prop("scrollHeight"));
})
$("#player-tab").on("click", function(){
    $("#gamemaster-box").addClass("invisible");
    $("#player-tab").removeClass("unselected");
    $("#gamemaster-tab").addClass("unselected");
    $("#player-box").removeClass("invisible");
    $(".textbox").scrollTop($(".textbox").prop("scrollHeight"));
})