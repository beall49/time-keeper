app.controller('TimeCardController', function($scope, $filter, $sce, API){
    $scope.Status = {
        punch: "Clock In",
        half: "Half Hour Lunch",
        full: "Hour Lunch",
        title: "TimeCard"
    };

    $scope.TimeCard   = [];
    $scope.TimeStamps = {
        date: new Date(new Date().toLocaleString())
    };

    getTimeCard();

    function getTimeCard(){
        API.getTimeStamp()
            .then(function(response){
                $scope.TimeCard = response.data;
            })
            .catch(function(response){
                console.log(response);
            });
    }

    $scope.insertTimeStamp = function(){
        API.punchInWithTimeStamp($scope.TimeStamps.date)
            .then(function(){
                getTimeCard();
            })
    };

    $scope.buttonSubmit = function(){
        API.punchIn()
            .then(function(){
                $scope.Status.punch = "New Clock Event captured";
                getTimeCard();
            });
    };

    $scope.btnHour = function(){
        API.setLunch("1.0")
            .success(function(){
                $scope.Status.full = "Hour Lunch Event captured";
                getTimeCard();
            });
    };

    $scope.btnHalf = function(){
        API.setLunch("0.5")
            .then(function(){
                $scope.Status.half = "Half Hour Lunch Event captured";
                getTimeCard();
            });
    };

    //this is for small screens
    $scope.PanelText = function(incoming){
        let in_   = "In: " + incoming.clock_in;
        let _out  = (incoming.clock_out ? " Out: " + incoming.clock_out : "");
        let hours = incoming.hours ? "Hours: " + incoming.hours + `<p></p>` : "";
        let lunch = incoming.lunch > 0 ? "Lunch: " + incoming.lunch + `<p></p>` : "";
        return $sce.trustAsHtml([`<h3>`, in_, _out, `<p></p>`, lunch, hours, `</h3>`].join(""));
    };
});