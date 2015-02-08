$(function () {

   window.myRadar = new Chart(document.getElementById("canvas").getContext("2d")).Radar(
      {
         labels: ["温度", "AQI", "湿度", "燥度", "风速"],
         datasets: [
          {
             label: "My First dataset",
             fillColor: "rgba(220,220,220,0.2)",
             strokeColor: "rgba(220,220,220,1)",
             pointColor: "rgba(220,220,220,1)",
             pointStrokeColor: "#fff",
             pointHighlightFill: "#fff",
             pointHighlightStroke: "rgba(220,220,220,1)",
             data: [65, 59, 90, 81, 91]
          },
          {
             label: "My Second dataset",
             fillColor: "rgba(151,187,205,0.2)",
             strokeColor: "rgba(151,187,205,1)",
             pointColor: "rgba(151,187,205,1)",
             pointStrokeColor: "#fff",
             pointHighlightFill: "#fff",
             pointHighlightStroke: "rgba(151,187,205,1)",
             data: [28, 48, 40, 19, 80]
          }
         ]
      }, {
         responsive: true
      });

   var vm = {
      rooms: ko.observableArray(),
      viewRoom: function (data) {
         location.href = "baRoom.html?" + $.param({ "roomId": data.roomId, "deviceSN": data.deviceSN, "addressId": data.addressId });
      }
   };

   vm.refresh = function () {
     

      $.ajax({
         type: 'POST',
         url: config.baseUrl + "myBaOverview",
         data: JSON.stringify({ "userId": config.userId }),
         contentType: "application/json",
         dataType: "json"
      }).then(function (result) {

         vm.rooms.removeAll();
         if (result && $.isArray(result)) {
            result.forEach(
               function (item) {
                  vm.rooms.push(config.mapFun(item));
               }
            );

         }
      });
   };

   ko.applyBindings(vm);
   vm.refresh();
   /*
    var result = [{
      "userId": 1, "deviceSN": "12345678", "addressId": 1, "roomId": 1, "description": "bed room", "type": "1",

      "temperature": [
         { "pk": { "deviceSN": "12345678", "dataTimestamp": "2015-02-01 09:14:29" }, "addressId": 1, "data": 14, "rate": null, "links": [] }
      ],
      "humidity": [
         { "pk": { "deviceSN": "12345678", "dataTimestamp": "2015-02-01 20:28:36" }, "addressId": 1, "data": 80, "rate": null, "links": [] }
      ],
      "pressure": [
         { "pk": { "deviceSN": "12345678", "dataTimestamp": "2015-01-06 10:03:12" }, "addressId": 1, "data": 101200, "rate": null, "links": [] }
      ],

      "equipments": null, "launchTimestamp": null, "stopTimestamp": null,
      "pm25data": [
         { "pk": { "deviceSN": "12345678", "dataTimestamp": "2015-02-01 10:03:57" }, "addressId": 1, "data": 101, "rate": null, "links": [] }
      ],


      "links": [{ "rel": "self", "href": "http://211.144.85.15:8080/baserver/rest/device/v1/myBaView" }, { "rel": "self", "href": "http://211.144.85.15:8080/baserver/rest/device/v1/myBaView24h" }]
   },
        {
           "userId": 1, "deviceSN": "87654321", "addressId": 1, "roomId": 2, "description": "baby room", "type": null, "temperature": [],
           "humidity": [
              { "pk": { "deviceSN": "87654321", "dataTimestamp": "2015-01-05 02:00:00" }, "addressId": 1, "data": 70, "rate": null, "links": [] }
           ],
           "pressure": [
              { "pk": { "deviceSN": "87654321", "dataTimestamp": "2015-01-06 12:12:15" }, "addressId": 1, "data": 123123, "rate": null, "links": [] }
           ],

           "equipments": null, "launchTimestamp": null, "stopTimestamp": null,
           "pm25data": [
              { "pk": { "deviceSN": "87654321", "dataTimestamp": "2015-01-05 00:33:00" }, "addressId": 1, "data": 90, "rate": null, "links": [] }
           ],

           "links": [
              { "rel": "self", "href": "http://211.144.85.15:8080/baserver/rest/device/v1/myBaView" },
              { "rel": "self", "href": "http://211.144.85.15:8080/baserver/rest/device/v1/myBaView24h" }
           ]
        }
   ];
   */
});
