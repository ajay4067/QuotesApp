<div class="row login-control" ng-controller="LoginController">
    <div class="row">
        <div class="large-12 columns">
            <p class="titleBar">{{headerTitle}}<p>
            <p ng-show="appMessageDisp" 
               ng-class="{'app-message-error' : appMessageErr, 
                          'app-message-success' : appMessageSuccess}">{{appMessage}}</p>
            <p ng-show="resendVerifyInviteDisp" class="resend-verify-invite">Click <span ng-click="resendVerifyInvite()" class="linkResend">
                    here</span> to Resend email verification link.</p>
            <p ng-show="resendVerifyInviteResponseDisp" class="resend-verify-response">
                {{resendVerifyInviteResponse}}</p>
        </div>
    </div> 
    <div class="row">
        <div class="large-8 columns">
            <div class="bigQuote">{{singleQuote}}</div>
            <div class="quoteAuthorBigQuote">{{singleQuoteAuthor}}</div>
        </div>
        <div class="large-4 columns">
            <form autocomplete="off" class="login-form" name="loginForm"
                  ng-show="loginFormDisp" ng-submit="login(user)" novalidate>
                <input 
                    ng-class="{
                        'invalid-input' : loginForm.email.$invalid && !loginForm.email.$pristine,
                        'valid-input' : loginForm.email.$valid&& loginForm.email.$dirty}"
                    type="email" placeholder="Email Id" ng-model="user.emailId" name="email" required/>
                <p ng-show="loginForm.email.$invalid && !loginForm.email.$pristine" class="err-msg">
                    Please Enter Valid email Id
                </p>
                <input 
                    ng-class="{
                        'invalid-input' : loginForm.password.$invalid && !loginForm.password.$pristine,
                        'valid-input' : loginForm.password.$valid && loginForm.password.$dirty}"
                    type="password" placeholder="Password"  ng-model="user.password" name="password"
                    required />
                <p ng-show="loginForm.password.$invalid && !loginForm.password.$pristine" class="err-msg">
                    Password is required</p>
                <button class="stdBtn" type="submit" ng-disabled="loginForm.$invalid">
                    Login
                </button>
                <p class="signuplink"><a href="#register">
                        New to Quotes Inspire? Sign Up Here!</a></p>
                <p class="forgotPswdLink"><span ng-click="showForgotPswd()">
                        Forgot Password?</span></p>
            </form>
            <form autocomplete="off" class="login-form" name="resetSendEmailForm"
                  ng-show="resetSendEmailDisp" ng-submit="resetSendEmail(resetEmail)" novalidate>
                <input 
                    ng-class="{
                        'invalid-input' : resetSendEmailForm.resetEmail.$invalid && !resetSendEmailForm.resetEmail.$pristine,
                        'valid-input' : resetSendEmailForm.resetEmail.$valid&& resetSendEmailForm.resetEmail.$dirty}"
                    type="email" placeholder="Email Id" ng-model="resetEmail" name="resetEmail" required/>
                <p class="err-msg" ng-show="resetSendEmailForm.resetEmail.$invalid && !resetSendEmailForm.resetEmail.$pristine">
                    Please Enter Valid email Id
                </p>
                <button class="stdBtn" type="submit" ng-disabled="resetSendEmailForm.$invalid">
                    Send Reset Link
                </button>
            </form>
        </div>
    </div>

</div>