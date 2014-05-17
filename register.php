<div class="row register-control" ng-controller="RegisterController">
    <div class="columns twelve">
        <p class="titleBar">{{headerTitle}}<p>
        <p ng-show="appMessageDisp" class="app-message">{{appMessage}}</p>
    </div>
    <div class="large-7 columns">
        <div class="bigQuote">{{singleQuote}}</div>
        <div class="quoteAuthorBigQuote">{{singleQuoteAuthor}}</div>
    </div>
    <div class="large-5 columns reg-form-container">
        <p class="txt-reg">Register<p>
        <form ng-show="registerFormDisp" name="registerForm" ng-submit="register(user)" novalidate>
            <div class="input-group">
                <input 
                    ng-class="{
                           'invalid-input' : registerForm.name.$invalid && !registerForm.name.$pristine,
                           'valid-input' : registerForm.name.$valid && registerForm.name.$dirty
                        }"
                    type="text" placeholder="Name" ng-model="user.name" name="name"
                    ng-minlength="4" ng-maxlength="20" required check-spl-chars/>
                <p class="err-msg" 
                   ng-show="registerForm.name.$invalid && !registerForm.name.$pristine">
                    {{register_validation_name}}
                </p>
            </div>
            <div class="input-group">
                <input 
                    ng-class="{'invalid-input' : registerForm.email.$invalid && !registerForm.email.$pristine && !emailIdUnique, 'valid-input' : registerForm.email.$valid && registerForm.email.$dirty && emailIdUnique}"
                    type="email" placeholder="Email Id" ng-model="user.emailId" 
                    name="email" required unique-email />
                <p class="err-msg" 
                   ng-show="registerForm.email.$invalid && !registerForm.email.$pristine">
                    {{register_validation_email}}
                </p>
                <p class="success-msg" ng-show="emailIdUnique">
                    {{emailIdStatusReceived}}
                </p>
                <p class="err-msg" ng-show="!emailIdUnique">
                    {{emailIdStatusReceived}}
                </p>
            </div>
            <div class="input-group">
                <input 
                    ng-class="{
                           'invalid-input' : registerForm.password.$invalid && !registerForm.password.$pristine,
                           'valid-input'
                                : registerForm.password.$valid && registerForm.password.$dirty}"
                    type="password" placeholder="Password"  ng-model="user.password" 
                    name="password" ng-minlength="6" ng-maxlength="12" required check-strong-pswd/>
                <p class="err-msg" 
                   ng-show="registerForm.password.$error.strongPswd">{{register_validation_password}}
                </p>
            </div>
            <div id="captcha-container"></div>
            <p class="err-msg" 
               ng-show="captchaError">{{register_validation_captcha}}</p>
            <button class="stdBtn" type="submit" 
                    ng-disabled="registerForm.$invalid || !emailIdUnique">
                Register
            </button>                        
        </form>
        <p ng-show="register_success" class="loginBtnRegForm">
            {{register_login}}
            <button class="stdBtn" ng-click="showLogin()">Login</button>
        </p>
    </div>
</div>