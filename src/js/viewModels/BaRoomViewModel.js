/**
 * User: sean
 * Date: 2/8/2015
 * Time: 10:46 PM
 * To change this template use File | Settings | File Templates.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'ko'], factory);
    } else if (typeof exports === 'object') {
        // CMD
        module.exports = factory(require('jquery'), require('ko'));
    } else {
        // Browser globals (root is window)
        root.ba = root.ba || {};
        root.ba.models = root.ba.models || {};
        root.ba.models.BaRoomViewModel = factory(root.jQuery, root.ko);
    }
}(this, function ($, ko) {

    function ViewModel() {
        this.description = ko.observable();
        this.dimensions= ko.observableArray();
        this.equipments= ko.observableArray();
    }

    ViewModel.prototype.getStatistics = getMockData;

    ViewModel.prototype.viewEquipment = function(data) {
        location.href = "equipment.html?" + $.param({ "equipmentId": data.equipmentId });
    };
    ViewModel.prototype.refresh = function () {

        var key = {
            "roomId": getParameter("roomId"),
            "deviceSN": getParameter("deviceSN"),
            "addressId": getParameter("addressId"),
            "userId": config.userId
        };
        var equipments = [];
        var self = this;
        return $.ajax({
            type: 'POST',
            url: config.baseUrl + "myBaView",
            contentType: "application/json",
            data: JSON.stringify(key),
            dataType: "json"
        }).then(function (result) {
            var item = result.map(config.mapFun)[0];
            self.description(item.description);
            self.dimensions.removeAll();
            self.dimensions(item.dimensions);
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

            return $.when.apply($, deferreds).done(function () {
                Array.prototype.forEach.call(arguments, function (item) {
                    var result = item[0];
                    var equipment = equipments.filter(function (eq) {
                        return eq.equipmentId == result.equipment.equipmentId;
                    })[0];
                    equipment.brandCode = result.equipment.brandCode;
                    equipment.operations = result.operations;
                });

                self.equipments.removeAll();
                self.equipments(equipments);
                console.log(self.equipments());
            });
        });

    };

    ViewModel.prototype.renderChart = function() {
        var ctx = document.querySelector("#canvas").getContext("2d");
        new Chart(ctx).Line(this.getStatistics(), {
            responsive: true,
            showScale: true,
            scaleShowGridLins: false
        });
    };

    ViewModel.prototype.applyBindings = function() {
        var dfd = new $.Deferred();
        var self = this;
        setTimeout(function() {
            ko.applyBindings(self);
            dfd.resolve(self);
        },0);
        return dfd.promise();
    };

    return ViewModel;

////////////////////////////////////////////////////////////////////////////////////////////////////
//private:

    function getMockData() {
        var randomScalingFactor = function () { return Math.round(Math.random() * 50); };
        return {
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
    }

    function getParameter(name) {
        var match = new RegExp('[?&]' + name + '=([^&]*)').exec(this.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
}));

