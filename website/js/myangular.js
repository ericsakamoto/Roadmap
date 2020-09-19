/*global Roadmap _config*/
/*global angular */

var Roadmap = window.Roadmap || {};

(function roadmapScopeWrapper($) {
    // Authentication validation
    var authToken;
    Roadmap.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });
    
    // Angular App and Controller
    var app = angular.module('RoadmapDashboardApp', []);
    app.controller('RoadmapDashboardController', function($scope,$http) {
        $scope.message= "###";
        getRoadmaps2($scope,$http)
    });
    

    function getRoadmaps2($scope,$http) {
        
        $http({
            url: _config.api.invokeUrl + '/roadmap',
            method: "GET",
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.roadmaps = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.error = response.statusText;
        });

    }


    function getRoadmaps() {
        $.ajax({
            method: 'GET',
            url: _config.api.invokeUrl + '/roadmap',
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error getting roadmaps: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when getting your roadmaps:\n' + jqXHR.responseText);
            }
        });
    }

    function completeRequest(result) {
        console.log('Response received from API: ', result);
        app.controller('RoadmapDashboardController', function($scope) {
            $scope.roadmaps= result;
        });
    }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#request').click(handleRequestClick);
        $('#signOut').click(function() {
            Roadmap.signOut();
            alert("You have been signed out.");
            window.location = "signin.html";
        });

        Roadmap.authToken.then(function updateAuthMessage(token) {
            if (token) {
                displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                $('.authToken').text(token);
            }
        });

        if (!_config.api.invokeUrl) {
            $('#noApiMessage').show();
        }
    });

    function handleRequestClick(event) {
        event.preventDefault();
        getRoadmaps();
    }

    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }

}(jQuery));
