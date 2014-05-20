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

myApp.controller('RegisterController', function($scope, WebServiceHandler, $http, $location) {
    logoutIfAuthSet($http, $location);
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
    logoutIfAuthSet($http, $location);
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
myApp.controller('ResetController', function($scope, WebServiceHandler, $http, $location) {
    logoutIfAuthSet($http, $location);
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
myApp.controller('LogoutController', function($scope, WebServiceHandler, Data, $http, $location) {
    logoutIfAuthSet($http, $location);
});
myApp.controller('CategoryController', function($scope, WebServiceHandler, Data, $location) {
    $scope.categories = [
        {'name': 'Most popular',
            'description': 'Most liked quotes',
            'ctgId': 1, 'likes': 3,
            liked: false, 'editable': false},
        {'name': 'All the quotes',
            'description': 'This category opens up all the quotes available with us',
            'ctgId': 1, 'likes': 3,
            liked: false, 'editable': true},
        {'name': 'einstein', 'description': 'A great Scientist', 'ctgId': 2,
            'likes': 5, liked: true, 'editable': true},
        {'name': 'einstein', 'description': 'A great Scientist', 'ctgId': 3, 'likes': 7,
            liked: false, 'editable': false},
        {'name': 'UG', 'description': 'Mind is myth', 'ctgId': 5, 'likes': 9,
            liked: false, 'editable': true},
        {'name': 'Osho', 'description': 'The rebel', 'ctgId': 7, 'likes': 11,
            liked: true, 'editable': false},
        {'name': 'Sri Sri', 'description': 'My beloved mystic', 'ctgId': 4, 'likes': 78333,
            liked: false, 'editable': true}
    ];
    $scope.actions = [];
    for (var n = 0; n < $scope.categories.length; n++) {
        $scope.actions.push({'delete': false, 'disabled': false});
    }
    $scope.actionAddDisabled = false;
    $scope.editModel = {'ctgId': '', 'name': '', 'description': ''};
    $scope.deleteIndex = -1;
    $scope.editIndex = -1;
    showHideGame($scope, ['ctgDisp'], ['editCtgDisp', 'createCtgDisp']);
    $scope.likeCategory = function(index) {
        $scope.categories[index].liked = !$scope.categories[index].liked;
        $scope.categories[index].likes++;
    };
    $scope.editCategory = function(index) {
        $scope.editModel = {
            'ctgId': $scope.categories[index].ctgId,
            'name': $scope.categories[index].name,
            'description': $scope.categories[index].description};
        $scope.editIndex = index;
        showHideGame($scope, ['editCtgDisp'], ['ctgDisp', 'createCtgDisp']);
    };
    $scope.cancelCategoryEdit = function() {
        showHideGame($scope, ['ctgDisp'], ['editCtgDisp', 'createCtgDisp']);
        $scope.editForm.$setPristine(true);
    };
    $scope.updateCategory = function(editModel) {
        $scope.categories[$scope.editIndex].name = editModel.name;
        $scope.categories[$scope.editIndex].description = editModel.description;
        $scope.editForm.$setPristine(true);
        showHideGame($scope, ['ctgDisp'], ['editCtgDisp', 'createCtgDisp']);
    };
    $scope.deleteCategoryDialog = function(index) {
        disableButtons($scope, index, true);
        $scope.deleteIndex = index;
    };
    $scope.deleteCtg = function() {
        $scope.categories.splice($scope.deleteIndex, 1);
        $scope.deleteDialogDisp = false;
        disableButtons($scope, $scope.deleteIndex, false);
        $scope.deleteIndex = -1;
    };
    $scope.cancelDeleteCtg = function() {
        $scope.deleteDialogDisp = false;
        disableButtons($scope, $scope.deleteIndex, false);
        $scope.deleteIndex = -1;
    };
    $scope.addCategoryDialog = function() {
        showHideGame($scope, ['createCtgDisp'], ['ctgDisp', 'editCtgDisp']);
    };
    $scope.cancelCategoryCreate = function() {
        $scope.createForm.$setPristine(true);
        showHideGame($scope, ['ctgDisp'], ['editCtgDisp', 'createCtgDisp']);
    };
    $scope.createCategory = function(createModel) {
        var ctg = {
            'name': createModel.name,
            'description': createModel.description,
            'ctgId': 1,
            'likes': 3,
            liked: false
        };
        $scope.categories.unshift(ctg);
        $scope.createForm.$setPristine(true);
        showHideGame($scope, ['ctgDisp'], ['editCtgDisp', 'createCtgDisp']);
    };
    $scope.displayQuotes = function(index) {
        console.log('display Quotes for id ' + index);
        Data.categorySelected = $scope.categories[index].ctgId;
        $location.url('/quotes');
    };

});
myApp.controller('QuotesController', function($scope, WebServiceHandler, Data, $location) {
    $scope.quotes = [
        {
            'text': 'Sample One',
            'quoteId': 1,
            'likes': 14,
            'liked': false,
            'editable': false
        },
        {
            'text': 'Sample two',
            'quoteId': 2,
            'likes': 1433,
            'liked': true,
            'editable': false
        },
        {
            'text': 'Sample One Dtedsad d',
            'quoteId': 3,
            'likes': 1423,
            'liked': true,
            'editable': true
        },
        {
            'text': 'Sample Last',
            'quoteId': 4,
            'likes': 6,
            'liked': false,
            'editable': false
        }
    ];
    if (typeof Data.categorySelected === 'undefined') {
//        $location.url('/categories');
        Data.categorySelected = undefined;
    }
    $scope.actions = [];
    for (var n = 0; n < $scope.quotes.length; n++) {
        $scope.actions.push({'delete': false, 'disabled': false});
    }
    $scope.actionAddDisabled = false;
    $scope.editModel = {'ctgId': '', 'name': '', 'description': ''};
    $scope.deleteIndex = -1;
    $scope.editIndex = -1;
    $scope.editModel = resetObjectKeysToEmpty($scope.editModel);
    showHideGame($scope, ['quotesDisp'], ['createQuotesDisp', 'editQuotesDisp']);
    $scope.backToCtg = function() {
        $location.url('/categories');
    };
    $scope.addQuoteDialog = function() {
        showHideGame($scope, ['createQuotesDisp'], ['quotesDisp', 'editQuotesDisp']);
    };
    $scope.cancelCategoryCreate = function(createModel) {
        $scope.createModel = resetObjectKeysToEmpty(createModel);
        $scope.createForm.$setPristine(true);
        showHideGame($scope, ['quotesDisp'], ['createQuotesDisp', 'editQuotesDisp']);
    };
    $scope.createCategory = function(createModel) {
        var quote = {
            'text': createModel.quote,
            'quoteId': 1,
            'likes': 3,
            'liked': false,
            'editable': true
        };
        $scope.quotes.unshift(quote);
        $scope.createModel = resetObjectKeysToEmpty(createModel);
        $scope.createForm.$setPristine(true);
        showHideGame($scope, ['quotesDisp'], ['createQuotesDisp', 'editQuotesDisp']);
    };
    $scope.likeQuote = function(index) {
        $scope.quotes[index].liked = !$scope.quotes[index].liked;
        $scope.quotes[index].likes++;
    };
    $scope.editQuote = function(index) {
        console.log(index);
        $scope.editModel = {
            'quoteId': $scope.quotes[index].quoteId,
            'quote': $scope.quotes[index].text,
            'liked': false,
            'editable': true};
        $scope.editIndex = index;
        showHideGame($scope, ['editQuotesDisp'], ['quotesDisp', 'createQuotesDisp']);
    };
    $scope.updateQuote = function(editModel) {
        $scope.quotes[$scope.editIndex].text = editModel.quote;
        $scope.editForm.$setPristine(true);
        showHideGame($scope, ['quotesDisp'], ['editQuotesDisp', 'createQuotesDisp']);
    };
    $scope.cancelQuoteEdit = function() {
        $scope.editForm.$setPristine(true);
        showHideGame($scope, ['quotesDisp'], ['editQuotesDisp', 'createQuotesDisp']);
    };
    $scope.deleteQuoteDialog = function(index) {
        disableButtons($scope, index, true);
        $scope.deleteIndex = index;
    };
    $scope.deleteQuote = function() {
        $scope.quotes.splice($scope.deleteIndex, 1);
        $scope.deleteDialogDisp = false;
        disableButtons($scope, $scope.deleteIndex, false);
        $scope.deleteIndex = -1;
    };
    $scope.cancelDeleteQuote = function() {
        disableButtons($scope, $scope.deleteIndex, false);
        $scope.deleteIndex = -1;
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