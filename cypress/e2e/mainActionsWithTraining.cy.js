const users = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/users1.json");

describe('Администратор. Основные действия с тренингом: создание, добавление / удаление урока, архивирование / удаление тренинга', () => {

    let trainingId;
    let lessonId;

    before('Auth', () => {
        cy.login(users.admin.email);
    });

    it('Ошибка при попытке создать тренинг без имени', () => {
        cy.visit(`/teach/control`, { auth: { username: 'gcrc', password: 'gc12rc' } });
        cy.get('.btn-success').click();
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/new');
        cy.get('.btn-lg').click();
        cy.get('.errorSummary ul li').should('have.text', 'Название не должно быть пустым.');
    });

    it('Создание тренинга', () => {
        cy.visit(`/teach/control`, { auth: { username: 'gcrc', password: 'gc12rc' } });
        cy.get('.btn-success').click();
        cy.get('#Training_title').type('New Training').should('have.value', 'New Training');
        cy.get('.btn-lg').click();
        cy.get('.gc-tags-editable')
            .invoke('attr', 'data-object-id')
            .then(($style1) => {
                trainingId = $style1;
            });

        //включился режим быстрого редактирования уроков
        cy.url().should('include', `/editable/1`);

        //отображается кнопка "Добавить урок" в режиме быстрого редактирования уроков
        cy.get('.btn-add-lesson')
            .contains('Добавить урок')
            .should('be.visible');

        //отображается кнопка "Завершить" в режиме быстрого редактирования уроков
        cy.get('.btn-link')
            .contains('Завершить')
            .should('be.visible');

        //сверху меню редактирования отображается информация
        let alerts = [
            'Кликните, чтобы изменить',
            'название, описание,',
            'картинку или установить признак',
            'стоп-урока.',
            'Перетаскивайте уроки мышкой, чтобы изменить порядок.',
            'Изменения сохраняются автоматически.',
            'Чтобы удалить урок, завершите редактирование и перейдите в нужный урок для удаления.'
        ]

        alerts.forEach((alert) => {
            cy.get('.alert-warning')
                .contains(alert)
                .should('be.visible');
        })

        cy.get('.btn-link')
            .contains('Завершить')
            .click({ force: true });

        //отображается кнопка "Добавить урок"
        cy.get('.btn-success')
            .contains('Добавить урок')
            .should('be.visible');
    });

    it('Добавление урока в тренинг через режим быстрого редактирования', () => {

        //открыли режим быстрого редактирования уроков
        cy.visit(`/teach/control/stream/view/id/${trainingId}/editable/1`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //так как уроков еще нет - отображается соответствующее сообщение
        cy.get('#lessonsOrder')
            .contains('В этом тренинге нет ни одного урока')
            .should('be.visible');

        //нажали на кнопку "Добавить урок"
        cy.get('.btn-add-lesson').click({ force: true });

        //сообщение "В этом тренинге нет ни одного урока" пропало
        cy.get('#lessonsOrder')
            .contains('В этом тренинге нет ни одного урока')
            .should('not.exist');

        //появился новый урок
        cy.get('.item-content')
            .contains('Название урока')
            .should('be.visible');

        //НЕ РАБОТАЕТ ДАЛЬШЕ
        //редактируем название урока
        // cy.get('.item-content[title="Редактировать"]').click();
        // cy.get('.input-title[value]="Название урока"')
        //     .clear()
        //     .type('Урок из автотеста')
        //     .should('have.value', 'Урок из автотеста');

        // //редактируем описание урока
        // cy.get('description[title="Редактировать"]').click();
        // cy.get('.input-description')
        //     .clear()
        //     .type('Описание урока из автотеста')
        //     .should('have.value', 'Описание урока из автотеста');

        //вышли из режима быстрого редактирования уроков
        cy.get('.btn-link')
            .contains('Завершить')
            .click({ force: true });

        //проверили юрл
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);

        //проверили, что в списке есть урок с стандартным названием
        cy.get('.title')
            .contains('Название урока')
            .should('be.visible');
    });

    it('Добавление урока в тренинг через кнопку "Добавить урок"', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //кнопка "Добавить урок" не отображается, так как в тренинге уже есть хотя бы один урок
        cy.get('.btn-success')
            .contains('Добавить урок')
            .should('not.exist');

        cy.get('.dropdown-toggle')
            .contains('Добавить')
            .click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Урок')
            .click({ force: true });

        cy.get('#Lesson_title').type('New Lesson').should('have.value', 'New Lesson');
        cy.get('.btn-primary').click();
        cy.get('.btn').contains('Вернуться к просмотру').click();
        cy.get('.user-answer')
            .invoke('attr', 'data-lesson-id')
            .then(($style1) => {
                lessonId = $style1;
            });
        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.title').contains('New Lesson').should('exist');
    });

    it('Добавление подтренинга в тренинг', () => {

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //проверяем, что в тренинге нет подтренингов
        cy.get('.stream-table')
            .should('not.exist');

        cy.get('.dropdown-toggle')
            .contains('Добавить')
            .click({ force: true });

        cy.get('div.btn-group ul.dropdown-menu li a')
            .contains('Подтренинг')
            .click({ force: true });

        cy.get('#Training_title').type('New Training child').should('have.value', 'New Training child');
        cy.get('.btn-lg').click();

        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //проверяем, что в тренинге есть подтренинг
        cy.get('.stream-table')
            .contains('New Training child')
            .should('be.visible');

    });

    it('Нельзя скопировать тренинг без указания имени', () => {

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
            .contains('Копировать тренинг')
            .click({ force: true });

        //проверка юрл
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/training/copy?id=${trainingId}`);

        //очистили название тренинга
        cy.get('#copytrainingform-new_title').clear();

        //выбрали место, куда поместить копию и заодно переместили курсор с поля для названия тренинга
        cy.get('#copytrainingform-copy-to--0').check();

        //появилось сообщение "Название копии не должно быть пустым."
        cy.get('.help-block')
            .contains('Название копии не должно быть пустым.')
            .should('be.visible');

        cy.get('.btn-primary').click({ force: true });

        cy.get('.error-summary')
            .contains('Пожалуйста, исправьте следующие ошибки:')
            .should('be.visible');

        cy.get('.error-summary')
            .contains('Название копии не должно быть пустым.')
            .should('be.visible');

        //проверили, что остались на той же странице
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/training/copy?id=${trainingId}`);
    });

    it('Нельзя скопировать тренинг без выбора места для расположения копии', () => {

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
            .contains('Копировать тренинг')
            .click({ force: true });

        //проверка юрл
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/training/copy?id=${trainingId}`);

        //нажали на кнопку "Копировать"
        cy.get('.btn-primary').click({ force: true });

        cy.get('.error-summary')
            .contains('Пожалуйста, исправьте следующие ошибки:')
            .should('be.visible');

        cy.get('.error-summary')
            .contains('Копировать тренинг в не должно быть пустым.')
            .should('be.visible');

        //проверили, что остались на той же странице
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/training/copy?id=${trainingId}`);
    });

    it('Успешное копирование тренинга без уроков и подтренингов', () => {

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
            .contains('Копировать тренинг')
            .click({ force: true });

        //проверка юрл
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/training/copy?id=${trainingId}`);

        //выбрали место, куда поместить копию
        cy.get('#copytrainingform-copy-to--0').check();

        //проверяем, что нет галочек в пунктах для копирования уроков и подтренингов
        cy.get('#copytrainingform-copy_lessons')
            .should('not.be.checked');

        cy.get('#copytrainingform-copy_subtrainings')
            .uncheck()
            .should('not.be.checked');

        //нажали на кнопку "Копировать"
        cy.get('.btn-primary').click({ force: true });

        //проверяем, в копии нет уроков
        cy.get('.lesson-list')
            .should('not.exist');

        //проверяем, в копии нет подтренингов
        cy.get('.stream-table')
            .should('not.exist');

        //удаляем созданную копию
        cy.get('.gc-tags-editable').invoke('attr', 'data-object-id')
            .then(($copyTrainingId) => {
                cy
                    .visit(`/teach/control/stream/update/id/${$copyTrainingId}`, {
                        auth: {
                            username: 'gcrc',
                            password: 'gc12rc'
                        }
                    });
                cy.get('#settings-link').click();
                cy.get('#send_to_archive').check();
                cy.get('.btn-primary').click({ force: true });
                cy.visit(`/teach/control/stream/delete/id/${$copyTrainingId}`, {
                    auth: {
                        username: 'gcrc',
                        password: 'gc12rc'
                    }
                });
                cy.get('.btn-danger').click({ force: true });
                //проверяем, что созданная копия удалена
                cy
                    .request({
                        url: `/teach/control/stream/view/id/${$copyTrainingId}`,
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

    it('Успешное копирование тренинга с уроком и подтренингом', () => {

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
            .contains('Копировать тренинг')
            .click({ force: true });

        //проверка юрл
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/training/copy?id=${trainingId}`);

        //выбрали место, куда поместить копию
        cy.get('#copytrainingform-copy-to--0').check();

        //проверяем, что есть галочки в пунктах для копирования уроков и подтренингов
        cy.get('#copytrainingform-copy_lessons')
            .check()
            .should('be.checked');

        cy.get('#copytrainingform-copy_subtrainings')
            .should('be.checked');

        //нажали на кнопку "Копировать"
        cy.get('.btn-primary').click({ force: true });

        //проверяем, в копии есть уроки
        cy.get('.lesson-list')
            .should('exist');

        //проверяем, в копии есть подтренинг
        cy.get('.stream-table')
            .should('exist');

        //удаляем созданную копию
        cy
            .get('.gc-tags-editable')
            .invoke('attr', 'data-object-id')
            .then(($copyTrainingId) => {
                cy
                    .visit(`/teach/control/stream/update/id/${$copyTrainingId}`, {
                        auth: {
                            username: 'gcrc',
                            password: 'gc12rc'
                        }
                    });
                cy
                    .get('#settings-link')
                    .click();
                cy
                    .get('#send_to_archive')
                    .check();
                cy
                    .get('.btn-primary')
                    .click({ force: true });
                cy
                    .visit(`/teach/control/stream/delete/id/${$copyTrainingId}`, {
                        auth: {
                            username: 'gcrc',
                            password: 'gc12rc'
                        }
                    });
                cy
                    .get('.btn-danger')
                    .click({ force: true });
                //проверяем, что созданная копия удалена
                cy
                    .request({
                        url: `/teach/control/stream/view/id/${$copyTrainingId}`,
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

    it('Удаление урока', () => {
        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get(`[data-lesson-id=${lessonId}]`).click();
        cy.get('.dropdown-toggle:first').click();
        cy.get('.dropdown-menu > li').contains('Удалить урок').click();
        cy.get('.btn-danger').click();
        cy.get(`[data-training-id=${lessonId}]`).should('not.exist');

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

    it('Нельзя удалить НЕархивный тренинг', () => {

        //проверяем, что на вкладке "Настройки" нет кнопки "Удалить"
        cy.visit(`/teach/control/stream/update/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('button').contains('Удалить').should('not.exist');

        //проверяем, что на вкладке "Содержание" в меню "Действия" нет кнопки "Удалить тренинг"
        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.dropdown-toggle').contains('Действия').click({ force: true });
        cy.get('div.btn-group ul.dropdown-menu li a').contains('Удалить тренинг').should('not.exist');

        //проверяем, что по прямой ссылке для удаления происходит переадресация на вкладку "Настройки"
        cy.visit(`/teach/control/stream/delete/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/update/id/${trainingId}`);

    });

    it('Архивирование тренинга', () => {
        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.dropdown-toggle:first').click();
        cy.get('.page-menu > li').contains('Настройки').click();
        cy.get('#settings-link').click();
        cy.get('#send_to_archive').check();
        cy.get('.btn-primary').click();

        //на странице списка тренингов проверяемый тренинг НЕ отображается
        cy.visit('/teach/control', {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get(`[data-training-id=${trainingId}]`).should('not.exist');

        //на странице архивных тренингов проверяемый тренинг отображается
        cy.visit(`/pl/teach/training/archived`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.reload();

        cy.get(`a[href*="/pl/teach/training/archived?id=${trainingId}"]`)
            .should('be.visible');

    });

    it('Удаление тренинга', () => {

        cy.visit('/teach/control', {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        //проверяем кнопку удаления в списке архивных тренингов
        cy.get('a').contains('Архивные тренинги').click();
        cy.reload();
        cy.get(`a[href*="/teach/control/stream/delete/id/${trainingId}"]`).click();
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/delete/id/${trainingId}`);

        //проверяем кнопку "Удалить тренинг" на вкладке "Содержание" в меню "Действия"
        cy.visit(`/teach/control/stream/view/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.dropdown-toggle').contains('Действия').click({ force: true });
        cy.get('div.btn-group ul.dropdown-menu li a').contains('Удалить тренинг').click({ force: true });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/delete/id/${trainingId}`);

        //проверяем кнопку "Удалить" на вкладке "Настройки" и удаляем
        cy.visit(`/teach/control/stream/update/id/${trainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('button').contains('Удалить').click({ force: true });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/delete/id/${trainingId}`);
        cy.get('.btn-danger').click();

        //проверяем, что тренинг удален
        cy.request({
            url: `/teach/control/stream/view/id/${trainingId}`,
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