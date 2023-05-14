docker run `
    -e MYSQL_ROOT_PASSWORD=password `
    -e MYSQL_DATABASE=museum `
    -p 3306:3306 `
    mysql:8.0.33
