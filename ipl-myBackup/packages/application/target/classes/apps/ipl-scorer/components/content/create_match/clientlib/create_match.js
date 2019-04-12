var teamOne,teamTwo,rules,tossWinner,chooseTo;
var teamOnePlayingSquad = [];
var teamTwoPlayingSquad = [];

//loads data for all auto complete
$( function() {
	  loadRules();
      loadTeamData("team-one");
      loadTeamData("team-two");     
 } );

//get rules  
function loadRules(){
	var rulesValue = [];
	$.getJSON( "/content/ipl-scorer/schema/rules_schema.1.json", function( data ) {
        $.each( data, function( key, val ) {
            if(key != "jcr:primaryType" && key != "callback"){ 
        		rulesValue.push(key);
            }
        });

      });
	
	$( "#rules" ).autocomplete({
	    source: rulesValue,
	    select: function(event,ui){
	    		rules = ui.item.value;		
	    }
	  });
}

//team-one-name 
function loadTeamData(team){
  $( "#"+team+"-name" ).autocomplete({
    source: getTeamNames(),
    select: function(event,ui){
    		$(this).val(ui.item.value);
    		if($('#team-one-name').val() != $('#team-two-name').val()){
    			(team == "team-one")? teamOne = ui.item.value.replace(/\s/g, "_") : teamTwo = ui.item.value.replace(/\s/g, "_");
	    		document.getElementById(team+"-title").innerHTML = ui.item.value;
	    		document.getElementById("pop-up-"+team).innerHTML = " "+ui.item.value + " ";
	    		loadPlayersList(team,ui.item.value.replace(/\s/g, "_"));    		
				return false;
    		}
    		else{
    			document.getElementById("acknowledgement").innerHTML="Team already selected please choose another team";
    			$(this).val("");
    			return false;
    		}
    }
  });
}

//team Name sourcing 
function getTeamNames(){
	var teamNames = [];
	$.getJSON( "/content/ipl-scorer/schema/team_schema.1.json", function( data ) {
        $.each( data, function( key, val ) {
            if(key != "jcr:primaryType" && key != "callback"){   
            	key = key.replace(/_/g, " ");
        		teamNames.push(key);
            }
        });

      });
	return teamNames;
}

//renders players name in the autocomplete
function loadPlayersList(team,teamName){
	$( "#"+team+"-players-list" ).autocomplete({
	    source: getPlayersList(teamName),
	    select: function(event,ui){	 
	    		console.log("Select :" + team);
	    		addPlayers(ui,team);
				$(this).val("");
				return false;
	    }
	  });
}

//returns the array list of players in the given team
function getPlayersList(teamName){
	var playersList = [];
	$.getJSON( "/content/ipl-scorer/schema/team_schema/"+teamName+"/players_list.infinity.json", function( data ) {
		$.each( data, function( key, val ) {
            if(key != "jcr:primaryType" && key != "callback"){
            	var player = val['employee_name']+"-"+key;
        		playersList.push(player);
            }
        });
      });
	return playersList;
}


//add-players in the list
function addPlayers(ui, team){
	var employeeId = ui.item.value.split("-");
        employeeId = employeeId[1];
    console.log(employeeId);
    if(team == "team-one"){
    	console.log("team - one"+team);
    	if(teamOnePlayingSquad.includes(employeeId))
    		document.getElementById("acknowledgement").innerHTML="You have already choosed this player choose anyone else";
    	else 
    		addPlayerToTheList(team,employeeId,ui);
    }
    else if(team == "team-two"){
    	console.log("team - two" + team);
    	if(teamTwoPlayingSquad.includes(employeeId))
    		document.getElementById("acknowledgement").innerHTML="You have already choosed this player choose anyone else";
    	else 
    		addPlayerToTheList(team,employeeId,ui);
    }
  
}

function addPlayerToTheList(team,employeeId,ui){
	(team == "team-one")?teamOnePlayingSquad.push(employeeId):teamTwoPlayingSquad.push(employeeId);
    var ul = document.getElementById(team+"-choosed-players-list");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(ui.item.value));
    $('<i/>').addClass('fas fa-trash delete-player').attr({onclick:"removePlayer(this,\""+team+"\")"}).appendTo(li);
    ul.appendChild(li);
	
}
//remove player from the list and the array
function removePlayer (button,team){
    var playerToBeRemoved = $(button).parent().clone().children().remove().end().text();
    $(button).parent().remove();
    playerToBeRemoved = playerToBeRemoved.split("-");
    (team == "team-one")?removePlayerFromArray(teamOnePlayingSquad,playerToBeRemoved[1]):removePlayerFromArray(teamTwoPlayingSquad,playerToBeRemoved[1]);
}

//remove a specific value from an array
function removePlayerFromArray(arr){
	var what, a= arguments, L= a.length, ax;
	while(L> 1 && arr.length){
	    what= a[--L];
	    while((ax= arr.indexOf(what))!= -1){
	        arr.splice(ax, 1);
	    }
	}
	return arr;
}




 $( document ).ready(function() {
	 
	 		  
    $( "#create-match-button" ).on( "click", function() {
    	if(tossWinner == undefined || chooseTo == undefined){
    		document.getElementById("acknowledgement").innerHTML="Plese Enter Toss Results";
    	}
    	else{
    		//ajax call to create a match in schema
    		var overs = document.getElementById("overs").value;
    		$.ajax({
    			url: '/bin/ipl-scorer/create_match_resource_type',
    			data: {
    	           teamOne : teamOne,
    	           teamTwo : teamTwo,
    	           rules : rules,
    	           overs : overs,
    	           tossWinner : tossWinner,
    	           chooseTo : chooseTo,
    	           teamOnePlayingSquad : teamOnePlayingSquad,
    	           teamTwoPlayingSquad : teamTwoPlayingSquad
    			},
    			error: function() {
    				document.getElementById("acknowledgement").innerHTML="Error on creating match please retry";
    			},
    	        success: function(data) {
    	        	console.log(data);
    	        	if(data != "false"){
    	        		document.getElementById("acknowledgement").innerHTML="Match created Successfully";
    	        	}
    	        	else{
    	        		document.getElementById("acknowledgement").innerHTML="Already a match is in progress please complete it and then try creating a match";
    	        	}
    			},
    			type: 'POST'
    		});
    	}
	});
    
    
    // Get the modal
	var modal = document.getElementById('toss-popup');

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

    
    $('#toss-button').click(function(){
    	loadPopupData();
	    modal.style.display = "block";
    });
    	
    
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    $( ".popup-footer button" ).on( "click", function() {	
    	modal.style.display = "none";
    });
});

//Loads data for all auto complete in pop-up
function loadPopupData(){
	loadTossWinner();
	loadChooseTo();
}
//toss winner auto complete
function loadTossWinner(){
	
	$( "#toss-winner" ).autocomplete({
	    source: [teamOne,teamTwo],
	    select: function(event,ui){
	    		tossWinner = ui.item.value;	
	    		$('#toss-result').css('display','block');
	    		document.getElementById("toss-winner-span").innerHTML = " "+tossWinner+" ";
	    }
	  });
}

//loads data to choose to auto complete 
function loadChooseTo(){
	$( "#choose-to" ).autocomplete({
	    source: ["Batting","Bowling"],
	    select: function(event,ui){
	    		chooseTo = ui.item.value;	
	    		document.getElementById("choose-to-span").innerHTML = " "+chooseTo+" ";
	    }
	  });
}










