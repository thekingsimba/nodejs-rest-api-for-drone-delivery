## Drones EXERCISE  ✅ Complete -----------------------------------
### Task description

Introduction

There is a major new technology that is destined to be a disruptive force in the field of transportation: **the drone**. Just as the mobile phone allowed developing countries to leapfrog older technologies for personal communication, the drone has the potential to leapfrog traditional transportation infrastructure.

Useful drone functions include delivery of small items that are (urgently) needed in locations with difficult access.

---

We have a fleet of **10 drones**. A drone is capable of carrying devices, other than cameras, and capable of delivering small loads. For our use case **the load is medications**.

A **Drone** has:
- serial number (100 characters max); ✅ Done
- model (Lightweight, Middleweight, Cruiserweight, Heavyweight); ✅ Done
- weight limit (500gr max); ✅ Done
- battery capacity (percentage); ✅ Done
- state (IDLE, LOADING, LOADED, DELIVERING, DELIVERED, RETURNING). ✅ Done

Each **Medication** has: 
- name (allowed only letters, numbers, ‘-‘, ‘_’); ✅ Done
- weight;  ✅ Done
- code (allowed only upper case letters, underscore and numbers);  ✅ Done
- image (picture of the medication case).  ✅ Done

Develop a service via REST API that allows clients to communicate with the drones (i.e. **dispatch controller**). The specific communication with the drone is outside the scope of this task. 

The service should allow:
- registering a drone;✅ Done
- loading a drone with medication items;✅ Done
- checking loaded medication items for a given drone; ✅ Done
- checking available drones for loading;✅ Done
- check drone battery level for a given drone; ✅ Done

> Feel free to make assumptions for the design approach. 

---
#### Functional requirements

While implementing your solution **please take care of the following requirements**: 
- There is no need for UI; ✅ Done
- Prevent the drone from being loaded with more weight that it can carry;✅ Done
- Prevent the drone from being in LOADING state if the battery level is **below 25%**; ✅ Done
- Introduce a periodic task to check drones battery levels and create history/audit event log for this. ✅ Done

---
#### Non-functional requirements

- Input/output data must be in JSON format; ✅ Done
- Your project must be buildable and runnable; ✅ Done
- Your project must have a README file with build/run/test instructions ✅ Done
- Use DB that can be run locally, e.g. in-memory, via container; ✅ Done
- Required data must be preloaded in the database.✅ Done
- JUnit tests are optional but advisable (if you have time);
- Advice: Show us how you work through your commit history. ✅ Done

---
## Drones REST API SOLUTION  ✅ Complete -----------------------------------

> 😎️ I did it using Nodejs + MongoDB ( which can connect with a local BD or remote cluster ) + Docker 😎️

#### run/start server instructions
To run/start the project ( With docker ) and access the REST APIs ( on http://localhost:4000 regarding my docker-compose config ) :
1- sudo docker-compose up 

To remove the docker image volume from your computer when you are done:
2- sudo docker-compose down --volume 


If you want, you can also run/start the project ( Without docker on http://localhost:3000)  the project code  :
1- npm install
2- npm run dev (in dev mode I gave you opportunity to test with a remote MongoDB cluster database)
    - to use the remote database you just need to uncomment connectToRemoteClusterDB() and then comment connectToRemoteClusterDB() method ( inside index.js and inside createPreloadedData.js )
#### POSTMAN COLLECTION SHARED

To do some HTTP request on the APIs : You can use the software Postman (I have shared a complete POSTMAN collection with you)

