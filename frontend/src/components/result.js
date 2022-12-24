import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Result {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.userInfo = Auth.getUserInfo();
        this.init();
        document.getElementById('right-answers').onclick = (() => {
            location.href = '#/answers?id=' + this.routeParams.id ;
        });
    }

    async init() {
        if (!this.userInfo) {
            location.href = '#/';
        }
        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + this.userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    document.getElementById('result__score').innerText = result.score + '/' + result.total;
                    return;
                }

            } catch (error) {
                console.log(error);
            }
            location.href = '#/';
        }

    }
}