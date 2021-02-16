from openpyxl import load_workbook
import requests
import time
from bs4 import BeautifulSoup
import json
#import re

wb = load_workbook(filename = '/Users/PJ/Downloads/eu_stations.xlsx')
sheet_id1 = wb['08f9v-b1ow0']
#sheet_id2 = wb['liens']

row = 0

for n1 in range(4454,5717):
    cell_code= "A" + str(n1)
    cell_no= "B" + str(n1)

    code = sheet_id1[cell_code].value
    #print(code)

    #https://airindex.eea.europa.eu/Map/AQI/Viewer/instant?dt=2020-08-26T10%3A00%3A00.000Z&st=DEBY004
    url_ok = "https://airindex.eea.europa.eu/Map/AQI/Viewer/instant?dt=2020-08-26T10%3A00%3A00.000Z&st="+str(code)
    print(url_ok)
    print(n1)
    response= requests.get(url_ok)      
    time.sleep(3)
    jsonparsed = (json.loads(response.text))
    for n2 in range(0,len(jsonparsed)):
        try:
            if jsonparsed[n2]["PollutantId"] == 423:
                if jsonparsed[n2]["BandId"] != 0:
                    sheet_id1[cell_no] = 1
            
                    wb.save('/Users/PJ/Downloads/eu_stations.xlsx')
        except:
            sheet_id1[cell_no] = "timeout"
    #for n1 in range(0,len(jsonparsed)):
        
    
    #source_code = response.text
    #print(source_code)
    
 #   result = re.fullmatch('[ ]*jsonFlickrApi[ ]*\((.+?)\)[ ]*', source_code)

 #   photos = jsonparsed["photos"]["photo"]

   # for n2 in range(0,len(photos)):
        #print(photos[n2])
