myApp.factory('Data', function() {
    var data = {};
    return data;
});
myApp.factory('WebServiceHandler', function($q, $http) {

    var loginToServer = function(credentials) {
        var deferred = $q.defer();

        $http({
            method: "POST",
            url: SERVICE_ROOT + 'login',
            data: getStringData(credentials),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'message': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'message': data});
        });

        return deferred.promise;
    };
    var registerUser = function(credentials) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: SERVICE_ROOT + 'register',
            data: getStringData(credentials),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).success(function(data, status, headers, config) {
            deferred.resolve({'status': status, 'message': data});
        }).error(function(data, status, headers, config) {
            deferred.reject({'status': status, 'message': data});
        });
        return deferred.promise;
    };
    var checkUserAvailable = function(email) {
        var deferred = $q.defer();
        $.ajax({
            type: "GET",
            url: SERVICE_ROOT + 'userAvailable/' + email
        }).done(function(response) {
            deferred.resolve(response);
        }).fail(function(response) {
            deferred.reject(response.responseJSON);
        }).always(function() {
        });
        return deferred.promise;
    };
    var fetchWritersNCtgs = function(api_key) {
        var deferred = $q.defer();
        $.ajax({
            type: "GET",
            url: SERVICE_ROOT + 'writerNCtg',
            headers: {
                'Authorization': api_key
            }
        }).done(function(response) {
            deferred.resolve(response);
        }).fail(function(response) {
            deferred.reject(response.responseJSON);
        }).always(function() {
        });
        return deferred.promise;
    };
    var createWrtNCtg = function(api_key, form_data) {
        var deferred = $q.defer();
        $.ajax({
            type: "POST",
            url: SERVICE_ROOT + 'writerNCtg',
            data: form_data,
            contentType: false,
            processData: false,
            headers: {
                'Authorization': api_key
            }
        }).done(function(response) {
            deferred.resolve(response);
        }).fail(function(response) {
            deferred.reject(response.responseJSON);
        }).always(function() {
        });
        return deferred.promise;
    };
    var updateWrtNCtg = function(api_key, form_data, id) {
        var deferred = $q.defer();
        $.ajax({
            type: "PUT",
            url: SERVICE_ROOT + 'writerNCtg/' + id,
            data: form_data,
            headers: {
                'Authorization': api_key
            }
        }).done(function(response) {
            deferred.resolve(response);
        }).fail(function(response) {
            deferred.reject(response.responseJSON);
        }).always(function() {
        });
        return deferred.promise;
    };
    var removeWritersNCtgs = function(api_key, idToDelete) {
        var deferred = $q.defer();
        $.ajax({
            type: "DELETE",
            url: SERVICE_ROOT + 'writerNCtg/' + idToDelete,
            headers: {
                'Authorization': api_key
            }
        }).done(function(response) {
            deferred.resolve(response);
        }).fail(function(response) {
            deferred.reject(response.responseJSON);
        }).always(function() {
        });
        return deferred.promise;
    };
    var fetchQuotes = function(api_key, writerId) {
        var deferred = $q.defer();
        $.ajax({
            type: "GET",
            url: SERVICE_ROOT + 'quotes/' + writerId,
            headers: {
                'Authorization': api_key
            }
        }).done(function(response) {
            deferred.resolve(response);
        }).fail(function(response) {
            deferred.reject(response.responseJSON);
        }).always(function() {
        });
        return deferred.promise;
    };

    var createNewQuote = function(api_key, form_data) {
        var deferred = $q.defer();
        $.ajax({
            type: "POST",
            url: SERVICE_ROOT + '/quotes',
            data: form_data,
            headers: {
                'Authorization': api_key
            }
        }).done(function(response) {
            deferred.resolve(response);
        }).fail(function(response) {
            deferred.reject(response.responseJSON);
        }).always(function() {
        });
        return deferred.promise;
    };
    var updateTheQuote = function(api_key, form_data, quoteId) {
        var deferred = $q.defer();
        $.ajax({
            type: "PUT",
            url: SERVICE_ROOT + 'quotes/' + quoteId,
            data: form_data,
            headers: {
                'Authorization': api_key
            }
        }).done(function(response) {
            deferred.resolve(response);
        }).fail(function(response) {
            deferred.reject(response.responseJSON);
        }).always(function() {
        });
        return deferred.promise;
    };
    var removeQuote = function(api_key, idToDelete) {
        var deferred = $q.defer();
        $.ajax({
            type: "DELETE",
            url: SERVICE_ROOT + 'quotes/' + idToDelete,
            headers: {
                'Authorization': api_key
            }
        }).done(function(response) {
            deferred.resolve(response);
        }).fail(function(response) {
            deferred.reject(response.responseJSON);
        }).always(function() {
        });
        return deferred.promise;
    };

    var fetchAllQuotesData = function(api_key, writerId) {
        var deferred = $q.defer();
        $.ajax({
            type: "GET",
            url: SERVICE_ROOT + 'allQuotesData',
            headers: {
                'Authorization': api_key
            }
        }).done(function(response) {
            deferred.resolve(response);
        }).fail(function(response) {
            deferred.reject(response.responseJSON);
        }).always(function() {
        });
        return deferred.promise;
    };

    return {
        register: registerUser,
        login: loginToServer,
        userAvailable: checkUserAvailable,
        getWritersNCtgs: fetchWritersNCtgs,
        createWritersNCtgs: createWrtNCtg,
        deleteWritersNCtgs: removeWritersNCtgs,
        updateWriterNCtg: updateWrtNCtg,
        getQuotes: fetchQuotes,
        createQuote: createNewQuote,
        updateQuote: updateTheQuote,
        deleteQuote: removeQuote,
        getAllQuotesData: fetchAllQuotesData
    };
});
