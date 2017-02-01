app.controller('TimeCardController', function($scope, $interval, $http, $sce, API){
    $scope.Status     = "Clock In";
    $scope.HourStatus = "Hour Lunch";
    $scope.HalfStatus = "Half Hour Lunch";
    $scope.colorState = "primary";
    $scope.Increment  = true;
    $scope.Counter    = 0;
    $scope.TimeCard   = [];

    toggleSideBar();
    getTimeCard();

    function getTimeCard(){
        $scope.Increment = true;
        $scope.Counter   = 0;

        API.getTimeStamp().success(function(response){
            console.log(response);
            $scope.TimeCard = response;
        });
    }

    $scope.PanelText = function(incoming){
        let hours = incoming.hours ? "Hours: " + incoming.hours + `<p></p>`: "";
        let in_ = "In: " + incoming.clock_in;
        let _out = (incoming.clock_out ? " Out: " + incoming.clock_out : "");
        return $sce.trustAsHtml(`<h3>` + hours +  in_  + _out + `</h3>`);
    };


    $scope.buttonSubmit = function(){
        API.punchIn().success(function(){
            $scope.Status = "New Clock Event captured";
            getTimeCard();
        });
    };

    $scope.btnHour = function(){
        API.setLunch("1.0").success(function(){
            $scope.HourStatus = "Hour Lunch Event captured";
            getTimeCard();
        });
    };

    $scope.btnHalf = function(){
        API.setLunch("0.5").success(function(){
            $scope.HalfStatus = "Half Hour Lunch Event captured";
            getTimeCard();
        });
    };

    function toggleSideBar(){
        let screenWidth = $(window).width();
        if (screenWidth < 500) {
            $("#wrapper").toggleClass("toggled");
        }
    }

    $scope.showHide = function(ndx){
        if ($scope.Increment == false) return;

        let _count      = $scope.Counter;
        let entryNumber = (new Date().getDay() == 1) ? 2 : 1;

        if (_count > entryNumber) {
            $scope.Increment = false;
            $scope.apply;
        } else {
            $scope.Counter = ($scope.TimeCard[ndx].day_name == 'Monday') ? _count + 1 : _count;
        }
    };
});