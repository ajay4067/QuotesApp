myApp.controller('ParentController', function($scope) {
    $scope.appMessageDisp = true;
    if (keySet.resetKey) {
        if (key) {
            showHideGame($scope, ['resetSendEmailDisp'], ['loginFormDisp']);
            $scope.appMessageDisp = true;
            $scope.$parent.titleBarMsg = PASSWORD_RESET;
            $scope.resetPswdObj = {'resetKey': key.split('***')[0], 'email': key.split('***')[1]};
        } else {
            $scope.appMessageDisp = true;
            $scope.$parent.titleBarMsg = PASSWORD_RESET_USED;
            showHideGame($scope, ['loginDisp'], []);
        }

    } else if (keySet.activateUser) {
        if (key === '200') {
            $scope.appMessageDisp = true;
            $scope.$parent.titleBarMsg = USER_VERIFIED;
        } else if (key === '203') {
            $scope.appMessageDisp = true;
            $scope.$parent.titleBarMsg = USER_ALREADY_VERIFIED;
        } else {
            $scope.appMessageDisp = true;
            $scope.$parent.titleBarMsg = USER_VERIFICATION_ERR;
        }
    } else {
        $scope.appMessageDisp = false;
    }
    $scope.headerTitle = "Inspirational Quotes";
});

myApp.controller('RegisterController', function($scope, WebServiceHandler) {
    $scope.appMessageDisp = false;
    $scope.singleQuote = '“There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle.”';
    $scope.singleQuoteAuthor = '― Albert Einstein';
    $scope.register_validation_name = REGISTER_VALIDATION_NAME;
    $scope.register_validation_email = REGISTER_VALIDATION_EMAIL;
    $scope.register_validation_password = REGISTER_VALIDATION_PASSWORD;
    $scope.register_validation_captcha = REGISTER_VALIDATION_CAPTCHA;
    $scope.register_login = REGISTER_LOGIN;
    $scope.register_success = false;
    $scope.emailIdUnique = false;
    $scope.registerFormDisp = true;
    $scope.emailIdStatusReceived = '';

    if (typeof Recaptcha === 'undefined') {
        var captcha_script = document.createElement('script');
        captcha_script.setAttribute('src', 'http://www.google.com/recaptcha/api/js/recaptcha_ajax.js');
        document.head.appendChild(captcha_script);
        captcha_script.onload = function() {
            Recaptcha.create("6LcyZfMSAAAAAHxXTKjVqC2G6qike2rUDjQhj5rC", "captcha-container", {
                theme: "white",
                callback: Recaptcha.focus_response_field
            });
        };
    } else {
        Recaptcha.create("6LcyZfMSAAAAAHxXTKjVqC2G6qike2rUDjQhj5rC", "captcha-container", {
            theme: "white",
            callback: Recaptcha.focus_response_field
        });
    }

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
                $scope.appMessageDisp = true;
                $scope.appMessage = REGISTER_SUCCESS;
                $scope.captchaError = false;
                $scope.registerFormDisp = false;
                $scope.register_success = true;
            } else {
                $scope.appMessageDisp = true;
                $scope.appMessage = REGISTER_FAILURE;
                $scope.captchaError = false;
                $scope.registerFormDisp = false;
                $scope.register_success = true;
            }
            hideLoading();
        }, function(failureReason) {
            if (failureReason.status === 400 && (failureReason.data.message === 'captcha is not valid' || failureReason.data.message === 'Required field(s) recaptcha_response_field is missing or empty')) {
                Recaptcha.reload();
                $scope.captchaError = true;
            } else {
                $scope.$parent.appMessageDisp = true;
                $scope.$parent.titleBarMsg = REGISTER_FAILURE;
                $scope.captchaError = false;
                $scope.registerFormDisp = true;
                $scope.loginForm.$setPristine(true);
                $scope.user = resetObjectKeysToEmpty(user);
            }
            hideLoading();
        });
    };
});

myApp.controller('LoginController', function($scope, WebServiceHandler, $http) {
    $scope.loginFormDisp = true;
    $scope.resetSendEmailDisp = false;
    $scope.headerTitle = "Inspirational Quotes";
    $scope.singleQuote = '“There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle.”';
    $scope.singleQuoteAuthor = '― Albert Einstein';
    $scope.login = function(user) {
        appMessageDisp = false;
        showLoading();
        WebServiceHandler.login({
            'email': user.emailId,
            'password': pidCrypt.MD5(user.password)
        }).then(function(response) {
            if (response.status === 200) {
                $http.defaults.headers.common['Authorization'] = response.data.api_key;
                //present Logged in page
            } else if (response.status === 202) {
                $scope.appMessage = ACCOUNT_NOT_ACTIVE;
                $scope.appMessageDisp = true;
                $scope.loginForm.$setPristine(true);
                $scope.user = resetObjectKeysToEmpty(user);
            }
            hideLoading();
        }, function() {
            $scope.appMessage = LOGIN_FAIL;
            $scope.appMessageDisp = true;
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
            $scope.appMessageDisp = true;
            $scope.appMessage = RESET_EMAIL_SENT;
            $scope.loginFormDisp = true;
            $scope.resetSendEmailDisp = false;
            $scope.resetSendEmailForm.$setPristine(true);
            $scope.resetEmail = '';
            hideLoading();
        }, function() {
            $scope.appMessageDisp = true;
            $scope.appMessage = RESET_EMAIL_SENT;
            $scope.loginFormDisp = true;
            $scope.resetSendEmailDisp = false;
            $scope.resetSendEmailForm.$setPristine(true);
            $scope.resetEmail = '';
            hideLoading();
        });
    };

    $scope.showRegisterTemplate = function() {
        var captcha_script = document.createElement('script');
        captcha_script.setAttribute('src', 'http://www.google.com/recaptcha/api/js/recaptcha_ajax.js');
        document.head.appendChild(captcha_script);
        window.location.hash = '#register';
    };
});
myApp.controller('ResetController', function($scope, WebServiceHandler) {
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
});
myApp.controller('QuoteAppController', function($scope, WebServiceHandler, Data) {
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

});