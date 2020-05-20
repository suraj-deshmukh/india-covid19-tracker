import flask, requests, datetime, json, copy
import pandas as pd
from flask import request, jsonify, render_template
from flask_cors import CORS
from Covid19India import CovidIndia

with open('india.geojson') as f:
    data = json.load(f)

app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True
obj = CovidIndia()

@app.route('/stats', methods=['GET'])
def stats():
    stats = obj.getstats()
    return stats

@app.route('/chart', methods=['GET'])
def chart():
    covid_data = requests.get("https://corona.lmao.ninja/v2/historical/India?lastdays=10000")
    data = covid_data.json()['timeline']
    ordered_cases = sorted(data['cases'].items(), key = lambda x:datetime.datetime.strptime(x[0], '%m/%d/%y'))
    ordered_deaths = sorted(data['deaths'].items(), key = lambda x:datetime.datetime.strptime(x[0], '%m/%d/%y'))
    ordered_recovered = sorted(data['recovered'].items(), key = lambda x:datetime.datetime.strptime(x[0], '%m/%d/%y'))
    x = [i[0] for i in ordered_cases]
    cases = [i[1] for i in ordered_cases]
    deaths = [i[1] for i in ordered_deaths]
    recovered = [i[1] for i in ordered_recovered]
    active = [cases[index] - deaths[index] - recovered[index] for index, i in enumerate(cases)]
    return {
        'active': active,
        'recovered': recovered,
        'deaths': deaths,
        'x': x
    }

@app.route('/geojson', methods=['GET'])
def geojson():
    states = obj.getstats()['states']
    geojson = copy.deepcopy(data)
    for i in geojson['features']:
        st = states.get(i['properties']['st_nm'], None)
        if st:
            if i['properties']['st_nm'] == 'Jammu and Kashmir':
                i['properties']['active'] += states['Ladakh']['active'] + st['active']
                i['properties']['recovered'] += states['Ladakh']['active'] + st['recovered']
                i['properties']['confirmed'] += states['Ladakh']['active'] + st['confirmed']
                i['properties']['deaths'] += states['Ladakh']['active'] + st['deaths']
            else:
                i['properties']['active'] += st['active']
                i['properties']['recovered'] += + st['recovered']
                i['properties']['confirmed'] += + st['confirmed']
                i['properties']['deaths'] += + st['deaths']            
    return geojson

@app.route('/todays', methods=['GET'])
def todays():
    today_stat = {'today_cases': 0, 'testsPerOneMillion': 0, 'today_deaths': 0, 'tests': 0}
    try:
        d = requests.get("https://corona.lmao.ninja/v2/countries/india")
        if d.status_code == 200:
            tmp = d.json()
            today_stat['today_cases'] = tmp['todayCases']
            today_stat['testsPerOneMillion'] = tmp['testsPerOneMillion']
            today_stat['today_deaths'] = tmp['todayDeaths']
            today_stat['tests'] = tmp['tests']
        return today_stat
    except Exception as e:
        pass
    return today_stat

@app.route('/india', methods=['GET'])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0',port='80')
