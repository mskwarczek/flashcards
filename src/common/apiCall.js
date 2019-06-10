const apiCall = (endpoint, options = {}, callback = () => null) => {
    fetch(endpoint, { ...options })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status);
                };
                return res;
            })
            .then(res => res.json())
            .then(res => callback(res, null))
            .catch(err => {
                console.log(err);
                return callback(null, err);
            });
};

export default apiCall;
