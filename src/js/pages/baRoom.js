(function($, ba){

   $(function () {
      var vm = new ba.models.BaRoomViewModel();
      vm.refresh().then(function() {
         return vm.applyBindings();
      }).then(function(model) {
         model.renderChart();
      });
   });

}($, ba));
