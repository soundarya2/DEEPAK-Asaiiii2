var bowlingTable ;
	$(document).ready( function () {

        currentMatchDetails();
		battingDataTableInit();
		bowlingDataTableInit();

    });

     function battingDataTableInit (){
          $.ajax({
                      url: "/conf/scorecard",
                      data:{team_name:"batting"},
                      success: function(data){
                          data = data.data;

                          let dataTableArrayData = [];
                          let length = data.length;
                          for(let i = 0 ; i < data.length ; i++) {
                              if(data[i].player_batting_status)
                              dataTableArrayData.push([data[i].employee_name,data[i].player_batting_status.score, data[i].player_batting_status.balls, data[i].player_batting_status.fours, data[i].player_batting_status.sixes, data[i].player_batting_status.no_of_outs]);
                          }

                        getBattingDataTable(dataTableArrayData);
                }
         });
     }

	function bowlingDataTableInit()
	{
             $.ajax({
                      url: "/conf/scorecard",
                      data:{team_name:"bowling"},
                      success: function(data){
                          data = data.data;

                          let dataTableArrayData = [];
                          let length = data.length;
                          for(let i = 0 ; i < data.length ; i++) {
                              if(data[i].player_bowling_stats)
                              dataTableArrayData.push([data[i].employee_name,data[i].player_bowling_stats.overs, data[i].player_bowling_stats.runs,data[i].player_bowling_stats.wickets,data[i].player_bowling_stats.economy]);
                          }

                        getBowlingDataTable(dataTableArrayData);
                }
         });
     }

    function getBattingDataTable(dataList){

        $.fn.dataTable.ext.errMode = 'none';
    
            $('#batting_details').DataTable(
            {
                data: dataList,
                info:false,
                "searching": false,
                paging:false,
                 columns:[
                     {'title':'Batsmen'},
                     {'title':'Runs'},
                     {'title':'Balls'},
                     {'title':'Fours'},
                     {'title':'Sixes'},
                     {'title':'Outs'}
                ]

            }
            );
    }

   function getBowlingDataTable(dataList)
   {


       if(!bowlingTable){

        bowlingTable = $('#bowling_details').DataTable(
            {
                data: dataList,
                info:false,
                "searching": false,
                paging:false,
                order:[[1,'desc']],
                 columns:[
                     {'title':'Bowler'},
                     {'title':'Overs'},
                     {'title':'Runs'},
  					 {'title':'Wickets'},
					 {'title':'Economy'}
         ]

       }
             ).draw();

       }else{
           bowlingTable.rows().remove().draw();
           bowlingTable.rows.add(dataList).draw(true);
       }

    }


	function currentMatchDetails()
	{
      $.ajax({
          url: "/conf/currentMatchDetails",
          success: function(data){
            var batting_team_name=document.getElementById("batting_team_name");
            var runs=document.getElementById("score");
            var ballsFaced=document.getElementById("overs");
            var bowling_team_name=document.getElementById("bowling_team_name");

            var batting_team=data.batting_team;
			var bowling_team=data.bowling_team;
            var balls=data.current_over;
            var score=data.current_total_runs;

			batting_team_name.innerHTML= batting_team;
            bowling_team_name.innerHTML =bowling_team;
            ballsFaced.innerHTML =balls;
			runs.innerHTML=score;

              bowlingDataTableListener(data);
              battingDataTableListener(data);

          }
	});
    }



    var config = {
        apiKey: "AIzaSyCBhKsE8KKTqk4jVvSzZnQPzgXI4hENZYY",
        authDomain: "iplscorer-6ba55.firebaseapp.com",
        databaseURL: "https://iplscorer-6ba55.firebaseio.com",
        projectId: "iplscorer-6ba55",
        storageBucket: "iplscorer-6ba55.appspot.com",
        messagingSenderId: "216550326550"
     };


    firebase.initializeApp(config);


	function bowlingDataTableListener(dataList)
     {
		var date = new Date();
        var year = date.getFullYear();
        var database = firebase.database();

         console.log("dataaa"+dataList);
         var current_match=dataList.current_match;
         var current_bowling_team=dataList.bowling_team;
          database.ref("schema/match_schema/"+year+"/"+current_match+"/playing_teams/"+current_bowling_team).on('value', function(snapshot){

     firebase.initializeApp(config);

       var date = new Date();
        var year = date.getFullYear();
        var database = firebase.database();
          database.ref("schema/match_schema/"+year).on('value', function(snapshot){


              if(bowlingTable){
                 bowlingDataTableInit();
              }


          }  
      );


    });
     }



	function battingDataTableListener(dataList)
	{
        var date = new Date();
        var year = date.getFullYear();
         var current_match=dataList.current_match;
         var current_batting_team=dataList.batting_team;

         var database = firebase.database();
		 database.ref("schema/match_schema/"+year+"/"+current_match+"/playing_teams/"+current_batting_team).on('value', function(snapshot){
           var data=snapshot.val();
            console.log(data.current_batsman);
             currentBatsman(data.current_batsman);
        });
    }

    function currentBatsman(currentBatsman)
    {
    $('#batting_details').DataTable({
            // ...
            "createdRow": function( row, data, dataIndex ) {
                if ( data[0] == currentBatsman ) {
                    $( row ).css( "background-color", "Orange" );
                }
            },

        });


    }










