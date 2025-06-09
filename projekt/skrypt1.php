<?php
    header('Content-Type: application/json; charset=utf-8; ');
    header("Access-Control-Allow-Origin: *");
    /////////////////////////////////
    //=-=-=-=skrypt1=-=-=-=//
    //
    //  skrypt 1 odpowiada za:
    //  -sprawdzenie czy wpisane słowo jest słowem polskim
    //          - (wyszukanie tego słowa i pobranie go)
    //  -sprawdzanie jaki tryb jest wybrany i z takiej bazy słów wybiera słowo
    //  -pobranie aktualnego słowa do zgadnięcia
    //          - (pobranie indeksu + znalezienie słowa o takim indeksie)
    //  -porownanie słow i wysłanie 5 liczb
    //          - (żeby klient nigdy nie widział słowa przed zgadnięciem)
    //  
    //////////////////////////////
    $param = json_decode($_GET['json'],false);
    $sja = $param->slowo; //slowoja

    //$ssv = "słowo";//<-test   
    //slowoserwer - POBIERANIE Z SERWERA TUTAJ
    //sprawdzenie czy słowo jest polskie
    $link = new mysqli('localhost', 'root', '', 'wordl');
    $sql = "SELECT slowo from `bankall` where slowo = '$sja' limit 1";
    $dane = $link->query($sql);
    $res = [];
    while($rek = $dane->fetch_object()){
        $res[] = $rek ;
    }

if($res){
    ////
    //pobranie indexu aktualnego słowa
    $link = new mysqli('localhost', 'root', '', 'wordl');
    $sql = 'SELECT id from `indexb` limit 1';
    $dane = $link->query($sql);
    $res = [];
    while($rek = $dane->fetch_object()){
        $res[] = $rek ;
    }
    $dd = $res[0]->id;
    /////
    //pobranie aktualnego słowa żeby można było z nim porównać
    //TUTAJ TEZ SPRAWDZAM CZY JEST TRYB EASY CZY EXTREME
    $sqlez = "SELECT easy from indexb limit 1";
    $daneez = $link->query($sqlez);
    $resez = [];
    while($rekez = $daneez->fetch_object()){
        $resez[] = $rekez ;
    }
    $czyez = $resez[0]->easy;
    if($czyez){
        $sql2 = "SELECT slowo from bankeasy where id = $dd";
    }else{
        $sql2 = "SELECT slowo from bankall where id = $dd";
    }
    $dane2 = $link->query($sql2);
    $res2 = [];
    while($rek2 = $dane2->fetch_object()){
        $res2[] = $rek2 ;
    }
    $ssv = $res2[0]->slowo;
    //////

    //forma odpowiedzi - slowo jest w odległosci 0-5 gdzie
    // 0 - te same miejsce
    // 1-4 - odleglosc
    // 5 - nie ma w slowie
    // 6 - słowo nie zostało zaakceptowane
    if (mb_strlen($sja) != mb_strlen($ssv)) {
        echo json_encode("niemozliwy blad złej dlugosci");
    }else{
        $odp = array_fill(0, mb_strlen($sja), 5);
        for ($i = 0; $i < mb_strlen($sja); $i++) {
            for ($j = 0; $j < mb_strlen($ssv); $j++) {
                if (mb_substr($sja,$i,1) == mb_substr($ssv,$j,1) && $odp[$i] >= abs($i-$j)) {
                    
                    $odp[$i] = abs($i-$j);
                }
            }                  
        }
        echo json_encode($odp);
    }
}else{
        $odp = array_fill(0, mb_strlen($sja), 6);
        echo json_encode($odp);
    }

?>