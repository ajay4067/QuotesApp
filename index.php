<!doctype html>
<html lang="en" ng-app="myApp">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
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
        <link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300|Roboto+Slab:100'>
        <link rel="stylesheet" href="lib/animate.css"/>
        <link rel="stylesheet" href="css/style.css"/>

        <script src="lib/angular/angular.min.js"></script>    
        <script src="lib/angular/angular-route.min.js"></script>
        <script src="lib/angular/angular-animate.min.js"></script>
        <script src="js/config.js"></script>
        <script src="js/app.js"></script>
        <script src="js/Controllers.js"></script>
        <script src="js/services.js"></script>

    </head>

    <body>    

        <div id="main" ng-controller="ParentController">
             
            <!-- angular templating -->
            <div class="load-view" ng-view></div>

        </div>
        <script src="lib/pidcrypt/pidcrypt.js"></script>
        <script src="lib/pidcrypt/md5_c.js"></script>
        <script src="lib/underscore-min.js"></script>
        <!--<script src="http://www.google.com/recaptcha/api/js/recaptcha_ajax.js"></script>-->
    </body>
</html>
