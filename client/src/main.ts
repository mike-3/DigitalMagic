/**
 * Created by Vlad on 4/23/2017.
 */

import {MyDevice} from './myDevice';

import {initModal, MyModal} from "./myModal";
import {CustomMarker} from "./myCustomGoogleMapMarker";
import {getInitData} from "./geInitData";

declare var globalDispather$:JQuery;

var initialize = function () {

  var devicesAr = [
    {Lat: 43.799632, Lng: -79.517201},
    {Lat: 43.793506, Lng: -79.23994},
    {Lat: 43.710955, Lng: -79.28338},
    {Lat: 43.732221, Lng: -79.475403}
  ];
  var myLatlng = new google.maps.LatLng(43.734022, -79.333717);

  var mapOptions = {
    zoom: 12,
    center: myLatlng,
    disableDefaultUI: true
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


  getInitData(map, devicesAr);
  initModal();
//            setInterval(function(){getData()},10000);
};

google.maps.event.addDomListener(window, 'load', initialize);