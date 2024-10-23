function ajaxRequest(url, method, data, dataType) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            type: method,
            dataType: dataType,
            data: data,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            async: false,
            success: function(response) {
                resolve(response);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

function ajaxRequestByAsync(url, method, data, dataType) {
    $.ajax({
        url: url,
        type: method,
        dataType: dataType,
        data: data,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        async: true,
        success: function(response) {}
    });
}

function ajaxRequestByForm(url, method, data, dataType) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            type: method,
            dataType: dataType,
            processData: false,
            contentType: false,
            cache: false,
            data: data,
            async: false,
            success: function(response) {
                resolve(response);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

function ajaxRequestByFormJsonp(url, method, data, isAsync) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            type: method,
            dataType: 'jsonp',
            // jsonp: 'callback',
            processData: false,
            contentType: false,
            cache: false,
            data: data,
            async: isAsync,
            success: function(response) {
                resolve(response);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

function httpRequest(url, method, data, isForm) {
    return new Promise(function(resolve, reject) {
        const request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open(method, url);

        if (!isForm) {
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }

        request.addEventListener('readystatechange', function(event) {
            let res;

            if (event.target.status === 200 || event.target.status === 201) {
                if (event.target.response !== '' && event.target.response !== null) {
                    resolve(JSON.parse(event.target.response));
                }
            } else {
                if (event.target.status !== 500) {
                    if (event.target.responseText !== '') {
                        res = {
                            'status': event.target.status,
                            'message': event.target.responseText
                        };

                        reject(res);
                    }
                } else {
                    res = {
                        'status': event.target.status,
                        'message': ''
                    };

                    reject(res);
                }
            }
        });

        if (isForm) {
            request.send(data);
        } else {
            request.send(jsonConvert(data));
        }
    });
}