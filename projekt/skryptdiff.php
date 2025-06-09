<?php
    header('Content-Type: application/json; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    ////
    $param = json_decode($_GET['json'],false);
    $jakiez = $param->jakiez;
    
    //pobranie indexu aktualnego słowa
    $link = new mysqli('localhost', 'root', '', 'wordl');

    if($jakiez!=2){
    if($jakiez==0){$jez=false;}
    if($jakiez==1){$jez=true;}
    $sql1 = "SELECT id from indexb limit 1";
    $dane1 = $link->query($sql1);
    $res1 = [];
    while($rek1 = $dane1->fetch_object()){
        $res1[] = $rek1;
    }
    $dd = $res1[0]->id;
    $sqlep = "SELECT easy from indexb limit 1";
    $daneep = $link->query($sqlep);
    $resep = [];
    while($rekep = $daneep->fetch_object()){
        $resep[] = $rekep;
    }
    $czyezprzed = $resep[0]->easy;
    //z zero na jeden czyli z extreme na easy
    if($czyezprzed<$jakiez){
        //pobieram z bazy easy
        $sql2 = "SELECT slowo from bankall where id = '$dd'";
        $dane2 = $link->query($sql2);
        $res2 = [];
        while($rek2 = $dane2->fetch_object()){
            $res2[] = $rek2;
        }
        // niemozliwe zeby slowa nie bylo ale if na wrazie czego
        if($res2){
        $slowoprzed=$res2[0]->slowo;
        $sql3 = "SELECT id from bankeasy where slowo = '$slowoprzed'";
        $dane3 = $link->query($sql3);
        $res3 = [];
        while($rek3 = $dane3->fetch_object()){
            $res3[] = $rek3 ;
        }
        if($res3){
            $ddpo = $res3[0]->id;
        }else{
            $ddpo = rand(1,1275);
        }
        }else{
        $ddpo = rand(1,38125);
        }
    }
     //z jeden na zero czyli z easy na extreme
     if($czyezprzed>$jakiez){
        //pobieram z bazy all/extreme
        $sql2 = "SELECT slowo from bankeasy where id = '$dd'";
        $dane2 = $link->query($sql2);
        $rek2 = [];
        while($rek2 = $dane2->fetch_object()){
            $res2[] = $rek2;
        }
        // nmozliwe zeby slowa nie bylo wiec jest if
        if($res2){
        $slowoprzed=$res2[0]->slowo;
        $sql3 = "SELECT id from bankall where slowo = '$slowoprzed'";
        $dane3 = $link->query($sql3);
        $res3 = [];
        while($rek3 = $dane3->fetch_object()){
            $res3[] = $rek3 ;
        }
        if($res3){
            $ddpo = $res3[0]->id;
        }else{
            $ddpo = rand(1,38125);
        }
        }else{
            $ddpo = rand(1,1275);
        }

    }

    $sql = "DELETE FROM `indexb` WHERE true";
    $link->query($sql);
    $sql = "INSERT INTO `indexb`(`id`, `easy`) VALUES ('$ddpo', '$jez')";
    $link->query($sql);

    }   
    /////
    //pobranie aktualnego słowa żeby można było z nim porównać
    $sqlez = "SELECT easy from indexb limit 1";
    $daneez = $link->query($sqlez);
    $resez = [];
    while($rekez = $daneez->fetch_object()){
        $resez[] = $rekez ;
    }
    $czyez = $resez[0]->easy;

    //////

    echo json_encode($czyez);

?>