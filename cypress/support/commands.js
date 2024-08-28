// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const loginPage = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/pages/loginPage.json");
const lessonElements = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/pages/lessonPage.json");
const trainingElements = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/pages/training.json");

//Авторизация
Cypress.Commands.add('login', (email) => {
    cy.clearCookies();
    cy.visit('/user/my/logout', { auth: { username: 'gcrc', password: 'gc12rc' } });
    cy.get(loginPage.login).type(email);
    cy.get(loginPage.password).type('1234{enter}');
    cy.get(loginPage.logined).should('exist');
});


/* ПРОВЕРКА ДОСТУПНОСТИ И ОТОБРАЖЕНИЯ ТРЕНИНГА */


//Метод для нахождения в списке тренингов тренинга по Id и клик на него
Cypress.Commands.add('clickTraining', (trainingId) => {
    //открыли страницу списка тренингов
    cy.visit('/teach/control', { auth: { username: 'gcrc', password: 'gc12rc' } });
    //кликаем на тренинг
    cy.get(trainingElements.findTrainingById + `"` + trainingId + `"]`).click({ force: false });
    //проверяем url, переадресация произошла
    cy.url().should('eq', trainingElements.trainingViewUrl + trainingId);
});
//В архивированном тренинге отображается заглушка
Cypress.Commands.add('checkArchivedContentTraining', (trainingId) => {
    cy.visit({
        url: `/teach/control/stream/view/id/${trainingId}`,
        auth: { username: 'gcrc', password: 'gc12rc' }
    });
    cy.get('.archived-content').contains('Тренинг в архиве, обратитесь в администрацию').should('be.visible');
    cy.get('.btn').should('have.attr', 'href', '/pl/talks/conversation').and('be.visible');
});
//Проверяем, что недоступный тренинг не отображается в списке тренингов
Cypress.Commands.add('checkHiddenTraining', (trainingId) => {
    //открыли страницу списка тренингов
    cy.visit('/teach/control', { auth: { username: 'gcrc', password: 'gc12rc' } });
    //в списке нет тренинга
    cy.get(`.training-row[data-training-id="${trainingId}"]`).should('not.exist');
});

/* ПРОВЕРКА ДОСТУПНОСТИ И ОТОБРАЖЕНИЯ УРОКА */


//В методе checkNotReachedLesson проверяется отображение в списке уроков как недоступного урока, отображание (если есть (поэтому здесь два метода с разными аргументами)) лейбла с причиной недоступности, проверка, что при клике нет переадресации в тренинг
Cypress.Commands.add('checkNotReachedLessonWithLabel', (lessonId, trainingId, label) => {

    //перешли на страницу тренинга
    cy.visit(trainingElements.trainingViewUrl + trainingId, {
        auth: { username: 'gcrc', password: 'gc12rc' }
    });
    //урок отображается как недоступный
    cy.get(trainingElements.findLessonById + lessonId + trainingElements.notReachedLesson)
        .as('lesson').should('be.visible');

    //на уроке отображается лейб, который передали в метод
    cy.get('@lesson').contains(label).should('be.visible');

    //при клике ничего не происходит
    cy.failedClickOnLesson(lessonId, trainingId);
});
//недоступен без лейблов
Cypress.Commands.add('checkNotReachedLesson', (lessonId, trainingId) => {

    //перешли на страницу тренинга
    cy.visit(trainingElements.trainingViewUrl + trainingId,
        { auth: { username: 'gcrc', password: 'gc12rc' } });

    //урок отображается как недоступный
    cy.get(trainingElements.findLessonById + lessonId + trainingElements.notReachedLesson)
        .as('lesson').should('be.visible');

    //лейбла "есть задание" нет
    cy.get('@lesson').contains('Есть задание').should('not.exist');

    //лейбла "необходимо выполнить задание" нет
    cy.get('@lesson').contains('Необходимо выполнить задание').should('not.exist');

    //лейбла с датой начала нет
    cy.get('@lesson').contains('Дата начала').should('not.exist');

    //лейбла с датой начала нет
    cy.get('@lesson').contains('Дата и время начала').should('not.exist');

    //лейбла "Недоступен" нет
    cy.get('@lesson').contains('Недоступен').should('not.exist');

    //при клике ничего не происходит
    cy.failedClickOnLesson(lessonId, trainingId);
});
//Проверка отображения доступного урока как урока с заданием в списке и открытие его по клику
Cypress.Commands.add('checkReachedLessonWithMission', (lessonId, trainingId) => {

    //перешли на страницу тренинга
    cy.visit(trainingElements.trainingViewUrl + trainingId, {
        auth: { username: 'gcrc', password: 'gc12rc' }
    });

    //урок отображается в списке как доступный с заданием
    cy.get(trainingElements.findLessonById + lessonId + trainingElements.reachedLessonWithMission).as('lesson')
        .contains('Есть задание').should('be.visible');

    //лейбла с датой начала нет
    cy.get('@lesson').contains('Дата начала').should('not.exist');

    //лейбла с датой начала нет
    cy.get('@lesson').contains('Дата и время начала').should('not.exist');

    //лейбла "Недоступен" нет
    cy.get('@lesson').contains('Недоступен').should('not.exist');

    //можно попасть внутрь урока по клику
    cy.successClickOnLesson(lessonId, 'Есть задание');
});
//Проверка отображения доступного урока по расписанию без задания и открытие его по клику
Cypress.Commands.add('checkReachedLessonBySchedule', (lessonId, trainingId, label) => {

    //перешли на страницу тренинга
    cy.visit(trainingElements.trainingViewUrl + trainingId, {
        auth: { username: 'gcrc', password: 'gc12rc' }
    });

    //урок отображается в списке как доступный и отображается дата начала
    cy.get(trainingElements.findLessonById + lessonId + trainingElements.reachedLesson).as('lesson')
        .contains(label).should('be.visible');

    //лейбла "есть задание" нет
    cy.get('@lesson').contains('Есть задание').should('not.exist');

    //можно попасть внутрь урока по клику и передаем дату начала, чтобы проверить, что внутри она тоже указана
    cy.successClickOnLesson(lessonId, label);
});
//Проверка отображения доступного урока без лейблов
Cypress.Commands.add('checkOrdinaryReachedLesson', (lessonId, trainingId) => {

    //перешли на страницу тренинга
    cy.visit(trainingElements.trainingViewUrl + trainingId, {
        auth: { username: 'gcrc', password: 'gc12rc' }
    });

    //урок отображается в списке как доступный
    cy.get(trainingElements.findLessonById + lessonId + trainingElements.reachedLesson).as('lesson').should('be.visible');

    //лейбла "есть задание" нет
    cy.get('@lesson').contains('Есть задание').should('not.exist');

    //лейбла "Необходимо выполнить задание" нет
    cy.get('@lesson').contains('Необходимо выполнить задание').should('not.exist');

    //лейбла "Необходимо выполнить задание (стоп-урок)" нет
    cy.get('@lesson').contains('Необходимо выполнить задание (стоп-урок)').should('not.exist');

    //лейбла с датой начала нет
    cy.get('@lesson').contains('Дата начала').should('not.exist');

    //лейбла с датой начала нет
    cy.get('@lesson').contains('Дата и время начала').should('not.exist');

    //лейбла "Недоступен" нет
    cy.get('@lesson').contains('Недоступен').should('not.exist');

    //можно попасть внутрь урока по клику и передаем лейбл "Доступен"
    cy.successClickOnLesson(lessonId, 'Доступен');
});
//Проверка отображения доступного выполненного урока и открытие его по клику
Cypress.Commands.add('checkAccomplishedLesson', (lessonId, trainingId) => {
    //перешли на страницу тренинга
    cy.visit(trainingElements.trainingViewUrl + trainingId, {
        auth: { username: 'gcrc', password: 'gc12rc' }
    });

    //урок отображается в списке как доступный с заданием
    cy.get(trainingElements.findLessonById + lessonId + trainingElements.accomplishedLesson).as('lesson')
        .should('be.visible');

    //лейбла "есть задание" нет
    cy.get('@lesson').contains('Есть задание').should('not.exist');

    //лейбла с датой начала нет
    cy.get('@lesson').contains('Дата начала').should('not.exist');

    //лейбла с датой начала нет
    cy.get('@lesson').contains('Дата и время начала').should('not.exist');

    //лейбла "Недоступен" нет
    cy.get('@lesson').contains('Недоступен').should('not.exist');

    //можно попасть внутрь урока по клику
    cy.successClickOnLesson(lessonId, 'Задание выполнено');
});
//Проверка отображения доступного урока с заданием в статусе "Задание ожидает проверки" и открытие его по клику
Cypress.Commands.add('checkAnsweredLesson', (lessonId, trainingId) => {
    //перешли на страницу тренинга
    cy.visit(trainingElements.trainingViewUrl + trainingId, {
        auth: { username: 'gcrc', password: 'gc12rc' }
    });

    //урок отображается в списке как доступный с отправленным заданием на проверку
    cy.get(trainingElements.findLessonById + lessonId + '.user-state-answered').as('lesson')
        .should('be.visible');

    //лейбла "есть задание" нет
    cy.get('@lesson').contains('Есть задание').should('not.exist');

    //лейбла с датой начала нет
    cy.get('@lesson').contains('Дата начала').should('not.exist');

    //лейбла с датой начала нет
    cy.get('@lesson').contains('Дата и время начала').should('not.exist');

    //лейбла "Недоступен" нет
    cy.get('@lesson').contains('Недоступен').should('not.exist');

    //можно попасть внутрь урока по клику
    cy.successClickOnLesson(lessonId, 'Ответ ожидает проверки');
});
//Кликаем на урок и происходит переадресация в урок
Cypress.Commands.add('successClickOnLesson', (lessonId, label) => {

    //кликаем на урок
    cy.get(trainingElements.findLessonById + lessonId).click({ force: false });

    //проверяем url, мы попали внутрь урока
    cy.url().should('eq', lessonElements.url1 + lessonId + lessonElements.url2);

    //проверяем содержимый контент урока
    cy.get(lessonElements.checkedBlock).contains(lessonElements.content).should('be.visible');

    if (label) {
        //проверяем, что внутри урока указан нужный лейбл
        cy.get('.user-state-label').contains(label).should('be.visible');
    };

});
//При клике ничего не происходит
Cypress.Commands.add('failedClickOnLesson', (lessonId, trainingId) => {

    //кликаем на урок
    cy.get(trainingElements.findLessonById + lessonId + trainingElements.notReachedLesson).click({ force: false });

    //проверяем url, переадресации не произошло
    cy.url().should('eq', trainingElements.trainingViewUrl + trainingId);

});
//Проверка отсутствия в списке урока, который не отображается
Cypress.Commands.add('checkHiddenLesson', (lessonId, trainingId) => {

    //перешли на страницу тренинга
    cy.visit(trainingElements.trainingViewUrl + trainingId, {
        auth: { username: 'gcrc', password: 'gc12rc' }
    });

    //урок не отображается в списке
    cy.get(trainingElements.findLessonById + lessonId).should('not.exist');
});


/* REQUESTS */


//Запрос на доступность урока, возвращает код ответа
Cypress.Commands.add('getResponseForAccessLesson', (lessonId) => {
    cy.request({
        url: lessonElements.url1 + lessonId,
        auth: { username: 'gcrc', password: 'gc12rc' },
        failOnStatusCode: false
    }).then((response) => {
        return response;
    });
});
//Запрос по ссылке
Cypress.Commands.add('getResponseForAccess', (link) => {
    cy.request({
        url: link,
        auth: { username: 'gcrc', password: 'gc12rc' },
        failOnStatusCode: false
    }).then((response) => {
        return response;
    });
});
//Запрос отсутствие доступа к уроку через визит, так как обычный запрос вернет 200
Cypress.Commands.add('visitLessonForCheckAccess', (lessonId) => {
    //открываем страницу урока
    cy.visit(lessonElements.url1 + lessonId, {
        auth: {
            username: 'gcrc',
            password: 'gc12rc'
        }
    });
    //проверяем url страницы, попали на заглушку из-за отсутствие доступа
    cy.url().should('eq', lessonElements.urlNotReachedLesson + lessonId);

    //проверка информации об отсутствии доступа
    cy.get(lessonElements.panelNotReached).contains('Нет доступа').should('be.visible');
    cy.get(lessonElements.panelNotReached).contains('У вас нет доступа к этому уроку').should('be.visible');
});
//Запрос отсутствие доступа к архивированному уроку через визит, так как обычный запрос вернет 200
Cypress.Commands.add('checkArchivedContentLesson', (lessonId) => {
    cy.visit({
        url: `/pl/teach/control/lesson/view?id=${lessonId}`,
        auth: { username: 'gcrc', password: 'gc12rc' }
    });
    cy.get('.archived-content').contains('Тренинг в архиве, обратитесь в администрацию').should('be.visible');
    cy.get('.btn').should('have.attr', 'href', '/pl/talks/conversation').and('be.visible');
});


/*  ЛЕНТА ОТВЕТОВ  */


//Проверяем, что в ленте ответов отображается ответ, оставленный в архивированном тренинге
Cypress.Commands.add('archivedAnswerInAnswersPage', (trainingName, lessonName, answerId, answerText) => {
    cy.visit(`/teach/control/answers/my`, {
        auth: { username: 'gcrc', password: 'gc12rc' }
    });
    cy.get('.filter-list').contains(trainingName).click({ force: true });
    cy.get('.selected').contains(lessonName).click({ force: true });
    cy.get('.col-md-8 > h3').contains(trainingName + '. ' + lessonName)
        .should('be.visible');
    cy.get(`.user-answer[data-id="${answerId}"]`).contains(answerText).should('be.visible');
    cy.get(`.user-answer[data-id="${answerId}"] .answer-status-label`)
        .contains('Задание ожидает проверки').should('be.visible');
    cy.get('.answer-edit-link').contains('Редактировать ответ').should('be.visible');
    //нет поля для ввода комментария
    cy.get(`.user-answer[data-id="${answerId}"] .new-comment-textarea`).should('not.exist');
});

//Проверяем, что в ленте ответов отображается ответ, оставленный в доступном тренинге
Cypress.Commands.add('ordinaryAnswerInAnswersPage', (trainingName, lessonName, answerId, answerText) => {
    cy.visit(`/teach/control/answers/my`, {
        auth: { username: 'gcrc', password: 'gc12rc' }
    });
    cy.get('.filter-list').contains(trainingName).click({ force: true });
    cy.get('.selected').contains(lessonName).click({ force: true });
    cy.get('.col-md-8 > h3').contains(trainingName + '. ' + lessonName)
        .should('be.visible');
    cy.get(`.user-answer[data-id="${answerId}"]`).contains(answerText).should('be.visible');
    cy.get(`.user-answer[data-id="${answerId}"] .answer-status-label`)
        .contains('Задание ожидает проверки').should('be.visible');
    cy.get('.answer-edit-link').contains('Редактировать ответ').should('be.visible');
    cy.get(`.user-answer[data-id="${answerId}"] .new-comment-textarea`).should('be.visible');
});


/*  ДЕЙСТВИЯ АДМИНИСТРАТОРА/УЧИТЕЛЯ  */


Cypress.Commands.add('declineAnswer', (answerId) => {
    cy.visit(`/teach/control/answers/review?id=${answerId}`, {
        auth: { username: 'gcrc', password: 'gc12rc' }
    });
    cy.get('.btn-decline-action').contains('Отклонить').click({ force: true });
    cy.get('.answer-status-label').contains('Задание не принято').should('be.visible');
});

Cypress.Commands.add('deleteAnswer', (answerId) => {
    cy.visit(`/teach/control/answers/review?id=${answerId}`, {
        auth: { username: 'gcrc', password: 'gc12rc' }
    });
    cy.get('.dropdown-toggle').contains('Действия').click();
    cy.get('.action-link').contains('Удалить').click({ force: true });

    //проверяем, что ответ удален и код ответа 404
    cy.request({
        url: `/teach/control/answers/review?id=${answerId}`,
        auth: {
            username: 'gcrc', password: 'gc12rc'
        },
        failOnStatusCode: false
    }).then((response) => {
        expect(response.status).to.eq(404)
    });
})

Cypress.Commands.add('acceptAnswer', (answerId) => {
    cy.visit(`/teach/control/answers/review?id=${answerId}`, {
        auth: { username: 'gcrc', password: 'gc12rc' }
    });
    cy.get('.btn-main-action').contains('Принять').click({ force: true });
    cy.get('.answer-status-label').contains('Задание принято').should('be.visible');
});