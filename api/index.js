import axios from "axios";

const API_KEY = '45514863-609a8dc3647bf533016e7a1eb'

const API_URL = `https://pixabay.com/api/?key=${API_KEY}`

const formatUrl = (params) => {
    let url = API_URL + "&per_page=25&safesearch=true&editors_choice=true"
    if (!params) return url;
    let paramKeys = Object.keys(params);
    paramKeys.map(key => {
        let value = key == 'q' ? encodeURIComponent(params[key]) : params[key]
        url += `&${key}=${value}`
    })
    console.log('final url:', url);
    return url;
}

export const getPhotos = async (params) => {
    try {
        const response = await axios.get(formatUrl(params))
        const { data } = response
        return {success: true, data}
    }
    catch (err) {
        console.log(err);
        return { success: false, msg: err.message }
    }
}