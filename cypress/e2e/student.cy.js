const users = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/users1.json");
const lessonElements = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/pages/lessonPage.json");

describe('Ученик. Основные действия в уроке', () => {

    const trainingId = 875708082;
    const lessonId = 327148856;
    let answerId;
    const userId = 373339797;
    let commentParentId;
    let commentChildId;

    before('Авторизация', () => {
        cy.login(users.lena.email);
    });

    it('Отображение урока в списке тренинге, если ответ на задание еще не отправлен', () => {

        cy.clickTraining(trainingId);
        cy.get(`.lesson-id-${lessonId} .user-state-label`)
            .contains('Есть задание').should('be.visible');
        cy.get(`.user-state-has_mission[data-lesson-id="${lessonId}"]`).should('be.visible');

    });

    it('Проверка содержимого урока', () => {
        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get('.breadcrumb').contains('Список тренингов').should('be.visible');
        cy.get('h1').contains('проверочный тренинг для ученика').should('be.visible');
        cy.get('.lesson-title-value').contains('первый урок').should('be.visible');
        cy.get('.user-state-label').contains('Есть задание').should('be.visible');
        cy.get('h3').contains('Задание').should('be.visible');
        cy.get(lessonElements.answerField).should('have.attr', 'placeholder', 'Ваш ответ').and('be.visible');
        cy.get('.uploadifive-button:first').contains('Добавить файлы').should('be.visible');
        cy.contains('максимальный размер файла - 100мб').should('be.visible');
        cy.get('.field-lessonanswer-answer_text .emoji-button').should('be.visible');
        cy.get('.lesson-answers-title').contains('Ответы и комментарии').should('be.visible');
        cy.get('.new-comment-textarea:first').should('have.attr', 'placeholder', 'добавить комментарий к уроку (ответ на задание здесь давать не нужно)').and('be.visible');
        cy.get('#answers').contains('старые ответы').should('be.visible');
        cy.get('#answers').contains('новые ответы').should('be.visible');
        cy.get('#answers').contains('сначала').should('be.visible');
        cy.get('.answer-text').contains('это комментарий от администратора: всем привет!').should('be.visible');
        cy.get('.new-comment-textarea:last').should('have.attr', 'placeholder', 'добавить комментарий к ответу').and('be.visible');
    });

    it('Можно сохранить ответ как черновик', () => {
        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get(lessonElements.answerField).type('Ответ из автотеста').should('have.value', 'Ответ из автотеста');
        cy.get('.btn-link').contains('Сохранить черновик').click({ force: true });
        cy.reload();
        cy.get('.why-no-form').contains('У вас есть черновик ответа на это задание').should('be.visible');
        cy.get(lessonElements.answerField).should('have.value', 'Ответ из автотеста');
        cy.contains('Статус: Черновик').should('be.visible');
        cy.get('.btn').contains('Отправить ответ').should('be.visible');
        cy.get('.btn-link').contains('Сохранить черновик').should('be.visible');
        cy.get('.user-state-label').contains('Есть задание').should('be.visible');
    });

    it('Сохраненный черновик можно отправить как ответ на задание', () => {
        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get(lessonElements.answerField).should('have.value', 'Ответ из автотеста');

        cy.get(lessonElements.sendAnswer).contains('Отправить ответ').click({ force: true });
        cy.reload();
        cy.get(`.user-answer[data-user-id="${userId}"]:first`).invoke('attr', 'data-id')
            .then((answer) => {
                answerId = answer;
            });

        cy.get('.answer-status-label').contains('Задание ожидает проверки').should('be.visible');
        cy.get('.self-answers').contains('Ответ из автотеста').should('be.visible');
        cy.get(lessonElements.editAnswer).contains('Редактировать ответ').should('be.visible');
        cy.get('.new-comment-textarea-level-1').should('have.attr', 'placeholder', 'добавить комментарий к ответу').and('be.visible');
        cy.get('.user-state-label').contains('Ответ ожидает проверки').should('be.visible');
    });

    it('Можно отредактировать отправленный ответ в статусе "Задание ожидает проверки"', () => {
        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get(lessonElements.editAnswer).click();

        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/answers/edit?id=${answerId}`);

        cy.get('h1').contains('Ответ #' + answerId + ' на урок "первый урок"').should('be.visible');
        cy.get('.page-actions .btn').contains('Вернуться к просмотру').should('be.visible');
        cy.contains('Статус: Задание ожидает проверки').should('be.visible');
        cy.get(lessonElements.answerField).should('have.value', 'Ответ из автотеста');
        cy.get('.uploadifive-button:first').contains('Добавить файлы').should('be.visible');
        cy.contains('максимальный размер файла - 100мб').should('be.visible');
        cy.get('.field-lessonanswer-answer_text .emoji-button').should('be.visible');
        cy.get(lessonElements.sendAnswer).should('be.visible');

        cy.get('.page-actions .btn').contains('Вернуться к просмотру').click();

        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lessonId}&editMode=0#answer${answerId}`);

        cy.get(lessonElements.editAnswer).click();
        cy.get(lessonElements.answerField).clear().type('Отредактированный ответ из автотеста').should('have.value', 'Отредактированный ответ из автотеста');
        cy.get(lessonElements.sendAnswer).click();
        cy.reload();
        cy.get(lessonElements.answerField).should('have.value', 'Отредактированный ответ из автотеста');
    });

    it('Можно отправить комментарий в ленту комментариев', () => {
        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get('.answer-comment .new-comment-textarea').type('Комментарий из автотеста')
            .should('have.value', 'Комментарий из автотеста');
        cy.get('.answer-comment > .btn').click();

        cy.reload();
        cy.reload(); // не всегда отображается комментарий при первом обновлении страницы

        cy.get(`.user-answer[data-user-id="${userId}"]:last`).invoke('attr', 'data-id')
            .then((comment) => {
                commentParentId = comment;
                console.log('commentParentId ' + commentParentId);
            });

        cy.get(`.user-answer[data-user-id="${userId}"]`)
            .contains('Комментарий из автотеста').should('be.visible');
    });

    it('Можно отправить комментарий к комментарию в ленте комментариев', () => {
        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get(`.user-answer[data-id="${commentParentId}"]`);
        cy.get(`#commentReplyForm-${commentParentId}-8 .new-comment-textarea`).type('Комментарий к комментарию в автотесте').should('have.value', 'Комментарий к комментарию в автотесте');
        cy.get(`#commentReplyForm-${commentParentId}-8 .btn`).click();
        cy.get(`.user-answer[data-id="${commentParentId}"] .comment`).invoke('attr', 'data-id')
            .then((commentChild) => {
                commentChildId = commentChild;
                console.log('commentChildId ' + commentChildId);
                cy.get(`.comment[data-id="${commentChild}"]`).contains('Комментарий к комментарию в автотесте');
            });
    });

    it('Оставленный ответ отображается в ленте ответов', () => {
        cy.visit(`/teach/control/answers/my`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.reload();
        cy.get('.filter-list').contains('проверочный тренинг для ученика').click({ force: true });
        cy.get('.selected').contains('первый урок').click({ force: true });
        cy.get('.col-md-8 > h3').contains('проверочный тренинг для ученика. первый урок')
            .should('be.visible');
        cy.get(`.user-answer[data-id="${answerId}"]`).contains('Отредактированный ответ из автотеста').should('be.visible');
        cy.get(`.user-answer[data-id="${answerId}"] .answer-status-label`)
            .contains('Задание ожидает проверки').should('be.visible');
        cy.get(`.user-answer[data-id="${answerId}"] .new-comment-textarea`).should('be.visible');
    });

    it('Оставленный комментарий отображается в ленте ответов', () => {
        cy.visit(`/teach/control/answers/my`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.reload();
        cy.get('.filter-list').contains('проверочный тренинг для ученика').click({ force: true });
        cy.get('.selected').contains('первый урок').click({ force: true });
        cy.get('.col-md-8 > h3').contains('проверочный тренинг для ученика. первый урок')
            .should('be.visible');
        cy.get(`.user-answer[data-id="${commentParentId}"]`)
            .contains('Комментарий из автотеста').should('be.visible');
        cy.get(`.user-answer[data-id="${commentParentId}"] .answer-status-label`).should('not.exist');
        cy.get(`.user-answer[data-id="${commentParentId}"] .new-comment-textarea`).should('be.visible');
    });

    it('Удаление ответа и комментария', () => {
        cy.login(users.admin.email);
        cy.deleteAnswer(answerId);
        cy.deleteAnswer(commentParentId);
    });

})