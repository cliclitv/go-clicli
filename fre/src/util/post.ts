export function post(url, data) {
    return new Promise(resolve => {
        fetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            resolve(res)
        })
    })
}