     $(document).ready( function () {
     $.fn.dataTable.ext.errMode = 'none';

      $('#bowling_details').DataTable(
        {
           "severSide":true,
           "ajax":{
            url:"/conf/scorecard",
		    type:'GET',
            data:{team_name:"bowling"}
           },
          "dataType":'json',
		  "success":function(data)
            {

         	},
             columns:[
                 {'data':'employee_name'},
			     {'data':'player_bowling_stats.overs'},
				 {'data':'player_bowling_stats.runs'},
                 {'data':'player_bowling_stats.wickets'},
                 {'data':'player_bowling_stats.economy'}
            ]

        }
  );


    $('#batting_details').DataTable(
        {
            "serverSide":true,
           "ajax":{
            url:"/conf/scorecard",
            type:'GET',
            data: {team_name:"batting"}
         	},
          "dataType":'json',
		  "success":function(json)
            {
            },
             columns:[
                 {'data':'employee_name'},
			     {'data':'player_batting_status.score'},
				 {'data':'player_batting_status.balls'},
                 {'data':'player_batting_status.fours'},
                 {'data':'player_batting_status.sixes'},
                 {'data':'player_batting_status.no_of_outs'}
            ]

        }

	);



} );


var config = {
    apiKey: "AIzaSyCBhKsE8KKTqk4jVvSzZnQPzgXI4hENZYY",
    authDomain: "iplscorer-6ba55.firebaseapp.com",
    databaseURL: "https://iplscorer-6ba55.firebaseio.com",
    projectId: "iplscorer-6ba55",
    storageBucket: "iplscorer-6ba55.appspot.com",
    messagingSenderId: "216550326550"
 };
firebase.initializeApp(config);

   var date = new Date();
    var year = date.getFullYear();
	var database = firebase.database();
      database.ref("schema/match_schema/"+year).on('value', function(snapshot){
		   $('#bowling_details').DataTable().draw();
		   
      }  
  );

 $.ajax({
          url: "/conf/scorecard?team_name=bowling&_=1535789796869",
          success: function(data){
              console.log(data);
              console.log(JSON.stringify(data));

			}
		});







