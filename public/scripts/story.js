const socket = io();
let listenerAdded = false;
let index = -1;
let song;

/* Socket Reciever */
socket.on('nextLine', function(text){
    story.push(text);
    if($("#user-input").length){
        index--;
        index--;
        $("#user-input").remove();
        listenerAdded = false;
    }
})

const specialCommand = function(text){
      if(text.startsWith("[MUSIC]")){
        song = document.getElementById(text.replace('[MUSIC]',""));
        song.volume = 0.2;
        song.play();
        nextLine();
        $("#gamemaster-bottom").append(`<p class='boxtext'>${text}</p>`);
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
        console.log(text);
        nextLine();
        $("#gamemaster-bottom").append(`<p class='boxtext'>${text}</p>`);
        return "";
      }
}

const addText = function(){
    if(index<=story.length){
        index++;
    }
    if(index==story.length){
        return `<form id="user-input"><input type="text" name="user-input" class="boxtext" action="/game/:${game._id}/story/:${storyId}/" method="POST"><input type="submit" value="Submit" id="submit"></form>`
    }
    else if(index<story.length){
        if(!story[index].startsWith("[")){
            return `<p class='boxtext'>${story[index]}</p>`;
        }
        else{
            return specialCommand(story[index]);
        }
    } 
}

const nextLine = function(){
    let returnedText = addText();
    $(".bottom").append(returnedText);
    if(!listenerAdded){
        if($("#user-input").length){
        $("#user-input").submit(function(event){
            index--;
            index--;
            listenerAdded = false;
            event.preventDefault();
            let formData = $(this).serialize();
            formData = formData.substring(11);
            if(formData)
            $.ajax({
                method: "POST",
                url: `/game/${game._id}/story/${storyId}/${formData}`,
                success: function(res){
                    nextLine();
                    socket.emit('nextLine',res);
                    $("#user-input").remove();
                    listenerAdded = false;
                    index++;
                }
            })
            else{
            $("#user-input").unbind('submit');
            index=story.length+1;
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
