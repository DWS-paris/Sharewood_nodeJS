/*
Service definition
*/
    const sendBodyError = (endpoint, method, response, errorMessage, render = null, status = 400) => {
        const apiResponse = {
            endpoint: endpoint,
            method: method,
            message: errorMessage,
            err: null,
            data: null,
            status: status
        }

        // Check if render
        return render === null
        ? response.status(status).json(apiResponse)
        : response.status(status).render(render, { data: apiResponse })
    }

    const sendFieldsError = (endpoint, method, response, errorMessage, miss, extra, render = null, status = 400) => {
        const apiResponse = {
            endpoint: endpoint,
            method: method,
            message: errorMessage,
            err: { miss, extra },
            data: null,
            status: status
        }

        // Check if render
        return render === null
        ? response.status(status).json(apiResponse)
        : response.status(status).render(render, { data: apiResponse })
    }

    const sendApiSuccessResponse = (endpoint, method, response, successMessage, data, render = null, status = 200) => {
        const apiResponse = {
            endpoint: endpoint,
            method: method,
            message: successMessage,
            err: null,
            data: data,
            status: status
        }

        // Check if render
        return render === null
        ? response.status(status).json(apiResponse)
        : response.status(status).render(render, { data: apiResponse })
    }

    const sendApiErrorResponse = (endpoint, method, response, errorMessage, error, render = null, status = 500) => {
        const apiResponse = {
            endpoint: endpoint,
            method: method,
            message: errorMessage,
            err: error,
            data: null,
            status: status
        }

        // Check if render
        return render === null
        ? response.status(status).json(apiResponse)
        : response.status(status).render(render, { data: apiResponse })
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