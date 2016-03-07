# Pinakarri - RaRo Offsite Activities

[Pinakarri](http://www.pinakarri.at) is an international scout camp held in August 2016 in Austria, Laxenburg.

This application implements the online-booking system for activities which scouts of the age of 16-20 years (so-called "Ranger and Rovers") can participate.

##The requirements

There are a certain number of activities, which have a limited set of seats for participants (Ranger and Rovers) as well as for their leaders.

* Only a limited number of scouts of the same group may book the same activity
* Only one leader of a scout group may book the same activity.
* The system will be opened at a given time, tickets for an activity are booked on a first-come, first-served basis. Once an activity is booked it must no longer be possible to book it a second time.

##Technology stack

* [Vagrant](http://www.vagrantup.com) for providing a the development environment
* [Docker](http://www.docker.com) for running the services the application
* [Express](http://expressjs.com), a server side web framework based on [NodeJs](http://nodejs.org/) for serving the application and providing the back-end services via REST apis
* [AngularJS](http://angularjs.org) for the client-side web-framework
* [MongoDB] (http://mongodb.org), a NOSQL database


##Installing a development environment

###Install vagrant
* Follow the installation instructions at https://www.vagrantup.com/downloads.html for the operating system of your choice
* Install the vagrant docker compose plugin by running
```
vagrant plugin install vagrant-docker-compose
```

###Clone this git-repository
```
git clone https://github.com/armstrongconsulting/pinakarri.git
```

###Boot up vagrant
Open a terminal, switch to the pinakarri folder an run

```
vagrant up
````

This now gives you a virtual machine (or 'box' as the vagrant community would say), based on ubuntu trusty, which has Docker installed on it. The following services will be running

* MongoDb, you can point your browser at http://192.168.100.100:9001 which hosts an admin app for mongo
* The application at http://192.168.100.100:9000/pinakarri
* Open a debugger session by pointing your chrome-browser at http://192.168.100.100:8888/?port=5858

####What else can you do

* run ```vargrant ssh``` to ssh into your pinakarri-development vm (box)
* There run ```docker ps``` to list all docker containers which are running
* Run ```docker logs pinakarri_app``` to check the logs of the application, you'll find something like 

```
Debugger listening on port 5858

Initializing mongodb mongodb://db:27017/pinakarri
Running on http://localhost:8080
found data.xlsx, will import the data
Starting import
Import finished
W32: http://localhost:8080/pinakarri?uid=xxxx-xxxx-xxx-xxx-xxx-xxx
W1: http://localhost:8080/pinakarri?uid=yyyy-yyy-yyy-yyy-yyy-yy-yy
```
* copy the ?uid=xxxxx query parameter and append it to the address of your browser window showing the application. This brings you to the booking site for this particular group.
* Want to get rid of everyhing, simply run ```vagrant destroy```


##Deployment to a production environment
* On a host of your choice install docker and docker-compose
* clone the git-repository
* run docker-compose up -d

That's it.
