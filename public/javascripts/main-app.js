let app = angular.module('myApp', [])
    .run(function($rootScope){
        $rootScope.Toggle = function(){
            $("#wrapper").toggleClass("toggled");
        };
    })
    .service('API', function($http){
        let base_api = "api/";
        return {
            getTimeStamp: function(){
                return $http.get(base_api);
            },
            punchIn: function(){
                return $http.post(base_api + "insert");
            },
            setLunch: function(lunch){
                return $http.post(base_api + "lunch", JSON.stringify({"lunch": lunch}));
            }
        };
    })
    .directive('compileTemplate', function($compile, $parse){
        return {
            link: function(scope, element, attr){
                let parsed = $parse(attr.ngBindHtml);

                function getStringValue(){
                    return (parsed(scope) || '').toString();
                }

                //Recompile if the template changes
                scope.$watch(getStringValue, function(){
                    $compile(element, null, -9999)(scope);  //The -9999 makes it skip directives so that we do not recompile ourselves
                });
            }
        }
    })

    .filter("cleanDate", function(){
        return function(incoming_date){
            return new Date(incoming_date).toLocaleDateString();
        }
    });

// var earl = `${host}/api/logs-date-time?type=${type}&start=${time_value.startDateInt}` +
//     `&end=${time_value.endDateInt}&status=${status}&topvalues=${top_values}`;

    