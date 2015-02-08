var config = {
   "baseUrl": "http://211.144.85.15:8080/baserver/rest/device/v1/",
   "userId": 1,
   "pm25": [{ "description": "优", "max": 10000000, "min": "100" },
   { "description": "良", "max": 100, "min": "80" },
   { "description": "中", "max": 80, "min": "60" },
   { "description": "差", "max": 60, "min": "0" }],
   
    mapFun : function (data) {
      var newData = {
         "userId": data.userId,
         "deviceSN": data.deviceSN,
         "addressId": data.addressId,
         "roomId": data.roomId,
         "description": data.description,
         "type": data.type,
         "dimensions": []
      };

      var temperature = data.temperature;
      if (temperature) {
         temperature.forEach(function (i) {
            i.description = i.data + "度";
         });
         newData.dimensions.push({ "dimensionType": "temperature", datas: temperature });
      }


      var humidity = data.humidity;
      if (humidity) {
         humidity.forEach(function (i) {
            i.description = i.data + "%";
         });
         newData.dimensions.push({ "dimensionType": "humidity", datas: humidity });
      }

      var pressure = data.pressure;
      if (pressure) {
         pressure.forEach(function (i) {
            var num = parseInt(i.data / 100);
            i.description = num + "百帕";
         });
         newData.dimensions.push({ "dimensionType": "pressure", datas: pressure });
      }

      var pm25 = data.pm25data;
      if (pm25) {
         pm25.forEach(function (i) {
            i.description = config.pm25.filter(
               function (rule) {
                  return rule.max > i.data && rule.min <= i.data;

               }
            )[0].description;
         });
         newData.dimensions.push({ "dimensionType": "pm25data", datas: pm25 });
      }
      return newData;
   }
};

//myBaOverview