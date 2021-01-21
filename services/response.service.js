/*
Service definition
*/
    const sendBodyError = (endpoint, method, response, errorMessage, render = null, redirect = false, status = 400) => {
        const apiResponse = {
            endpoint: endpoint,
            method: method,
            message: errorMessage,
            err: null,
            data: null,
            status: status
        }

        // Check if render
        if(render !== null){
            // Check redirect
            return !redirect
            ? response.status(status).render(render, { apiResponse })
            : response.redirect(render, status, { apiResponse })
        }
        else{
            return response.status(status).json(apiResponse);
        }
    }

    const sendFieldsError = (endpoint, method, response, errorMessage, miss, extra, render = null, redirect = false, status = 400) => {
        const apiResponse = {
            endpoint: endpoint,
            method: method,
            message: errorMessage,
            err: { miss, extra },
            data: null,
            status: status
        }

        // Check if render
        if(render !== null){
            // Check redirect
            return !redirect
            ? response.status(status).render(render, { apiResponse })
            : response.redirect(render, status, { apiResponse })
        }
        else{
            return response.status(status).json(apiResponse);
        }
    }

    const sendApiSuccessResponse = (endpoint, method, response, successMessage, data, render = null, redirect = false, status = 200) => {
        const apiResponse = {
            endpoint: endpoint,
            method: method,
            message: successMessage,
            err: null,
            data: data,
            status: status
        }

        // Check if render
        if(render !== null){
            // Check redirect
            return !redirect
            ? response.status(status).render(render, { apiResponse })
            : response.redirect(render, status, { apiResponse })
        }
        else{
            return response.status(status).json(apiResponse);
        }
    }

    const sendApiErrorResponse = (endpoint, method, response, errorMessage, error, render = null, redirect = false, status = 500) => {
        const apiResponse = {
            endpoint: endpoint,
            method: method,
            message: errorMessage,
            err: error,
            data: null,
            status: status
        }

        // Check if render
        if(render !== null){
            // Check redirect
            return !redirect
            ? response.status(status).render(render, { apiResponse })
            : response.redirect(render, status, { apiResponse })
        }
        else{
            return response.status(status).json(apiResponse);
        }
    }
// 


/*
Export service fonctions
*/
    module.exports = {
        sendBodyError,
        sendFieldsError,
        sendApiSuccessResponse,
        sendApiErrorResponse
    };
//