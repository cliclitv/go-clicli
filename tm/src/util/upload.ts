export function uploadImage(e) {
    const file = e.target.files[0]


    const formData = new FormData()

    formData.append('businessType', 'yk_community_post')
    formData.append('appKey', '110')
    formData.append('apiSig', 'helloYouku')
    formData.append('callId', '1687164992861')
    formData.append('uploadToken', 'OWE5OTgyNzNhZTliM2UyNGEzOWJiYTEyMmJjZDE3NTc=')
    formData.append('openId', '405321465')
    formData.append('fileData', file)


    fetch('https://bcy-upload.deno.dev/proxy', {
        body: formData,
        method: 'POST',
    }).then(res => res.json()).then(data => {
        console.log(data)
        md.image(data.model.data)
    })
}