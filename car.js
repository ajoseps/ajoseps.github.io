$( document ).ready(function() {
  yearSelect();
});

//$('#make-select').click(makeSelect);

//$('#model-select').click(modelSelect);

$('#specific-model-select').click(specificModelSelect);

$('#car-selection-form').submit(function(event){
  getVehicleInfo(event);
});

$('#year-select').change(makeSelect);

$('#make-select').change(modelSelect);

$('#model-select').change(specificModelSelect);

// Get Vehicle Information
function getVehicleInfo(event){
  event.preventDefault();

  // Formatting URL
  var apiURL = 'http://www.nhtsa.gov/webapi/api/SafetyRatings';
  var vehicleId = $('#specific-model-select').val();
  var apiParam = '/VehicleId/' + vehicleId;
  var outputFormat = '?format=json';
  var callback = '?callback=myCallback';
  var requestURL = apiURL+apiParam+outputFormat+callback;

  var vehicleInfo = [];
  getVehicleInformation(requestURL, function(info){
      vehicleInfo = info.Results[0];
      displayVehicleInfo(vehicleInfo);
  });
}

// Output Vehicle Info to site
function displayVehicleInfo(info){
  console.log(info);
  $('#vehicle-info').children().remove();
  $.each(info, function(key,val){
    if(/(ModelYear)$/.test(key)){
      return false;
    }
    else if(!(/(Video)$/.test(key))){
      var listItemHeading = '<h4 class="list-group-item-heading">' + key.replace(/([a-z])([A-Z])/g, '$1 $2') + '</h4>';
      $('#vehicle-info').append(listItemHeading);
    }
    var listItemText = '';
    if (/(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg)$/.test(val))
      listItemText = '<div class="row"> <div class="col-md-3"> </div>  <div id="container" class="col-md-6"> <img src=' + val + ' alt=' + key + '> </div> <div class="col-md-3"> </div> </div>' ;
    else if(/(Rating|Rating2)$/.test(key) && $.isNumeric(val) && val <= 5){
      if(val >= 4)
        listItemText = '<div class="progress"> <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow='+ val + ' aria-valuemin="0" aria-valuemax="5" style="width:' + (val/5.0)*100 + '%;">' + val + '</div> </div>';
      else if(val == 3)
        listItemText = '<div class="progress"> <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow='+ val + ' aria-valuemin="0" aria-valuemax="5" style="width:' + (val/5.0)*100 + '%;">' + val + '</div> </div>';
      else
        listItemText = '<div class="progress"> <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow='+ val + ' aria-valuemin="0" aria-valuemax="5" style="width:' + (val/5.0)*100 + '%;">' + val + '</div> </div>';
    }
    else if(/(wmv)$/.test(val))
      listItemText = '';
    else
      listItemText = '<p class="list-group-item-text">' + val + '</p>';
    $('#vehicle-info').append(listItemText);
    return true;
  });
}


// List Item Creation Functions
function yearSelect(){ createListItems('ModelYear','#year-select'); }

function makeSelect(){ createListItems('Make','#make-select'); }

function modelSelect(){ createListItems('Model','#model-select'); }

function specificModelSelect(){ createListItems('VehicleDescription','#specific-model-select'); }

// Formats the Request URL to NHTSA API
function formatRequestToAPI(param){
  // Formatting URL
  var apiURL = 'http://www.nhtsa.gov/webapi/api/SafetyRatings';
  var apiParam = '';
  var outputFormat = '?format=json';
  var callback = '?callback=myCallback';

  switch(param){
    case 'VehicleDescription':
      var model = $('#model-select').find(':selected').text();
      apiParam = 'model/' + model + '/' + apiParam;
    case 'Model':
      var make = $('#make-select').find(':selected').text();
      apiParam = 'make/' + make + '/' + apiParam;
    case 'Make':
      var year = $('#year-select').find(':selected').text();
      apiParam = '/modelyear/' + year + '/' + apiParam;
    case 'ModelYear':
      break;
    default:
      console.log('Wrong Parameter Specified');
  }
  var requestURL = apiURL+apiParam+outputFormat+callback;
  return requestURL
}

function getVehicleInformation(requestURL, callback){
  // Sending Request
  $.ajax({
    url: requestURL,
    dataType: 'jsonp',
    success: function(data){
      callback(data);
      }
  });
}

// Sends formatted URL to NHTSA API and callback returns a list of items
function sendRequestToApi(requestURL, param, callback){
  var listItems = [];
  // Sending Request
  $.ajax({
    url: requestURL,
    dataType: 'jsonp',
    success: function(data){
      $.each(data['Results'],function(){
        var isCar = false; // For Obtaining Vehicle ID
        var vehicledesc = '';
        $.each(this, function(k,v){
            if(param == 'VehicleDescription' && k == 'VehicleId'){
              var yearItem = '<option value='+v+'>'+vehicledesc+'</option>';
                listItems.push(yearItem);
            }
            else if(k == param && param == 'VehicleDescription'){
                vehicledesc = v;
            }
            else if(k == param){
                var yearItem = '<option value='+v+'>'+v+'</option>';
                listItems.push(yearItem);
            }
          });
      });
      callback(listItems);
    }
  });
}

// Creates list items in html according to specified api param and html id
function createListItems(param,id){
  var param = param;
  var requestURL = formatRequestToAPI(param);
  sendRequestToApi(requestURL, param, function(dropdownItems){
    $(id).children().remove();
      $.each(dropdownItems, function(index,value){
        $(id).append(value);
      });
    });
}
