$(function () {
   var randomScalingFactor = function () { return Math.round(Math.random() * 50); };
   var lineChartData = {
      labels: ["1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM"],
      datasets: [
          {
             label: "My First dataset",
             fillColor: "rgba(220,220,220,0.2)",
             strokeColor: "rgba(220,220,220,1)",
             pointColor: "rgba(220,220,220,1)",
             pointStrokeColor: "#fff",
             pointHighlightFill: "#fff",
             pointHighlightStroke: "rgba(220,220,220,1)",

             data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
          },
          {
             label: "My Second dataset",
             fillColor: "rgba(151,187,205,0.2)",
             strokeColor: "rgba(151,187,205,1)",
             pointColor: "rgba(151,187,205,1)",
             pointStrokeColor: "#fff",
             pointHighlightFill: "#fff",
             pointHighlightStroke: "rgba(151,187,205,1)",
             data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
          }
      ]
   };

   var ctx = document.getElementById("canvas").getContext("2d");
   window.myLine = new Chart(ctx).Line(lineChartData, {
      responsive: true,
      showScale: true,
      scaleShowGridLins: false,
   });

   var getParameter = function (name) {
      var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
   };

   var key =
      {
         "roomId": getParameter("roomId"),
         "deviceSN": getParameter("deviceSN"),
         "addressId": getParameter("addressId"),
         "userId": config.userId
      };
   var vm = {
      "description": ko.observable(),
      "dimensions": ko.observableArray(),
      "equipments": ko.observableArray(),
      "viewEquipment": function (data) {
         location.href = "equipment.html?" + $.param({ "equipmentId": data.equipmentId });
      }
   };

   vm.refresh = function () {

      var equipments = [];
      $.ajax({
         type: 'POST',
         url: config.baseUrl + "myBaView",
         contentType: "application/json",
         data: JSON.stringify(key),
         dataType: "json"
      }).then(function (result) {
         var item = result.map(config.mapFun)[0];
         vm.description(item.description);
         vm.dimensions.removeAll();
         vm.dimensions.push.apply(vm.dimensions, item.dimensions);
         equipments = result[0].equipments;
         var temp = [
            {
               "userId": 1,
               "deviceSN": "12345678",
               "addressId": 1,
               "roomId": 1,
               "description": "bed room",
               "type": "1",
               "temperature": [{ "pk": { "deviceSN": "12345678", "dataTimestamp": "2015-02-01 09:14:29" }, "addressId": 1, "data": 14, "rate": null, "links": [] }],
               "humidity": [{ "pk": { "deviceSN": "12345678", "dataTimestamp": "2015-02-01 20:28:36" }, "addressId": 1, "data": 80, "rate": null, "links": [] }],
               "pressure": [{ "pk": { "deviceSN": "12345678", "dataTimestamp": "2015-01-06 10:03:12" }, "addressId": 1, "data": 101200, "rate": null, "links": [] }],
               "pm25data": [{ "pk": { "deviceSN": "12345678", "dataTimestamp": "2015-02-01 10:03:57" }, "addressId": 1, "data": 101, "rate": null, "links": [] }],

               "equipments": [
                  {
                     "equipmentId": 1, "deviceSN": "12345678", "type": "2", "brandCode": "GREEY", "controlType": "1", "energyEfficiency": null,
                     "efficiency": null, "conditionerType": null, "updateTimestamp": null, "roomId": 1, "deleteFlag": "N", "version": 1, "links": []
                  },
                  {
                     "equipmentId": 2, "deviceSN": "12345678", "type": "2", "brandCode": "PHILPS", "controlType": "2", "energyEfficiency": null,
                     "efficiency": null, "conditionerType": null, "updateTimestamp": null, "roomId": 1, "deleteFlag": "N", "version": null, "links": []
                  }
               ],
               "launchTimestamp": null,
               "stopTimestamp": null,
               "links": [{ "rel": "self", "href": "http://211.144.85.15:8080/baserver/rest/device/v1/myEqView" },
                        { "rel": "self", "href": "http://211.144.85.15:8080/baserver/rest/device/v1/myEqView24h" },
                        { "rel": "self", "href": "http://211.144.85.15:8080/baserver/rest/device/v1/myEqView" },
                        { "rel": "self", "href": "http://211.144.85.15:8080/baserver/rest/device/v1/myEqView24h" }]
            }
         ];
      }).then(function () {

         var deferreds = equipments.map(function (item) {
            return $.ajax({
               type: 'POST',
               url: config.baseUrl + "myEqView",
               contentType: "application/json",
               data: JSON.stringify({
                  "userId": config.userId,
                  "equipmentId": item.equipmentId
               }),
               dataType: "json"
            });
         });

         $.when.apply($, deferreds).done(function () {
            Array.prototype.forEach.apply(arguments, [function (item) {
               var result = item[0];
               var equipment = equipments.filter(function (eq) {
                  return eq.equipmentId == result.equipment.equipmentId;
               })[0];
               equipment.brandCode = result.equipment.brandCode;
               equipment.operations = result.operations;
            }]);

            vm.equipments.removeAll();
            vm.equipments.push.apply(vm.equipments, equipments);
            console.log(vm.equipments());
         });
      });

   };


   ko.applyBindings(vm);
   vm.refresh();
});
