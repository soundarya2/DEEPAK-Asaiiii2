
var currentMatchPath;
var currentMatchRules;
var currentRulesYear;
var currentInnings;
var firstInningsTotal,secondInningsTotal,firstInningsWickets,secondInningsWickets;
var firstBattingTeamPath,firstBowlingTeamPath,secondBattingTeamPath,secondBowlingTeamPath;
var currentBattingTeamPath,currentBowlingTeamPath;
var currentBatsmanId,currentBowlerId,currentBatsmanName,currentBowlerName,currentBatsmanPath,currentBowlerPath;
var currentOver,currentBall;
var thisOver, totalOvers;
var currentBallRun,currentBallRunType;
var isPowerPlay;
var isBallValid , isWicket;
var outType;
var totalRuns,extras;
var penaltyRuns;


$(document).ready(function(){
	
	var chooseBatsmanPopup = document.getElementById("choose-batsman-popup");
	var chooseBowlerPopup = document.getElementById("choose-bowler-popup");
	var wicketPopup = document.getElementById("wicket-popup");
	var penaltyPopup = document.getElementById("penalty-popup");
	var powerplayPopup =  document.getElementById("powerplay-popup");
	$(".undo-container").css('display','none');
	//choose batsman popup
	
	//show choose batsman popup
	$('.batsman-details .batsman i').click(function(){
		chooseBatsmanPopup.style.display = "block";		
	});
	
	//update current batsman
	$('#choose-batsman-popup .popup-body button').click(function(){
		updateCurrentBatsman(currentBatsmanId);
		chooseBatsmanPopup.style.display = "none";
	});
	
	function showChooseBatsmanPop(){
		chooseBatsmanPopup.style.display = "block";
	}
	
	
	//choose bowler popup
	
	//show choose bowler popup
	$('.bowler-details .bowler i').click(function(){
		chooseBowlerPopup.style.display = "block";
		loadPlayersAutocomplete(currentBowlingTeamPath , "#current-bowler");		
	});
	
	//select current bowler
	$('#choose-bowler-popup .popup-body button').click(function(){
		updateCurrentBowler(currentBowlerId);
		chooseBowlerPopup.style.display = "none";
	});
	
	
	window.onclick = function(event) {
        if (event.target == chooseBatsmanPopup) {
        	chooseBatsmanPopup.style.display = "none";
        }
        if (event.target == chooseBowlerPopup) {
        	chooseBowlerPopup.style.display = "none";
        }
        if (event.target == wicketPopup) {
        	wicketPopup.style.display = "none";
        }
        if (event.target == penaltyPopup) {
        	penaltyPopup.style.display = "none";
        }
        if (event.target == powerplayPopup) {
        	powerplayPopup.style.display = "none";
        }
    }
	
	//score entry 
	$('#submit-score').click(function(){
		if(currentBallRun != null && currentBallRunType != ""){
			thisOver.push(currentBallRun + currentBallRunType);
		}
		else if(currentBallRun != null){
			thisOver.push(currentBallRun);
		}
		else{
			if(currentBallRunType == "p")
				thisOver.push($('.score-entry .runs-span').text() + currentBallRunType);
			else
				thisOver.push(currentBallRunType);
			currentBallRun = 0;
		}
		updateScore();
	});
	
	//runs button
	$('.run-buttons button').click(function(){	
		if(currentBallRunType == "NB"){
			currentBallRun = parseInt($(this).val());
			$('.score-entry .runs-span').text(currentBallRun);	
		}
		else{
			currentBallRunType = "";
			$('.score-entry .run-type-span').text("");
			currentBallRun = parseInt($(this).val());
			$('.score-entry .runs-span').text(currentBallRun);	
		}
		$('#submit-score').css('display','inline');	
	});
	
	//run type buttons
	$('.run-type-buttons button').click(function(){	
		if(currentBallRunType == "Nb" && $(this).val() == "W" ){
			currentBallRunType = currentBallRunType + "+W";
			$('.score-entry .run-type-span').text(currentBallRunType);
			currentBallRun = null;
			$('.score-entry .runs-span').text("");	

		}
		else if((currentBallRunType == "Wd" && $(this).val() == "W" )){
			currentBallRunType = currentBallRunType + "+W";
			$('.score-entry .run-type-span').text(currentBallRunType);
			currentBallRun = null;
			$('.score-entry .runs-span').text("");
		}
		else if($(this).val() == "Nb"){
			currentBallRunType = $(this).val();
			$('.score-entry .run-type-span').text(currentBallRunType);
		}
		else{
			currentBallRun = null;
			$('.score-entry .runs-span').text("");	
			currentBallRunType = $(this).val();
			$('.score-entry .run-type-span').text(currentBallRunType);
		}
		
		$('#submit-score').css('display','inline');
	});
	
	//backspace button
	$('.score-entry i').click(function(){
		currentBallRun = null;
		currentBallRunType = "";
		$('.score-entry .run-type-span').text("");
		$('.score-entry .runs-span').text("");
		$('#submit-score').css('display','none');
	});
	
	//out-type 
	$('.score-entry .run-type-buttons .wicket').click(function(){
		wicketPopup.style.display = "block";
		getOutTypes(currentMatchRules);
	});
	
	$(".wicket-type-select-container button").click(function(){
		$( "#wicket-type-select option:selected" ).each(function() {
		      outType = $(this).text();
		 });
		wicketPopup.style.display = "none";
	})
		
	function getOutTypes(MatchRules){
		var outOptions = document.getElementById("wicket-type-select");
		$(outOptions).children().remove();
		var outTypesArray = [];
		var scoringRules = "scoring_rules";
		if(isPowerPlay == true)
			scoringRules ="scoring_rules_in_powerplay";
		
		$.each( MatchRules[currentRulesYear]["match_rules"][scoringRules]['out'], function( key, val ) {
	        if(key != "jcr:primaryType"){         	
	        	outTypesArray.push(key);
	        }
	    });
		
		outTypesArray.forEach(element => {
			
			  var option = document.createElement("option");
			  option.appendChild(document.createTextNode(element));
			  outOptions.appendChild(option);
			  
		});			
	}
	
	//penalty runs
	$(".run-type-buttons button.penalty").click(function(){
		penaltyPopup.style.display = "block";
	});
	
	$(".penalty-runs-container button").click(function(){		
		penaltyRuns = parseInt(document.getElementById("penalty-runs").value);
		$('.score-entry .runs-span').text(penaltyRuns);	
		penaltyPopup.style.display = "none";
	});
	
	//powerplay
	$('#power-play').click(function(){
		powerplayPopup.style.display = "block";
	});
	
	$('.powerplay-container button').click(function(){
		var powerplayOption;
		$( "#powerplay-select option:selected" ).each(function() {
		     powerplayOption = $(this).text();
		 });
		if(powerplayOption == "on"){
			isPowerPlay = true;
			setPowerPlayColor(isPowerPlay);
		}
		else{
			isPowerPlay = false;
			setPowerPlayColor(isPowerPlay);
		}
		powerplayPopup.style.display = "none";
	});
	
	//undo button
	$('.undo').click(function(){
		undoScore(currentMatchPath);
	});
	
});

$( function() {
	initMatch(); 
} );





//initialize the match
function initMatch(){
	$.ajax({
		url: '/bin/ipl-scorer/initialize_match_resorce_type',
		data: {          
		},
		error: function() {
			document.getElementById("score-entry-acknowledgement").innerHTML="Error on loading match";
		},
        success: function(data) {
    		document.getElementById("score-entry-acknowledgement").innerHTML="Current Match initialized";
    		currentMatchPath = data;
    		getPlayingTeams(currentMatchPath);
    		getCurrentMatchRules(currentMatchPath);
    		getScoreCardDetails(currentMatchPath);
		},
		type: 'POST'
	});
}

//gets data that is to be displayed in score card
function getScoreCardDetails(matchPath){
	$("span.runs-span , span.run-type-span").text("");
	matchPath = formatUrl(matchPath,".1.json");
	$.getJSON( matchPath, function( data ) {
		if(data.is_match_over == true){
			$(".score-entry").css('display','none');
			$(".undo-container").css('display','block');
			$("#current-innings").text(data.current_innings + " ");
		}
		else{
			$("#current-innings").text(data.current_innings + " ");
			isBallValid = false;
			isWicket = false;
			currentBallRun = null;
			currentBallRunType = "";
			totalOvers = data.total_overs;
			firstBattingTeamPath = data.first_innings_batting_team_path;
			firstBowlingTeamPath = data.first_innings_bowling_team_path;
			secondBattingTeamPath = data.second_innings_batting_team_path;
			secondBowlingTeamPath = data.second_innings_bowling_team_path;
			//innings
			firstInningsTotal = data.first_innings_total;
			firstInningsWickets = data.first_innings_wickets;
			secondInningsTotal = data.second_innings_total;
			secondInningsWickets = data.second_innings_wickets;
			currentInnings = data.current_innings;		
			if(currentInnings == "first"){
				currentBattingTeamPath = firstBattingTeamPath;
				currentBowlingTeamPath = firstBowlingTeamPath;
				$('.total-score h1').text(firstInningsTotal);
				var battingTeam = firstBattingTeamPath.split("/");
				$('.total-score h2').text(battingTeam[battingTeam.length - 1].replace(/_/g," "));
				var bowlingTeam = firstBowlingTeamPath.split("/");
				$('.bowling-team-container .bowling-team').text(bowlingTeam[bowlingTeam.length - 1].replace(/_/g," "));
			}
			else{
				currentBattingTeamPath = secondBattingTeamPath;
				currentBowlingTeamPath = secondBowlingTeamPath;
				$('.total-score h1').text(secondInningsTotal);
				var battingTeam = secondBattingTeamPath.split("/");
				$('.total-score h2').text(battingTeam[battingTeam.length - 1].replace(/_/g," "));
				var bowlingTeam = secondBowlingTeamPath.split("/");
				$('.bowling-team-container .bowling-team').text(bowlingTeam[bowlingTeam.length - 1].replace(/_/g," "));
			}
	        
	        
	        //current over and ball
	        currentOver = data.current_over;
	        currentBall = data.current_ball;     
	        if(currentBall == 6){
	        	currentOver = currentOver+1;
	        	currentBall = 0;
	        }
	        $('.over-details .overs h1').text(currentOver + "." + currentBall);
	        
	        //this over
	        thisOver = data.balls;
	        clearThisOver();
	        generateThisOver(data.balls);
	        
	        //extras
	        extras = data.extras;
	        $('.extras h1').text(extras);
	        
	        if(data.current_batsman == "-"){
	        	$('.batsman-details .batsman h2').text("-");
	        	$('.batsman-details .runs h3').text("");
	        	showBatsmanPopup();
	        }
	        else{
	        	currentBatsmanPath = data.current_batsman;
	        	$('.batsman-details .batsman h2').text(data.current_batsman_name);
	        	getBatsmanDetails(currentBatsmanPath);
	        }
	        if(data.current_bowler == "-"){
	        	$('.bowler-details .bowler h2').text("-");
	        	showBowlerPopup();
	        }
	        else{
	        	currentBowlerPath = data.current_bowler;
	        	$('.bowler-details .bowler h2').text(data.current_bowler_name);
	        	
	        }
	        
	        //isPower play
	        isPowerPlay = data.is_power_play;
	       
	        //load popup for players
	        loadPlayersAutocomplete(currentBattingTeamPath , "#current-batsman");
	        loadPlayersAutocomplete(currentBowlingTeamPath , "#current-bowler");
	        
	        showOrHideSubmitButton();
	        setPowerPlayColor(isPowerPlay);
	        
		}
		
      });
	
}

//setPowerPlayColor
function setPowerPlayColor(isPowerPlay){
	
	if(isPowerPlay){	
		$("#power-play").css('background-color','#a4ccd6');
	}
		
	else{
		$("#power-play").css('background-color','#f8cb36');
	}
		
		
}

//showBatsmanPopup
function showBatsmanPopup(){
	var chooseBatsmanPopup = document.getElementById("choose-batsman-popup");
	chooseBatsmanPopup.style.display = "block";
	
}

//showBowlerPopup
function showBowlerPopup(){
	var chooseBowlerPopup = document.getElementById("choose-bowler-popup");
	chooseBowlerPopup.style.display = "block";
	
}

//show Or Hide Submit Button
function showOrHideSubmitButton(){
    if($('.batsman-details .batsman h2').text() == "-" || $('.bowler-details .bowler h2').text() == "-" || $('.score-entry .runs-span').text() == "" || $('.score-entry .run-type-span').text() == ""){
    	$('#submit-score').css('display','none');
    }
    else{
    	$('#submit-score').css('display','inline');
    }
}

//this formats the url required to get json
function formatUrl(path,selector){
	path = path+selector;
	return path;
}

//this function gets the playing teams 
function getPlayingTeams(matchPath){
	var playingTeamsPath = formatUrl(matchPath,"/playing_teams.1.json");
	
	$.getJSON( playingTeamsPath, function( data ) {
		var team = "#team-one";
        $.each( data, function( key, val ) {
            if(key != "jcr:primaryType" && key != "callback"){
            	key = key.replace(/_/g," ");
            	$(team).text(" "+ key + " ");
            	team = "#team-two";
            }
        });

      });
	
	
}
//this function gets the current match rules
function getCurrentMatchRules(matchPath){
	var currentMatchRulesPath = formatUrl(matchPath,"/rules_followed.infinity.json");
	$.getJSON( currentMatchRulesPath, function( data ) {
		setCurrentMatchRules(data);
		$.each( data, function( key, val ) {
			if(key != "jcr:primaryType" && key != "callback")
				currentRulesYear = key;
        });
      });
}

//this method sets the value for current match rules 
function setCurrentMatchRules(jsonData){
	currentMatchRules = jsonData;
	
}


//this function gets the batsman details
function getBatsmanDetails(path){
	var currentBatsmanDetails = formatUrl(path,"/player_batting_status.infinity.json");
	$.getJSON( currentBatsmanDetails, function( data ) {
		$('.batsman-details .runs h3').text(data.runs);
      });
}


//this function gets the bowler details
function generateThisOver(thisOver){
	var thisOverContainer = document.getElementById("this-over-container");
	
	thisOver.forEach(element => {
		  var span = document.createElement("span");
		  span.appendChild(document.createTextNode(element));
		  thisOverContainer.appendChild(span);
	});	
}

//clear the this over data
function clearThisOver(){
	$('#this-over-container').children().remove();
}

//this loads data for the auto-complete
function loadPlayersAutocomplete(path,selector){
	var playersSourceUrl = formatUrl(path,"/playing_squad.1.json");
	var players = [];
	$.getJSON( playersSourceUrl, function( data ) {
        $.each( data, function( key, val ) {
            if(key != "jcr:primaryType" && key != "callback"){         	
            	var player = val['employee_name']+"-"+key;
            	players.push(player);
            }
        });

      });
	
	$(selector).autocomplete({
	    source: players,
	    select: function(event,ui){
	    		var playerId = ui.item.value.split("-")[1];
	    		var playerName = ui.item.value.split("-")[0];
	    		
	    		if(selector == "#current-batsman"){	
	    			currentBatsmanId = playerId;
	    			currentBatsmanName = playerName;
	    		}
	    		else{
	    			currentBowlerId = playerId;
	    			currentBowlerName = playerName;
	    		}
	    		
	    }
	  });
}

//this method updates the current batsman
function updateCurrentBatsman(batsmanId){
	$.ajax({
		url: '/bin/ipl-scorer/update_current_batsman_resourcetype',
		data: {  
			currentBatsmanId : batsmanId,
			currentMatchPath : currentMatchPath,
			currentBattingTeamPath : currentBattingTeamPath
		},
		error: function() {
			document.getElementById("score-entry-acknowledgement").innerHTML="Error on loading match";
		},
        success: function(data) {
    		document.getElementById("score-entry-acknowledgement").innerHTML="Current Match initialized";
    		getScoreCardDetails(currentMatchPath);
            showOrHideSubmitButton();
    		
		},
		type: 'POST'
	});
}

//this method updates the current bowler
function updateCurrentBowler(bowlerId){
	$.ajax({
		url: '/bin/ipl-scorer/update_current_bowler_resourcetype',
		data: {  
			currentBowlerId : bowlerId,
			currentMatchPath : currentMatchPath,
			currentBowlingTeamPath : currentBowlingTeamPath
		},
		error: function() {
			document.getElementById("score-entry-acknowledgement").innerHTML="Error on loading match";
		},
        success: function(data) {
    		document.getElementById("score-entry-acknowledgement").innerHTML="Current Match initialized";
    		getScoreCardDetails(currentMatchPath);
    		showOrHideSubmitButton();
		},
		type: 'POST'
	});
}






//this updates the score 
function updateScore(){
	var runsToBeUpdated = getRunsTobeUpdated();
	if(currentInnings == "first"){		
		firstInningsTotal = firstInningsTotal + runsToBeUpdated;
		if(isWicket){
			firstInningsWickets = firstInningsWickets + 1;
		}
	}else{
		secondInningsTotal = secondInningsTotal + runsToBeUpdated;
		if(isWicket){
			secondInningsWickets = secondInningsWickets + 1;
		}
	}
	
	if(isBallValid){
		currentBall = currentBall+1;
	}
	$.ajax({
		url: '/bin/ipl-scorer/update_score_resource_type',
		data: {  
			currentMatchPath : currentMatchPath,
			currentInnings : currentInnings,
			currentBowlerPath : currentBowlerPath,
			currentBatsmanPath : currentBatsmanPath,
			currentBattingTeamPath : currentBattingTeamPath,
			currentBowlingTeamPath : currentBowlingTeamPath,
			currentBall : currentBall,
			currentOver : currentOver,
			currentBallRun : currentBallRun,
			currentBallRunType : currentBallRunType,
			runsToBeUpdated : runsToBeUpdated,
			isWicket : isWicket,
			isBallValid : isBallValid,
			isPowerPlay : isPowerPlay,
			firstInningsTotal : firstInningsTotal,
			firstInningsWickets : firstInningsWickets,
			secondInningsTotal : secondInningsTotal,
			secondInningsWickets : secondInningsWickets,
			extras : extras,
			thisOver : thisOver,
			overs : totalOvers
		},
		error: function() {
			document.getElementById("score-entry-acknowledgement").innerHTML="Error on updating match";
		},
        success: function(data) {
    		document.getElementById("score-entry-acknowledgement").innerHTML="Score Updated";
    		getScoreCardDetails(currentMatchPath);
		},
		type: 'POST'
	});
}

//runs to be updated
function getRunsTobeUpdated(){

	var runs;
	//get runs after applying rules
	if(currentBallRunType == ""){
		isBallValid = true;
		runs = currentBallRun;
	}
	else{		
		switch(currentBallRunType){	
			case "Wd" : runs = computeRunsForWide();
						break;
			case "Wd+W" : runs = computeRunsForWideWithOut();
						 break;
			case "Db" : runs = computeRunsForDeadball();
						break;
			case "Nb" : runs = computeRunsForNoball();
						break;
			case "Nb+W" : runs = computeRunsForNoballWithOut();
						  break;
			case "p" : runs = computeRunsForPenalty();
						 break;
			case "W" : runs = computeRunsForWicket();
					   break;
		}
	}
	return runs;
}


//compute runs for wide
function computeRunsForWide(){
	var wideCount = 0;
	var thisOverlength = thisOver.length; 
	while(thisOverlength > 0 && (thisOver[thisOverlength-1].includes("Wd") || thisOver[thisOverlength-1].includes("p"))){
		if(thisOver[thisOverlength-1].includes("p")){
			thisOverlength--;
			continue;
		}			
		wideCount = wideCount + 1;
		thisOverlength--;
	}
	
	var multiplyBy ;
	if(isPowerPlay == false){
		multiplyBy = currentMatchRules[currentRulesYear]['match_rules']['scoring_rules']['wide']['increment'];
	}
	else{
		multiplyBy = currentMatchRules[currentRulesYear]['match_rules_in_powerplay']['scoring_rules']['wide']['increment'];
	}
	return wideCount * multiplyBy;
	
}

//compute runs for dead ball
function computeRunsForDeadball(){
	if(isPowerPlay == false){
		return currentMatchRules[currentRulesYear]['match_rules']['scoring_rules']['dead_ball']['run'];
	}
	else{
		return currentMatchRules[currentRulesYear]['match_rules_in_powerplay']['scoring_rules']['dead_ball']['run'];
	}
}

//compute runs for no-ball 
function computeRunsForNoball(){
	if(isPowerPlay == false){
		if(currentBallRun == null)
			return currentMatchRules[currentRulesYear]['match_rules']['scoring_rules']['no_ball']['run'];
		else
			return currentBallRun + currentMatchRules[currentRulesYear]['match_rules']['scoring_rules']['no_ball']['run'];
	}
	else{
		if(currentBallRun == null)
			return currentMatchRules[currentRulesYear]['match_rules_in_powerplay']['scoring_rules']['no_ball']['run'];
		else
			return currentBallRun + currentMatchRules[currentRulesYear]['match_rules_in_powerplay']['scoring_rules']['no_ball']['run'];
	}
}

// compute runs for noball with runs and out
function computeRunsForNoballWithOut(){
	isWicket = true;
	var runsForNoball = computeRunsForNoball();
	if(isPowerPlay == false){
		return runsForNoball + currentMatchRules[currentRulesYear]['match_rules']['scoring_rules']['out'][outType];
	}
	else{
		return runsForNoball + currentMatchRules[currentRulesYear]['match_rules_in_powerplay']['scoring_rules']['out'][outType];
	}
	
}

//compute runs for penalty
function computeRunsForPenalty(){
	return penaltyRuns;
}

//compute runs for wicket
function computeRunsForWicket(){
	isBallValid = true;
	isWicket = true;
	if(isPowerPlay == false){
		return  currentMatchRules[currentRulesYear]['match_rules']['scoring_rules']['out'][outType];
	}
	else{
		return  currentMatchRules[currentRulesYear]['match_rules_in_powerplay']['scoring_rules']['out'][outType];
	}
}

//compute runs for wide with wicket
function computeRunsForWideWithOut(){
	var runsRunsForWideWithOut = computeRunsForWide() + computeRunsForWicket();
	isBallValid = false;
	return runsRunsForWideWithOut;
}


//undo functionality
function undoScore(currentMatchPath){
	console.log("in undo");
	$.ajax({
		url: '/bin/ipl-scorer/undo_score_resource_type',
		data: {  
			currentMatchPath : currentMatchPath
		},
		error: function() {
			document.getElementById("score-entry-acknowledgement").innerHTML="Undo cannot be done";
		},
        success: function(data) {
        	console.log(data);
    		document.getElementById("score-entry-acknowledgement").innerHTML="Undo Successfull";
    		getScoreCardDetails(currentMatchPath);
    		showOrHideSubmitButton();
		},
		type: 'POST'
	});
}


