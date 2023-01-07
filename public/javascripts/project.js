$(document).ready(function(){
    $.getJSON("http://localhost:3000/employee/fetchallstates",function(data){
       //alert(JSON.stringify(data))
        data.result.map((item)=>{
            $('#state').append($('<option>').text(item.statename).val(item.stateid))
                    })  
})
$('#state').change(function(){
  $.getJSON("http://localhost:3000/employee/fetchallcities",{stateid:$('#state').val()},function(data){
    $('#city').empty()
    $('#city').append($('<option>').text("Choose city"))
    data.result.map((item)=>{
        $('#city').append($('<option>').text(item.cityname).val(item.cityid))
    })
  })
})
})