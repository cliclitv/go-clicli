export function post(url, params) {
    return new Promise(resolve => {
        fetch(url, {
            method: 'post',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            return res.json()
        }).then(data => {
            resolve(data)
        })
    })
}