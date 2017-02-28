# wardubot
slack bot for polish discount stores newsletters


-> ściągnąć zdjęcia produktów, ich cen i linku z biedonka.pl
  - download image for 1 product
  - parse its price
  - parse its link
-> zapisać w taki sposób, by wszystko było widoczne na 1 zdjęciu
  - merge all the data to one single image. (preferably clickable)
-> zapisać w bazie danych MongoDB
  - make images available in database for bot to take
-> stworzyć bota, który 'weźmie' obraz i wrzuci go na slacka
  - create a bot
  - connect it to the slack
  - make it upload the file to one of the channels
-> skonfigurować crona, żeby o jednej porze codziennie pobierał dane z biedronka.pl
  - think about if app should check that images are not the same as yesterday
