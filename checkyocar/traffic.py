import requests
#from urllib2 import urlopen
from json import load

def getYears():
	#Declare and assign value for apiUrl variable here
	apiUrl = 'http://www.nhtsa.gov/webapi/api/SafetyRatings'
	#Declare and assign value for apiParam variable here
	#apiParam = '/modelyear/2015/make/ACURA/model/ILX'
	apiParam = ''
	#Declare and assign value for outputFormat variable for response format in querystring
	outputFormat = '?format=json'
	#Combine all three variables to make up the complete request URL
	response = requests.get(apiUrl + apiParam + outputFormat)

	#code below is only to handle JSON response object/format
	#use equivalent sets of commands to handle xml response object/format
	json_obj = response.json()

	years = []
	#Load the Result (vehicle collection) from the JSON response
	for objectCollection in json_obj['Results']:
		years.append(objectCollection['ModelYear'])

	return years

getYears()