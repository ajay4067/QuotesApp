function NavController($scope) {
    $scope.registerDisplay = false;
    $scope.loginDisplay = true;
    $scope.quoteDisplay = false;
    $scope.headerDisplay = false;

    $scope.showRegister = function() {
        $scope.registerDisplay = true;
        $scope.loginDisplay = false;
        $scope.quoteDisplay = false;
        angular.element(document.body).css('background', '#fff');
    };
    $scope.showLogin = function() {
        $scope.registerDisplay = false;
        $scope.loginDisplay = true;
        $scope.quoteDisplay = false;
    };
}

function HeadController($scope) {
    $scope.appTitle = "Quotes";
    $scope.appDescription = "Quotes that inspire";
}

function RegisterController($scope, WebServiceHandler) {
    $scope.failure_message = false;
    $scope.success_message = false;
    $scope.emailIdUnique = false;
    $scope.emailIdStatusReceived = '';

    Recaptcha.create("6LcyZfMSAAAAAHxXTKjVqC2G6qike2rUDjQhj5rC", "captcha-container", {
        theme: "white",
        callback: Recaptcha.focus_response_field
    });

    $scope.register = function(user) {
        showLoading();
        WebServiceHandler.register({
            'name': user.name,
            'email': user.emailId,
            'password': pidCrypt.MD5(user.password),
            'recaptcha_challenge_field': Recaptcha.get_challenge(),
            'recaptcha_response_field': Recaptcha.get_response()
        }).then(function(response) {
            if (response.status === 201) {
                $scope.success_message = true;
                $scope.captchaError = false;
                $scope.failure_message = false;
//                $('form[name=registerForm]').slideUp();
            } else {
                $scope.failure_message = true;
                $scope.success_message = false;
                $scope.captchaError = false;
//                $('form[name=registerForm]').slideUp();
            }
            hideLoading();
        }, function(failureReason) {
            if (failureReason.status === 400 && (failureReason.message === 'captcha is not valid' || failureReason.message === 'Required field(s) recaptcha_response_field is missing or empty')) {
                Recaptcha.reload();
                $scope.captchaError = true;
                $scope.failure_message = false;
                $scope.success_message = false;
            } else {
                $scope.failure_message = true;
                $scope.success_message = false;
                $scope.captchaError = false;
//                $('form[name=registerForm]').slideUp();
            }
            hideLoading();
        });
    };
}

function LoginController($scope, WebServiceHandler, $http) {
    $scope.errorLogin = false;
    $scope.errorActivation = false;
    $scope.login = function(user) {
        showLoading();
        WebServiceHandler.login({
            'email': user.emailId,
            'password': pidCrypt.MD5(user.password)
        }).then(function(data) {
            if (data.status === 200) {
                $http.defaults.headers.common['Authorization'] = data.message.api_key;
//                $scope.loginDisplay = false;
//                $scope.quoteDisplay = true;
                $scope.loginForm.$setPristine(true);
                $scope.user = resetObjectKeysToEmpty(user);
            } else if (data.status === 202) {
                $scope.errorActivation = true;
                $scope.errorLogin = false;
                $scope.loginForm.$setPristine(true);
                $scope.user = resetObjectKeysToEmpty(user);
            }
            hideLoading();
        }, function(data) {
            $scope.errorLogin = true;
            $scope.errorActivation = false;
            $scope.loginForm.$setPristine(true);
            $scope.user = resetObjectKeysToEmpty(user);
            hideLoading();
        });
    };
}

function QuoteAppController($scope, WebServiceHandler, Data) {
    $scope.getWritersNCtgs = function() {
        WebServiceHandler.getWritersNCtgs(Data.api_key).then(function(response) {
            $scope.quoteData = response;
            hideLoading();
        }, function(failureReason) {
            console.log(JSON.parse(failureReason));
            hideLoading();
        });
    };

    $scope.createWrtNctg = function(wrtNctg) {
        var data = new FormData();
        data.append('name', wrtNctg.name);
        data.append('description', wrtNctg.description);
        data.append('imagefile', $("#imagefile").get(0).files[0]);
        WebServiceHandler.createWritersNCtgs(Data.api_key, data).then(function(response) {
            $scope.quoteData = response;
            hideLoading();
        }, function(failureReason) {
            console.log(JSON.parse(failureReason));
            hideLoading();
        });
    };

    $scope.updateWriterNCtg = function(wrtNctg) {
        var data = {};
        data['name'] = wrtNctg.name;
        data['description'] = wrtNctg.description;
        var id = 8;

        WebServiceHandler.updateWriterNCtg(Data.api_key, data, id).then(function(response) {
            $scope.quoteData = response;
            hideLoading();
        }, function(failureReason) {
            console.log(JSON.parse(failureReason));
            hideLoading();
        });
    };

    $scope.deleteWriter = function(idToDelete) {
        WebServiceHandler.deleteWritersNCtgs(Data.api_key, idToDelete).then(function(response) {
            $scope.quoteData = response;
            hideLoading();
        }, function(failureReason) {
            console.log(JSON.parse(failureReason));
            hideLoading();
        });
    };

    $scope.getQuotes = function(writerId) {
        WebServiceHandler.getQuotes(Data.api_key, writerId).then(function(response) {
            $scope.quoteData = response;
            hideLoading();
        }, function(failureReason) {
            console.log(JSON.parse(failureReason));
            hideLoading();
        });
    };

    $scope.createNewQuote = function(newQuote) {
        WebServiceHandler.createQuote(Data.api_key, newQuote).then(function(response) {
            $scope.quoteData = response;
            hideLoading();
        }, function(failureReason) {
            console.log(JSON.parse(failureReason));
            hideLoading();
        });
    };

    $scope.updateQuote = function(newQuote) {
        var quoteId = 7;
        WebServiceHandler.updateQuote(Data.api_key, newQuote, quoteId).then(function(response) {
            $scope.quoteData = response;
            hideLoading();
        }, function(failureReason) {
            console.log(JSON.parse(failureReason));
            hideLoading();
        });
    };

    $scope.deleteQuote = function() {
        var idToDelete = 6;
        WebServiceHandler.deleteQuote(Data.api_key, idToDelete).then(function(response) {
            $scope.quoteData = response;
            hideLoading();
        }, function(failureReason) {
            console.log(JSON.parse(failureReason));
            hideLoading();
        });
    };

    $scope.getAllQuotesData = function() {
        WebServiceHandler.getAllQuotesData(Data.api_key).then(function(response) {
            $scope.quoteData = response;
            hideLoading();
        }, function(failureReason) {
            console.log(JSON.parse(failureReason));
            hideLoading();
        });
    };

}