const trainingElements = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/pages/training.json");
const lessonElements = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/pages/lessonPage.json");
const generalElements = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/pages/general.json");
const users = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/users1.json");

describe('Доступ по обычной покупке. Проверка расписания', () => {

    before('Авторизация', () => {
        cy.login(users.lena.email);
    });

    it('Можно зайти в тренинг по ссылке из списка тренингов', () => {

        const trainingIdList = [860208557, 860870424, 868122525];

        trainingIdList.forEach((trainingId) => {
            cy.clickTraining(trainingId);
        });
    });

    it('Общее расписание. Урок без расписания', () => {

        const trainingId = 860208557;
        const lessonId = 323517859;

        //проверяем, что урок отображается как доступный с заданием, по клику попадаем внутрь урока
        cy.checkReachedLessonWithMission(lessonId, trainingId);

        //есть доступ к уроку (200)
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
    });

    it('Общее расписание. Урок недоступен но показывается', () => {

        const trainingId = 860208557;
        const lessonId = 323518126;

        //проверка отображения урока и попытки кликнуть на урок
        cy.checkNotReachedLessonWithLabel(lessonId, trainingId, 'Недоступен до Вт 01 Янв 2030');

        //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
        cy.visitLessonForCheckAccess(lessonId);
    });

    it('Общее расписание. Урок недоступен и не отображается', () => {

        const trainingId = 860208557;
        const lessonId = 323518105;

        //урок НЕ отображается в списке
        cy.checkHiddenLesson(lessonId, trainingId);

        //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
        cy.visitLessonForCheckAccess(lessonId);
    });

    it('Общее расписание. Урок доступен до начала', () => {

        const trainingId = 860208557;
        const lessonId = 323518134;

        //проверяем отображение урока в списке, надпись о дате начала, отсутствии лейбла с заданием и открытие его по клику
        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Дата начала Вт 01 Янв 2030');

    });

    it('Индивидуальное расписание. Урок недоступен но показывается', () => {

        const trainingId = 860870424;
        const lessonId = 323622236;

        //проверка отображения урока в списке
        cy.checkNotReachedLessonWithLabel(lessonId, trainingId, 'Недоступен до Вт 25 Июл 2051');

        //проверка отсутствия доступа по прямой ссылке
        cy.visitLessonForCheckAccess(lessonId);
    });

    it('Индивидуальное расписание. Урок недоступен и не показывается', () => {

        const trainingId = 860870424;
        const lessonId = 323622233;

        //проверка НЕ отображения урока в списке
        cy.checkHiddenLesson(lessonId, trainingId);

        //проверка отсутствия доступа по прямой ссылке
        cy.visitLessonForCheckAccess(lessonId);

    });

    it('Индивидуальное расписание. Урок доступен до начала', () => {

        const trainingId = 860870424;
        const lessonId = 323622239;

        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Дата и время начала Пт 28 Июл 2051');

    });

    it('Индивидуальное расписание. Дата и время наступили', () => {

        const trainingId = 860870424;
        const lessonId = 323622226;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId);

    });

    it('Индивидуальное расписание. Включена настройка "Не показывать урок, пока он недоступен", дата наступила', () => {

        const trainingId = 868122525;
        const lessonId = 325149897;

        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Дата и время начала Чт 28 Мар 17:33');

    });

    it('Индивидуальное расписание. Включена настройка "Не показывать урок, пока он недоступен", доступен до начала', () => {

        const trainingId = 868122525;
        const lessonId = 325149902;

        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Дата и время начала Пт 11 Июн 2032');
    });

    it('Включена настройка "Не показывать урок, пока он недоступен", недоступные уроки (показывается и не показывается в списке)', () => {

        const trainingId = 868122525;
        const listLessons = [325149898, 325149900];

        listLessons.forEach((lesson) => {

            cy.checkHiddenLesson(lesson, trainingId);
            cy.visitLessonForCheckAccess(lesson);

        })
    });
});

describe('Доступ по обычной покупке. Проверка стоп-уроков', () => {

    const trainingId = 861367841;

    //под ru2hm@yandex.ru
    before('Авторизация', () => {
        cy.login(users.lena.email);
    });

    beforeEach('Переадресация на страницу тренинга', () => {

        cy.visit(trainingElements.trainingViewUrl + trainingId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
    });

    it('Можно зайти в тренинг по ссылке из списка тренингов', () => {

        const trainingId = 861367841;

        cy.clickTraining(trainingId);

    });

    //ru2hm@yandex.ru
    it('Урок после стоп-урока "пока не выполнят этот урок", ученик выполнил условие, доступ есть', () => {

        const stopLessonId = 323678451;
        const lessonId = 323678584;

        //стоп-урок отображается как выполненный
        cy.get(`.lesson-id-${stopLessonId}` + trainingElements.accomplishedLesson).should('be.visible');

        //проверочный урок отображается как доступный
        cy.checkOrdinaryReachedLesson(lessonId, trainingId);

    });

    it('Урок после стоп-урока "пока не выполнят все предыдущие", ученик выполнил условие, доступ есть', () => {

        const stopLessonId = 323678796;
        const lessonId = 323679011;

        //стоп-урок отображается как выполненный
        cy.get(`.lesson-id-${stopLessonId}` + trainingElements.accomplishedLesson).should('be.visible');

        //проверочный урок отображается как доступный
        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
    });

    it('Урок после стоп-урока "отложенный", ответ на проверка, доступ есть', () => {

        const stopLessonId = 323679113;
        const lessonId = 323681018;

        //стоп-урок отображается как отвеченный
        cy.get(`.lesson-id-${stopLessonId}` + trainingElements.answeredLesson).should('be.visible');

        //проверочный доступен
        cy.checkReachedLessonWithMission(lessonId, trainingId);
    });

    it('Урок после стоп-урока "пока не выполнят все важные", ученик выполнил условие, доступ есть', () => {

        const stopLessonId = 323680074;
        const lessonId = 323680204;
        const importantLessonId = 323679242;

        //важный урок отображается как выполненный
        cy.get(`.lesson-id-${importantLessonId}` + trainingElements.accomplishedLesson).should('be.visible');

        //стоп-урок отображается как необходимо выполнить
        cy.get(`.lesson-id-${stopLessonId}` + trainingElements.needAccomplish).should('be.visible');

        //проверочный доступен без лейблов
        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
    });

    it('Урок "доступен вне зависимости от стоп-уроков", доступ есть', () => {

        const stopLessonId = 323932000;
        const lessonId = 323680424;

        //стоп-урок отображается как недоступный
        cy.get(`.lesson-id-${stopLessonId}` + trainingElements.notReachedLesson).should('be.visible');

        //проверочный доступен без лейблов
        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
    });

    //yana@test.ru
    it('Урок после стоп-урока "пока не выполнят этот урок", ученик не выполнил условие, доступа нет', () => {

        const stopLessonId = 323678451;
        const lessonId = 323678584;

        //yana@test.ru
        cy.login(users.yana.email);

        cy.visit(trainingElements.trainingViewUrl + trainingId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //стоп-урок отображается как требующий выполнить задание
        cy.get(`.lesson-id-${stopLessonId}` + trainingElements.needAccomplish).should('be.visible');

        //проверочный урок недоступен без лейблов
        cy.checkNotReachedLesson(lessonId, trainingId);
    });

    it('ПРОМОУРОК после стоп-урока "пока не выполнят этот урок", ученик не выполнил условие, доступа нет', () => {

        const lessonId = 325144953;
        const stopLessonId = 323678451;

        //стоп-урок отображается как требующий выполнить задание
        cy.get(`.lesson-id-${stopLessonId}` + trainingElements.needAccomplish).should('be.visible');

        //проверочный урок недоступен без лейблов
        cy.checkNotReachedLesson(lessonId, trainingId);
    });

    //maksim@test.ru
    it('Урок после отложенного стоп-урока, ученик выполнил условия, а затем ответ отклонен, доступа нет', () => {

        const lessonId = 323681018;
        const stopLessonId = 323679113;
        const userId = 373549198;

        //maksim@test.ru
        cy.login(users.maksim.email);

        cy.visit(trainingElements.trainingViewUrl + trainingId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //стоп-урок отображается как требующий выполнить задание
        cy.get(`.lesson-id-${stopLessonId}` + trainingElements.needAccomplish).should('be.visible');

        //проверочный урок недоступен с лейблом "Недоступен"
        cy.checkNotReachedLessonWithLabel(lessonId, trainingId, 'Недоступен');

        //оставляем ответ в отложенном уроке 
        cy.visit(`/pl/teach/control/lesson/view?id=${stopLessonId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get('#LessonAnswer_answer_text').type('Ответ из автотеста').should('have.value', 'Ответ из автотеста');
        cy.get('.btn-send-answer').contains('Отправить ответ').click({ force: true });
        cy.reload();
        cy.get('.answer-status-label').contains('Задание ожидает проверки').should('be.visible');
        cy.get(`.user-answer[data-user-id="${userId}"]`).invoke('attr', 'data-id')
            .then((answerId) => {
                cy.wrap(answerId).as('answer_id');
            });

        //проверяем, что урок стал доступен
        cy.checkReachedLessonWithMission(lessonId, trainingId);

        //****************************
        //от лица админа отклоняем ответ
        cy.login(users.admin.email);
        cy.get('@answer_id')
            .then((answerId) => {
                cy.declineAnswer(answerId);
            });

        //****************************
        //от лица ученика проверяем, что урок недоступен
        cy.login(users.maksim.email);
        cy.checkNotReachedLessonWithLabel(lessonId, trainingId, 'Недоступен');

        //****************************
        //от лица администратора удаляем ответ
        cy.login(users.admin.email);
        cy.get('@answer_id')
            .then((answerId) => {
                cy.deleteAnswer(answerId);
            });
    });

    it('Урок после отложенного стоп-урока, ответ отклонен в отложенном, но в проверочном успели его принять, доступ есть', () => {

        const lessonId = 323681018;
        const stopLessonId = 323679113;
        const userId = 373549198;

        //maksim@test.ru
        cy.login(users.maksim.email);

        cy.visit(trainingElements.trainingViewUrl + trainingId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //отложенный стоп-урок отображается как требующий выполнить задание
        cy.get(`.lesson-id-${stopLessonId}` + trainingElements.needAccomplish).should('be.visible');

        //проверочный урок недоступен с лейблом "Недоступен"
        cy.checkNotReachedLessonWithLabel(lessonId, trainingId, 'Недоступен');

        //оставляем ответ в отложенном уроке
        cy.visit(`/pl/teach/control/lesson/view?id=${stopLessonId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get('#LessonAnswer_answer_text').type('Ответ из автотеста').should('have.value', 'Ответ из автотеста');
        cy.get('.btn-send-answer').contains('Отправить ответ').click({ force: true });
        cy.reload();
        cy.get('.answer-status-label').contains('Задание ожидает проверки').should('be.visible');
        cy.get(`.user-answer[data-user-id="${userId}"]`).invoke('attr', 'data-id')
            .then((answerId) => {
                cy.wrap(answerId).as('answer_in_stop_lesson');
            });

        //оставляем ответ в проверочном уроке
        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('#LessonAnswer_answer_text').type('Ответ из автотеста').should('have.value', 'Ответ из автотеста');
        cy.get('.btn-send-answer').contains('Отправить ответ').click({ force: true });
        cy.reload();
        cy.get('.answer-status-label').contains('Задание ожидает проверки').should('be.visible');
        cy.get(`.user-answer[data-user-id="${userId}"]`).invoke('attr', 'data-id')
            .then((answerId) => {
                cy.wrap(answerId).as('answer_in_check_lesson');
            });

        //****************************
        //от лица админа принимаем ответ в проверочном уроке и отклоняем в отложенном стоп уроке
        cy.login(users.admin.email);
        cy.get('@answer_in_check_lesson').then((answerId) => {
            cy.acceptAnswer(answerId);
        });
        cy.get('@answer_in_stop_lesson').then((answerId) => {
            cy.declineAnswer(answerId);
        });

        //****************************
        //от лица ученика проверяем, что урок доступен
        cy.login(users.maksim.email);
        //проверочный урок отображается как доступный с выполненным заданием
        cy.checkAccomplishedLesson(lessonId, trainingId);

        //****************************
        //от лица администратора удаляем ответы
        cy.login(users.admin.email);
        cy.get('@answer_in_check_lesson').then((answerId) => {
            cy.deleteAnswer(answerId);
        });
        cy.get('@answer_in_stop_lesson').then((answerId) => {
            cy.deleteAnswer(answerId);
        });
    });
});

describe('В предложении отключены стоп-уроки, но действует расписание', () => {

    //юзер mariarty@test.ru
    before('Авторизация', () => {
        cy.login(users.mariarty.email);
    });

    it('Можно зайти в тренинг по ссылке из списка тренингов', () => {

        const trainingIdList = [868207435, 861367841, 868346440];

        trainingIdList.forEach((trainingId) => {
            cy.clickTraining(trainingId);
        });
    });

    it('Индивидуальное расписание. Урок после стоп-урока и датой начала, которая уже наступила', () => {

        const trainingId = 868207435;
        const lessonId = 325171024;

        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Дата и время начала Пт 29 Мар 10:31');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
    });

    it('Индивидуальное расписание. Урок после отложенного стоп-урока и датой начала, которая уже наступила', () => {

        const trainingId = 868207435;
        const lessonId = 325171028;

        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Дата и время начала Пт 29 Мар 10:31');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
    });

    it('Индивидуальное расписание. Урок после стоп-урока и настройкой "Доступен до начала"', () => {

        const trainingId = 868207435;
        const lessonId = 325171031;

        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Дата и время начала Пн 14 Авг 2051');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });

    });

    it('Индивидуальное расписание. Урок после стоп-урока и настройкой "Недоступен, но отображается"', () => {
        const trainingId = 868207435;
        const lessonId = 325171030;

        cy.checkNotReachedLessonWithLabel(lessonId, trainingId, 'Недоступен до Пн 14 Авг 2051');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
        cy.visitLessonForCheckAccess(lessonId);
    });

    it('Индивидуальное расписание. Урок после стоп-урока и настройкой "Недоступен и не показывается"', () => {

        const trainingId = 868207435;
        const lessonId = 325171029;

        cy.checkHiddenLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
        cy.visitLessonForCheckAccess(lessonId);
    });

    it('Без расписания. Урок после стоп-урока "пока не выполнят этот урок"', () => {
        const trainingId = 861367841;
        const lessonId = 323678584;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
    });

    it('Без расписания. Урок после стоп-урока "пока не выполнят все предыдущие"', () => {
        const trainingId = 861367841;
        const lessonId = 323679011;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
    });

    it('Без расписания. Урок после отложенного стоп-урока', () => {
        const trainingId = 861367841;
        const lessonId = 325172791;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
    });

    it('Без расписания. Урок после стоп-урока "пока не выполнят все важные"', () => {
        const trainingId = 861367841;
        const lessonId = 323680204;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
    });

    it('Без расписания. Скрытый урок', () => {

        const trainingId = 861367841;
        const lessonId = 325172939;

        cy.checkHiddenLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Общее расписание. Урок после стоп-урока и датой начала, которая уже наступила', () => {

        const trainingId = 868346440;
        const lessonId = 325223468;

        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Дата начала Пт 01 Мар');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
    });

    it('Общее расписание. Урок после отложенного стоп-урока и датой начала, которая уже наступила', () => {

        const trainingId = 868346440;
        const lessonId = 325223470;

        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Дата начала Пт 01 Мар');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
    });

    it('Общее расписание. Урок после стоп-уроков и настройкой "доступен до расписания"', () => {

        const trainingId = 868346440;
        const lessonId = 325223473;

        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Дата и время начала Сб 21 Дек 2030');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
    });

    it('Общее расписание. Урок после стоп-урока и настройкой "Недоступен, но отображается"', () => {

        const trainingId = 868346440;
        const lessonId = 325223472;

        cy.checkNotReachedLessonWithLabel(lessonId, trainingId, 'Недоступен до Сб 21 Дек 2030');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
        cy.visitLessonForCheckAccess(lessonId);
    });

    it('Общее расписание. Урок после стоп-урока и настройкой "Недоступен и не показывается"', () => {
        const trainingId = 868346440;
        const lessonId = 325223471;

        cy.checkHiddenLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
        cy.visitLessonForCheckAccess(lessonId);
    });

    it('Общее расписание. Расписания нет, но урок стоит после всех уроков с расписанием', () => {
        const trainingId = 868346440;
        const lessonId = 325243643;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200)
        });
    })
});

describe('Доступ только к урокам для тест-драйва', () => {

    //юзер sheldon@test.ru
    before('Авторизация', () => {
        cy.login(users.sheldon.email);
    });

    it('Можно зайти в тренинг по ссылке из списка тренингов', () => {
        const trainingIdList = [860208557, 860870424, 861367841];

        trainingIdList.forEach((trainingId) => {
            cy.clickTraining(trainingId);
        });
    });

    it('Обычный урок, 403', () => {
        const trainingId = 860208557;
        const lessonId = 323517859;

        cy.checkNotReachedLessonWithLabel(lessonId, trainingId, 'Недоступен');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(403);
        });
    });

    it('Промоурок, 403', () => {
        const trainingId = 860208557;
        const lessonId = 323517863;

        cy.checkNotReachedLessonWithLabel(lessonId, trainingId, 'Недоступен');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(403);
        });
    });

    it('Урок для тест-драйва, есть доступ', () => {
        const trainingId = 860208557;
        const lessonId = 323517866;

        cy.checkReachedLessonWithMission(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Урок для тест-драйва, скрытый, 403', () => {

        const trainingId = 860208557;
        const lessonId = 323518095;

        cy.checkHiddenLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(403);
        });
    });

    it('Урок для тест-драйва. Общее расписание. Недоступен но показывается', () => {
        const trainingId = 860208557;
        const lessonId = 323518133;

        cy.checkNotReachedLessonWithLabel(lessonId, trainingId, 'Недоступен до Вт 01 Янв 2030');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
        cy.visitLessonForCheckAccess(lessonId);
    });

    it('Урок для тест-драйва. Общее расписание. Урок недоступен и не отображается', () => {

        const trainingId = 860208557;
        const lessonId = 323518122;

        cy.checkHiddenLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
        cy.visitLessonForCheckAccess(lessonId);
    });

    it('Урок для тест-драйва. Общее расписание. Урок доступен до начала', () => {
        const trainingId = 860208557;
        const lessonId = 323518137;

        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Дата начала Вт 01 Янв 2030');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Урок для тест-драйва. Индивидуальное расписание. Урок доступен до начала', () => {
        const trainingId = 860870424;
        const lessonId = 323622241;

        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Дата и время начала Ср 23 Авг 2051');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Урок для тест-драйва. Индивидуальное расписание. Недоступен но показывается', () => {
        const trainingId = 860870424;
        const lessonId = 323622238;

        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Недоступен до Вс 20 Авг 2051');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Урок для тест-драйва. Индивидуальное расписание. Урок недоступен и не отображается', () => {
        const trainingId = 860870424;
        const lessonId = 323622235;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Обычный урок. Индивидуальное расписание. Урок доступен до начала, 403', () => {
        const trainingId = 860870424;
        const lessonId = 323622239;

        cy.checkNotReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(403);
        });
    });

    it('Обычный урок. Индивидуальное расписание. Урок недоступен но показывается, 403', () => {

        const trainingId = 860870424;
        const lessonId = 323622236;

        cy.checkNotReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(403);
        });
    });

    it('Обычный урок. Индивидуальное расписание. Урок недоступен и не показывается, 403', () => {
        const trainingId = 860870424;
        const lessonId = 323622233;

        cy.checkHiddenLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(403);
        });
    });

    it('Урок для тест-драйва. Без расписания. Урок после "пока не выполнят этот урок"', () => {

        const trainingId = 861367841;
        const lessonId = 325222109;
        const stopLessonId = 323678451;

        cy.visit(trainingElements.trainingViewUrl + trainingId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //стоп-урок недоступен, так как это не урок для тест-драйва
        cy.get(`.lesson-id-${stopLessonId}` + trainingElements.notReachedLesson)
            .contains('Недоступен (стоп-урок)').should('be.visible');
        cy.getResponseForAccessLesson(stopLessonId).then((response) => {
            expect(response.status).to.eq(403);
        });

        //проверочный урок доступен
        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Урок для тест-драйва. Без расписания. Урок после "пока не выполнят все предыдущие"', () => {

        const trainingId = 861367841;
        const lessonId = 325222111;
        const stopLessonId = 323678796;

        cy.visit(trainingElements.trainingViewUrl + trainingId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //стоп-урок недоступен, так как это не урок для тест-драйва
        cy.get(`.lesson-id-${stopLessonId}` + trainingElements.notReachedLesson)
            .contains('Недоступен (стоп-урок)').should('be.visible');
        cy.getResponseForAccessLesson(stopLessonId).then((response) => {
            expect(response.status).to.eq(403);
        });

        //проверочный урок доступен
        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Урок для тест-драйва. Без расписания. Урок после "отложенного"', () => {
        const trainingId = 861367841;
        const lessonId = 325222581;
        const stopLessonId = 323679113;

        cy.visit(trainingElements.trainingViewUrl + trainingId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //стоп-урок недоступен, так как это не урок для тест-драйва
        cy.get(`.lesson-id-${stopLessonId}` + trainingElements.notReachedLesson)
            .contains('Недоступен (стоп-урок)').should('be.visible');
        cy.getResponseForAccessLesson(stopLessonId).then((response) => {
            expect(response.status).to.eq(403);
        });

        //проверочный урок доступен
        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Урок для тест-драйва. Без расписания. Урок после "пока не выполят все важные"', () => {
        const trainingId = 861367841;
        const lessonId = 325222710;
        const stopLessonId = 323680074;

        cy.visit(trainingElements.trainingViewUrl + trainingId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //стоп-урок недоступен, так как это не урок для тест-драйва
        cy.get(`.lesson-id-${stopLessonId}` + trainingElements.notReachedLesson)
            .contains('Недоступен (стоп-урок)').should('be.visible');
        cy.getResponseForAccessLesson(stopLessonId).then((response) => {
            expect(response.status).to.eq(403);
        });

        //проверочный урок доступен
        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Обычный урок. "Доступен вне зависимости от стоп-уроков"', () => {
        const trainingId = 861367841;
        const lessonId = 323680424;

        cy.checkNotReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(403);
        });
    });

    it('Урок для тест-драйва. Общее расписание. Даты нет. Недоступен, но показывается', () => {

        const trainingId = 860208557;
        const lessonId = 326737522;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Урок для тест-драйва. Общее расписание. Даты нет. Урок недоступен, и не отображается', () => {
        const trainingId = 860208557;
        const lessonId = 326737535;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Урок для тест-драйва. Индивидуальное расписание. Даты нет. Недоступен, но показывается', () => {
        const trainingId = 860870424;
        const lessonId = 327148358;

        cy.checkReachedLessonBySchedule(lessonId, trainingId, 'Дата и время начала Сб 30 Мар 10:13');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Урок для тест-драйва. Индивидуальное расписание. Даты нет. Урок недоступен, и не отображается', () => {
        const trainingId = 860870424;
        const lessonId = 326737976;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});

describe('Дать доступ к обычному уроку, когда у ученика есть доступ только к урокам для тест-драйва', () => {
    const trainingId = 860208557;
    const lessonId = 323517859;
    const lessonName = 'обычный урок 323517859';
    const trainingName = 'по покупке (общее расписание)';
    const userId = 373571857;

    it('Выдача доступа к уроку', () => {
        cy.login(users.admin.email);
        cy.visit(`/user/control/user/update/id/${userId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get('.btn.dropdown-toggle').contains('Действия').click();
        cy.get('.dropdown-menu').contains('Дать доступ к уроку').click({ force: true });
        cy.get('#s2id_objects').click();
        cy.get('#s2id_autogen1_search').type(lessonName, { force: true });
        cy.get('.select2-match').contains(lessonName).click();
        cy.get('#run-export').click({ force: true });
        cy.get('.table').contains(userId).should('be.visible');
        cy.get('.label-success').contains('Успешно').should('be.visible');
        cy.get('.table').contains('Пользователь добавлен в ' + trainingName + '. ' + lessonName).should('be.visible');
    });

    it('Ручной доступ к обычному уроку. У ученика доступ только к урокам для тест-драйва. 403', () => {
        cy.login(users.sheldon.email); //sheldon@test.ru
        cy.clickTraining(trainingId);
        cy.checkNotReachedLessonWithLabel(lessonId, trainingId, 'Недоступен');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(403);
        });
    });

    it('Отзыв доступа к уроку', () => {
        cy.login(users.admin.email);
        cy.visit(`/user/control/user/update/id/${userId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get('.btn.dropdown-toggle').contains('Действия').click();
        cy.get('.dropdown-menu').contains('Забрать ранее выданный доступ к уроку').click({ force: true });
        cy.get('#s2id_objects').click();
        cy.get('#s2id_autogen1_search').type(lessonName, { force: true });
        cy.get('.select2-match').contains(lessonName).click();
        cy.get('#run-export').click({ force: true });
        cy.get('.table').contains(userId).should('be.visible');
        cy.get('.label-success').contains('Успешно').should('be.visible');
        cy.get('.table').contains('Отозван ранее выданный доступ к уроку ' + trainingName + '. ' + lessonName).should('be.visible');
    });
});

//добавить проверку на тренинг со стоп-уроками
describe('Настройка предложения "Возможность отвечать" - "Не может отвечать"', () => {
    const trainingId = 860208557;

    //юзер penny@test.ru
    before('Авторизация', () => {
        cy.login(users.penny.email);
    });

    //идет проверка отображения ленты комментариев без возможности написать
    it('Обычный урок', () => {
        const lessonId = 323517859;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId, 'Доступен');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get('.why-no-form').contains('Вы не можете отвечать в этом уроке').should('be.visible');
        cy.get('h3').contains('Задание').should('be.visible');
        cy.get(lessonElements.answerField).should('not.exist');
        cy.contains('Добавить файлы').should('not.exist');
        cy.contains('максимальный размер файла - 100мб').should('not.exist');
        cy.get('.field-lessonanswer-answer_text .emoji-button').should('not.exist');
        cy.get('.lesson-answers-title').contains('Ответы и комментарии').should('be.visible');
        cy.get('.new-comment-textarea').should('not.exist');
        cy.get('#answers').contains('старые ответы').should('be.visible');
        cy.get('#answers').contains('новые ответы').should('be.visible');
        cy.get('#answers').contains('сначала').should('be.visible');
        cy.get('.answer-text').contains('я Шерлок').should('be.visible');
    });

    it('Промо урок', () => {
        const lessonId = 323517863;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId, 'Доступен');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get('.why-no-form').contains('Вы не можете отвечать в этом уроке').should('be.visible');
        cy.get('h3').contains('Задание').should('be.visible');
        cy.get(lessonElements.answerField).should('not.exist');
        cy.contains('Добавить файлы').should('not.exist');
        cy.contains('максимальный размер файла - 100мб').should('not.exist');
        cy.get('.field-lessonanswer-answer_text .emoji-button').should('not.exist');
        cy.contains('Ответы и комментарии').should('not.exist');
        cy.get('.new-comment-textarea').should('not.exist');
        cy.contains('старые ответы').should('not.exist');
        cy.contains('новые ответы').should('not.exist');
        cy.contains('сначала').should('not.exist');
    });

    it('Урок для тест-драйва', () => {
        const lessonId = 323517866;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId, 'Доступен');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get('.why-no-form').contains('Вы не можете отвечать в этом уроке').should('be.visible');
        cy.get('h3').contains('Задание').should('be.visible');
        cy.get(lessonElements.answerField).should('not.exist');
        cy.contains('Добавить файлы').should('not.exist');
        cy.contains('максимальный размер файла - 100мб').should('not.exist');
        cy.get('.field-lessonanswer-answer_text .emoji-button').should('not.exist');
        cy.contains('Ответы и комментарии').should('not.exist');
        cy.get('.new-comment-textarea').should('not.exist');
        cy.contains('старые ответы').should('not.exist');
        cy.contains('новые ответы').should('not.exist');
        cy.contains('сначала').should('not.exist');
    });

});

describe('Настройка предложения "Возможность отвечать" - "Можно отвечать, но без проверки"', () => {
    const trainingId = 860208557;
    const userId = 373564130;
    let answerId;
    const answerStatus = 'Без проверки';
    const answerText = 'Ответ из автотеста';
    const lessonName = 'обычный урок 323517859';
    const trainingName = 'по покупке (общее расписание)';

    //sherlok@test.ru
    before('Авторизация', () => {
        cy.login(users.sherlok.email);
    });

    it('Обычный урок', () => {
        const lessonId = 323517859;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId, 'Доступен');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

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
        cy.get('.answer-text').contains('я Шерлок').should('be.visible');
        cy.get('.new-comment-textarea:last').should('have.attr', 'placeholder', 'добавить комментарий к ответу').and('be.visible');
    });

    it('Промо урок', () => {
        const lessonId = 323517863;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId, 'Доступен');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get('h3').contains('Задание').should('be.visible');
        cy.get(lessonElements.answerField).should('have.attr', 'placeholder', 'Ваш ответ').and('be.visible');
        cy.get('.uploadifive-button:first').contains('Добавить файлы').should('be.visible');
        cy.contains('максимальный размер файла - 100мб').should('be.visible');
        cy.get('.field-lessonanswer-answer_text .emoji-button').should('be.visible');
        cy.get('.new-comment-textarea:first').should('have.attr', 'placeholder', 'добавить комментарий к уроку (ответ на задание здесь давать не нужно)').and('be.visible');
    });

    it('Урок для тест-драйва', () => {
        const lessonId = 323517866;

        cy.checkOrdinaryReachedLesson(lessonId, trainingId, 'Доступен');
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get('h3').contains('Задание').should('be.visible');
        cy.get(lessonElements.answerField).should('have.attr', 'placeholder', 'Ваш ответ').and('be.visible');
        cy.get('.uploadifive-button:first').contains('Добавить файлы').should('be.visible');
        cy.contains('максимальный размер файла - 100мб').should('be.visible');
        cy.get('.field-lessonanswer-answer_text .emoji-button').should('be.visible');
        cy.get('.new-comment-textarea:first').should('have.attr', 'placeholder', 'добавить комментарий к уроку (ответ на задание здесь давать не нужно)').and('be.visible');
    });

    it('Можно оставить ответ, который примет статус "Без проверки"', () => {
        const lessonId = 323517859;

        cy.visit(lessonElements.url1 + lessonId, { auth: { username: 'gcrc', password: 'gc12rc' } });
        cy.get(lessonElements.answerField).type(answerText).should('have.value', answerText);
        cy.get(lessonElements.sendAnswer).contains('Отправить ответ').click({ force: true });
        cy.get('.answer-status-label').contains(answerStatus).should('be.visible');
        cy.get(lessonElements.editAnswer).contains('Редактировать ответ').should('be.visible');
        cy.get(`.user-answer[data-user-id="${userId}"]`).invoke('attr', 'data-id')
            .then((answer) => {
                answerId = answer;
            });

        cy.get(lessonElements.answerField).should('be.visible');
        cy.get(lessonElements.sendAnswer).contains('Отправить ответ').should('be.visible');
    });

    it('В ленте ответов ученик видит ответ без проверки', () => {
        cy.visit(`/teach/control/answers/my`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.reload();
        cy.get('.filter-list').contains(trainingName).click({ force: true });
        cy.get('.selected').contains(lessonName).click({ force: true });
        cy.get('.col-md-8 > h3').contains(trainingName + '. ' + lessonName)
            .should('be.visible');
        cy.get(`.user-answer[data-id="${answerId}"]`).contains(answerText).should('be.visible');
        cy.get(`.user-answer[data-id="${answerId}"] .answer-status-label`)
            .contains(answerStatus).should('be.visible');
        cy.get(`.user-answer[data-id="${answerId}"] .new-comment-textarea`).should('be.visible');
    });

    it('В ленте ответов отправленный ответ не отображается у админа при фильтре "Требующие внимание', () => {
        const lessonId = 323517859;

        cy.login(users.admin.email);
        //открыли ленту ответов
        cy.visit(`/teach/control/answers/unanswered/lesson/${lessonId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get('.col-md-8 > h3').contains(trainingName + '. ' + lessonName).should('be.visible');
        cy.get('#filter_status').select("unanswered", { force: true });
        //проверяем трижды, так как бывают ситуации, когда ответы отображаются со второго-третьего раза
        cy.contains(answerText).should('not.exist');
        cy.reload();
        cy.contains(answerText).should('not.exist');
        cy.reload();
        cy.contains(answerText).should('not.exist');
    });

    it('Удаление ответа', () => {
        cy.deleteAnswer(answerId);
    })
});

describe('Настройка предложения "Возможность отвечать" - "Может отвечать, автопринятие ответов"', () => {
    const trainingId = 860208557;
    const userId = 373565499;
    let answerId;

    //vatson@test.ru
    before('Авторизация', () => {
        cy.login(users.vatson.email);
    });

    it('Обычный урок', () => {
        const lessonId = 323517859;

        cy.checkReachedLessonWithMission(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

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
        cy.get('.answer-text').contains('я Шерлок').should('be.visible');
        cy.get('.new-comment-textarea:last').should('have.attr', 'placeholder', 'добавить комментарий к ответу').and('be.visible');
    });

    it('Промо урок', () => {
        const lessonId = 323517863;

        cy.checkReachedLessonWithMission(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get('h3').contains('Задание').should('be.visible');
        cy.get(lessonElements.answerField).should('have.attr', 'placeholder', 'Ваш ответ').and('be.visible');
        cy.get('.uploadifive-button:first').contains('Добавить файлы').should('be.visible');
        cy.contains('максимальный размер файла - 100мб').should('be.visible');
        cy.get('.field-lessonanswer-answer_text .emoji-button').should('be.visible');
        cy.get('.new-comment-textarea:first').should('have.attr', 'placeholder', 'добавить комментарий к уроку (ответ на задание здесь давать не нужно)').and('be.visible');
    });

    it('Урок для тест-драйва', () => {
        const lessonId = 323517866;

        cy.checkReachedLessonWithMission(lessonId, trainingId);
        cy.getResponseForAccessLesson(lessonId).then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.visit(lessonElements.url1 + lessonId, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get('h3').contains('Задание').should('be.visible');
        cy.get(lessonElements.answerField).should('have.attr', 'placeholder', 'Ваш ответ').and('be.visible');
        cy.get('.uploadifive-button:first').contains('Добавить файлы').should('be.visible');
        cy.contains('максимальный размер файла - 100мб').should('be.visible');
        cy.get('.field-lessonanswer-answer_text .emoji-button').should('be.visible');
        cy.get('.new-comment-textarea:first').should('have.attr', 'placeholder', 'добавить комментарий к уроку (ответ на задание здесь давать не нужно)').and('be.visible');
    });

    it('Можно оставить ответ, который примет статус "Задание принято"', () => {
        const lessonId = 323517859;

        cy.visit(lessonElements.url1 + lessonId, { auth: { username: 'gcrc', password: 'gc12rc' } });
        cy.get(lessonElements.answerField).type('Ответ из автотеста').should('have.value', 'Ответ из автотеста');
        cy.get(lessonElements.sendAnswer).contains('Отправить ответ').click({ force: true });
        cy.get('.answer-status-label').contains('Задание принято').should('be.visible');
        cy.get(`.user-answer[data-user-id="${userId}"]`).invoke('attr', 'data-id')
            .then((answer) => {
                answerId = answer;
            });
    });

    it('Отправленный ответ отображается в ленте ответов у админа с фильтром "Принятые"', () => {
        const lessonId = 323517859;

        cy.login(users.admin.email);

        //открыли ленту ответов
        cy.visit(`/teach/control/answers/unanswered/lesson/${lessonId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get('.col-md-8 > h3').contains('по покупке (общее расписание). обычный урок 323517859').should('be.visible');
        cy.get('#filter_status').select("accepted", { force: true });
        cy.get(`.user-answer[data-id="${answerId}"]`).contains('Ответ из автотеста').should('be.visible');
        cy.get(`.user-answer[data-id="${answerId}"] .answer-status-label`)
            .contains('Задание принято').should('be.visible');
        cy.get(`.user-answer[data-id="${answerId}"] .new-comment-textarea`).should('be.visible');
    });

    it('Удаление ответа', () => {
        cy.deleteAnswer(answerId);
    })

});

describe('Ответственный учитель назначен в предложении', () => {

    it('Ответственный учитель назначен в предложении', () => {
        const lessonId = 327348180;
        const userId = 373378138;

        //шаг 1. оставить ответ в урока от ученика yana@test.ru, проверить, что нет информации о закрепленном учителе
        cy.login(users.yana.email);
        cy.visit(lessonElements.url1 + lessonId, { auth: { username: 'gcrc', password: 'gc12rc' } });
        cy.get(lessonElements.answerField).type('Ответ из автотеста').should('have.value', 'Ответ из автотеста');
        cy.get(lessonElements.sendAnswer).contains('Отправить ответ').click({ force: true });
        cy.get('.answer-status-label').contains('Задание ожидает проверки').should('be.visible');
        cy.get(`.user-answer[data-user-id="${userId}"]`).invoke('attr', 'data-id')
            .then((answer) => {
                cy.wrap(answer).as('answerId');
            });
        cy.contains('Ответственный учитель').should('not.exist');

        //шаг 2. проверить от лица админа, что в ответе закрепился ответственный учитель "учитель"
        cy.login(users.admin.email);
        cy.visit(`/teach/control/answers/unanswered/lesson/${lessonId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get('.col-md-8 > h3').contains('проверочный тренинг для ученика. для проверки ответственных учителей').should('be.visible');
        cy.get('#filter_status').select('Все статусы', { force: true });
        cy.get('@answerId').then((answer) => {
            cy.get(`.user-answer[data-id="${answer}"]`).contains('Ответственный учитель: учитель').should('be.visible');
            cy.visit(`/teach/control/answers/review?id=${answer}`, { auth: { username: 'gcrc', password: 'gc12rc' } });
            cy.contains('Ответственный учитель: учитель').should('be.visible');

            //шаг 3. удалить оставленный ответ
            cy.deleteAnswer(answer);
        });
    })

    it('Оставить ответ в урока от ученика yana@test.ru', () => {
        cy.login(users.yana.email);
        cy.visit(lessonElements.url1 + lessonId, { auth: { username: 'gcrc', password: 'gc12rc' } });
        cy.get(lessonElements.answerField).type('Ответ из автотеста').should('have.value', 'Ответ из автотеста');
        cy.get(lessonElements.sendAnswer).contains('Отправить ответ').click({ force: true });
        cy.get('.answer-status-label').contains('Задание ожидает проверки').should('be.visible');
        cy.get(`.user-answer[data-user-id="${userId}"]`).invoke('attr', 'data-id')
            .then((answer) => {
                answerId = answer;
            });
        cy.contains('Ответственный учитель').should('not.exist');
    });

    it('Проверить от лица админа, что в ответе закрепился ответственный учитель: "учитель"', () => {
        cy.login(users.admin.email);
        cy.visit(`/teach/control/answers/unanswered/lesson/${lessonId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get('.col-md-8 > h3').contains('проверочный тренинг для ученика. для проверки ответственных учителей').should('be.visible');
        cy.get('#filter_status').select('Все статусы', { force: true });

        cy.get(`.user-answer[data-id="${answerId}"]`).contains('Ответственный учитель: учитель').should('be.visible');

        cy.visit(`/teach/control/answers/review?id=${answerId}`, { auth: { username: 'gcrc', password: 'gc12rc' } });
        cy.contains('Ответственный учитель: учитель').should('be.visible');
    });

    it('Удалить оставленный ответ', () => {
        cy.deleteAnswer(answerId);
    })
});

describe('Ответственный учитель', () => {

    it('Ответственный учитель назначен в предложении', () => {
        //шаг 1. оставить ответ в урока от ученика yana@test.ru, проверить, что нет информации о закрепленном учителе
        //шаг 2. проверить от лица ответственного учителя, что ответ есть в ленте ответов
        //шаг 3. проверить от лица админа, что в ответе закрепился ответственный учитель "учитель"
        //шаг 4. удалить оставленный ответ

        const lessonId = 327348180;
        const userId = 373378138;

        //шаг 1. оставить ответ в урока от ученика yana@test.ru, проверить, что нет информации о закрепленном учителе
        cy.login(users.yana.email);
        cy.visit(lessonElements.url1 + lessonId, { auth: { username: 'gcrc', password: 'gc12rc' } });
        cy.get(lessonElements.answerField).type('Ответ из автотеста').should('have.value', 'Ответ из автотеста');
        cy.get(lessonElements.sendAnswer).contains('Отправить ответ').click({ force: true });
        cy.get('.answer-status-label').contains('Задание ожидает проверки').should('be.visible');
        cy.get(`.user-answer[data-user-id="${userId}"]`).invoke('attr', 'data-id')
            .then((answer) => {
                cy.wrap(answer).as('answerId');
            });
        cy.contains('Ответственный учитель').should('not.exist');

        //шаг 2. проверить от лица ответственного учителя, что ответ есть в ленте ответов
        cy.login(users.teacher.email);
        cy.get('@answerId').then((answer) => {
            cy.visit(`/teach/control/answers/unanswered`,
                { auth: { username: 'gcrc', password: 'gc12rc' } });
            cy.get('#filter_learner_type').select('only_my', { force: true });
            cy.get('#filter_learner_type').contains('Ответы моих учеников').should('be.visible');
            cy.get(`.user-answer[data-id="${answer}"]`).contains('Ответственный учитель: учитель').should('be.visible');
            cy.visit(`/teach/control/answers/review?id=${answer}`, { auth: { username: 'gcrc', password: 'gc12rc' } });
            cy.contains('Ответственный учитель: учитель').should('be.visible');
        });

        //шаг 3. проверить от лица админа, что в ответе закрепился ответственный учитель "учитель"
        cy.login(users.admin.email);
        cy.visit(`/teach/control/answers/unanswered/lesson/${lessonId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get('.col-md-8 > h3').contains('проверочный тренинг для ученика. для проверки ответственных учителей').should('be.visible');
        cy.get('#filter_status').select('Все статусы', { force: true });
        cy.get('@answerId').then((answer) => {
            cy.get(`.user-answer[data-id="${answer}"]`).contains('Ответственный учитель: учитель').should('be.visible');
            cy.visit(`/teach/control/answers/review?id=${answer}`, { auth: { username: 'gcrc', password: 'gc12rc' } });
            cy.contains('Ответственный учитель: учитель').should('be.visible');

            //шаг 4. удалить оставленный ответ
            cy.deleteAnswer(answer);
        });
    })

    it('Ответственный учитель вручную назначен в покупке (проверка до назначения и после)', () => {
        //шаг 1. от лица админа проверить, что в покупке НЕ назначен учитель 
        //шаг 2. оставить ответ в урока от ученика maksim@test.ru, проверить, что нет информации о закрепленном учителе
        //шаг 3. проверить от лица учителя, что ответ не закреплен за ним в ленте ответов
        //шаг 4. проверить от лица админа, что в ответе нет закрепленных учителей
        //шаг 5. удалить оставленный ответ
        //шаг 6. указать в покупке ответственного учителя: "учитель"
        //шаг 7. оставить ответ в урока от ученика maksim@test.ru, проверить, что нет информации о закрепленном учителе
        //шаг 8. проверить от лица учителя, что ответ закреплен за ним в ленте ответов
        //шаг 9. проверить от лица админа, что в ответе закрепился ответственный учитель: "учитель"
        //шаг 10. удалить оставленный ответ
        //шаг 11. убрать из покупки ответственного учителя

        const lessonId = 327348180;
        const userId = 373549198;
        const userProduct = 436037794;

        //шаг 1. от лица админа проверить, что в покупке НЕ назначен учитель 
        cy.login(users.admin.email);
        cy.visit(`/sales/control/userProduct/update/id/${userProduct}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get('#select2-chosen-1').contains('не выбрано').should('be.visible');

        //шаг 2. оставить ответ в урока от ученика maksim@test.ru, проверить, что нет информации о закрепленном учителе
        cy.login(users.maksim.email);
        cy.visit(lessonElements.url1 + lessonId, { auth: { username: 'gcrc', password: 'gc12rc' } });
        cy.get(lessonElements.answerField).type('Ответ из автотеста').should('have.value', 'Ответ из автотеста');
        cy.get(lessonElements.sendAnswer).contains('Отправить ответ').click({ force: true });
        cy.get('.answer-status-label').contains('Задание ожидает проверки').should('be.visible');
        cy.get(`.user-answer[data-user-id="${userId}"]`).invoke('attr', 'data-id')
            .then((answer) => {
                cy.wrap(answer).as('answer1');
            });
        cy.contains('Ответственный учитель').should('not.exist');

        //шаг 3. проверить от лица учителя, что ответ не закреплен за ним в ленте ответов
        cy.login(users.teacher.email);
        cy.get('@answer1').then((answer) => {
            cy.visit(`/teach/control/answers/unanswered`,
                { auth: { username: 'gcrc', password: 'gc12rc' } });
            cy.get('#filter_learner_type').select('only_my', { force: true });
            cy.get('#filter_learner_type').contains('Ответы моих учеников').should('be.visible');
            cy.contains('Нет непроверенных ответов.').should('be.visible');
            cy.get(`.user-answer[data-id="${answer}"]`).should('not.exist');
        });

        //шаг 4. проверить от лица админа, что в ответе нет закрепленных учителей
        cy.login(users.admin.email);
        cy.visit(`/teach/control/answers/unanswered/lesson/${lessonId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get('.col-md-8 > h3').contains('проверочный тренинг для ученика. для проверки ответственных учителей').should('be.visible');
        cy.get('#filter_status').select('Все статусы', { force: true });
        cy.contains('Ответственный учитель').should('not.exist');
        cy.get('@answer1').then((answer) => {
            cy.visit(`/teach/control/answers/review?id=${answer}`, { auth: { username: 'gcrc', password: 'gc12rc' } });
            cy.contains('Ответственный учитель').should('not.exist');

            //шаг 5. удалить оставленный ответ
            cy.deleteAnswer(answer);
        });

        //шаг 6. указать в покупке ответственного учителя: "учитель"
        cy.visit(`/sales/control/userProduct/update/id/${userProduct}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get('#w2').select('374765968', { force: true });
        cy.get('#select2-chosen-1').contains('учитель').should('be.visible');
        cy.get('.btn-primary:last').contains('Сохранить').click({ force: true });
        cy.get('#select2-chosen-1').contains('учитель').should('be.visible');

        //шаг 7. оставить ответ в урока от ученика maksim@test.ru, проверить, что нет информации о закрепленном учителе
        cy.login(users.maksim.email);
        cy.visit(lessonElements.url1 + lessonId, { auth: { username: 'gcrc', password: 'gc12rc' } });
        cy.get(lessonElements.answerField).type('Ответ из автотеста').should('have.value', 'Ответ из автотеста');
        cy.get(lessonElements.sendAnswer).contains('Отправить ответ').click({ force: true });
        cy.get('.answer-status-label').contains('Задание ожидает проверки').should('be.visible');
        cy.get(`.user-answer[data-user-id="${userId}"]`).invoke('attr', 'data-id')
            .then((answer) => {
                cy.wrap(answer).as('answer2');
            });
        cy.contains('Ответственный учитель').should('not.exist');

        //шаг 8. проверить от лица учителя, что ответ закреплен за ним в ленте ответов
        cy.login(users.teacher.email);
        cy.get('@answer2').then((answer) => {
            cy.visit(`/teach/control/answers/unanswered`,
                { auth: { username: 'gcrc', password: 'gc12rc' } });
            cy.get('#filter_learner_type').select('only_my', { force: true });
            cy.get('#filter_learner_type').contains('Ответы моих учеников').should('be.visible');
            cy.get(`.user-answer[data-id="${answer}"]`).contains('Ответственный учитель: учитель').should('be.visible');
            cy.visit(`/teach/control/answers/review?id=${answer}`, { auth: { username: 'gcrc', password: 'gc12rc' } });
            cy.contains('Ответственный учитель: учитель').should('be.visible');
        });

        //шаг 9. проверить от лица админа, что в ответе закрепился ответственный учитель: "учитель"
        cy.login(users.admin.email);
        cy.visit(`/teach/control/answers/unanswered/lesson/${lessonId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get('.col-md-8 > h3').contains('проверочный тренинг для ученика. для проверки ответственных учителей').should('be.visible');
        cy.get('#filter_status').select('Все статусы', { force: true });
        cy.get('@answer2').then((answer) => {
            cy.get(`.user-answer[data-id="${answer}"]`).contains('Ответственный учитель: учитель').should('be.visible');
            cy.visit(`/teach/control/answers/review?id=${answer}`, { auth: { username: 'gcrc', password: 'gc12rc' } });
            cy.contains('Ответственный учитель: учитель').should('be.visible');

            //шаг 10. удалить оставленный ответ
            cy.deleteAnswer(answer);
        });

        //шаг 11. убрать из покупки ответственного учителя
        cy.visit(`/sales/control/userProduct/update/id/${userProduct}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get('#w2').select('-- не выбрано --', { force: true });
        cy.get('#select2-chosen-1').contains('-- не выбрано --').should('be.visible');
        cy.get('.btn-primary:last').contains('Сохранить').click({ force: true });
        cy.get('#select2-chosen-1').contains('-- не выбрано --').should('be.visible');
    });


})