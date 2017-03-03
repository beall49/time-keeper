let app = angular.module('myApp', [])
    .service('API', function($http){
        let base_api = "api/";
        return {
            getTimeStamp: function(){
                return $http.get(base_api);
            },
            punchIn: function(){
                return $http.post(base_api + "insert");
            },
            punchInWithTimeStamp: function(date_time){
                return  $http.post(base_api + "insert-time-stamp/", JSON.stringify({"date_time": date_time}));
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
            let d = new Date(incoming_date);
            d.setTime(d.getTime() + (8 * 60 * 60 * 1000));
            return d.toLocaleDateString()
        }
    });


    