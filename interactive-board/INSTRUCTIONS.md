# KONCEPTNE TABLE
Delovanje aplikacije je bilo preverjeno z brskalnikom Google Chrome.

## Remote dostop
Aplikacija je obljavljena na računalniškem oblaku tipa _PaaS_ (Platform as a Service) Heroku. Dostopna je na spletnem naslovu (https://konceptne-table.herokuapp.com/). Za urejanje vsebine se je potrebno v aplikacijo prijaviti kot skrbnik (username: _admin_, password: _ioi_konceptne_admin_)

## Navodila za lokalen zagon
### 1.Vzpostavitev izvajalnega okolja
#### Potrebno je namestiti:
* python3.5 (https://www.python.org/downloads/release/python-350/)
* python-pip (https://pip.pypa.io/en/stable/installing/)

Preden nadaljujemo, se moramo prepričati, da uporabljamo Python verzijo 3.5. Za starejše verzije Pythona (2.7) aplikacija ne bo delovala.

#### Virtualno okolje
Za ustvarjanje "čistega" izvajalnega okolja uporabljamo virtualna okolja. V ukazni vrstici poženemo
````python
pip install virtualenv
````

nato pa ustvarimo virtualno okolje (lahko kar znotraj korenskega direktorija KonceptneTable) - ukaz je enak za Windows in Linux sisteme:
````python
virtualenv env
````

Nazadnje še aktiviramo virtualno okolje:

a) Windows: `env\Scripts\activate`
b) Linux: `source env/bin/activate`

Da je virtualno okolje aktivirano se lahko prepričamo, da je v ukaznem pozivu pred indikatorjem o trenutnem direktoriju predpona _(env)_

### 2. Priprava podatkovne baze in zagon aplikacije
Znotraj virtualnega okolja (torej po aktivaciji) inštaliramo programske pakete, ki jih potrebuje naša spletna aplikacija:
````python
pip install -r requirements.txt
````

Nato pa izvedemo še naslednje zaporedje ukazov:
````python
cd app
python manage.py makemigrations        
python manage.py migrate                        #Ustvari ustrezne podatkovne strukture v bazi
python manage.py loaddata admin conceptTables   #Napolni konceptne table z vsebino in ustvari administratorja
python manage.py runserver                      #zažene lokalni spletni strežnik
````

Aplikacija je nato dostopna v brskalniku na naslovu http://localhost:8000 . Za urejanje vsebine se je potrebno v aplikacijo prijaviti kot skrbnik - (username: _admin_, password: _ioi_konceptne_admin_)

## Ostalo
Ker je možno, da bom tik pred razstavo kakšne malenkosti še spreminjala, vam lahko omogočim tudi dostop do mojega git repozitorija na BitBucketu (za zadnjo različico) - če bo to potrebno.
