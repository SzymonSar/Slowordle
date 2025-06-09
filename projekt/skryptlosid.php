<?php
    header('Content-Type: application/json; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    ////
    ////////     RANDOM ID klient
    ////


    //pobranie indexu aktualnego słowa
    $link = new mysqli('localhost', 'root', '', 'wordl');

        //TUTAJ TEZ SPRAWDZAM CZY JEST TRYB EASY CZY EXTREME
    $sqlez = "SELECT easy from indexb limit 1";
    $daneez = $link->query($sqlez);
    $resez = [];
    while($rekez = $daneez->fetch_object()){
        $resez[] = $rekez;
    }
    $czyez = $resez[0]->easy;

    if($czyez){
        $dd = rand(1,1275);
    }else{
        $dd = rand(1,38125);
    }

    $sql = "DELETE FROM `indexb` WHERE true";
    $link->query($sql);
    $sql = "INSERT INTO `indexb`(`id`, `easy`) VALUES ('$dd', '$czyez')";
    $link->query($sql);
    echo json_encode("index wylosowany");
?>