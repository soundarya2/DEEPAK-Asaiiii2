
	$(document).ready( function () {
		dataTableInit();
    });

     function dataTableInit (){
          $.ajax({
                      url: "/conf/scorecard",
                      data:{team_name:"batting"},
                      success: function(data){
                          console.log(data);
                          let dataTableArrayData = [];
                          let length = data.length;
                          for(let i = 0 ; i < length ; i++) {
                              dataTableArrayData.push(Object.values(data[i]));
                          }

                        getDataTable(dataTableArrayData);
                }
               });
     }
    function getDataTable(dataList){
        console.log("" +dataList);

        $.fn.dataTable.ext.errMode = 'none';
    
            $('#batting_details').DataTable(
            {
                data: dataList,
                 columns:[
                     {'title':'employee_name'},
                     {'title':'x'},
                     {'title':'y'},
                     {'title':'z'},
                     {'title':'ada'},
                     {'title':'dsdx'}
                ]
    
          }
             );
    
    }