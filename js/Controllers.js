myApp.controller('ParentController', function($scope, $location) {
    $scope.headerTitle = "Inspirational Quotes";
    $scope.singleQuote = '“There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle.”';
    $scope.singleQuoteAuthor = '― Albert Einstein';

    if (!keySet.notSet) {
        $location.url('/redirect');
    } else {
        resetActivationKeys();
    }
});

myApp.controller('RegisterController', function($scope, WebServiceHandler) {
    hideAppMessage($scope);
    showHideGame($scope, ['registerFormDisp'], ['appMessageDisp', 'register_success', 'emailIdUnique']);

    $scope.register_validation_name = REGISTER_VALIDATION_NAME;
    $scope.register_validation_email = REGISTER_VALIDATION_EMAIL;
    $scope.register_validation_password = REGISTER_VALIDATION_PASSWORD;
    $scope.register_validation_captcha = REGISTER_VALIDATION_CAPTCHA;
    $scope.register_login = REGISTER_LOGIN;
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
        hideAppMessage($scope);
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.register({
            'name': user.name,
            'email': user.emailId,
            'password': pidCrypt.MD5(user.password),
            'recaptcha_challenge_field': Recaptcha.get_challenge(),
            'recaptcha_response_field': Recaptcha.get_response()
        }).then(function(response) {
            if (response.status === 201) {
                showAppMessage($scope, REGISTER_SUCCESS, true);
                showHideGame($scope, ['register_success'], ['captchaError', 'registerFormDisp']);
            } else {
                showAppMessage($scope, REGISTER_FAILURE, false);
                showHideGame($scope, ['register_success'], ['captchaError', 'registerFormDisp']);
            }
            hideLoading();
        }, function(failureReason) {
            if (failureReason.status === 400 && (failureReason.data.message === 'captcha is not valid' || failureReason.data.message === 'Required field(s) recaptcha_response_field is missing or empty')) {
                Recaptcha.reload();
                $scope.captchaError = true;
            } else {
                showAppMessage($scope, REGISTER_FAILURE, false);
                showHideGame($scope, ['registerFormDisp'], ['captchaError']);
                $scope.loginForm.$setPristine(true);
                $scope.user = resetObjectKeysToEmpty(user);
            }
            hideLoading();
        });
    };
});

myApp.controller('LoginController', function($scope, WebServiceHandler, $http, $location) {

    hideAppMessage($scope);
    showHideGame($scope, ['loginFormDisp'], ['resetSendEmailDisp']);

    $scope.login = function(user) {
        hideAppMessage($scope);
        var emailId = user.emailId;
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.login({
            'email': user.emailId,
            'password': pidCrypt.MD5(user.password)
        }).then(function(response) {
            if (response.status === 200) {
                $http.defaults.headers.common['Authorization'] = response.data.api_key;
                $location.url('/category');
                //present Logged in page
            } else if (response.status === 202) {
                showAppMessage($scope, ACCOUNT_NOT_ACTIVE, false);
                $scope.loginForm.$setPristine(true);
                $scope.user = resetObjectKeysToEmpty(user);
                $scope.resendVerifyInviteDisp = true;
                $scope.resetEmailId = emailId;
            }
            hideLoading();
        }, function() {
            showAppMessage($scope, LOGIN_FAIL, false);
            $scope.loginForm.$setPristine(true);
            $scope.user = resetObjectKeysToEmpty(user);
            hideLoading();
        });
    };

    $scope.showForgotPswd = function() {
        hideAppMessage($scope);
        showHideGame($scope, ['resetSendEmailDisp'], ['appMessageDisp', 'loginFormDisp']);
    };

    $scope.resetSendEmail = function(email) {
        hideAppMessage($scope);
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.sendReset(email).then(function() {
            showAppMessage($scope, RESET_EMAIL_SENT, true);
            showHideGame($scope, ['loginFormDisp'], ['resetSendEmailDisp']);
            $scope.resetSendEmailForm.$setPristine(true);
            $scope.resetEmail = '';
            hideLoading();
        }, function() {
            showAppMessage($scope, RESET_EMAIL_SENT, true);
            showHideGame($scope, ['loginFormDisp'], ['resetSendEmailDisp']);
            $scope.resetSendEmailForm.$setPristine(true);
            $scope.resetEmail = '';
            hideLoading();
        });
    };

    $scope.resendVerifyInvite = function() {
        hideAppMessage($scope);
        var email = $scope.resetEmailId;
        showLoading($scope, [], ['appMessageDisp']);
        WebServiceHandler.resendVerifyInvite(email).then(function(response) {
            console.log(response);
            showAppMessage($scope, EMAIL_VERIFY_SENT, true);
            showHideGame($scope, ['resendVerifyInviteResponseDisp'], ['resendVerifyInviteDisp']);
            hideLoading();
        }, function(response) {
            console.log(response);
            showAppMessage($scope, EMAIL_VERIFY_SENT_FAIL, false);
            showHideGame($scope, ['resendVerifyInviteResponseDisp'], ['resendVerifyInviteDisp']);
            hideLoading();
        });
    };
});
myApp.controller('ResetController', function($scope, WebServiceHandler) {

    if (keySet.resetKey) {
        if (key !== 'false') {
            showAppMessage($scope, PASSWORD_RESET, true);
            $scope.resetPswdObj = {'resetKey': key.split('***')[0], 'email': key.split('***')[1]};
            showHideGame($scope, ['resetFormDisp'], ['reset_success']);
            $scope.password_changed = PASSWORD_CHANGED;
        } else {
            showAppMessage($scope, PASSWORD_RESET_USED, false);
            showHideGame($scope, ['reset_success'], ['resetFormDisp']);
            $scope.password_changed = 'Reset link seems expired. Please request it again.';
        }
    } else if (keySet.activateUser) {
        if (key === '200') {
            showAppMessage($scope, USER_VERIFIED, true);
        } else if (key === '203') {
            showAppMessage($scope, USER_ALREADY_VERIFIED, true);
        } else {
            showAppMessage($scope, USER_VERIFICATION_ERR, false);
        }
        showHideGame($scope, ['reset_success'], ['resetFormDisp']);
        $scope.password_changed = 'Please login.';
    } else {
        hideAppMessage($scope);
        showHideGame($scope, ['reset_success'], ['resetFormDisp']);
        $scope.password_changed = 'Please login.';
    }

    $scope.resetPswd = function(resetPswdObj) {
        hideAppMessage($scope.$parent, true);
        showLoading($scope, [], ['appMessageDisp']);
        var pswd = resetPswdObj.newPassword;
        resetPswdObj.newPassword = pidCrypt.MD5(pswd);
        resetPswdObj.repeatPassword = pidCrypt.MD5(pswd);
        WebServiceHandler.resetPswd(resetPswdObj).then(function() {
            showHideGame($scope, ['reset_success'], ['resetFormDisp']);
            showAppMessage($scope, PASSWORD_CHANGED, true);
            $scope.resetForm.$setPristine(true);
            $scope.user = resetObjectKeysToEmpty(resetPswdObj);
            hideLoading();
        }, function() {
            showHideGame($scope, ['reset_success'], ['resetFormDisp']);
            showAppMessage($scope, PASSWORD_CHANGE_FAIL, false);
            $scope.password_changed = 'Login to the application.';
            $scope.resetForm.$setPristine(true);
            $scope.user = resetObjectKeysToEmpty(resetPswdObj);
            hideLoading();
        });
    };
});
myApp.controller('CategoryController', function($scope, WebServiceHandler, Data){
    
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