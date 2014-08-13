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
    var listItemHeading = '<h4 class="list-group-item-heading">' + key + '</h4>';
    $('#vehicle-info').append(listItemHeading);
    if (/(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg)$/.test(val))
      var listItemText = '<img src=' + val + ' alt=' + key + '>'
    else
      var listItemText = '<p class="list-group-item-text">' + val + '</p>';
    $('#vehicle-info').append(listItemText);
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
