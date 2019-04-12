
	$.getJSON( "/content/ipl-scorer/schema/match_schema/match_1/playing_teams/scorchers/players_list/1359.json", function( data ) {
     var temp = data['batting_order'];
     document.getElementById("temp").innerHTML=temp;
	 })




