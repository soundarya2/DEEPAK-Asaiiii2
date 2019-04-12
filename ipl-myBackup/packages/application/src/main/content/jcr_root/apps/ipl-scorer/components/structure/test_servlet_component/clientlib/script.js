
console.log("here")

   		   var config = {
    apiKey: "AIzaSyCBhKsE8KKTqk4jVvSzZnQPzgXI4hENZYY",
    authDomain: "iplscorer-6ba55.firebaseapp.com",
    databaseURL: "https://iplscorer-6ba55.firebaseio.com",
    projectId: "iplscorer-6ba55",
    storageBucket: "iplscorer-6ba55.appspot.com",
    messagingSenderId: "216550326550"
  };
firebase.initializeApp(config);

var reference=firebase.database().ref('schema/match_schema/2018');
reference.on('value',function(snapshot)
		{


             $.ajax({
   			url: '/bin/ipl-scorer/scorerapp',
   			data: {

                testPostData :"hello"


   			},
   			error: function() {
				console.log("error");
   			},

   			success: function(data) {
                var a =JSON.parse(data);



                console.log(data);





                   if("current_batsman_employee_name" in a){
                       document.getElementById("current_batsman_employee_name").innerHTML =a.current_batsman_employee_name;
                     if("current_batsman_runs" in a){
                          document.getElementById("current_batsman_employee_name").innerHTML =a.current_batsman_employee_name+"&nbsp;&nbsp;"+a.current_batsman_runs;
                          if("current_batsman_balls" in a){
                                document.getElementById("current_batsman_employee_name").innerHTML =a.current_batsman_employee_name+"&nbsp;&nbsp;&nbsp;&nbsp;"+a.current_batsman_runs+"("+a.current_batsman_balls+")";
                            }

                     }

                  }






                if("current_bowler_employee_name" in a){
                     document.getElementById("current_bowler_employee_name").innerHTML =a.current_bowler_employee_name;
                        if("current_bowler_runs" in a){
                         document.getElementById("current_bowler_employee_name").innerHTML =a.current_bowler_employee_name+"&nbsp;&nbsp;"+a.current_bowler_runs;
                          if("current_bowler_wickets" in a){
                               document.getElementById("current_bowler_employee_name").innerHTML =a.current_bowler_employee_name+"&nbsp;&nbsp;&nbsp;&nbsp;"+a.current_bowler_runs+"-"+a.current_bowler_wickets;
                           }

                    }
                }

                 if("current_batting_team" in a){
                     console.log(a.current_batting_team);
                      document.getElementById("current_batting_team").innerHTML =a.current_batting_team;

                 }
                 if("current_bowling_team" in a){
                      document.getElementById("current_bowling_team").innerHTML =a.current_bowling_team;

                 }

                if("current_innings" in a){
                    var temp=a.current_innings+"_innings_total";
                    temp=(temp.toLowerCase());
                    if(temp in a){
                          document.getElementById("total").innerHTML =a[""+temp+""];
                    }

                }

                if("current_over" in a){
                    document.getElementById("current_over").innerHTML ="OVERS "+a.current_over;
                }
                if("notifications" in a){
                    document.getElementById("notifications").innerHTML =a.notifications;
                }


                document.getElementById("replace").innerHTML = "";
                 var d = document.createDocumentFragment();
                for(var i=0;i<50;i++){

                        if("ball_"+String(i) in a){
                              console.log("ball_"+String(i));
                              var temp="ball_"+String(i);

                              var p=document.createElement("p");
                              var pnode = document.createTextNode(a[""+temp+""]);
                              p.setAttribute("class", "runs");
                              p.appendChild(pnode);

                              var para = document.createElement("div");
                               para.setAttribute("class", "square");
                              para.appendChild(p);

                              d.appendChild(para);

                        }
                }


                 var element = document.getElementById("replace");
                 element.appendChild(d);



 			},
   			type: 'POST'
		});

		});
