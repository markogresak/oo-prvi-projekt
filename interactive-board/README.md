## Locally testing heroku
See Procfile.windows (if on windows)
* create virtualenv (or activate existing one)
* activate it
* install dependencies `pip install -r requirements.txt`
* `python app/manage.py collectstatic` (if running from root directory - KonceptneTable)
* `heroku local web -f Procfile.windows` starts local web server
* visit localhost:5000, the app should run normally

## Heroku deploy
put `web: python app/manage.py runserver 0.0.0.0:$PORT` in Profcile

* heroku auth:token
* git push heroku master, username pusti blank, pass = auth token iz prejsnjega koraka
* heroku run python app/manage.py flush
* heroku run python app/manage.py loaddata admin conceptTables
* herkou run python app/manage.py collectstatic
* heroku ps:scale web=1
* heroku open

* heroku config