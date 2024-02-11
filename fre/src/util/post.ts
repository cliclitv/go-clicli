export function post(url, params) {
    return new Promise(resolve => {
        fetch(url, {
            method: 'post',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token')
            }
        }).then(function (res) {
            return res.json()
        }).then(data => {
            resolve(data)
        }).catch(e => console.log(e))
    })
}


export function get(url) {
    return new Promise(resolve => {
        fetch(url).then(function (res) {
            return res.json()
        }).then(data => {
            resolve(data)
        }).catch(e => console.log(e))
    })
}

export function getToken() {
    const search = new URL(window.location.href).searchParams
    return search.get('token') || null
}