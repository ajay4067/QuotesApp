var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);
// configure our routes
myApp.config(function($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: 'login.php',
                controller: 'LoginController'
            })
            .when('/register', {
                templateUrl: 'register.php',
                controller: 'RegisterController'
            });
});
myApp.directive('checkSplChars', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(password) {
                if (!password.match(/[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) {
                    ctrl.$setValidity('checkSplChars', true);
                    return password;
                } else {
                    ctrl.$setValidity('checkSplChars', false);
                    return password;
                }
            });
        }
    };
});
myApp.directive('uniqueEmail', function($http) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            var ctrlCache = ctrl;
            element.on('focus', function() {
                scope.$apply(function() {
                    scope.emailIdUnique = false;
                    scope.emailIdStatusReceived = '';
                });
            });
            element.on('focusout', function() {
                var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
                if (!EMAIL_REGEXP.test(element.val())) {
                    return;
                }
                $http({
                    method: "GET",
                    url: SERVICE_ROOT + 'userAvailable/' + element.val(),
                    crossDomain: true
                }).success(function(data, status, headers, config) {
                    scope.emailIdUnique = data.status;
                    scope.emailIdStatusReceived = data.message;
                }).error(function(data, status, headers, config) {
                    scope.emailIdUnique = data.status;
                    scope.emailIdStatusReceived = data.message;
                });
            });
            element.on('dblclick', function(evt) {
            });
            element.on('mousedown', function() {
            });
            element.on('click', function() {
            });
        }
    };
});

myApp.directive('checkStrongPswd', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (!isWeakPassword(viewValue)) {
                    ctrl.$setValidity('strongPswd', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('strongPswd', false);
                    return viewValue;
                }
            });
        }
    };
});

function showLoading() {
    var bodyElm = document.getElementsByTagName('body')[0];
    var bodyWidth = bodyElm.clientWidth;
    var bodyHeight = bodyElm.clientHeight;
    var progressDiv = document.createElement('div');
    progressDiv.id = 'progress_div';
    progressDiv.className = 'ws-in-progress';
    var progressDivChild = document.createElement('span');
    progressDivChild.id = 'progress_div_child';
    progressDivChild.className = 'ajax-load';
    progressDivChild.innerHTML = 'Please Wait';
    progressDiv.appendChild(progressDivChild);
    bodyElm.appendChild(progressDiv);
    angular.element(document.getElementById('progress_div')).css(
            {'height': bodyHeight + 'px', 'width': bodyWidth + 'px'});
    var ajaxLoader = document.getElementById('progress_div_child');
    var loaderStyle = {
        'top': (bodyHeight / 2) - ajaxLoader.clientHeight + 'px',
        'left': (bodyWidth / 2) - ajaxLoader.clientWidth / 2 + 'px'
    };
    angular.element(ajaxLoader).css(loaderStyle);
}

function hideLoading() {
    angular.element(document.getElementById('progress_div')).remove();
}
function isWeakPassword(password) {
    var desc = ['Very Weak', 'Weak', 'Better', 'Medium', 'Strong', 'Strongest'];
    var score = 0;
    if (typeof password == 'undefined')
        return false;
    if (password.length > 5)
        score++;
    if ((password.match(/[a-z]/)) && (password.match(/[A-Z]/)))
        score++;
    if (password.match(/\d+/))
        score++;
    if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/))
        score++;
    if (password.length > 12)
        score++;
    return (score > 3) ? false : true;
}
function showHideGame($scope, showArray, hideArray) {
    for (var n = 0; n < showArray.length; n++) {
        $scope[showArray[n]] = true;
    }
    for (var n = 0; n < hideArray.length; n++) {
        $scope[hideArray[n]] = false;
    }
}
function resetObjectKeysToEmpty(obj) {
    _.each(_.keys(obj), function(key) {
        obj[key] = '';
    });
    return obj;
}
function getStringData(obj) {
    var str = '';
    _.each(_.keys(obj), function(key) {
        str = str + key + '=' + obj[key] + '&';
    });
    return str;
}