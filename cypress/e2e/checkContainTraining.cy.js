const updatePage = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/pages/updateTrainingPage.json");
const generalElements = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/pages/general.json");
const users = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/users1.json");

const current_training_title = 'Проверка настроек';
const new_training_title = 'Название из автотеста';
const new_training_description = 'Описание из автотеста';

describe('Проверяем содержимое тренинга', () => {

    const trainingId = 864615211;

    before('Auth', () => {
        cy.login(users.admin.email);
    });

    it('На странице "Содержание" есть все необходимые пункты в кнопках "Действия" и "Добавить", если в тренинге более 1 урока', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.btn-group li').its('length').should('eq', 14); //проверяем количество li в списке (их 14: 12 ссылок и 2 разделителя)

        // далее проверяем наличие всех нужных ссылок

        cy.get('.dropdown-menu')
            .find('a')
            .contains('Быстрое редактирование уроков')
            .should('have.attr', 'href')
            .and('include', `/teach/control/stream/view/id/${trainingId}/editable/1`);

        cy.get('.dropdown-menu')
            .find('a')
            .contains('Настроить вид')
            .should('have.attr', 'href')
            .and('include', `/teach/control/stream/view/id/${trainingId}/editMode/1`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Сделать рассылку')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/sendNotification/id/${trainingId}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Редактировать тренинг')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/update/id/${trainingId}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Настроить доступ')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/access/id/${trainingId}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Поменять порядок тренингов')
            .should('have.attr', 'onclick')
            .and('include', '/teach/control/stream/tree/edit/1');

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Копировать тренинг')
            .should('have.attr', 'onclick')
            .and('include', `/pl/teach/training/copy?id=${trainingId}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Настройки уроков')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/lessonsSettings/id/${trainingId}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Сменить порядок уроков в тренинге')
            .should('have.class', 'link-change-sort');

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Статистика тренинга')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/stat/id/${trainingId}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Урок')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/lesson/new/trainingId/${trainingId}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Подтренинг')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/new/parentId/${trainingId}`);
    });

    it('На странице "Содержание" есть все необходимые пункты в кнопках "Действия" и "Добавить", если в тренинге 1 урок', () => {

        const trainingId2 = 857502050;

        cy.visit(`/teach/control/stream/view/id/${trainingId2}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.btn-group li').its('length').should('eq', 13); //проверяем количество li в списке (их 13: 11 ссылок и 2 разделителя)

        // далее проверяем наличие всех нужных ссылок

        cy.get('.dropdown-menu')
            .find('a')
            .contains('Быстрое редактирование уроков')
            .should('have.attr', 'href')
            .and('include', `/teach/control/stream/view/id/${trainingId2}/editable/1`);

        cy.get('.dropdown-menu')
            .find('a')
            .contains('Настроить вид')
            .should('have.attr', 'href')
            .and('include', `/teach/control/stream/view/id/${trainingId2}/editMode/1`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Сделать рассылку')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/sendNotification/id/${trainingId2}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Редактировать тренинг')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/update/id/${trainingId2}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Настроить доступ')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/access/id/${trainingId2}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Поменять порядок тренингов')
            .should('have.attr', 'onclick')
            .and('include', '/teach/control/stream/tree/edit/1');

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Копировать тренинг')
            .should('have.attr', 'onclick')
            .and('include', `/pl/teach/training/copy?id=${trainingId2}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Настройки уроков')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/lessonsSettings/id/${trainingId2}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Статистика тренинга')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/stat/id/${trainingId2}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Урок')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/lesson/new/trainingId/${trainingId2}`);

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Подтренинг')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/new/parentId/${trainingId2}`);

        //нет кнопки "Сменить порядок уроков в тренинге", так как в тренинге всего 1 урок
        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Сменить порядок уроков в тренинге')
            .should('not.exist');
    });

    it('В верхнем меню на всех вкладках отображаются нужные пункты', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        const pages1 = [
            `/teach/control/stream/view/id/${trainingId}`,
            `/teach/control/stream/update/id/${trainingId}`,
            `/teach/control/stream/access/id/${trainingId}`,
            `/teach/control/stat/stream/id/${trainingId}`,
            `/teach/control/stream/stat/id/${trainingId}`
        ];

        const pages2 = [
            `/pl/teach/training/lessons-schedule?id=${trainingId}`,
            `/pl/teach/training/achievements?id=${trainingId}`,
            `/pl/teach/training/chatium?id=${trainingId}`,
            `/pl/teach/training/feedback?id=${trainingId}`
        ];

        //возможно вместо посещения нужно сделать запрос на доступ "200"
        pages1.forEach((page) => {
            cy.visit(page, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });

            cy.get('.page-menu li').its('length').should('eq', 9); //проверяем количество li в списке (их 9)

            //далее проверяем наличие всех вкладок

            cy.get('.content-menu')
                .find('a')
                .contains('Содержание')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/view/id/${trainingId}`);

            cy.get('.content-menu')
                .find('a')
                .contains('Настройки')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/update/id/${trainingId}`);

            cy.get('.content-menu')
                .find('a')
                .contains('Доступ')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/access/id/${trainingId}`);

            cy.get('.content-menu')
                .find('a')
                .contains('Расписание')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/lessons-schedule?id=${trainingId}`);

            cy.get('.content-menu')
                .find('a')
                .contains('Ученики')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stat/stream/id/${trainingId}`);

            cy.get('.content-menu')
                .find('a')
                .contains('Статистика')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/stat/id/${trainingId}`);

            cy.get('.content-menu')
                .find('a')
                .contains('Достижения')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/achievements?id=${trainingId}`);

            cy.get('.content-menu')
                .find('a')
                .contains('В приложении')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/chatium?id=${trainingId}`);

            cy.get('.content-menu')
                .find('a')
                .contains('Качество тренинга')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/feedback?id=${trainingId}`);
        })

        pages2.forEach((page) => {
            cy.visit(page, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get('.standard-page-menu li').its('length').should('eq', 9); //проверяем количество li в списке (их 9)

            //далее проверяем наличие всех вкладок

            cy.get('.standard-page-menu')
                .find('a')
                .contains('Содержание')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/view?id=${trainingId}`);

            cy.get('.standard-page-menu')
                .find('a')
                .contains('Настройки')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/settings?id=${trainingId}`);

            cy.get('.standard-page-menu')
                .find('a')
                .contains('Доступ')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/access?id=${trainingId}`);

            cy.get('.standard-page-menu')
                .find('a')
                .contains('Расписание')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/lessons-schedule?id=${trainingId}`);

            cy.get('.standard-page-menu')
                .find('a')
                .contains('Ученики')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/students?id=${trainingId}`);

            cy.get('.standard-page-menu')
                .find('a')
                .contains('Статистика')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/stat?id=${trainingId}`);

            cy.get('.standard-page-menu')
                .find('a')
                .contains('Достижения')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/achievements?id=${trainingId}`);

            cy.get('.standard-page-menu')
                .find('a')
                .contains('В приложении')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/chatium?id=${trainingId}`);

            cy.get('.standard-page-menu')
                .find('a')
                .contains('Качество тренинга')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/feedback?id=${trainingId}`);
        })
    });

    it('Опция "Настроить вид" работает', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle')
            .contains('Действия')
            .click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Настроить вид')
            .click({ force: true });

        //проверка юрл
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}/editMode/1`);

    });

    it('Опция "Сделать рассылку" работает', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle')
            .contains('Действия')
            .click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Сделать рассылку')
            .click({ force: true });

        //проверка юрл
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/stream/send-notification?id=${trainingId}`);

        cy.get('.standard-page-actions')
            .contains('Вернуться к просмотру')
            .should('be.visible');

        cy.get('#streamnotificationform-subject')
            .should('be.visible');

        cy.get('.control-label')
            .contains('Тема письма')
            .should('be.visible');

        cy.get('.control-label')
            .contains('Текст письма')
            .should('be.visible');

        cy.get('.note-editable')
            .should('be.visible');

        cy.get('#btnSendTestMessage')
            .contains('Отправить тестовое письмо')
            .should('be.visible');

        cy.get('.btn-danger')
            .contains('Разослать всем')
            .should('be.visible');
    });

    it('Опция "Редактировать тренинг" работает', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle')
            .contains('Действия')
            .click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Редактировать тренинг')
            .click({ force: true });

        //проверили, что произошла переадресация на вкладку "Настройки"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/update/id/${trainingId}`);

    });

    it('Опция "Настроить доступ" работает', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle')
            .contains('Действия')
            .click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Настроить доступ')
            .click({ force: true });

        //проверили, что произошла переадресация на вкладку "Доступ"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/access/id/${trainingId}`);

    });

    it('Опция "Поменять порядок тренингов" работает', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle')
            .contains('Действия')
            .click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Поменять порядок тренингов')
            .click({ force: true });

        //проверили, что произошла переадресация на страницу дерева тренингов
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/tree/edit/1');
    });

    it('Опция "Настройки уроков" работает', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle')
            .contains('Действия')
            .click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Настройки уроков')
            .click({ force: true });

        //проверили, что произошла переадресация на страницу настройки уроков
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/lessonsSettings/id/${trainingId}`);

        //Проверяем наличие столбцов №, урок и тд
        const items = [
            '№',
            'Урок',
            'Задание',
            'Поля задания',
            'Параметры'
        ]

        cy.get('.table-hover')
            .as('table');

        items.forEach((item) => {
            cy.get('@table')
                .contains(item)
                .should('be.visible')
        });

        //проверяем, что отображается обычная кнопка "Вернуться к просмотру"
        cy.get('.btn')
            .contains('Вернуться к просмотру')
            .as('back')
            .should('be.visible');

        //проверяем, что отображается зеленая кнопка "Вернуться к просмотру"
        cy.get('.btn-success')
            .as('save')
            .contains('Сохранить')
            .should('be.visible');

        //сохраняем все без изменений
        cy.get('@save').click({ force: true });

        //проверили, что постались на той же странице
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/lessonsSettings/id/${trainingId}`);

        //возвращаемся к просмотру
        cy.get('@back').click({ force: true });

        //проверили, что вернулись к просмотру тренинга
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
    });

    it('Опция "Сменить порядок уроков в тренинге" работает', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle')
            .contains('Действия')
            .click({ force: true });
        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Сменить порядок уроков в тренинге')
            .click({ force: true });

        //Проверяем наличие кнопок
        cy.get('.btn-save-sort')
            .contains('Сохранить порядок')
            .as('save')
            .should('be.visible');

        cy.get('.btn-cancel-sort')
            .contains('Отменить')
            .as('cancel')
            .should('be.visible');

        //нажимаем на кнопку "Отменить"
        cy.get('@cancel').click({ force: true });
        cy.get('.lesson-sort-block')
            .should('not.be.visible');

        //нажимаем на кнопку "Сменить порядок уроков в тренинге"
        cy.get('.dropdown-toggle')
            .contains('Действия')
            .click({ force: true });
        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Сменить порядок уроков в тренинге')
            .click({ force: true });

        cy.get('@save').click({ force: true });
        cy.get('.lesson-sort-block')
            .should('not.be.visible');
        cy.get('.flash-success')
            .contains('Порядок уроков сохранен')
            .should('be.visible');
    });

    it('Опция "Статистика тренинга" работает', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle')
            .contains('Действия')
            .click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Статистика тренинга')
            .click({ force: true });

        //проверили, что произошла переадресация на вкладку "Статистика"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/stat/id/${trainingId}`);

    });
});

describe('Проверка вкладки "Доступ" в тренинге', () => {

    before('Auth', () => {
        cy.login(users.admin.email);
    });

    it('Отображение видимых опций на странице и не отображение скрытых в родительском тренинге без подтренингов', () => {

        const trainingId = 864615211;

        const panelHeading = [
            'Доступ к тренингу имеют', 'Тем, у кого нет доступа', 'Продажа тренинга'
        ]
        const paramsObject_access_type = [
            'только те, кто купил тренинг', 'все зарегистрированные пользователи', 'те, кто прошел другой тренинг', 'выбранные группы и те, кто купил тренинг'
        ]

        const training_noaccess_mode = [
            'Не показывать в списке тренингов', 'Показать в списке тренингов'
        ]

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //всего 4 варианта доступов
        cy.get('#ParamsObject_access_type input').its('length').should('eq', 4);

        //проверка заголовков блоков
        panelHeading.forEach((heading) => {
            cy.get('.panel-heading')
                .contains(heading)
                .should('be.visible')
        })

        // проверка отображения вариантов "Доступ к тренингу имеют"
        let num = 0;
        paramsObject_access_type.forEach((access) => {
            cy.get(`label[for="ParamsObject_access_type_${num}"]`).contains(access).should('be.visible');
            num++;
        });

        // проверка отображения настроек "Тем, у кого нет доступа"
        training_noaccess_mode.forEach((mode) => {
            cy.get('#Training_noaccess_mode')
                .contains(mode)
                .should('be.visible')
        });

        //Проверка наличия кнопки "Задать параметры продажи"
        cy.get('#generate-page-btn')
            .contains('Задать параметры продажи тренинга')
            .should('be.visible');
    });

    it('Проверка вариантов доступа в тренинге с подтренингом', () => {

        const trainingId = 868344065;

        const paramsObject_access_type = [
            'только те, кто купил тренинг', 'все, у кого есть доступ хотя бы к одному из подтренингов', 'все зарегистрированные пользователи', 'те, кто прошел другой тренинг', 'выбранные группы и те, кто купил тренинг'
        ];

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        let num = 0;
        paramsObject_access_type.forEach((access) => {
            cy.get(`label[for="ParamsObject_access_type_${num}"]`).contains(access).should('be.visible');
            num++;
        });

        //всего 5 опций доступа
        cy.get('#ParamsObject_access_type input').its('length').should('eq', 5);

    });

    it('Проверка вариантов доступа в подтренинге', () => {

        const trainingId = 868344066;

        const paramsObject_access_type = [
            'только те, кто купил тренинг', 'все зарегистрированные пользователи', 'все, у кого есть доступ к родительскому тренингу', 'те, у кого есть доступ к родительскому тренингу, ограниченные группами', 'те, кто прошел другой тренинг', 'выбранные группы и те, кто купил тренинг'
        ];

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //всего 5 опций доступа
        cy.get('#ParamsObject_access_type input').its('length').should('eq', 6);

        // проверка отображения вариантов "Доступ к тренингу имеют"
        let num = 0;
        paramsObject_access_type.forEach((access) => {
            cy.get(`label[for="ParamsObject_access_type_${num}"]`).contains(access).should('be.visible');
            num++;
        });
    });

    it('Варианты опций имеют тип radio', () => {

        const trainingId = 864615211;

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //Проверяем, что опции "Доступ к тренингу имеют" и "Тем, у кого нет доступа" имеют тип radio
        cy.get('#ParamsObject_access_type_0[type="radio"]')
            .should('exist')
            .and('be.visible');

        cy.get('#ParamsObject_access_type_1[type="radio"]')
            .should('exist')
            .and('be.visible');

        cy.get('#ParamsObject_access_type_2[type="radio"]')
            .should('exist')
            .and('be.visible');

        cy.get('#ParamsObject_access_type_3[type="radio"]')
            .should('exist')
            .and('be.visible');

        cy.get('#Training_noaccess_mode_0[type="radio"]')
            .should('exist')
            .and('be.visible');

        cy.get('#Training_noaccess_mode_1[type="radio"]')
            .should('exist')
            .and('be.visible');

    });

    it('Можно изменить тип доступа на "все зарегистрированные пользователи"', () => {

        const trainingId = 864615211;

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //Проверяем, изначально тип доступа стоит "только те, кто купил тренинг"
        cy.get('#ParamsObject_access_type_0[value="none"]').as('none').should('be.checked');

        //Проверяем, что выбор группы и тренинга для доступа скрыты, так как по умолчанию выбран вариант "те, кто купил тренинг"
        cy.get('.select-users').should('exist').and('not.be.visible');
        cy.get('.select-other-training').should('exist').and('not.be.visible');

        //Меняем вариант доступа на "все зарегистрированные пользователи"
        cy.get('#ParamsObject_access_type_1[value="all"]').as('all').check();
        cy.get('@none').should('not.be.checked');
        cy.get('button[name="saveAccess"]').as('save').click({ force: true });
        cy.get(generalElements.flashSuccess).contains('Настройки доступа сохранены').as('success').should('be.visible');
        cy.get('@all').should('be.checked');

        //Проверяем, что выбор группы и тренинга для доступа скрыты
        cy.get('.select-users').should('exist').and('not.be.visible');
        cy.get('.select-other-training').should('exist').and('not.be.visible');

        //возвращаем настройки по-умолчанию
        cy.get('@none').check().should('be.checked');
        cy.get('@save').click({ force: true });
        cy.get('@none').should('be.checked');
    });

    it('Можно изменить тип доступа на "те, кто прошел другой тренинг"', () => {
        const trainingId = 864615211;

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //Поменяли вариант доступа на "те, кто прошел другой тренинг"
        cy.get('#ParamsObject_access_type_2[value="finished_other"]')
            .as('finished_other')
            .check();

        //появился список для выбора тренинга
        cy.get('.select-other-training').should('be.visible');

        //список для выбора групп скрыт
        cy.get('.select-users').should('exist').and('not.be.visible');

        //Отображается опция "закрыть доступ" и она не включена по умолчанию
        cy.get('label')
            .contains('Закрыть доступ, если выбранный тренинг больше не доступен ученику')
            .should('be.visible')
            .and('not.be.checked');

        //Включили опцию "закрыть доступ"
        cy.get('input[name="ParamsObject[finish_training_id_to_access_depends]"]:last')
            .as('accessDepends')
            .check()
            .should('be.checked');

        //Выбрали тренинг "По покупке"
        cy.get('select')
            .select('Доступ по покупке', { force: true })
            .invoke('val').should('eq', '857501950');

        //Проверили, что выбранный тренинг отображается
        cy.get('#select2-chosen-1')
            .contains('Доступ по покупке')
            .should('exist').and('be.visible');

        //сохраняем изменения доступа
        cy.get('button[name="saveAccess"]').as('save').click({ force: true });
        cy.get(generalElements.flashSuccess).contains('Настройки доступа сохранены').should('be.visible');

        //Проверяем, что установлен выбранный ранее тип доступа и включена настройка "закрыть доступ"
        cy.get('@finished_other').should('be.checked');
        cy.get('@accessDepends').should('be.checked');

        //Выключили опцию "закрыть доступ"
        cy.get('input[name="ParamsObject[finish_training_id_to_access_depends]"]:last').uncheck().should('not.be.checked');

        //убрали тренинг для завершения из поля
        cy.get('select').select('--выберите тренинг--', { force: true }).invoke('val').should('eq', '0');

        //Проверили, что выбранный тренинг отображается
        cy.get('#select2-chosen-1').contains('--выберите тренинг--').should('exist').and('be.visible');

        //возвращаем настройки по-умолчанию
        cy.get('#ParamsObject_access_type_0[value="none"]').as('none').check().should('be.checked');
        cy.get('@save').click({ force: true });
        cy.get('@none').should('be.checked');
    });

    it('Можно изменить тип доступа на "выбранные группы и те, кто купил тренинг"', () => {

        const trainingId = 864615211;

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //Поменяли вариант доступа на "выбранные группы и те, кто купил тренинг"
        cy.get('#ParamsObject_access_type_3[value="selected"]').as('selected').check();

        //Проверяем, что отображается выбор группы и скрыт выбор тренинга для завершения
        cy.get('.select-users').and('be.visible');
        cy.get('.select-other-training').should('exist').and('not.be.visible');

        //Проверяем поисковую строку "Поиск по группе"
        cy.get('.filter-for-group[placeholder="Поиск по группе"]').as('filter').should('be.visible');

        //Отображается случайно выбранная группа
        cy.get('label').contains('группа, в которой никого не будет (НЕ УДАЛЯТЬ)').as('group_for_check').should('be.visible');

        //В поле для поиска вводим название группы
        cy.get('@filter').type('группа для доступов').should('have.value', 'группа для доступов');

        //Случайно выбранная группа не отображается, так как введено не ее название
        cy.get('@group_for_check').should('not.be.visible');

        //В списке отображается группа, чье название было введено в поле для поиска
        cy.get('label').contains('группа для доступов').should('be.visible');

        //Ставим галочку в выбранную группу и проверяем, что галочка проставлена
        cy.get('input[value=3457865]').as('select_group').check().should('be.checked');

        //Проверяем кнопку "Добавить новую группу"
        cy.get('.add-new-group').contains('Добавить новую группу').as('new_group').should('be.visible');

        //Поле для имени новой группы скрыто, так как еще не нажата кнопка "Добавить новую группу"
        cy.get('.group-input[placeholder="Название группы"]').as('form_new_group').should('not.be.visible');

        //Скрыта кнопка "Создать", так как еще не нажата кнопка "Добавить новую группу"
        cy.get('.btn-primary[value="Создать"]').as('btn_new_group').should('not.be.visible');

        //нажимаем на кнопку "Добавить новую группу"
        cy.get('@new_group').click();

        //Поле для названия новой группы отображается
        cy.get('.group-input[placeholder="Название группы"]').as('form_new_group').should('be.visible');

        //Вводим в поле название группы
        cy.get('@form_new_group').type('новая группа из автотеста').should('have.value', 'новая группа из автотеста');

        //Кнопка для создания новой группы отображается и кликаем на нее
        cy.get('@btn_new_group').should('be.visible').click();

        //В списке отображается созданная группа
        cy.get('label').contains('новая группа из автотеста').as('new_group').should('be.visible');

        //сохраняем изменения доступа
        cy.get('button[name="saveAccess"]').as('save').click({ force: true });
        cy.get(generalElements.flashSuccess).contains('Настройки доступа сохранены').should('be.visible');

        //тип доступа установлен "выбранные группы и те, кто купил тренинг"
        cy.get('@selected').should('be.checked')
        //выбрана группа "группа для доступов"
        cy.get('@select_group').should('be.checked');
        //Проверяем строку "Показать: Все группы / Только выбранные"
        cy.get('.group-tree-select').contains('Показать:').should('be.visible');
        //Проверяем фильтр "только выбранные"
        cy.get('.only-selected-link').contains('Только выбранные').should('be.visible').click();
        cy.get('@group_for_check').should('not.be.visible');
        cy.get('@selected').should('be.visible')

        //Переключаем на фильтр "Все группы"
        cy.get('.all-link').contains('Все группы').should('be.visible').click();
        //отображается созданная группа
        cy.get('label').contains('новая группа из автотеста').as('new_group').should('be.visible');

        //удаляем созданную группу
        cy.visit('/pl/user/group/index', {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.dd-item:last > .dd-handle').contains('новая группа из автотеста').should('be.visible');
        cy.get('.dd-item:last > .edit-link').click({ force: true });
        cy.get('.page-header').contains('новая группа из автотеста').should('be.visible');
        cy.get('.btn-danger').click({ force: true });
        cy.get('.btn-danger').click({ force: true });
        cy.get('.dd-item').contains('новая группа из автотеста').should('not.exist');

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //снимаем флаг с выбранной группы
        cy.get('input[value=3457865]').uncheck().should('not.be.checked');

        //возвращаем настройки по-умолчанию
        cy.get('#ParamsObject_access_type_0[value="none"]').as('none').check().should('be.checked');
        cy.get('@save').click({ force: true });
        cy.get('@none').should('be.checked');

    });

    it('Можно изменить тип доступа на "все, у кого есть доступ хотя бы к одному из подтренингов"', () => {

        const trainingId = 868344065;

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //Поменяли вариант доступа на "все, у кого есть доступ хотя бы к одному из подтренингов"
        cy.get('#ParamsObject_access_type_1[value="children"]').as('children').check();

        //Проверили, что вариант "только те, кто купил тренинг" сейчас не выбран
        cy.get('#ParamsObject_access_type_0[value="none"]').as('none').should('not.be.checked');

        //сохраняем изменения доступа
        cy.get('button[name="saveAccess"]').click({ force: true });
        cy.get(generalElements.flashSuccess).contains('Настройки доступа сохранены').should('be.visible');

        //Проверяем, что установлен выбранный ранее тип доступа
        cy.get('@children').should('be.checked');

        //Проверяем, что выбор группы и тренинга для доступа скрыты
        cy.get('.select-users').should('exist').and('not.be.visible');
        cy.get('.select-other-training').should('exist').and('not.be.visible');

        //возвращаем вариант доступа на "только те кто купил"
        cy.get('@none').check();
        cy.get('button[name="saveAccess"]').click({ force: true });
        cy.get('@none').should('be.checked');

    });

    it('Можно изменить тип доступа на "все, у кого есть доступ к родительскому тренингу"', () => {

        const trainingId = 868344066;

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //Проверяем, изначально тип доступа стоит "только те, кто купил тренинг"
        cy.get('#ParamsObject_access_type_0[value="none"]').as('none').should('be.checked');

        //Поменяли вариант доступа на "все, у кого есть доступ к родительскому тренингу"
        cy.get('#ParamsObject_access_type_2[value="parent"]').as('parent').check();

        //Проверили, что вариант "только те, кто купил тренинг" сейчас не выбран
        cy.get('@none').should('not.be.checked');

        //сохраняем изменения доступа
        cy.get('button[name="saveAccess"]').click({ force: true });
        cy.get(generalElements.flashSuccess).contains('Настройки доступа сохранены').should('be.visible');

        //Проверяем, что установлен выбранный ранее тип доступа
        cy.get('@parent').should('be.checked');

        //Проверяем, что выбор группы и тренинга для доступа скрыты
        cy.get('.select-users').should('exist').and('not.be.visible');
        cy.get('.select-other-training').should('exist').and('not.be.visible');

        //возвращаем вариант доступа на "только те кто купил"
        cy.get('@none').check();
        cy.get('button[name="saveAccess"]').click({ force: true });
        cy.get('@none').should('be.checked');

    });

    it('Можно изменить тип доступа на "те, у кого есть доступ к родительскому тренингу, ограниченные группами"', () => {

        const trainingId = 868344066;

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //Проверяем, изначально тип доступа стоит "только те, кто купил тренинг"
        cy.get('#ParamsObject_access_type_0[value="none"]').as('none').should('be.checked');

        //Поменяли вариант доступа на "те, у кого есть доступ к родительскому тренингу, ограниченные группами"
        cy.get('#ParamsObject_access_type_3[value="parent_with_groups"]').as('parent_with_groups').check();

        //Проверили, что вариант "только те, кто купил тренинг" сейчас не выбран
        cy.get('@none').should('not.be.checked');

        //Проверяем, что отображается выбор группы и скрыт выбор тренинга для завершения
        cy.get('.select-users').and('be.visible');
        cy.get('.select-other-training').should('exist').and('not.be.visible');

        //Проверяем поисковую строку "Поиск по группе"
        cy.get('.filter-for-group[placeholder="Поиск по группе"]').as('filter').should('be.visible');

        //Отображается случайно выбранная группа
        cy.get('label').contains('группа, в которой никого не будет (НЕ УДАЛЯТЬ)').as('group_for_check').should('be.visible');

        //В поле для поиска вводим название группы
        cy.get('@filter').type('группа для доступов').should('have.value', 'группа для доступов');

        //Случайно выбранная группа не отображается, так как введено не ее название
        cy.get('@group_for_check').should('not.be.visible');

        //В списке отображается группа, чье название было введено в поле для поиска
        cy.get('label').contains('группа для доступов').should('be.visible');

        //Ставим галочку в выбранную группу и проверяем, что галочка проставлена
        cy.get('input[value=3457865]').as('select_group').check().should('be.checked');

        //сохраняем изменения доступа и проверяем, что изменения сохранились
        cy.get('button[name="saveAccess"]').click({ force: true });
        cy.get('.flash-success').contains('Настройки доступа сохранены').should('be.visible');
        cy.get('@parent_with_groups').should('be.checked');
        cy.get('@select_group').should('be.checked');

        //снимаем флаг с выбранной группы и возвращаем вариант доступа на "только те кто купил"
        cy.get('@select_group').uncheck().should('not.be.checked');
        cy.get('@none').check();
        cy.get('button[name="saveAccess"]').click({ force: true });
        cy.get('.flash-success').contains('Настройки доступа сохранены').should('be.visible');
        cy.get('@none').should('be.checked');

    });

    it('Можно переключать опцию "Тем, у кого нет доступа" и добавить адрес для переадресации', () => {

        const trainingId = 864615211;

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        // not_show включена, show выключена
        cy.get('#Training_noaccess_mode_0').as('not_show').should('be.checked');

        cy.get('#Training_noaccess_mode_1').as('show').should('not.be.checked');

        //включаем опцию "Показать в списке тренингов"
        cy.get('@show')
            .check();

        //вводим адрес для переадресации
        cy.get('#ParamsObject_not_access_redirect_url').as('redirect_url').type('https://getcourse.ru/')
            .should('have.value', 'https://getcourse.ru/');

        cy.get('button[name="saveAccess"]').as('save').click({ force: true });

        cy.get(generalElements.flashSuccess).contains('Настройки доступа сохранены').as('info').should('be.visible');

        // not_show выключена, show включена
        cy.get('@not_show').should('not.be.checked');
        cy.get('@show').should('be.checked');

        //сохранен адрес для переадресации
        cy.get('@redirect_url').should('have.value', 'https://getcourse.ru/').and('be.visible');

        //включаем опцию "Не показывать в списке тренингов"
        cy.get('@not_show').check();

        //удаляем адрес для переадресации
        cy.get('@redirect_url').clear();

        cy.get('@save').click({ force: true });

        cy.get('@info').should('be.visible');

        // not_show включена, show выключена
        cy.get('@not_show').should('be.checked');

        cy.get('@show').should('not.be.checked');

        cy.get('@redirect_url').should('have.value', '');

    });

    it('Задать параметры продажи тренинга', () => {

        const trainingId = 864615211;

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('#generate-page-btn > .btn-primary').invoke('removeAttr', 'target');

        cy.get('.btn-primary').contains('Задать параметры продажи тренинга').click({ force: true });

        //проверка юрл
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/sales/training/promote?id=${trainingId}`);

        //проверка содержимого страницы
        cy.contains('1. Название и описание тренинга').should('be.visible');

        cy.get('#product-title').should('have.value', current_training_title).and('be.visible');

        cy.get('#product-description').should('have.attr', 'placeholder', 'Введите описание: пару предложений, объясняющих суть тренинга').and('be.visible');

        cy.get('.field-product-createofferprice').contains('2. Стоимость обучения').should('be.visible');

        cy.get('#product-createofferprice')
            .should('have.value', '0')
            .and('have.attr', 'type', 'number')
            .and('have.attr', 'min', '0')
            .and('be.visible');

        cy.get('.help-block').contains('Тренинг может быть бесплатным').should('be.visible');

        cy.get('.field-product-finishafterdays').contains('3. Продолжительность обучения')
            .should('be.visible');

        cy.get('#product-finishafterdays')
            .should('have.attr', 'type', 'number')
            .and('have.attr', 'placeholder', 'дней')
            .and('have.attr', 'min', '0')
            .and('be.visible');

        cy.get('.help-block').contains('Ученики получат доступ на указанное количество дней.')
            .should('be.visible');

        cy.get('.help-block').contains('Оставьте пустым, если доступ не ограничен по времени.')
            .should('be.visible');

        cy.get('.row-buttons').contains('Вернуться к настройкам тренинга')
            .should('have.attr', 'href', `/teach/control/stream/access/id/${trainingId}`)
            .and('be.visible');

        cy.get('.btn-success').contains('Сохранить и создать страницу для продажи').as('save')
            .should('be.visible');

        //дальше не проверяем
        // //заполняем поля
        // cy
        //     .get('#product-title')
        //     .clear()
        //     .type('Название тренинга из автотеста')
        //     .should('have.value', 'Название тренинга из автотеста');

        // cy
        //     .get('#product-description')
        //     .type('Описание тренинга из автотеста')
        //     .should('have.value', 'Описание тренинга из автотеста');

        // cy
        //     .get('#product-createofferprice')
        //     .clear()
        //     .type('500')
        //     .should('have.value', '500');

        // cy
        //     .get('#product-finishafterdays')
        //     .clear()
        //     .type('30')
        //     .should('have.value', '30');

        // cy
        //     .get('@save')
        //     .click({ force: true });

        // //проверка созданной страницы
        // cy
        //     .url()
        //     .should('include', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/cms/page/editor?id=');

        // //название страницы
        // cy
        //     .get('.gc-into-main-content')
        //     .contains('Название тренинга из автотеста')
        //     .should('be.visible');

        // //блок с названием и описанием
        // cy
        //     .get('.modal-block-content')
        //     .contains('Название тренинга из автотеста')
        //     .should('be.visible');

        // cy
        //     .get('.modal-block-content')
        //     .contains('Описание тренинга из автотеста')
        //     .should('be.visible');

        // //наличие урока
        // cy
        //     .get('.lesson-id-324291910')
        //     .should('exist')
        //     .and('be.visible')

        // //проверяем, что создан продукт и предложение

        // cy
        //     .visit('/pl/sales/offer/index', {
        //         auth: {
        //             username: 'gcrc',
        //             password: 'gc12rc'
        //         }
        //     });

        // cy
        //     .get('.w5')
        //     .contains('Название тренинга из автотеста')
        //     .click({ force: true });

        // cy
        //     .get('.panel-heading')
        //     .contains('Название тренинга из автотеста')
        //     .should('be.visible');

        // cy
        //     .get('.text-muted')
        //     .contains('Открывает доступ к тренингу «Название тренинга из автотеста»')
        //     .should('be.visible');

        // //Проверяем, что у тренинга изменилось название и описание
        // cy
        //     .visit(`/teach/control/stream/update/id/${trainingId}`, {
        //         auth: {
        //             username: 'gcrc',
        //             password: 'gc12rc'
        //         }
        //     });

        // cy
        //     .get('#Training_title')
        //     .should('have.value', 'Название тренинга из автотеста');

        // cy
        //     .get('#Training_description')
        //     .should('have.value', 'Описание тренинга из автотеста');

    });

    it('В списке "те, кто прошел другой тренинг" отображается ранее выбранный архивный тренинг', () => {

        const trainingId = 858051027;

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //Проверили, что выбранный архивный тренинг отображается с дополнительной припиской "архивирован"
        cy.get('#select2-chosen-1')
            .contains('тренинг для завершения (архивирован)(архивирован)')
            .should('exist')
            .and('be.visible');

    });

    it('В списке "те, кто прошел другой тренинг" отображается ранее выбранный архивный подтренинг, который был архивирован из-за родителя', () => {

        const trainingId = 868344056;

        cy.visit(`/teach/control/stream/access/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //Проверили, что выбранный архивный тренинг отображается с дополнительной припиской "архивирован"
        cy.get('#select2-chosen-1')
            .contains('архивный подтренинг 868344058(архивирован)')
            .should('exist')
            .and('be.visible');
    });
});

describe('Проверка вкладки "Настройки" в тренинге', () => {

    const trainingId = 864615211;

    before('Auth', () => {
        cy.login(users.admin.email);
    });

    beforeEach('Переадресация на страницу настроек', () => {
        cy.visit(`/teach/control/stream/update/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
    });

    it('Проверка видимых опций', () => {

        const visibleOptions = [
            'Название',
            'Описание',
            'Основной преподаватель',
            'Дополнительные преподаватели',
            'Запретить дополнительным учителям изменять Тренинг и Урок',
            'Уведомлять основного учителя об ответах',
            'Уведомлять всех учителей об ответах',
            'Задать, что является «Началом» прохождения тренинга',
            'Задать, что является «Завершением» прохождения тренинга',
            'Запретить ученикам копирование и выделение текста во всех уроках тренинга и уроках подтренингов',
            'Сотрудники, назначенные дополнительными преподавателями, проверяют ответы на задания и могут редактировать тренинг, если это не запрещено',
            'Если флажок активен, то ученики не смогут выделять и копировать текст в уроках данного тренинга и в уроках подтренингов',
            'Запретить ученикам копирование и выделение текста во всех уроках тренинга',
            'Если флажок активен, то ученики не смогут выделять и копировать текст только в уроках данного тренинга',
            'Тема оформления тренинга',
            'Тема оформления тренинга применяется к тренингу, подтренингам и урокам',
            'Не наследовать тему оформления аккаунта'
        ]

        // проверка видимых опций на странице
        visibleOptions.forEach((option) => {
            cy.get('.col-md-6').contains(option).should('exist')
        });

    });

    it('Проверка скрытых опций', () => {

        const hiddenOptions = [
            'Показывать ученикам отметку',
            'Показывать Галерею тренинга',
            'Обратная сортировка уроков (последние сверху)',
            'Запретить дополнительным учителям видеть ответы не своих учеников в тренинге и ленте ответов',
            'URL для допродажи проверки в ответах без проверки',
            'Показывать чат в уроках',
            'Запретить пропускать стоп-уроки за монеты',
            'Архивировать тренинг',
            'Тренинг и все подтренинги будут перенесены в системный архив; ученики не будут иметь доступ к тренингам'
        ]

        // проверили, что скрытые настройки не отображаются на странице
        cy.get('.col-md-6').contains('Показывать ученикам отметку').should('not.exist');

        // раскрыли дополнительные настройки
        cy.get(updatePage.additionalOptions).click();

        // проверка наличия всех опций в дополнительных настройках
        hiddenOptions.forEach((option) => {
            cy.get('.col-md-12').contains(option).should('exist')
        });

    });

    it('Можно изменить название тренинга', () => {

        cy.get(updatePage.trainingName).as('title').should('have.value', current_training_title);
        cy.get('@title').clear().type(new_training_title).should('have.value', new_training_title);
        cy.get('.btn-primary').contains('Сохранить').as('save').click({ force: true });
        cy.get(generalElements.flashSuccess).contains(updatePage.flashSuccessText).should('be.visible');
        cy.get('h1').contains(new_training_title);
        cy.get('@title').should('have.value', new_training_title);
        cy.get('@title').clear().type(current_training_title).should('have.value', current_training_title);
        cy.get('@save').click({ force: true });
        cy.get('@title').should('have.value', current_training_title);
        cy.get('h1').contains(current_training_title);

    });

    it('Можно изменить описание тренинга', () => {

        cy.get(updatePage.trainingDescription).as('description').should('have.value', '');
        cy.get("@description").type(new_training_description).should('have.value', new_training_description);
        cy.get(generalElements.buttonSave).contains('Сохранить').as('save').click({ force: true });
        cy.get(generalElements.flashSuccess).contains(updatePage.flashSuccessText).should('be.visible');
        cy.get('@description').should('have.value', new_training_description);
        cy.get('@description').clear().should('have.value', '');
        cy.get('@save').click({ force: true });
        cy.get('@description').should('have.value', '');

    });

    it('Можно выбрать основного преподавателя', () => {

        const teacher = "Елена Шорохова";
        const teacherId = '373336638';

        //проверяем, что учитель сейчас не выбран
        cy.get(updatePage.selectedMainTeacher).contains(updatePage.noMainTeacher)
            .should('have.attr', 'selected', 'selected');

        //выбираем учителя
        cy.get(updatePage.selectedMainTeacher).select(teacher, { force: true })
            .invoke('val').should('eq', teacherId);

        cy.get('.btn-primary').contains('Сохранить').as('save').click({ force: true });
        cy.get(generalElements.flashSuccess).contains(updatePage.flashSuccessText).should('be.visible');
        cy.get(updatePage.selectedMainTeacher).contains(teacher).should('have.attr', 'selected', 'selected');

        cy.visit('/teach/control', {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get(`.training-row[data-training-id="${trainingId}"]`).contains(teacher).should('be.visible');

        //возвращаем значение по-умолчанию "без учителя"
        cy.visit(`/teach/control/stream/update/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get(updatePage.selectedMainTeacher)
            .select(updatePage.noMainTeacher, { force: true })
            .invoke('val').should('eq', '');

        cy.get('@save').click({ force: true });

        cy.get(generalElements.flashSuccess).contains(updatePage.flashSuccessText).should('be.visible');
        cy.get(updatePage.selectedMainTeacher).contains(updatePage.noMainTeacher)
            .should('have.attr', 'selected', 'selected');
        cy.visit('/teach/control', {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get(`.training-row[data-training-id="${trainingId}"]`).contains(teacher).should('not.exist');
    });

    it('Можно выбрать дополнительного учителя', () => {

        let teacher1 = "Елена Шорохова";
        let teacher2 = "учитель";

        //выбираем дополнительных учителей
        cy.get(updatePage.noAdditionalTeachers).contains('Дополнительные преподаватели не выбраны')
            .should('be.visible');
        cy.get(updatePage.allEmployees).contains('все сотрудники').click();
        cy.get('#ParamsObject_teachers_0').check().should('be.checked');
        cy.get('#ParamsObject_teachers_2').check().should('be.checked');
        cy.get(generalElements.buttonSave).contains('Сохранить').as('save').click({ force: true });
        cy.get(generalElements.flashSuccess).contains(updatePage.flashSuccessText).as('success').should('be.visible');

        cy.get(updatePage.additionalTeachers).contains(teacher1).should('be.visible');
        cy.get(updatePage.additionalTeachers).contains(teacher2).should('be.visible');

        //возвращаем доп учителей по умолчанию (никто не выбран)
        cy.get('#ParamsObject_teachers_0').uncheck().should('not.be.checked');
        cy.get('#ParamsObject_teachers_2').uncheck().should('not.be.checked');
        cy.get('@save').click({ force: true });
        cy.get('@success').should('be.visible');
        cy.get(updatePage.noAdditionalTeachers).contains('Дополнительные преподаватели не выбраны')
            .should('be.visible');
    });

    it('Настройка "Показывать Галерею тренинга"', () => {
        const filters = [
            'Уроки:', 'Месяц загрузки:', 'Источник:', 'Вид:', 'Добавлено с:', 'по:'
        ]
        // раскрыли дополнительные настройки
        cy.get(updatePage.additionalOptions).click();
        //Проверили, что настройка не включена
        cy.get('#ParamsObject_show_gallery').as('show_gallery').should('not.be.checked');
        //включили настройку
        cy.get('@show_gallery').check().should('be.checked');
        cy.get(generalElements.buttonSave).contains('Сохранить').as('save').click({ force: true });
        cy.get(generalElements.flashSuccess).contains(updatePage.flashSuccessText).as('success').should('be.visible');
        //Проверили, что галка проставлена
        cy.get('@show_gallery').should('be.checked');
        //Переходим на вкладку "Галерея"
        cy.get('.content-menu').contains('Галерея').as('gallery').click({ force: true });
        //проверка содержания страницы
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/gallery/id/${trainingId}`);
        cy.get('.page-header').contains('Галерея тренинга "Проверка настроек"').should('be.visible')
        filters.forEach((filter) => {
            cy.get('.list-filter').contains(filter).should('be.visible');
        });
        cy.get('.submit').contains('Показать').should('be.visible');
        cy.get('.gc-tags-cloud').should('be.visible');
        cy.get('.ui-sortable-handle').contains('теги').should('be.visible');
        //выключаем галерею
        cy.visit(`/teach/control/stream/update/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get(updatePage.additionalOptions).click();
        cy.get('@show_gallery').uncheck().should('not.be.checked');
        cy.get('@save').click({ force: true });
        cy.get('@success').should('be.visible');
        cy.get('@show_gallery').should('not.be.checked');
        cy.get('@gallery').should('not.exist');
    })

});

describe('Проверяем вкладку "Расписание" в тренинге', () => {

    const trainingId = 857501950;

    before('Auth', () => {
        cy.login(users.admin.email);
    });

    beforeEach('Переадресация на страницу расписания', () => {
        cy.visit(`/pl/teach/training/lessons-schedule?id=${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
    });

    it('Проверка основных опций', () => {

        const panelHeading1 = [
            'Вид расписания', 'Расписание уроков'
        ]
        const trainingScheduleType = [
            'У всех одинаковое', 'У каждого ученика свое'
        ]

        //проверка заголовков блоков
        panelHeading1.forEach((heading) => {
            cy.get('.panel-heading').contains(heading).should('exist')
        })

        // проверка отображения видов расписания
        trainingScheduleType.forEach((schedule) => {
            cy.get('#training-schedule_type').contains(schedule).should('exist')
        });
        cy.get('.radio').its('length').should('eq', 4); //проверяем количество настроек для расписания (4 шт: вид расписания + настройки для считать началом расписания)

    });

    it('Проверка опций индивидуального расписания', () => {

        const settingOwnSchedule = [
            '№', 'Урок', 'Задержка', 'Доступность и видимость урока до даты начала', 'Скрыть урок от учеников', 'Урок для тест-драйва', 'Промоурок', 'Контроль качества'
        ]
        const panelHeading2 = [
            'Вид расписания', 'Расписание уроков', 'Считать началом расписания', 'Начинать расписание'
        ]
        const paramsobjectScheduleStart = [
            'Получение доступа к тренингу', 'Первый вход в тренинг'
        ]

        //включаем индивидуальное расписание и сохраняем
        cy.get('#training-schedule-type--1').click();
        cy.get('button[name="save"]').click();
        cy.get('.own-schedule-type-params').should('be.visible');

        //проверяем отображение заголовков блоков из списка panelHeading2
        panelHeading2.forEach((item => {
            cy.get('.panel-heading').contains(item).should('exist').and('be.visible');
        }));

        //Проверяем отображение вариантов "считать началом расписания"
        paramsobjectScheduleStart.forEach((item) => {
            cy.get('#paramsobject-schedule_start').contains(item).should('exist').and('be.visible');
        })

        //проверяем наличие опции "Не показывать урок, пока он недоступен"
        cy.get('.field-paramsobject-hide_not_available_lessons')
            .contains('Не показывать урок, пока он недоступен')
            .should('exist')
            .and('be.visible');

        //проверяем наличие опции "Отправлять уведомления при открытии урока по расписанию"
        cy.get('.field-training-need_send_notifications')
            .contains('Отправлять уведомления при открытии урока по расписанию')
            .should('exist')
            .and('be.visible');

        //проверяем наличие вариант "Начинать расписание" - "не ранее чем"
        cy.get('.field-paramsobject-schedule_min_start_at')
            .contains('не ранее чем')
            .should('exist')
            .and('be.visible');

        //проверяем наличие вариант "Начинать расписание" - "не позднее чем"
        cy.get('.field-paramsobject-schedule_max_start_at')
            .contains('не позднее чем')
            .should('exist')
            .and('be.visible');

        //проверка отображения настроек для индивидуального расписания в блоке "Расписание уроков"
        settingOwnSchedule.forEach((item) => {
            cy.get('.table').contains(item).should('exist').and('be.visible');
        })
    });

    it('Проверка опций общего расписания', () => {

        const settingGeneralSchedule = [
            '№',
            'Урок',
            'Дата начала',
            'Доступность и видимость урока до даты начала',
            'Скрыть урок от учеников',
            'Урок для тест-драйва',
            'Промоурок',
            'Контроль качества'
        ]

        //включаем общее расписание и сохраняем
        cy.get('#training-schedule-type--0').click();
        cy.get('button[name="save"]').click();

        //скрыты настройки индивидуального расписания
        cy.get('.own-schedule-type-params').should('not.be.visible');

        //проверка отображения настроек для общего расписания в блоке "Расписание уроков"
        settingGeneralSchedule.forEach((item) => {
            cy.get('.table').contains(item).should('exist').and('be.visible');
        })

    });
});

//не работает
describe.skip('Проверяем вкладку "Ученики"', () => {
    const trainingIdWithStopLessons = 861367841;
    const userId = 373767399;

    it('Кнопка "Выдать доступ к урокам" переадресовывает на вкладку "Ученики"', function () {
        cy.login(users.admin.email);

        cy.visit(`/teach/control/stat/stream/id/${trainingIdWithStopLessons}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get(`.username[title="${userId}"]`).contains('Леонард').as('userButton').invoke('removeAttr', 'target');
        cy.get('@userButton').click({ force: true });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stat/userTraining/id/${userId}/trainingId/${trainingIdWithStopLessons}`);
        cy.get('.alert-warning').contains('Статусы уроков показаны для пользователя:').should('be.visible');
        cy.get('.btn-primary').contains('Выдать доступ к урокам').click({ force: true });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stat/stream/id/${trainingIdWithStopLessons}/userId/${userId}`);
        cy.get('.user-tr[data-email="leonard@test.ru"]').contains('проверочный после "пока не выполнят этот урок" 323678584').should('be.visible');
    });
});