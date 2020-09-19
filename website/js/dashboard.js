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
    
    
    // Angular Application and Controller for Dashboard
    var app = angular.module('RoadmapDashboardApp', []);
    app.controller('RoadmapDashboardController', function($scope,$http,$window,$location) {
        $scope.message= "Dashboard";
        
        getRoadmaps($scope,$http);
        
        $scope.abrirMilestones = function(id) {

            $window.location.href = "milestones.html#?roadmapId=" + id;

        };

        $scope.salvarRoadmap = function() {

            inserirRoadmap($scope,$http)
            
            $('#criarRoadmapModal').modal('hide');
        };

    });
    

    function getRoadmaps($scope,$http) {
        
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
            console.error('Erro ao consultar roadmaps: ', response.statusText, ', Detalhes: ', response.errorThrown);
            alert('Ocorreu um erro na consulta. Favor tentar novamente.\n');
        });

    }
    
    function inserirRoadmap($scope,$http) {
        
        $http({
            url: _config.api.invokeUrl + '/roadmap',
            method: "POST",
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            data: $scope.roadmap
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            alert("Roadmap criado com sucesso.");
            $scope.roadmaps.push(response.data);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.error('Erro ao inserir roadmaps: ', response.statusText, ', Detalhes: ', response.errorThrown);
            alert('Ocorreu um erro na inclusão. Favor tentar novamente.\n');
        });

    }       
    
    // Signout
    $(function onDocReady() {
        $('#signOut').click(function() {
            Roadmap.signOut();
            alert("You have been signed out.");
            window.location = "index.html";
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

    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }

}(jQuery));
