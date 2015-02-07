ko.virtualElements.allowedBindings.jqmTemplate = true;
ko.virtualElements.allowedBindings.jqmRefreshList = true;
ko.bindingHandlers.jqmTemplate = {
    init: ko.bindingHandlers.template.init,
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
        ko.bindingHandlers.template.update(element, valueAccessor,
            allBindingsAccessor, viewModel, context);
        try {
            $(element).listview('refresh');
        } catch (e) {
            //$(element).listview();
        }
    }
};

ko.bindingHandlers.jqmRefreshList = {
    update: function (element, valueAccessor) {

        ko.utils.unwrapObservable(valueAccessor()); //just to create a dependency
        setTimeout(function () { //To make sure the refresh fires after the DOM is updated

            try {
                $(element).listview();
                $(element).listview('refresh');
            } catch (e) {
                //$(element).listview();
            }

        }, 0);
    }
};

