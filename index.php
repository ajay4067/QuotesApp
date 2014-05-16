<!DOCTYPE html>
<html ng-app="myApp">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Quotes App</title>
        <script>
            var keySet = {resetKey: false, activateUser: false, notSet: false};
            var key = false;
            function urlRedirect() {
                var pageUrl = document.URL;
                var query = pageUrl.substring(pageUrl.indexOf('?') + 1);
                var queryParams = query.split('&');

                if (queryParams[0] === 'forgotPswd') {
                    if (queryParams[1] === '200') {
                        sessionStorage['resetKey'] = queryParams[2];
                    } else {
                        sessionStorage['resetKey'] = false;
                    }
                    window.location = pageUrl.substring(0, pageUrl.indexOf('?'));
                } else if (queryParams[0] === 'activateUser') {
                    if (queryParams[1] === '200') {
                        sessionStorage['activateUser'] = 200;
                    } else if (queryParams[1] === '203') {
                        sessionStorage['activateUser'] = 203;
                    } else {
                        sessionStorage['activateUser'] = false;
                    }
                    window.location = pageUrl.substring(0, pageUrl.indexOf('?'));
                } else {
                    if (typeof sessionStorage['resetKey'] !== 'undefined') {
                        keySet.resetKey = true;
                        key = sessionStorage['resetKey'];
                        sessionStorage.clear();
                    } else if (typeof sessionStorage['activateUser'] !== 'undefined') {
                        keySet.activateUser = true;
                        key = sessionStorage['activateUser'];
                        sessionStorage.clear();
                    } else {
                        keySet.notSet = true;
                        sessionStorage.clear();
                    }
                }
            }
            urlRedirect();
        </script>
        <link rel="stylesheet" href="css/style.css" />
        <link rel="stylesheet" href="lib/font-awesome/css/font-awesome.min.css" />
        <link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300|Roboto+Slab:100' rel='stylesheet'/>
        <script src="lib/angular/angular.min.js"></script>
        <script src="lib/angular/angular-animate.min.js"></script>
        <!-- <script src="lib/angular/ng-sanitize.js"></script> -->
        <script src="js/app.js"></script>
        <script src="js/Controllers.js"></script>
        <script src="js/services.js"></script>
    </head> 
    <body>
        <div ng-controller="NavController">
            <header class="row">
                <p class="titleBar large-12 columns">{{headerTitle}}<p>
                <p ng-show="appMessageDisp" class="app-message  large-12 columns">{{titleBarMsg}}</p>
            </header>
            <div class="row register-form" ng-controller="RegisterController" ng-show="registerDisp">
                <div class="large-7 columns">
                    <div class="bigQuote registerQuote">There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle.” 
                    </div>
                    <div class="quoteAuthorBigQuote">― Albert Einstein</div>
                </div>
                <div class="large-5 columns reg-form-container">
                    <p class="txt-reg">Register<p>
                    <form ng-show="registerFormDisp" name="registerForm" ng-submit="register(user)" novalidate>
                        <div class="input-group">
                            <input ng-class="{
                                    'invalid-input' : registerForm.name.$invalid && !registerForm.name.$pristine,
                                            'valid-input'
                                    : registerForm.name.$valid && registerForm.name.$dirty}"
                                   type="text" placeholder="Name" ng-model="user.name" name="name"
                                   ng-minlength="4" ng-maxlength="20" required check-spl-chars/>
                            <p class="err-msg" ng-show="registerForm.name.$invalid && !registerForm.name.$pristine">
                                Name should be atleast 4 character long and without special characters
                            </p>
                        </div>
                        <div class="input-group">
                            <input ng-class="{
                                    'invalid-input' : registerForm.email.$invalid && !registerForm.email.$pristine && !emailIdUnique,
                                            'valid-input'
                                    : registerForm.email.$valid && registerForm.email.$dirty && emailIdUnique}"
                                   type="email" placeholder="Email Id" ng-model="user.emailId" name="email" required unique-email />
                            <p class="err-msg" ng-show="registerForm.email.$invalid && !registerForm.email.$pristine">
                                Invalid Email Id
                            </p>
                            <p class="success-msg" ng-show="emailIdUnique">
                                {{emailIdStatusReceived}}
                            </p>
                            <p class="err-msg" ng-show="!emailIdUnique">
                                {{emailIdStatusReceived}}
                            </p>
                        </div>
                        <div class="input-group">
                            <input ng-class="{
                                    'invalid-input' : registerForm.password.$invalid && !registerForm.password.$pristine,
                                            'valid-input'
                                    : registerForm.password.$valid && registerForm.password.$dirty}"
                                   type="password" placeholder="Password"  ng-model="user.password" name="password" ng-minlength="6" ng-maxlength="12" required check-strong-pswd/>
                            <p class="err-msg" ng-show="registerForm.password.$error.strongPswd">Use strong password that contains at least 6 characters, a special character, a number and a capital letter</p>
                        </div>
                        <div id="captcha-container"></div>
                        <p class="err-msg" ng-show="captchaError">Your entered captcha was wrong please re-enter.</p>
                        <button class="stdBtn" type="submit" ng-disabled="registerForm.$invalid || !emailIdUnique">
                            Register
                        </button>                        
                    </form>
                    <p ng-show="register_success" class="loginBtnRegForm">Login to the application, if email verification is complete.
                        <button class="stdBtn" ng-click="showLogin()">Login</button>
                    </p>
                </div>
            </div>
            <div class="row login-control" ng-controller="LoginController" ng-show="loginDisp">
                <div class="large-8 columns">
                    <div class="bigQuote">“There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle.” 
                    </div>
                    <div class="quoteAuthorBigQuote">― Albert Einstein</div>
                </div>
                <div class="large-4 columns">
                    <form autocomplete="off" class="login-form" name="loginForm"
                          ng-show="loginFormDisp" ng-submit="login(user)" novalidate>
                        <input ng-class="{
                                    'invalid-input' : loginForm.email.$invalid && !loginForm.email.$pristine,
                                            'valid-input'
                                    : loginForm.email.$valid && loginForm.email.$dirty}"
                               type="email" placeholder="Email Id" ng-model="user.emailId" name="email" required/>
                        <p ng-show="loginForm.email.$invalid && !loginForm.email.$pristine">
                            Please Enter Valid email Id
                        </p>
                        <input ng-class="{
                                    'invalid-input' : loginForm.password.$invalid && !loginForm.password.$pristine,
                                            'valid-input'
                                    : loginForm.password.$valid && loginForm.password.$dirty}"
                               type="password" placeholder="Password"  ng-model="user.password" name="password" required/>
                        <p ng-show="loginForm.password.$invalid && !loginForm.password.$pristine">Password is required</p>
                        <button class="stdBtn" type="submit" ng-disabled="loginForm.$invalid">
                            Login
                        </button>
                        <p class="signuplink"><span ng-click="showRegister()">
                                New to Quotes Inspire? Sign Up Here!</span></p>
                        <p class="forgotPswdLink"><span ng-click="showForgotPswd()">
                                Forgot Password?</span></p>
                    </form>
                    <form autocomplete="off" class="login-form" name="resetSendEmailForm"
                          ng-show="resetSendEmailDisp" ng-submit="resetSendEmail(resetEmail)" novalidate>
                        <input type="email" placeholder="Email Id" ng-model="resetEmail" name="resetEmail" required/>
                        <p ng-show="resetSendEmailForm.email.$invalid && !resetSendEmailForm.email.$pristine">
                            Please Enter Valid email Id
                        </p>
                        <button class="stdBtn" type="submit" ng-disabled="resetSendEmailForm.$invalid">
                            Send Reset Link
                        </button>
                    </form>
                </div>
            </div>
            <div class="row reset-control" ng-controller="ResetController" ng-show="resetDisp">
                <div class="large-8 columns">
                    <div class="bigQuote">“There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle.” 
                    </div>
                    <div class="quoteAuthorBigQuote">― Albert Einstein</div>
                </div>
                <div class="large-4 columns">
                    <form autocomplete="off" class="login-form" name="resetForm"
                          ng-submit="resetPswd(resetPswdObj)" novalidate>
                        <p>{{resetPswdObj.email}}</p>
                        <div class="input-group">
                            <input ng-class="{
                                    'invalid-input' : resetForm.password.$invalid && !resetForm.password.$pristine,
                                            'valid-input'
                                    : resetForm.password.$valid && resetForm.password.$dirty}"
                                   type="password" placeholder="Password"  ng-model="resetPswdObj.newPassword" 
                                   name="password" ng-minlength="6" ng-maxlength="12" required check-strong-pswd/>
                            <p class="err-msg" ng-show="resetForm.password.$error.strongPswd">Use strong password that contains at least 6 characters, a special character, a number and a capital letter</p>
                        </div>
                        <div class="input-group">
                            <input ng-class="{
                                    'invalid-input' : resetPswdObj.newPassword != repeatPassword,
                                            'valid-input'
                                    : resetPswdObj.newPassword == repeatPassword}"
                                   type="password" placeholder="Repeat Password" ng-disabled="resetForm.password.$invalid"
                                   ng-model ="repeatPassword" name="repeatPassword"/>
                            <p class="err-msg" ng-show="resetPswdObj.newPassword != repeatPassword && resetForm.repeatPassword.$dirty">Password do not match.</p>
                        </div>
                        <button class="stdBtn" type="submit" ng-disabled="resetForm.password.$pristine || resetForm.repeatPassword.$pristine || resetPswdObj.newPassword != repeatPassword">
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
            <div class="row" ng-controller="QuoteAppController" ng-show="quoteDisp">
                <button ng-click="getWritersNCtgs()">
                    Fetch
                </button>
                {{quoteData}}
                <!--<form enctype="multipart/form-data" name="createWrtNctgForm" ng-submit="createWrtNctg(wrtNctg)" novalidate>-->
                <form enctype="multipart/form-data" name="createWrtNctgForm" novalidate>
                    <h3>Upload File using Jquery AJAX in PHP</h3>
                    Name:
                    <input type="text" name="name" ng-model="wrtNctg.name">
                    Description:           <textarea ng-model="wrtNctg.description" placeholder="Enter Description."></textarea>
                    <input type="file" id="imagefile">
                    Submit:
                    <!--<input type="submit">-->
                    <button ng-click="createWrtNctg(wrtNctg)">Create</button>
                    <button ng-click="updateWriterNCtg(wrtNctg)">Update</button>
                </form>
                <input type="text" ng-model="idToDelete" placeholder="id to delete"/>
                <button ng-click="deleteWriter(idToDelete)">Delete Writer</button>
                <button ng-click="getQuotes(1)">Get Quotes</button>
                <form name="createQuote" novalidate>
                    <span>Quote</span>
                    <textarea ng-model="newQuote.quote" placeholder="Enter Quote."></textarea>
                    <input type="text" ng-model="newQuote.wrNctg_ref">
                    Submit:
                    <button ng-click="createNewQuote(newQuote)">Create Quote</button>
                    <button ng-click="updateQuote(newQuote)">Update Quote</button>
                    <button ng-click="deleteQuote()">Delete Quote</button>
                    <button ng-click="getAllQuotesData()">All at Once</button>
                </form>
            </div>
        </div>

        <script src="lib/pidcrypt/pidcrypt.js"></script>
        <script src="lib/pidcrypt/md5_c.js"></script>
        <script src="lib/underscore-min.js"></script>
        <script src="http://www.google.com/recaptcha/api/js/recaptcha_ajax.js"></script>        
    </body>
</html>