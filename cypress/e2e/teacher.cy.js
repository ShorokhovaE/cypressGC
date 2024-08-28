const users = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/users1.json");

//поправить тесты с кнопкой "действия"
describe('Сотрудник. Основные действия с тренингом', () => {

    const trainingId = 766478245;
    const lessonId = 292113097;

    before('Авторизация', () => {
        cy.login(users.teacher.email);
    });

    it('Нет кнопок "Создать тренинг", "Список тренингов" и "Настроить вид", "Архивные тренинги" на странице списка тренингов', function () {

        cy.visit('/teach/control', {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control`);

        cy.contains('Добавить тренинг').should('not.exist');
        cy.contains('Список тренингов').should('not.have.class', 'btn');
        cy.contains('Настроить вид').should('not.exist');
        cy.contains('Архивные тренинги').should('not.exist');
    });

    it('Есть доступ по прямой ссылке к форме создания тренинга', () => {

        cy.visit('/teach/control/stream/new', {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('h1').contains('Новый тренинг').should('be.visible');


        cy.get('#Training_title').should('be.visible');
        cy.get('#Training_description').should('be.visible');
    });
});

describe('Основной учитель. Проверяем содержимое тренинга', () => {

    const trainingId = 864615211;
    const lessonId = 324291910;
    const teacher = "учитель";
    const no_teacher = "<не выбран>";

    it('Назначение сотрудника основным учителем', () => {
        cy.login(users.admin.email);

        cy.visit(`/teach/control/stream/update/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //Выбираем основного учителя
        cy.get('#Training_main_teacher_id')
            .as('selected_teacher')
            .contains(no_teacher)
            .should('have.attr', 'selected', 'selected');

        cy.get('@selected_teacher')
            .select(teacher, { force: true })
            .invoke('val').should('eq', '374765968');

        cy.get('.btn-primary').contains('Сохранить').click({ force: true });

        cy.get('#Training_main_teacher_id')
            .as('selected_teacher')
            .contains(teacher)
            .should('have.attr', 'selected', 'selected');
    });

    it('На странице "Содержание" есть все необходимые пункты в кнопках "Действия" и "Добавить", если в тренинге более 1 урока', () => {

        cy.login(users.teacher.email);

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.btn-group li').its('length').should('eq', 5); //проверяем количество li в списке (их 5)

        // далее проверяем наличие и отсутствие всех нужных ссылок
        cy.get('div.btn-group ul.dropdown-menu li a').as('menu')
            .contains('Быстрое редактирование уроков')
            .should('have.attr', 'href')
            .and('include', `/teach/control/stream/view/id/${trainingId}/editable/1`);

        cy.get('@menu').contains('Настроить вид').should('not.exist');

        cy.get('@menu')
            .contains('Сделать рассылку')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/sendNotification/id/${trainingId}`);

        cy.get('@menu')
            .contains('Редактировать тренинг')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/update/id/${trainingId}`);

        cy.get('@menu').contains('Настроить доступ').should('not.exist');
        cy.get('@menu').contains('Поменять порядок тренингов').should('not.exist');
        cy.get('@menu').contains('Копировать тренинг').should('not.exist');
        cy.get('@menu').contains('Настройки уроков').should('not.exist');

        cy.get('@menu').contains('Сменить порядок уроков в тренинге')
            .should('have.class', 'link-change-sort');

        cy.get('@menu').contains('Статистика тренинга').should('not.exist');

        cy.get('@menu').contains('Урок')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/lesson/new/trainingId/${trainingId}`);

        cy.get('@menu').contains('Подтренинг').should('not.exist');
    });

    it('В верхнем меню на всех вкладках отображаются нужные пункты', () => {

        //вкладка "Достижения" не отображается, но по прямой ссылке доступ есть
        const hidePage = `/pl/teach/training/achievements?id=${trainingId}`;

        //к вкладке "Качество тренинга" сотрудник не имеет доступ по умолчанию
        const unavailablePage = `/pl/teach/training/feedback?id=${trainingId}`;

        const pages1 = [
            `/teach/control/stream/view/id/${trainingId}`,
            `/teach/control/stream/update/id/${trainingId}`,
            `/teach/control/stream/access/id/${trainingId}`,
            `/teach/control/stat/stream/id/${trainingId}`,
            `/teach/control/stream/stat/id/${trainingId}`
        ];

        const pages2 = [
            `/pl/teach/training/lessons-schedule?id=${trainingId}`,
            `/pl/teach/training/chatium?id=${trainingId}`,
            hidePage
        ];

        //проверяем первую группу вкладок
        pages1.forEach((page) => {
            cy.visit(page, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });

            cy.get('.page-menu li').its('length').should('eq', 7); //проверяем количество li в списке (их 7, "Достижения" и "Качество тренинга" не отображаются)

            //далее проверяем наличие всех вкладок
            cy.get('.content-menu a').as('menuForPages1').contains('Содержание')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/view/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Настройки')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/update/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Доступ')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/access/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Расписание')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/lessons-schedule?id=${trainingId}`);

            cy.get('@menuForPages1')
                .contains('Ученики')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stat/stream/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Статистика')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/stat/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Достижения').should('not.exist');

            cy.get('@menuForPages1').contains('В приложении')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/chatium?id=${trainingId}`);

            cy.get('@menuForPages1').contains('Качество тренинга').should('not.exist');
        });

        pages2.forEach((page) => {
            cy.visit(page, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get('.standard-page-menu li').its('length').should('eq', 7); //проверяем количество li в списке (их 7)

            //далее проверяем наличие всех вкладок
            cy.get('.standard-page-menu a').as('menuForPages2').contains('Содержание')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/view?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Настройки')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/settings?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Доступ')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/access?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Расписание')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/lessons-schedule?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Ученики')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/students?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Статистика')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/stat?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Достижения').should('not.exist');

            cy.get('@menuForPages2').contains('В приложении')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/chatium?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Качество тренинга').should('not.exist');
        });

        //код ответа к вкладке "Качество тренинга" 403
        cy.request({
            url: unavailablePage,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Опция "Сделать рассылку" возвращает ошибку 403', () => {

        cy.request({
            url: `/pl/teach/control/stream/send-notification?id=${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Опция "Редактировать тренинг" работает', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').contains('Действия').click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a').contains('Редактировать тренинг').click({ force: true });

        //проверили, что произошла переадресация на вкладку "Настройки"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/update/id/${trainingId}`);

    });

    it('Прямая ссылка "Настройки уроков" возвращает ошибку 403', () => {

        cy.request({
            url: `/pl/teach/control/stream/send-notification?id=${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Опция "Сменить порядок уроков в тренинге" включается, но при попытке сохранить возвращает код ответа 403', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').contains('Действия')
            .click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a').contains('Сменить порядок уроков в тренинге')
            .click({ force: true });

        //Проверяем наличие кнопок
        cy.get('.btn-save-sort').contains('Сохранить порядок').as('save').should('be.visible');

        cy.get('.btn-cancel-sort').contains('Отменить').as('cancel').should('be.visible');

        //нажимаем на кнопку "Отменить"
        cy.get('@cancel').click({ force: true });
        cy.get('.lesson-sort-block').should('not.be.visible');

        //проверяем, что нет доступа к сохранению изменений
        cy.request({
            url: `/pl/teach/control/stream/save-lessons-order?id=${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });

    });

    it('Добавление урока в тренинг через кнопку "Добавить урок" и удаление урока', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').contains('Добавить').click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a').contains('Урок').click({ force: true });

        cy.get('#Lesson_title').type('New Lesson').should('have.value', 'New Lesson');
        cy.get('.btn-primary').click();
        cy.get('.btn').contains('Вернуться к просмотру').click();
        cy.get('.user-answer')
            .invoke('attr', 'data-lesson-id')
            .then((lessonId) => {
                cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
                    auth: {
                        username: 'gcrc',
                        password: 'gc12rc'
                    }
                });
                cy.get('.title').contains('New Lesson').should('exist');
                cy.get(`[data-lesson-id=${lessonId}]`).click();
                cy.get('.dropdown-toggle:first').click();
                cy.get('.dropdown-menu > li').contains('Удалить урок').click();
                cy.get('.btn-danger').click();

                //проверяем, что урок удален
                cy.request({
                    url: `/teach/control/stream/view/id/${lessonId}`,
                    auth: {
                        username: 'gcrc',
                        password: 'gc12rc'
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(404)
                });
            });
    });

    it('Есть доступ по прямой ссылке к форме создания подтренинга', () => {

        cy.visit(`/teach/control/stream/new/parentId/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('h1').contains('Новый тренинг').should('be.visible');


        cy.get('#Training_title').should('be.visible');
        cy.get('#Training_description').should('be.visible');
        cy.get('#Training_parent_id').contains('Список тренингов').should('not.exist');

    });

    it('Есть доступ к странице копирования тренинга', () => {

        cy.visit(`/pl/teach/training/copy?id=${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.control-label').contains('Поместить копию в').should('be.visible');
        cy.get('.control-label').contains('Название копии').should('be.visible');
    });

    it('Проверка опций в кнопке "Действия" в уроке', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-menu li').its('length').should('eq', 5); //проверяем количество li в списке (их 4 и 1 разделитель)

        cy.get('ul.dropdown-menu li a').as('menu')
            .contains('Задание')
            .should('have.attr', 'href')
            .and('include', `/teach/control/lesson/update?id=${lessonId}&part=mission`);

        cy.get('@menu')
            .contains('Настройки')
            .should('have.attr', 'href')
            .and('include', `/teach/control/lesson/update?id=${lessonId}&part=main`);

        cy.get('@menu').contains('Создать новое уведомление')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/lesson/notification?id=${lessonId}`);

        cy.get('@menu')
            .contains('Удалить урок')
            .should('have.attr', 'href')
            .and('include', `/teach/control/lesson/delete?id=${lessonId}`);

    });

    it('Опция "Задание" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').click();
        cy.get('ul.dropdown-menu li a').contains('Задание').click({ force: true });

        //проверили, что произошла переадресация на вкладку "Задание и комментарии"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/lesson/update?id=${lessonId}&part=mission`);

    });

    it('Опция "Настройки" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').click();
        cy.get('ul.dropdown-menu li a').contains('Настройки').click({ force: true });

        //проверили, что произошла переадресация на вкладку "Настройки"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/lesson/update?id=${lessonId}&part=main`);

    });

    it('Опция "Создать новое уведомление" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').click();
        cy.get('ul.dropdown-menu li a').contains('Создать новое уведомление').click({ force: true });

        //проверили, что произошла переадресация на страницу создания уведомления
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/lesson/notification?id=${lessonId}`);

        //проверяем объекты на странице
        cy.get('.row').contains('Тип уведомлений: Рассылка ученикам').should('be.visible');
        cy.get('label').contains('Отложенное').should('be.visible');
        cy.get('label').contains('Тема письма').should('be.visible');
        cy.get('label').contains('Текст письма').should('be.visible');
        cy.get('.btn-save').contains('Отправить уведомление').should('be.visible');
        cy.get('.btn').contains('Отменить').should('be.visible');



    });

    it('Опция "Редактировать урок" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.btn-primary').contains('Редактировать урок').click({ force: true });

        //проверили, что находимся в режиме редактирования урока
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lessonId}&editMode=1`);

        cy.get('.btn').contains('Вернуться к просмотру').click({ force: true });

        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lessonId}&editMode=0`);

    });

    it('Удаление сотрудника из числа основных учителей', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stream/update/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //Убираем основного учителя
        cy.get('#Training_main_teacher_id')
            .as('selected_teacher')
            .contains(teacher)
            .should('have.attr', 'selected', 'selected');

        cy.get('@selected_teacher')
            .select(no_teacher, { force: true })
            .invoke('val')
            .should('eq', '');

        cy.get('.btn-primary').contains('Сохранить').click({ force: true });

        cy.get('#Training_main_teacher_id')
            .as('selected_teacher')
            .contains(no_teacher)
            .should('have.attr', 'selected', 'selected');

    });
});

describe('Дополнительный учитель. Проверяем содержимое тренинга', () => {

    const trainingId = 864615211;
    const lessonId = 324291910;
    const teacher = "учитель";
    const no_teacher = "Дополнительные преподаватели не выбраны";

    it('Назначение сотрудника дополнительным учителем', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stream/update/id/${trainingId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //выбираем дополнительных учителей
        cy.get('#no-selected-teachers').contains(no_teacher).should('be.visible');
        cy.get('.all-link').contains('все сотрудники').click();
        cy.get('#ParamsObject_teachers_2').check().should('be.checked');
        cy.get('.btn-primary').contains('Сохранить').click({ force: true });
        cy.get('#additional-teachers').contains(teacher).should('be.visible');

    });

    it('На странице "Содержание" есть все необходимые пункты в кнопках "Действия" и "Добавить", если в тренинге более 1 урока', () => {

        cy.login(users.teacher.email);

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.btn-group li').its('length').should('eq', 6); //проверяем количество li в списке (их 6)

        // далее проверяем наличие и отсутствие всех нужных ссылок
        cy.get('div.btn-group ul.dropdown-menu li a').as('menu')
            .contains('Быстрое редактирование уроков')
            .should('have.attr', 'href')
            .and('include', `/teach/control/stream/view/id/${trainingId}/editable/1`);

        cy.get('@menu').contains('Настроить вид').should('not.exist');

        cy.get('@menu')
            .contains('Сделать рассылку')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/sendNotification/id/${trainingId}`);

        cy.get('@menu')
            .contains('Редактировать тренинг')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/update/id/${trainingId}`);

        cy.get('@menu').contains('Настроить доступ').should('not.exist');
        cy.get('@menu').contains('Поменять порядок тренингов').should('not.exist');
        cy.get('@menu').contains('Копировать тренинг').should('not.exist');
        cy.get('@menu').contains('Настройки уроков').should('not.exist');

        cy.get('@menu').contains('Сменить порядок уроков в тренинге')
            .should('have.class', 'link-change-sort');

        cy.get('@menu').contains('Статистика тренинга').should('not.exist');

        cy.get('@menu').contains('Урок')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/lesson/new/trainingId/${trainingId}`);

        cy.get('@menu').contains('Подтренинг').should('not.exist');
    });

    it('В верхнем меню на всех вкладках отображаются нужные пункты', () => {

        //вкладка "Достижения" не отображается, но по прямой ссылке доступ есть
        const hidePage = `/pl/teach/training/achievements?id=${trainingId}`;

        //к вкладке "Качество тренинга" сотрудник не имеет доступ по умолчанию
        const unavailablePage = `/pl/teach/training/feedback?id=${trainingId}`;

        const pages1 = [
            `/teach/control/stream/view/id/${trainingId}`,
            `/teach/control/stream/update/id/${trainingId}`,
            `/teach/control/stream/access/id/${trainingId}`,
            `/teach/control/stat/stream/id/${trainingId}`,
            `/teach/control/stream/stat/id/${trainingId}`
        ];

        const pages2 = [
            `/pl/teach/training/lessons-schedule?id=${trainingId}`,
            `/pl/teach/training/chatium?id=${trainingId}`,
            hidePage
        ];

        //проверяем первую группу вкладок
        pages1.forEach((page) => {
            cy.visit(page, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });

            cy.get('.page-menu li').its('length').should('eq', 7); //проверяем количество li в списке (их 7, "Достижения" и "Качество тренинга" не отображаются)

            //далее проверяем наличие всех вкладок
            cy.get('.content-menu a').as('menuForPages1').contains('Содержание')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/view/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Настройки')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/update/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Доступ')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/access/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Расписание')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/lessons-schedule?id=${trainingId}`);

            cy.get('@menuForPages1')
                .contains('Ученики')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stat/stream/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Статистика')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/stat/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Достижения').should('not.exist');

            cy.get('@menuForPages1').contains('В приложении')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/chatium?id=${trainingId}`);

            cy.get('@menuForPages1').contains('Качество тренинга').should('not.exist');
        });

        pages2.forEach((page) => {
            cy.visit(page, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get('.standard-page-menu li').its('length').should('eq', 7); //проверяем количество li в списке (их 7)

            //далее проверяем наличие всех вкладок
            cy.get('.standard-page-menu a').as('menuForPages2').contains('Содержание')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/view?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Настройки')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/settings?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Доступ')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/access?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Расписание')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/lessons-schedule?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Ученики')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/students?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Статистика')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/stat?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Достижения').should('not.exist');

            cy.get('@menuForPages2').contains('В приложении')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/chatium?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Качество тренинга').should('not.exist');
        });

        //код ответа к вкладке "Качество тренинга" 403
        cy.request({
            url: unavailablePage,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Опция "Сделать рассылку" возвращает ошибку 403', () => {

        cy.request({
            url: `/pl/teach/control/stream/send-notification?id=${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Опция "Редактировать тренинг" работает', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').contains('Действия').click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a').contains('Редактировать тренинг').click({ force: true });

        //проверили, что произошла переадресация на вкладку "Настройки"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/update/id/${trainingId}`);

    });

    it('Прямая ссылка "Настройки уроков" возвращает ошибку 403', () => {

        cy.request({
            url: `/pl/teach/control/stream/send-notification?id=${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Опция "Сменить порядок уроков в тренинге" включается, но при попытке сохранить возвращает код ответа 403', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').contains('Действия')
            .click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a').contains('Сменить порядок уроков в тренинге')
            .click({ force: true });

        //Проверяем наличие кнопок
        cy.get('.btn-save-sort').contains('Сохранить порядок').as('save').should('be.visible');

        cy.get('.btn-cancel-sort').contains('Отменить').as('cancel').should('be.visible');

        //нажимаем на кнопку "Отменить"
        cy.get('@cancel').click({ force: true });
        cy.get('.lesson-sort-block').should('not.be.visible');

        //проверяем, что нет доступа к сохранению изменений
        cy.request({
            url: `/pl/teach/control/stream/save-lessons-order?id=${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });

    });

    it('Добавление урока в тренинг через кнопку "Добавить урок" и удаление урока', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').contains('Добавить').click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a').contains('Урок').click({ force: true });

        cy.get('#Lesson_title').type('New Lesson').should('have.value', 'New Lesson');
        cy.get('.btn-primary').click();
        cy.get('.btn').contains('Вернуться к просмотру').click();
        cy.get('.user-answer')
            .invoke('attr', 'data-lesson-id')
            .then((lessonId) => {
                cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
                    auth: {
                        username: 'gcrc',
                        password: 'gc12rc'
                    }
                });
                cy.get('.title').contains('New Lesson').should('exist');
                cy.get(`[data-lesson-id=${lessonId}]`).click();
                cy.get('.dropdown-toggle:first').click();
                cy.get('.dropdown-menu > li').contains('Удалить урок').click();
                cy.get('.btn-danger').click();

                //проверяем, что урок удален
                cy.request({
                    url: `/teach/control/stream/view/id/${lessonId}`,
                    auth: {
                        username: 'gcrc',
                        password: 'gc12rc'
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(404)
                });
            });
    });

    it('Есть доступ по прямой ссылке к форме создания подтренинга', () => {

        cy.visit(`/teach/control/stream/new/parentId/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('h1').contains('Новый тренинг').should('be.visible');


        cy.get('#Training_title').should('be.visible');
        cy.get('#Training_description').should('be.visible');
        cy.get('#Training_parent_id').contains('Список тренингов').should('not.exist');

    });

    it('Есть доступ к странице копирования тренинга', () => {

        cy.visit(`/pl/teach/training/copy?id=${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.control-label').contains('Поместить копию в').should('be.visible');
        cy.get('.control-label').contains('Название копии').should('be.visible');
    });

    it('Проверка опций в кнопке "Действия" в уроке', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-menu li').its('length').should('eq', 5); //проверяем количество li в списке (их 4 и 1 разделитель)

        cy.get('ul.dropdown-menu li a').as('menu')
            .contains('Задание')
            .should('have.attr', 'href')
            .and('include', `/teach/control/lesson/update?id=${lessonId}&part=mission`);

        cy.get('@menu')
            .contains('Настройки')
            .should('have.attr', 'href')
            .and('include', `/teach/control/lesson/update?id=${lessonId}&part=main`);

        cy.get('@menu').contains('Создать новое уведомление')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/lesson/notification?id=${lessonId}`);

        cy.get('@menu')
            .contains('Удалить урок')
            .should('have.attr', 'href')
            .and('include', `/teach/control/lesson/delete?id=${lessonId}`);

    });

    it('Опция "Задание" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').click();
        cy.get('ul.dropdown-menu li a').contains('Задание').click({ force: true });

        //проверили, что произошла переадресация на вкладку "Задание и комментарии"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/lesson/update?id=${lessonId}&part=mission`);

    });

    it('Опция "Настройки" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').click();
        cy.get('ul.dropdown-menu li a').contains('Настройки').click({ force: true });

        //проверили, что произошла переадресация на вкладку "Настройки"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/lesson/update?id=${lessonId}&part=main`);

    });

    it('Опция "Создать новое уведомление" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').click();
        cy.get('ul.dropdown-menu li a').contains('Создать новое уведомление').click({ force: true });

        //проверили, что произошла переадресация на страницу создания уведомления
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/lesson/notification?id=${lessonId}`);

        //проверяем объекты на странице
        cy.get('.row').contains('Тип уведомлений: Рассылка ученикам').should('be.visible');
        cy.get('label').contains('Отложенное').should('be.visible');
        cy.get('label').contains('Тема письма').should('be.visible');
        cy.get('label').contains('Текст письма').should('be.visible');
        cy.get('.btn-save').contains('Отправить уведомление').should('be.visible');
        cy.get('.btn').contains('Отменить').should('be.visible');



    });

    it('Опция "Редактировать урок" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.btn-primary').contains('Редактировать урок').click({ force: true });

        //проверили, что находимся в режиме редактирования урока
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lessonId}&editMode=1`);

        cy.get('.btn').contains('Вернуться к просмотру').click({ force: true });

        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lessonId}&editMode=0`);

    });

    it('Удаление сотрудника из числа дополнительных учителей', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stream/update/id/${trainingId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //убираем дополнительного учителя
        cy.get('#ParamsObject_teachers_2').uncheck().should('not.be.checked');
        cy.get('.btn-primary').contains('Сохранить').click({ force: true });
        cy.get('#no-selected-teachers').contains(no_teacher).should('be.visible');
    })
});

//поправить тест, так как починили баг
describe.skip('Дополнительный учитель. "Запретить доп учителям редактировать". Проверяем содержимое тренинга', () => {

    const trainingId = 864615211;
    const lessonId = 324291910;
    const teacher = "учитель";
    const no_teacher = "Дополнительные преподаватели не выбраны";

    it('Назначение сотрудника дополнительным учителем и включение опции "Запретить доп учителям редактировать"', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stream/update/id/${trainingId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //выбираем дополнительного учителя
        cy.get('#no-selected-teachers').contains(no_teacher).should('be.visible');

        cy.get('.all-link').contains('все сотрудники').click();
        cy.get('#ParamsObject_teachers_2').check().should('be.checked');

        cy.get('#ParamsObject_disable_edit_for_additional_teachers')
            .as('disable_edit_for_additional_teachers')
            .should('not.be.checked');
        cy.get('@disable_edit_for_additional_teachers').check().should('be.checked');

        cy.get('.btn-primary').contains('Сохранить').click({ force: true });

        cy.get('#additional-teachers').contains(teacher).should('be.visible');
        cy.get('@disable_edit_for_additional_teachers').should('be.checked');

    });

    it('На странице "Содержание" нет опций в кнопках "Действия" и "Добавить"', () => {

        const unavailable_options = ['Быстрое редактирование уроков', 'Настроить вид', 'Сделать рассылку', 'Редактировать тренинг', 'Настроить доступ', 'Поменять порядок тренингов', 'Копировать тренинг', 'Настройки уроков', 'Сменить порядок уроков в тренинге', 'Статистика тренинга', 'Добавить', 'Подтренинг']

        cy.login(users.teacher.email);

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-menu').should('not.be.exist');

        unavailable_options.forEach((item) => {
            cy.contains(item).should('not.exist');
        });

    });

    it('В верхнем меню на всех вкладках отображаются только доступные вкладки', () => {

        const available_pages = [
            `/teach/control/stream/view/id/${trainingId}`,
            `/teach/control/stat/stream/id/${trainingId}`,
            `/teach/control/stream/stat/id/${trainingId}`
        ];

        const unavailable_pages = [
            `/pl/teach/training/lessons-schedule?id=${trainingId}`,
            `/pl/teach/training/chatium?id=${trainingId}`,
            `/teach/control/stream/update/id/${trainingId}`,
            `/teach/control/stream/access/id/${trainingId}`,
            `/pl/teach/training/achievements?id=${trainingId}`,
            `/pl/teach/training/feedback?id=${trainingId}`
        ];

        //проверяем доступные вкладки
        available_pages.forEach((page) => {
            cy.visit(page, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });

            cy.get('.page-menu li').its('length').should('eq', 3); //проверяем количество li в списке (их 3)

            //далее проверяем наличие всех вкладок
            cy.get('.content-menu a').as('menuForPages1').contains('Содержание')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/view/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Настройки').should('not.exist');

            cy.get('@menuForPages1').contains('Доступ').should('not.exist');

            cy.get('@menuForPages1').contains('Расписание').should('not.exist');

            cy.get('@menuForPages1')
                .contains('Ученики')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stat/stream/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Статистика')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/stat/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Достижения').should('not.exist');

            cy.get('@menuForPages1').contains('В приложении').should('not.exist');

            cy.get('@menuForPages1').contains('Качество тренинга').should('not.exist');
        });

        //проверка ответа 403 к вкладкам без доступа
        unavailable_pages.forEach((page) => {
            cy.request({
                url: page,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(403)
            });
        });
    });

    it('Опция "Сделать рассылку" возвращает ошибку 403', () => {

        cy.request({
            url: `/pl/teach/control/stream/send-notification?id=${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Прямая ссылка "Настройки уроков" возвращает ошибку 403', () => {

        cy.request({
            url: `/pl/teach/control/stream/send-notification?id=${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Нелья добавить урок, 403', () => {

        cy.request({
            url: `/teach/control/lesson/new/trainingId/${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });

    });

    it('Открывается страница удаления урока', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.dropdown-toggle:first').click();
        cy.get('.dropdown-menu > li').contains('Удалить урок').click();

        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/lesson/delete?id=${lessonId}`);

    });

    it('Есть доступ по прямой ссылке к форме создания подтренинга', () => {

        cy.visit(`/teach/control/stream/new/parentId/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('h1').contains('Новый тренинг').should('be.visible');


        cy.get('#Training_title').should('be.visible');
        cy.get('#Training_description').should('be.visible');
        cy.get('#Training_parent_id').contains('Список тренингов').should('not.exist');

    });

    it('Есть доступ к странице копирования тренинга', () => {

        cy.visit(`/pl/teach/training/copy?id=${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.control-label').contains('Поместить копию в').should('be.visible');
        cy.get('.control-label').contains('Название копии').should('be.visible');
    });

    it('Проверка опций в кнопке "Действия" в уроке', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-menu li').its('length').should('eq', 5); //проверяем количество li в списке (их 4 и 1 разделитель)

        cy.get('ul.dropdown-menu li a').as('menu')
            .contains('Задание')
            .should('have.attr', 'href')
            .and('include', `/teach/control/lesson/update?id=${lessonId}&part=mission`);

        cy.get('@menu')
            .contains('Настройки')
            .should('have.attr', 'href')
            .and('include', `/teach/control/lesson/update?id=${lessonId}&part=main`);

        cy.get('@menu').contains('Создать новое уведомление')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/lesson/notification?id=${lessonId}`);

        cy.get('@menu')
            .contains('Удалить урок')
            .should('have.attr', 'href')
            .and('include', `/teach/control/lesson/delete?id=${lessonId}`);

    });

    it('Опция "Задание" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').click();
        cy.get('ul.dropdown-menu li a').contains('Задание').click({ force: true });

        //проверили, что произошла переадресация на вкладку "Задание и комментарии"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/lesson/update?id=${lessonId}&part=mission`);

    });

    it('Опция "Настройки" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').click();
        cy.get('ul.dropdown-menu li a').contains('Настройки').click({ force: true });

        //проверили, что произошла переадресация на вкладку "Настройки"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/lesson/update?id=${lessonId}&part=main`);

    });

    it('Опция "Создать новое уведомление" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').click();
        cy.get('ul.dropdown-menu li a').contains('Создать новое уведомление').click({ force: true });

        //проверили, что произошла переадресация на страницу создания уведомления
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/lesson/notification?id=${lessonId}`);

        //проверяем объекты на странице
        cy.get('.row').contains('Тип уведомлений: Рассылка ученикам').should('be.visible');
        cy.get('label').contains('Отложенное').should('be.visible');
        cy.get('label').contains('Тема письма').should('be.visible');
        cy.get('label').contains('Текст письма').should('be.visible');
        cy.get('.btn-save').contains('Отправить уведомление').should('be.visible');
        cy.get('.btn').contains('Отменить').should('be.visible');



    });

    it('Опция "Редактировать урок" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.btn-primary').contains('Редактировать урок').click({ force: true });

        //проверили, что находимся в режиме редактирования урока
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lessonId}&editMode=1`);

        cy.get('.btn').contains('Вернуться к просмотру').click({ force: true });

        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lessonId}&editMode=0`);

    });

    it('Удаление сотрудника из числа дополнительных учителей и отключение опции "Запретить', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stream/update/id/${trainingId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //убираем дополнительного учителя и выключаем "запретить"
        cy.get('#ParamsObject_teachers_2').uncheck().should('not.be.checked');
        cy.get('#ParamsObject_disable_edit_for_additional_teachers').as('disable_edit_for_additional_teachers').uncheck().should('not.be.checked')

        cy.get('.btn-primary').contains('Сохранить').click({ force: true });

        cy.get('#no-selected-teachers').contains(no_teacher).should('be.visible');
        cy.get('@disable_edit_for_additional_teachers').should('not.be.checked');
    })
});

describe('Основной учитель. "Запретить доп учителям редактировать". Проверяем содержимое тренинга', () => {

    const trainingId = 864615211;
    const lessonId = 324291910;
    const teacher = "учитель";
    const no_teacher = "<не выбран>";

    it('Назначение сотрудника основным учителем и включение опции "Запретить', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stream/update/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //Выбираем основного учителя и включаем запрет на редактирование
        cy.get('#Training_main_teacher_id')
            .as('selected_teacher')
            .contains(no_teacher)
            .should('have.attr', 'selected', 'selected');

        cy.get('@selected_teacher')
            .select(teacher, { force: true })
            .invoke('val').should('eq', '374765968');

        cy.get('#ParamsObject_disable_edit_for_additional_teachers')
            .as('disable_edit_for_additional_teachers')
            .should('not.be.checked');
        cy.get('@disable_edit_for_additional_teachers').check().should('be.checked');

        cy.get('.btn-primary').contains('Сохранить').click({ force: true });
        cy.get('@selected_teacher').contains(teacher).should('have.attr', 'selected', 'selected');
        cy.get('@disable_edit_for_additional_teachers').should('be.checked');
    });

    it('На странице "Содержание" есть все необходимые пункты в кнопках "Действия" и "Добавить", если в тренинге более 1 урока', () => {

        cy.login(users.teacher.email);

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.btn-group li').its('length').should('eq', 5); //проверяем количество li в списке (их 5)

        // далее проверяем наличие и отсутствие всех нужных ссылок
        cy.get('div.btn-group ul.dropdown-menu li a').as('menu')
            .contains('Быстрое редактирование уроков')
            .should('have.attr', 'href')
            .and('include', `/teach/control/stream/view/id/${trainingId}/editable/1`);

        cy.get('@menu').contains('Настроить вид').should('not.exist');

        cy.get('@menu')
            .contains('Сделать рассылку')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/sendNotification/id/${trainingId}`);

        cy.get('@menu')
            .contains('Редактировать тренинг')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/stream/update/id/${trainingId}`);

        cy.get('@menu').contains('Настроить доступ').should('not.exist');
        cy.get('@menu').contains('Поменять порядок тренингов').should('not.exist');
        cy.get('@menu').contains('Копировать тренинг').should('not.exist');
        cy.get('@menu').contains('Настройки уроков').should('not.exist');

        cy.get('@menu').contains('Сменить порядок уроков в тренинге')
            .should('have.class', 'link-change-sort');

        cy.get('@menu').contains('Статистика тренинга').should('not.exist');

        cy.get('@menu').contains('Урок')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/lesson/new/trainingId/${trainingId}`);

        cy.get('@menu').contains('Подтренинг').should('not.exist');
    });

    it('В верхнем меню на всех вкладках отображаются нужные пункты', () => {

        //вкладка "Достижения" не отображается, но по прямой ссылке доступ есть
        const hidePage = `/pl/teach/training/achievements?id=${trainingId}`;

        //к вкладке "Качество тренинга" сотрудник не имеет доступ по умолчанию
        const unavailablePage = `/pl/teach/training/feedback?id=${trainingId}`;

        const pages1 = [
            `/teach/control/stream/view/id/${trainingId}`,
            `/teach/control/stream/update/id/${trainingId}`,
            `/teach/control/stream/access/id/${trainingId}`,
            `/teach/control/stat/stream/id/${trainingId}`,
            `/teach/control/stream/stat/id/${trainingId}`
        ];

        const pages2 = [
            `/pl/teach/training/lessons-schedule?id=${trainingId}`,
            `/pl/teach/training/chatium?id=${trainingId}`,
            hidePage
        ];

        //проверяем первую группу вкладок
        pages1.forEach((page) => {
            cy.visit(page, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });

            cy.get('.page-menu li').its('length').should('eq', 7); //проверяем количество li в списке (их 7, "Достижения" и "Качество тренинга" не отображаются)

            //далее проверяем наличие всех вкладок
            cy.get('.content-menu a').as('menuForPages1').contains('Содержание')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/view/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Настройки')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/update/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Доступ')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/access/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Расписание')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/lessons-schedule?id=${trainingId}`);

            cy.get('@menuForPages1')
                .contains('Ученики')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stat/stream/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Статистика')
                .should('have.attr', 'href')
                .and('include', `/teach/control/stream/stat/id/${trainingId}`);

            cy.get('@menuForPages1').contains('Достижения').should('not.exist');

            cy.get('@menuForPages1').contains('В приложении')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/chatium?id=${trainingId}`);

            cy.get('@menuForPages1').contains('Качество тренинга').should('not.exist');
        });

        pages2.forEach((page) => {
            cy.visit(page, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get('.standard-page-menu li').its('length').should('eq', 7); //проверяем количество li в списке (их 7)

            //далее проверяем наличие всех вкладок
            cy.get('.standard-page-menu a').as('menuForPages2').contains('Содержание')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/view?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Настройки')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/settings?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Доступ')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/access?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Расписание')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/lessons-schedule?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Ученики')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/students?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Статистика')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/stat?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Достижения').should('not.exist');

            cy.get('@menuForPages2').contains('В приложении')
                .should('have.attr', 'href')
                .and('include', `/pl/teach/training/chatium?id=${trainingId}`);

            cy.get('@menuForPages2').contains('Качество тренинга').should('not.exist');
        });

        //код ответа к вкладке "Качество тренинга" 403
        cy.request({
            url: unavailablePage,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Опция "Сделать рассылку" возвращает ошибку 403', () => {

        cy.request({
            url: `/pl/teach/control/stream/send-notification?id=${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Опция "Редактировать тренинг" работает', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').contains('Действия').click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a').contains('Редактировать тренинг').click({ force: true });

        //проверили, что произошла переадресация на вкладку "Настройки"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/update/id/${trainingId}`);

    });

    it('Прямая ссылка "Настройки уроков" возвращает ошибку 403', () => {

        cy.request({
            url: `/pl/teach/control/stream/send-notification?id=${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Опция "Сменить порядок уроков в тренинге" включается, но при попытке сохранить возвращает код ответа 403', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').contains('Действия')
            .click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a').contains('Сменить порядок уроков в тренинге')
            .click({ force: true });

        //Проверяем наличие кнопок
        cy.get('.btn-save-sort').contains('Сохранить порядок').as('save').should('be.visible');

        cy.get('.btn-cancel-sort').contains('Отменить').as('cancel').should('be.visible');

        //нажимаем на кнопку "Отменить"
        cy.get('@cancel').click({ force: true });
        cy.get('.lesson-sort-block').should('not.be.visible');

        //проверяем, что нет доступа к сохранению изменений
        cy.request({
            url: `/pl/teach/control/stream/save-lessons-order?id=${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });

    });

    it('Добавление урока в тренинг через кнопку "Добавить урок" и удаление урока', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').contains('Добавить').click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a').contains('Урок').click({ force: true });

        cy.get('#Lesson_title').type('New Lesson').should('have.value', 'New Lesson');
        cy.get('.btn-primary').click();
        cy.get('.btn').contains('Вернуться к просмотру').click();
        cy.get('.user-answer')
            .invoke('attr', 'data-lesson-id')
            .then((lessonId) => {
                cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
                    auth: {
                        username: 'gcrc',
                        password: 'gc12rc'
                    }
                });
                cy.get('.title').contains('New Lesson').should('exist');
                cy.get(`[data-lesson-id=${lessonId}]`).click();
                cy.get('.dropdown-toggle:first').click();
                cy.get('.dropdown-menu > li').contains('Удалить урок').click();
                cy.get('.btn-danger').click();

                //проверяем, что урок удален
                cy.request({
                    url: `/teach/control/stream/view/id/${lessonId}`,
                    auth: {
                        username: 'gcrc',
                        password: 'gc12rc'
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(404)
                });
            });
    });

    it('Есть доступ по прямой ссылке к форме создания подтренинга', () => {

        cy.visit(`/teach/control/stream/new/parentId/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('h1').contains('Новый тренинг').should('be.visible');


        cy.get('#Training_title').should('be.visible');
        cy.get('#Training_description').should('be.visible');
        cy.get('#Training_parent_id').contains('Список тренингов').should('not.exist');

    });

    it('Есть доступ к странице копирования тренинга', () => {

        cy.visit(`/pl/teach/training/copy?id=${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.control-label').contains('Поместить копию в').should('be.visible');
        cy.get('.control-label').contains('Название копии').should('be.visible');
    });

    it('Проверка опций в кнопке "Действия" в уроке', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-menu li').its('length').should('eq', 5); //проверяем количество li в списке (их 4 и 1 разделитель)

        cy.get('ul.dropdown-menu li a').as('menu')
            .contains('Задание')
            .should('have.attr', 'href')
            .and('include', `/teach/control/lesson/update?id=${lessonId}&part=mission`);

        cy.get('@menu')
            .contains('Настройки')
            .should('have.attr', 'href')
            .and('include', `/teach/control/lesson/update?id=${lessonId}&part=main`);

        cy.get('@menu').contains('Создать новое уведомление')
            .should('have.attr', 'onclick')
            .and('include', `/teach/control/lesson/notification?id=${lessonId}`);

        cy.get('@menu')
            .contains('Удалить урок')
            .should('have.attr', 'href')
            .and('include', `/teach/control/lesson/delete?id=${lessonId}`);

    });

    it('Опция "Задание" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').click();
        cy.get('ul.dropdown-menu li a').contains('Задание').click({ force: true });

        //проверили, что произошла переадресация на вкладку "Задание и комментарии"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/lesson/update?id=${lessonId}&part=mission`);

    });

    it('Опция "Настройки" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').click();
        cy.get('ul.dropdown-menu li a').contains('Настройки').click({ force: true });

        //проверили, что произошла переадресация на вкладку "Настройки"
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/lesson/update?id=${lessonId}&part=main`);

    });

    it('Опция "Создать новое уведомление" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').click();
        cy.get('ul.dropdown-menu li a').contains('Создать новое уведомление').click({ force: true });

        //проверили, что произошла переадресация на страницу создания уведомления
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/lesson/notification?id=${lessonId}`);

        //проверяем объекты на странице
        cy.get('.row').contains('Тип уведомлений: Рассылка ученикам').should('be.visible');
        cy.get('label').contains('Отложенное').should('be.visible');
        cy.get('label').contains('Тема письма').should('be.visible');
        cy.get('label').contains('Текст письма').should('be.visible');
        cy.get('.btn-save').contains('Отправить уведомление').should('be.visible');
        cy.get('.btn').contains('Отменить').should('be.visible');



    });

    it('Опция "Редактировать урок" работает', () => {

        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.btn-primary').contains('Редактировать урок').click({ force: true });

        //проверили, что находимся в режиме редактирования урока
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lessonId}&editMode=1`);

        cy.get('.btn').contains('Вернуться к просмотру').click({ force: true });

        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lessonId}&editMode=0`);

    });

    it('Удаление сотрудника из числа основных учителей и отключение опции "Запретить"', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stream/update/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //Убираем основного учителя и выключаем запрет на редактирование
        cy.get('#Training_main_teacher_id')
            .as('selected_teacher')
            .contains(teacher)
            .should('have.attr', 'selected', 'selected');

        cy.get('@selected_teacher').select(no_teacher, { force: true }).invoke('val').should('eq', '');

        cy.get('#ParamsObject_disable_edit_for_additional_teachers').as('disable_edit_for_additional_teachers').uncheck().should('not.be.checked')

        cy.get('.btn-primary').contains('Сохранить').click({ force: true });

        cy.get('@selected_teacher').contains(no_teacher).should('have.attr', 'selected', 'selected');
        cy.get('@disable_edit_for_additional_teachers').should('not.be.checked');
    });
});

describe('Сотрудник НЕ учитель. Проверяем содержимое тренинга', () => {

    const trainingId = 864615211;
    const lessonId = 324291910;

    before('Авторизация', () => {
        cy.login(users.teacher.email);
    })

    it('Нет доступа к вкладкам тренинга, 403', () => {

        const pages = [
            `/teach/control/stream/view/id/${trainingId}`,
            `/teach/control/stream/update/id/${trainingId}`,
            `/teach/control/stream/access/id/${trainingId}`,
            `/teach/control/stat/stream/id/${trainingId}`,
            `/teach/control/stream/stat/id/${trainingId}`,
            `/pl/teach/training/lessons-schedule?id=${trainingId}`,
            `/pl/teach/training/chatium?id=${trainingId}`,
            `/pl/teach/training/feedback?id=${trainingId}`,
            `/pl/teach/training/achievements?id=${trainingId}`
        ];

        pages.forEach((page) => {
            cy.request({
                url: page,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(403)
            });
        });
    });

    it('Нелья добавить урок, 403', () => {

        cy.request({
            url: `/teach/control/lesson/new/trainingId/${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });

    });

    it('Нелья удалить урок, 403', () => {

        cy.request({
            url: `/teach/control/lesson/delete?id=${lessonId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });

    });

    it('Нет доступа к уроку, 403', () => {

        cy.request({
            url: `/pl/teach/control/lesson/view?id=${lessonId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });

    });

    it('Нет доступа к форме создания подтренинга', () => {

        cy.request({
            url: `/teach/control/stream/new/parentId/${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });


    });

    it('Нет доступа к странице копирования тренинга', () => {

        cy.request({
            url: `/pl/teach/training/copy?id=${trainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });
});

describe('Проверка доступа основного учителя к тренингам с различными доступами', () => {
    //основной учитель в родительском тренинге, урок в подтренинге с доступом "все, у кого есть доступ к родительскому тренингу"

    //основной учитель, скрытый урок

    //основной учитель, урок недоступный по общему расписанию, НЕ показывается в списке
});