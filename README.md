# Data-Visualization
Dans ce projet il s’agit de visualiser les activités de la faculté Informatique sur le campus USTHB.

 -En premier lieu il s’agit de créer la map de l’usthb et des locaux utilisés par la faculté
  d’informatique : salles de TP, de TD, amphis, salle de réunion, etc (à partir du fichier geojson existant, 
  et du logiciel qui permet de tracer des frontières de zones [geojson.io](https://geojson.io/#map=2/0/20).

  -En second lieu, visualisez l’occupation des salles par la
  spécialité Informatique sur la map (par créneau horaire pour une journée
  donnée et semestre donné). Indiquez la matière, le numéro de salle, le numéro du
  groupe et/ou la section, et l’enseignant.
  Ajouter la visualisation des locaux utilisés par un enseignant donné.

# Structure de projet 
le premier repertoire contient le projet initiale de l'affichage du map et traitement sur les données par d3js
je vous mets aussi un script python pour la generation de fichier JSON contenant les details de chaque spécialitée
à partir des PDF des EDT.

je mets aussi une simple application utilisant js vanilla pour simple traitement qui affiche les EDT des profs.
