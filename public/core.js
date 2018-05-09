var angularCalls = angular.module('angularCalls', ["ngRoute"]);


angularCalls.config(function ($routeProvider) {              // Routing
    $routeProvider

        .when('/', {                            //When main link is " / " use landing page
            templateUrl: 'landing.html',
            controller: 'mainController'
        })

        .when('/ask.html', {                    // Use ask section
            templateUrl: 'ask.html',
            controller: 'AskController'               // and use appropriate controller
        })

        .when('/respond.html', {
            templateUrl: 'respond.html',
            controller: 'RespondController'
        })

        .when('/browse.html', {
            templateUrl: 'browse.html',
            controller: 'BrowseController'
        })

        .otherwise({redirectTo: '/'});
});


angularCalls.controller('mainController', function ($scope) {
    $scope.test1 = " yes ";
});


angularCalls.controller('AskController', function ($scope, $http, $location) {               //Ask section controller
    $scope.addQ = function (data) {                                  //when addQ() triggered

        var questionFromAdd = $scope.addMe;                     // user input
        console.log("Scope - parent " + questionFromAdd);

        $http({                                             // AJAX request to add question
            method: 'POST',
            url: '/api/addQuestions',
            data: {"questionFromAdd": questionFromAdd},
            headers: {'Content-Type': 'application/Json'}
        }).then(function (response) {
            console.log("TESTING THE RESPONSE -------- " + response.data);
            if (response.data == false) {                    //If the question has been added
                $scope.message = questionFromAdd + " added . We will notify you as soon as this questions is answered. ";   //Display meessage
                console.log(response);
                console.log("added");
                setTimeout(function () {
                    window.location.replace("#!/respond.html");                                                             //Redirect after 2 seconds
                }, 2000);
            }
            else {
                $scope.message = questionFromAdd + " already exists, redirecting to browse ... .";
                setTimeout(function () {
                    window.location.replace("#!/browse.html");
                }, 2000);
            }
            // $location.path('/')

        }, function (error) {
            console.log(error);

        });
    }
});


//Respond controller
angularCalls.controller('RespondController', function ($scope, $http, $location) {

    $http({
        method: 'POST',
        url: '/api/getQList',
        headers: {'Content-Type': 'application/Json'}
    }).then(function (response) {

        //$scope.message = response.data[0].question;
        $scope.names = response.data;                                   // Get all questions

        console.log(response);

    }, function (error) {
        console.log(error);
    });

    $scope.respondQ = function (data, answer) {                         //Add answer to question
        var respondAdd = answer;
        var currentQuestion = data;
        console.log("ID : === " + currentQuestion);

        console.log("Controler  " + respondAdd);
        $http({
            method: 'POST',
            url: '/api/addResponse',
            data: {"answerFromAdd": respondAdd, "currentQu": currentQuestion},
            headers: {'Content-Type': 'application/Json'}
        }).then(function (response) {

            $scope.message = " Thank you for your response ...  ";
            setTimeout(function () {
                location.reload();
            }, 2000);
            console.log(response);

        }, function (error) {
            console.log(error);
        });
    }
});


angularCalls.controller('BrowseController', function ($scope, $http, $location) {
    $scope.searchA = function (data) {
        var input = $scope.searchMe;
        console.log("input : " + input);


        $http({                                             //Find answer
            method: 'POST',
            url: '/api/getAnswer',
            data: {"browseSearchInput": input},
            headers: {'Content-Type': 'application/Json'}
        }).then(function (response) {

            console.log(response.data);
            if (response.data[0] == undefined) {                                                // Display appropriate messages
                $scope.question = "Question not found in the database";
                $scope.answer = "";
            }
            else if (response.data[1] == undefined) {
                $scope.question = "";
                $scope.answer = " No answer found in the database";
            }
            else {
                $scope.question = "" + response.data[0];

                $scope.answer = "Answer:" + response.data[1];
            }
            // $location.path('/')

        }, function (error) {
            console.log(error);
        });
    }
});