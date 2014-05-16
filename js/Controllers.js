function NavController($scope) {
    $scope.appMessageDisp = true;
//    keySet.resetKey = true;
//    key = 'fdsfeefsfd***ajay4067@gmail.com';
    if (keySet.resetKey) {
        if (key) {
            showHideGame($scope, ['resetDisp'], ['registerDisp', 'loginDisp', 'quoteDisp']);
            $scope.appMessageDisp = true;
            $scope.$parent.titleBarMsg = PASSWORD_RESET;
            $scope.resetPswdObj = {'resetKey': key.split('***')[0], 'email': key.split('***')[1]};
        } else {
            $scope.appMessageDisp = true;
            $scope.$parent.titleBarMsg = PASSWORD_RESET_USED;
            showHideGame($scope, ['loginDisp'], ['registerDisp', 'resetDisp', 'quoteDisp']);
        }

    } else if (keySet.activateUser) {
        if (key === '200') {
            showHideGame($scope, ['loginDisp'], ['registerDisp', 'quoteDisp', 'resetDisp']);
            $scope.appMessageDisp = true;
            $scope.$parent.titleBarMsg = USER_VERIFIED;
        } else if (key === '203') {
            showHideGame($scope, ['loginDisp'], ['registerDisp', 'quoteDisp', 'resetDisp']);
            $scope.appMessageDisp = true;
            $scope.$parent.titleBarMsg = USER_ALREADY_VERIFIED;
        } else {
            showHideGame($scope, ['loginDisp'], ['registerDisp', 'quoteDisp', 'resetDisp']);
            $scope.appMessageDisp = true;
            $scope.$parent.titleBarMsg = USER_VERIFICATION_ERR;
        }
    } else {
        $scope.appMessageDisp = false;
        showHideGame($scope, ['loginDisp'], ['appMessageDisp', 'registerDisp', 'quoteDisp', 'resetDisp']);
    }
    $scope.headerTitle = "Inspirational Quotes";
    $scope.showRegister = function() {
        showHideGame($scope, ['registerDisp'], ['appMessageDisp', 'loginDisp', 'quoteDisp', 'resetDisp']);
        angular.element(document.body).css({'background': '#323a45', 'color': '#fff'});
    };
    $scope.showLogin = function() {
        showHideGame($scope, ['loginDisp'], ['appMessageDisp', 'registerDisp', 'quoteDisp', 'resetDisp']);
        angular.element(document.body).css({'background': '#323a45', 'color': '#fff'});
    };
}

function RegisterController($scope, WebServiceHandler) {
    $scope.register_success = false;
    $scope.registerFormDisp = true;
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
                $scope.$parent.appMessageDisp = true;
                $scope.$parent.titleBarMsg = REGISTER_SUCCESS;
                $scope.captchaError = false;
                $scope.registerFormDisp = false;
                $scope.register_success = true;
            } else {
                $scope.$parent.appMessageDisp = true;
                $scope.$parent.titleBarMsg = REGISTER_FAILURE;
                $scope.success_message = false;
                $scope.captchaError = false;
                $scope.registerFormDisp = false;
                $scope.register_success = true;
            }
            hideLoading();
        }, function(failureReason) {
            if (failureReason.status === 400 && (failureReason.data.message === 'captcha is not valid' || failureReason.data.message === 'Required field(s) recaptcha_response_field is missing or empty')) {
                Recaptcha.reload();
                $scope.captchaError = true;
                $scope.failure_message = false;
                $scope.success_message = false;
            } else {
                $scope.$parent.appMessageDisp = true;
                $scope.$parent.titleBarMsg = REGISTER_FAILURE;
                $scope.success_message = false;
                $scope.captchaError = false;
                $scope.registerFormDisp = false;
                $scope.register_success = true;
            }
            hideLoading();
        });
    };
}

function LoginController($scope, WebServiceHandler, $http) {
    $scope.errorLogin = false;
    $scope.errorActivation = false;
    $scope.loginFormDisp = true;
    $scope.resetSendEmailDisp = false;
    $scope.login = function(user) {
        appMessageDisp = false;
        showLoading();
        WebServiceHandler.login({
            'email': user.emailId,
            'password': pidCrypt.MD5(user.password)
        }).then(function(response) {
            if (response.status === 200) {
                $http.defaults.headers.common['Authorization'] = response.data.api_key;
                $scope.$parent.loginDisp = false;
                $scope.$parent.appMessageDisp = false;
                $scope.quoteDisp = true;
                $scope.loginForm.$setPristine(true);
                $scope.user = resetObjectKeysToEmpty(user);
            } else if (response.status === 202) {
                $scope.$parent.titleBarMsg = ACCOUNT_NOT_ACTIVE;
                $scope.$parent.appMessageDisp = true;
                $scope.loginForm.$setPristine(true);
                $scope.user = resetObjectKeysToEmpty(user);
            }
            hideLoading();
        }, function(data) {
            $scope.$parent.titleBarMsg = LOGIN_FAIL;
            $scope.$parent.appMessageDisp = true;
            $scope.loginForm.$setPristine(true);
            $scope.user = resetObjectKeysToEmpty(user);
            hideLoading();
        });
    };
    $scope.showForgotPswd = function() {
        $scope.$parent.appMessageDisp = false;
        $scope.loginFormDisp = false;
        $scope.resetSendEmailDisp = true;
    };
    $scope.resetSendEmail = function(email) {
        $scope.$parent.appMessageDisp = false;
        showLoading();
        WebServiceHandler.sendReset(email).then(function() {
            $scope.$parent.appMessageDisp = true;
            $scope.$parent.titleBarMsg = RESET_EMAIL_SENT;
            $scope.loginFormDisp = true;
            $scope.resetSendEmailDisp = false;
            $scope.resetSendEmailForm.$setPristine(true);
            $scope.resetEmail = '';
            hideLoading();
        }, function() {
            $scope.$parent.appMessageDisp = true;
            $scope.$parent.titleBarMsg = RESET_EMAIL_SENT;
            $scope.loginFormDisp = true;
            $scope.resetSendEmailDisp = false;
            $scope.resetSendEmailForm.$setPristine(true);
            $scope.resetEmail = '';
            hideLoading();
        });
    };
}
function ResetController($scope, WebServiceHandler) {
    $scope.resetPswd = function(resetPswdObj) {
        showLoading();
        var pswd = resetPswdObj.newPassword;
        resetPswdObj.newPassword = pidCrypt.MD5(pswd);
        WebServiceHandler.resetPswd(resetPswdObj).then(function() {
            $scope.$parent.showLogin();
            $scope.$parent.appMessageDisp = true;
            $scope.$parent.titleBarMsg = PASSWORD_CHANGED;
            hideLoading();
        }, function() {
            $scope.$parent.showLogin();
            $scope.$parent.appMessageDisp = true;
            $scope.$parent.titleBarMsg = PASSWORD_CHANGE_FAIL;
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