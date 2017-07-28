# HEROCLASH
## Installation

### installer nodeJS et mettre à jour npm

linux : apt install nodejs

windows : https://nodejs.org/en/

puis :
npm install -g npm
npm update

### Installation des dépendances

à la racine du projet, npm install

Si vous n'avez pas MYSQL d'installé baaaaaah installez le (je vous avoue avoir la flemme de regarder comment faire sur linux. Ouais je code sur windows at the moment, Philippe ne me brûle pas stp)

### créer un fichier password.js à la racine du projet avec le contnu suivant :

exports.password = 'votre-mot-de-passe-mySQL';

exports.secret = 'ce que vous voulez'; (c'est pas important, ça doit juste ne pas être vide)

### insérez vos identifiants mySQL :

dans le fichier database.js, remplissez vos champs utilisateurs, host etc. ne touchez pas à password.

### installation de la base de données

dans le dossier data , mysql -u root -p < heroclash.sql
ou dans phpmyadmin : importer

### lancement du serveur node

à la racine du projet, tapez node server.js
vous devriez voir s'afficher "server running at port 8080". Si ce n'est pas le cas, soit vous avez merdé quelque part, soit c'est moi qui ne sait pas écrire un README correctement. Si vous êtes surs que c'est moi, faites le moi savoir s'il vous plait.

enfin, allez sur http://localhost:8080 pour consulter le site
