import React from "react";
//import store from "./configureStore";

/**
 * @returns {string} get server api URL
 */
export function getServer() {
    let server = "127.0.0.1:80"; //store.getState().settings.server;
    //return `http://${server}/api/v1`;
    return '/api/v1'
}

/**
 * Serialize object into http query arguments
 * eg:
 *  {
 *      username: "Bob",
 *      sortBy: "Decending",
 *      true: false
 *  }
 *  returns:
 *      username=Bob&sortBy=Decending&true=false
 * @param obj object to stringify
 * @param prefix prefix to add before item
 */

export function serialize(obj: any, prefix: any = undefined) :any {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push(typeof v == "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}

// accepted decoding arguments from remote api
const formats = ['json', 'list', 'object'];

/**
 * Server sent an array, get list, prev and next fields
 * @param object 
 */
export function parsePage(object: any): { ok: boolean, page: Array<Object>, prev: string, next: string } {
    if (object && object.Array) {
        return { ok: true, page: object.Array, prev: object.PrevCursor, next: object.NextCursor }
    }
    return { ok: false, page: [], prev: "", next: "" }
}
/**
 * Server sent an object, get relevant fields
 */
export function parseObject(object: any): { ok: boolean, object: Object } {
    if (object && object.Object) {
        return { ok: true, object: object.Object }
    }
    return { ok: false, object: {} }
}

/**
 * getResource 
 * create URL for <Image> or <Video> component pointing to media file on server
 * creates: https://server-name/api/v1/resource&resouceID={resourceID}
 * 
 * @param resourceID unique resource identifier identifying a resource file on the media server, eg: png, jpeg, mp4 or webm
 */
export function getResource(resourceID: string): string {
    //return "https://source.unsplash.com/collection/1079348/800x800"
    return `${getServer()}/resource?resourceID=${resourceID}`
}

/**
 * upload testing function, sends a multipart or postform to a api endpopint
 * @param file resource location on disk
 * @param name file name to send in the form
 * @param type MIME type of file, eg, image/png
 * @param onprogress progress callback
 * @param oncomplete upload complete callback
 */
export const upload = (file: any, name: string, type: string,
    onprogress: (e: number, t: number) => any,
    oncomplete: () => any) => {
    const path = "/resource";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", getServer() + path, true);
    xhr.timeout = 1000 * 10;

    var formData = new FormData();
    //formData.append("file", { uri: file, name: name, type: type });

    if (xhr.upload)
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                if (onprogress)
                    onprogress(e.loaded, e.total);
            }
        };

    xhr.send(formData);
}


/**
 * Wrapper around fetch for convenience and api abstraction.
 * 
 * Accepts all fetch() arguments, but the typical fetch("/myurl?args=xyz", ...) param is created from 
 * obj.method: string, and obj.args: string
 * 
 * see @param for all extra arguments
 * @param {{ string: string, accepts: []int }} obj 
 */
export const request = (obj: any): Promise<any> => {

    // clone input object
    const input = Object.assign({}, obj);

    // if no headers field, set it
    if (!input.headers) {
        input.headers = {};
    }

    // if json response format is defined, set accept headers
    if (input.format) {
        input.headers["Accept"] = "application/json"
    }

    // If json is defined, stringify it, attach it to the body 
    // then set content header
    const json = JSON.stringify(obj.json);
    input.body = json;
    input.mode = 'cors';

    if (json) {
        input.headers['Content-type'] = "application/json";
    }

    // serialize arguments object into HTTP query string if object is defined
    const encodedArgs = input.args ? serialize(input.args) : undefined;
    const url = getServer() + input.endpoint + (encodedArgs ? '?' + encodedArgs : "");

    return fetch(url, input).then((response) => {
        if (!response.ok) {
            throw new Error(`unexpected response, ${response.ok}`)
        }

        if (input.expects && !input.expects.includes(response.status)) {
            throw new Error(`unexpected response, ${response.status}`)
        }

        // If the expected response format was set, try to decode the response body as JSON
        // If it fails to decode, throw an error 
        if (input.format == 'page' || input.format == 'object') {
            //alert("decoding (request):" + input.format)
            return response.json().then(data => ({ status: response.status, data: data }))
        }
        return { status: response.status, data: null };
    }).then(
        ({ status, data }) => {
            //alert(`state: ${status}`);

            if (input.format == 'page') {
                const { ok, page, prev, next } = parsePage(data)
                if (!ok)
                    throw new Error('unexpected response, not a page')
                return { status, page, prev, next }
            }
            if (input.format == 'object') {
                const { ok, object } = parseObject(data)
                if (!ok)
                    throw new Error('unexpected response, not a object')
                return { status, object }
            }
            return { status }
        }
    ).catch((error) => {
        alert(`${obj.endpoint}\nSomething went wrong.\r\nCheck your connection and try again\r\n${error}`);
        return Promise.reject()
    })
}
