app.controller('TimeCardController', function($scope, $interval, $http, $sce, API){
    $scope.Status     = "Clock In";
    $scope.HourStatus = "Hour Lunch";
    $scope.HalfStatus   = "Half Hour Lunch";
    $scope.colorState   = "primary";
    $scope.TimeCard     = [];

    toggleSideBar();
    getTimeCard();

    function getTimeCard(){
        $scope.Increment = true;
        API.getTimeStamp().success(function(response){
            //console.log(response);
            $scope.TimeCard = response;
        });
    }

    $scope.PanelText = function(incoming){
        let in_   = "In: " + incoming.clock_in;
        let _out  = (incoming.clock_out ? " Out: " + incoming.clock_out : "");
        let hours = incoming.hours ? "Hours: " + incoming.hours  + `<p></p>`: "";
        let lunch = incoming.lunch > 0 ? "Lunch: " + incoming.lunch + `<p></p>` : "";
        return $sce.trustAsHtml([`<h3>`, in_, _out, `<p></p>`, lunch, hours, `</h3>`].join(""));
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
});