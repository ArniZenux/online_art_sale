#!/bin/bash 

mapfile -t list < names.txt

# username = Arni
# password = 123

for name in "${list[@]}"; do 
    echo "name... $name"
    for id in {100..200}; do 
        echo "http://localhost:8080/$name"
        curl -X POST -d '{"username": "Arni", "password": "'"$id"'"}' "http://localhost:8080/$list" -b cookies.txt
        echo -e "\n"
    done
done 