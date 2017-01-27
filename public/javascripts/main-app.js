var app = angular.module('myApp', [])
    .run(function($rootScope){
        $rootScope.Toggle = function(){
            $("#wrapper").toggleClass("toggled");
        };
    })
    .service('API', function($http){
        var base_api = "api/";
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
                var parsed = $parse(attr.ngBindHtml);

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



    