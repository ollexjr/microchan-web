import React from "react";
import { ToastAndroid, Alert } from "react-native";
import store from "./configureStore";

var statusCodes = {};
statusCodes[exports.NO_CONNECT = -1] = "FAILED_TO_CONTACT_SERVER";
statusCodes[exports.ERROR = 0] = "ERROR";
statusCodes[exports.ACCEPTED = 202] = "Accepted";
statusCodes[exports.BAD_GATEWAY = 502] = "Bad Gateway";
statusCodes[exports.BAD_REQUEST = 400] = "Bad Request";
statusCodes[exports.CONFLICT = 409] = "Conflict";
statusCodes[exports.CONTINUE = 100] = "Continue";
statusCodes[exports.CREATED = 201] = "Created";
statusCodes[exports.EXPECTATION_FAILED = 417] = "Expectation Failed";
statusCodes[exports.FAILED_DEPENDENCY = 424] = "Failed Dependency";
statusCodes[exports.FORBIDDEN = 403] = "Forbidden";
statusCodes[exports.GATEWAY_TIMEOUT = 504] = "Gateway Timeout";
statusCodes[exports.GONE = 410] = "Gone";
statusCodes[exports.HTTP_VERSION_NOT_SUPPORTED = 505] = "HTTP Version Not Supported";
statusCodes[exports.IM_A_TEAPOT = 418] = "I'm a teapot";
statusCodes[exports.INSUFFICIENT_SPACE_ON_RESOURCE = 419] = "Insufficient Space on Resource";
statusCodes[exports.INSUFFICIENT_STORAGE = 507] = "Insufficient Storage";
statusCodes[exports.INTERNAL_SERVER_ERROR = 500] = "Server Error";
statusCodes[exports.LENGTH_REQUIRED = 411] = "Length Required";
statusCodes[exports.LOCKED = 423] = "Locked";
statusCodes[exports.METHOD_FAILURE = 420] = "Method Failure";
statusCodes[exports.METHOD_NOT_ALLOWED = 405] = "Method Not Allowed";
statusCodes[exports.MOVED_PERMANENTLY = 301] = "Moved Permanently";
statusCodes[exports.MOVED_TEMPORARILY = 302] = "Moved Temporarily";
statusCodes[exports.MULTI_STATUS = 207] = "Multi-Status";
statusCodes[exports.MULTIPLE_CHOICES = 300] = "Multiple Choices";
statusCodes[exports.NETWORK_AUTHENTICATION_REQUIRED = 511] = "Network Authentication Required";
statusCodes[exports.NO_CONTENT = 204] = "No Content";
statusCodes[exports.NON_AUTHORITATIVE_INFORMATION = 203] = "Non Authoritative Information";
statusCodes[exports.NOT_ACCEPTABLE = 406] = "Not Acceptable";
statusCodes[exports.NOT_FOUND = 404] = "Not Found";
statusCodes[exports.NOT_IMPLEMENTED = 501] = "Not Implemented";
statusCodes[exports.NOT_MODIFIED = 304] = "Not Modified";
statusCodes[exports.OK = 200] = "OK";
statusCodes[exports.PARTIAL_CONTENT = 206] = "Partial Content";
statusCodes[exports.PAYMENT_REQUIRED = 402] = "Payment Required";
statusCodes[exports.PERMANENT_REDIRECT = 308] = "Permanent Redirect";
statusCodes[exports.PRECONDITION_FAILED = 412] = "Precondition Failed";
statusCodes[exports.PRECONDITION_REQUIRED = 428] = "Precondition Required";
statusCodes[exports.PROCESSING = 102] = "Processing";
statusCodes[exports.PROXY_AUTHENTICATION_REQUIRED = 407] = "Proxy Authentication Required";
statusCodes[exports.REQUEST_HEADER_FIELDS_TOO_LARGE = 431] = "Request Header Fields Too Large";
statusCodes[exports.REQUEST_TIMEOUT = 408] = "Request Timeout";
statusCodes[exports.REQUEST_TOO_LONG = 413] = "Request Entity Too Large";
statusCodes[exports.REQUEST_URI_TOO_LONG = 414] = "Request-URI Too Long";
statusCodes[exports.REQUESTED_RANGE_NOT_SATISFIABLE = 416] = "Requested Range Not Satisfiable";
statusCodes[exports.RESET_CONTENT = 205] = "Reset Content";
statusCodes[exports.SEE_OTHER = 303] = "See Other";
statusCodes[exports.SERVICE_UNAVAILABLE = 503] = "Service Unavailable";
statusCodes[exports.SWITCHING_PROTOCOLS = 101] = "Switching Protocols";
statusCodes[exports.TEMPORARY_REDIRECT = 307] = "Temporary Redirect";
statusCodes[exports.TOO_MANY_REQUESTS = 429] = "Too Many Requests";
statusCodes[exports.UNAUTHORIZED = 401] = "Unauthorized";
statusCodes[exports.UNPROCESSABLE_ENTITY = 422] = "Unprocessable Entity";
statusCodes[exports.UNSUPPORTED_MEDIA_TYPE = 415] = "Unsupported Media Type";
statusCodes[exports.USE_PROXY = 305] = "Use Proxy";

/**
 * @returns {string} get server api URL
 */
export function getServer() {
    let server = store.getState().settings.server;
    return `http://${server}/api/v1`;
}

/**
 * 
 * @param statusCode status code to print
 */

export const getStatusText = function (statusCode: number): string {
    if (statusCodes.hasOwnProperty(statusCode))
        return statusCodes[statusCode];
    return `Unknown: [${statusCode}]`;
};

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

export function serialize(obj: object, prefix: string = undefined) :any {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
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
export function parsePage(object: any): { ok: boolean, list: Array<Object>, prev: string, next: string } {
    if (object && object.Array) {
        return { ok: true, list: object.Array, prev: object.PrevCursor, next: object.NextCursor }
    }
    return { ok: false, list: [], prev: "", next: "" }
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
    formData.append("file", { uri: file, name: name, type: type });

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
            ToastAndroid.show("decoding (request):" + input.format, ToastAndroid.LONG)
            return response.json().then(data => ({ status: response.status, data: data }))
        }
        return { status: response.status, data: null };
    }).then(
        ({ status, data }) => {
            alert(`state: ${status}`);

            if (input.format == 'page') {
                const { ok, list, prev, next } = parsePage(data)
                if (!ok)
                    throw new Error('unexpected response, not a page')
                return { status, list, prev, next }
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
        alert(`Something went wrong.\r\nCheck your connection and try again\r\n${error}`);
        return Promise.reject()
    })
}
