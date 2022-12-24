import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Answers {
    constructor() {
        this.activeQuestion = 1;
        this.test = null;
        this.answers = null;
        this.questions = null;
        // this.userAnswers = [];
        this.routeParams = UrlManager.getQueryParams();
        this.userInfo = Auth.getUserInfo();
        // this.checkAnswers();
        this.init();

    }

    async init() {

        if (!this.userInfo) {
            location.href = '#/';
        }
        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + this.userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.test = result.test;
                    this.questions = result.test.questions;
                    this.showQuestions();
                    return;
                }
            } catch (error) {
                console.log(error);
            }
            location.href = '#/';
        }
    }

    showQuestions() {
        const testName = document.getElementById('test-name');
        testName.innerText = this.test.name;
        const userData = document.getElementById('user-data');
        userData.innerHTML = 'Тест выполнил <span>' + this.userInfo.fullName + ', ' + this.userInfo.email + '</span>';
        const returnToResult = document.getElementById('return-to-result');
        returnToResult.onclick = (() => {
            location.href = '#/result?id=' + this.routeParams.id;
        });
        this.questions.forEach(question => {
            const answersItemsElement = document.getElementById('answers__items');
            const answerItemElement = document.createElement('div');
            answerItemElement.className = 'answer__item';
            const questionElement = document.createElement('div');
            questionElement.className = 'answer__title';
            questionElement.classList.add('question-title');

            questionElement.innerHTML = '<span>Вопрос ' + Number(this.activeQuestion) + ': </span>' + question.question;
            const answerOptions = document.createElement('div');
            answerOptions.className = 'answer__options';


            question.answers.forEach(answer => {
                const answerOption = document.createElement('div');
                answerOption.className = 'answer__option';
                const inputId = 'answer' + answer.id;
                const inputElement = document.createElement('input');
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('name', 'answer-' + this.activeQuestion);
                inputElement.setAttribute('value', answer.id);
                inputElement.setAttribute('id', inputId);

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = answer.answer;
                answerOption.appendChild(inputElement);
                answerOption.appendChild(labelElement);
                answerOptions.appendChild(answerOption);
                if (answer.hasOwnProperty('correct')){
                    if (answer.correct ) {
                        labelElement.style.color = '#5FDC33';
                        inputElement.style.border = '6px solid #5FDC33';
                    } else {
                        labelElement.style.color = '#DC3333';
                        inputElement.style.border = '6px solid #DC3333';
                    }
                }

            })


            answerItemElement.appendChild(questionElement);
            answerItemElement.appendChild(answerOptions);
            answersItemsElement.appendChild(answerItemElement);
            this.activeQuestion++;
        })

    }


    // async checkAnswers() {
    //     try {
    //         const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + this.userInfo.userId);
    //         if (result) {
    //             if (result.error) {
    //                 throw new Error(result.error);
    //             }
    //             this.userAnswers = result.chosen_options;
    //
    //             return;
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    //
    // }
}