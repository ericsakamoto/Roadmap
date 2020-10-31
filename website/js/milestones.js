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
    var app = angular.module('RoadmapMilestoneApp', []);
    app.controller('RoadmapMilestoneController', function($scope,$http,$location,$window) {
        
        var roadmapId = $location.search().roadmapId;

        if(roadmapId==null) {
            roadmapId = $window.localStorage.getItem("roadmapId");
        } else {
            $window.localStorage.setItem("roadmapId",roadmapId);
        }

        // Buscar roadmap        
        getRoadmap($scope,$http,roadmapId);

        // Buscar milestones
        getMilestones($scope,$http,roadmapId);


        $scope.handleClick = function(id) {
            alert("Sucesso: " + id);
        };

        $scope.inserirMilestone = function(roadmapid) {
            console.log("inserirMilestone")
            $('#criarMilestoneModal').modal('hide');
            inserirMilestone($scope,$http,roadmapid)
        };
    });
    

    function getRoadmap($scope,$http,roadmapId) {
        
        $http({
            url: _config.api.invokeUrl + '/roadmap/' + roadmapId,
            method: "GET",
            headers: {
                Authorization: authToken,
            },
            contentType: 'application/json'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.roadmap = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.error('Erro ao consultar roadmap: ', response.statusText, ', Details: ', response.errorThrown);
            alert('Ocorreu um erro na consulta. Favor tentar novamente.\n');
        });

    }
    
    function getMilestones($scope,$http,roadmapId) {
        
        $http({
            url: _config.api.invokeUrl + '/milestones',
            method: "GET",
            headers: {
                Authorization: authToken,
            },
            contentType: 'application/json',
            params: {
                'roadmapid': roadmapId
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.milestones = response.data;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.error('Erro ao consultar milestones: ', response.statusText, ', Detalhes: ', response.errorThrown);
            alert('Ocorreu um erro na consulta. Favor tentar novamente.\n');
        });

    }    
    
    function inserirMilestone($scope,$http,roadmapid) {
        
        var body = {
            'roadmapId': roadmapid,
            'nome': $scope.milestone.nome,
            'descricao': $scope.milestone.descricao
        }
        
        $http({
            url: _config.api.invokeUrl + '/milestones',
            method: "POST",
            headers: {
                Authorization: authToken
            },
            contentType: 'application/json',
            data: body
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.milestones.push(response.data);
            alert("Milestone criado com sucesso.");
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.error('Erro ao inserir milestone: ', response.statusText, ', Detalhes: ', response.errorThrown);
            alert('Ocorreu um erro ao inserir o milestone. \n');
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

$(document).ready(function() {
    
    $('#back').click(function() {
        console.log("back clicked");
        window.location = "dashboard.html";
    });        

    $('[data-toggle="popover"]').popover(); 

});


