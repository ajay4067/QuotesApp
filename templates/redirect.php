<div class="row reset-control" ng-controller="ResetController" >
    <div class="row">
        <div class="large-12 columns">
            <p class="titleBar">{{headerTitle}}<p>
            <p ng-show="appMessageDisp" 
               ng-class="{'app-message-error' : appMessageErr, 
                          'app-message-success' : appMessageSuccess}">{{appMessage}}</p>
        </div>
    </div>
    <div class="row">
        <div class="large-8 columns">
            <div class="bigQuote">{{singleQuote}}</div>
            <div class="quoteAuthorBigQuote">{{singleQuoteAuthor}}</div>
        </div>
        <div class="large-4 columns">
            <form ng-show="resetFormDisp" autocomplete="off" class="login-form" name="resetForm"
                  ng-submit="resetPswd(resetPswdObj)" novalidate>
                <p class="reset-email">{{resetPswdObj.email}}</p>
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
            <p ng-show="reset_success" class="loginBtnRegForm">
                {{password_changed}}
                <a class="stdBtn" href="#">Login</a>
            </p>
        </div>
    </div>
</div>