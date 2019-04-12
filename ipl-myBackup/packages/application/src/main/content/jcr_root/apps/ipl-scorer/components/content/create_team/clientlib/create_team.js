var playersList = [];

$( function() {

      var employeeNameSource = [];
	  $.getJSON( "/content/ipl-scorer/schema/employee_schema.infinity.json", function( data ) {


          $.each( data, function( key, val ) {

              if(key != "jcr:primaryType" && key != "callback"){
            	var employee = val['employee_name']+"-"+key;
          		employeeNameSource.push(employee);
              }
          });

        });


    $( "#employees" ).autocomplete({
      source: employeeNameSource,
      select: function(event,ui){
			addPlayers(event,ui);
            $(this).val("");
            return false;
      }
    });

    function addPlayers(event , ui){
		var employeeId = ui.item.value.split("-");
            employeeId = employeeId[1];
        if(playersList.includes(employeeId)){
			document.getElementById("acknowledgement").innerHTML="You have already choosed this player choose anyone else";
        }
        else{

            playersList.push(employeeId);
            var ul = document.getElementById("players-list");
            var li = document.createElement("li");
            li.setAttribute('class','player');
            li.appendChild(document.createTextNode(ui.item.value));
            $('<i/>').addClass('fas fa-trash delete-player').attr('onclick','removePlayer(this)').appendTo(li);
            ul.appendChild(li);
        }

    }


  } );




 $( document ).ready(function() {
    $( "#create-team-button" ).on( "click", function() {
  		    console.log(playersList);
        	var teamName = document.getElementById('team-name').value;
   			$.ajax({
   			url: '/bin/ipl-scorer/create_team_component',
   			data: {
                teamName : teamName,
                players : playersList
   			},
   			error: function() {
				document.getElementById("acknowledgement").innerHTML="Error on creating team please retry";
   			},
                success: function(data) {

					document.getElementById("acknowledgement").innerHTML="Team created Successfully";
 			},
   			type: 'POST'
		});

	});
});

function removePlayer (button){

    var playerToBeRemoved = $(button).parent().clone().children().remove().end().text();
    $(button).parent().remove();
    playerToBeRemoved = playerToBeRemoved.split("-");
    removePlayerFromArray(playersList,playerToBeRemoved[1]);
    console.log(playersList);

}


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





