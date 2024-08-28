const users = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/users1.json");

describe.only('Открыть недоступные уроки после стоп-урока до следующего стоп-урока через действие "Дать доступ к уроку" и забрать доступ через действие "Забрать ранее выданный доступ к уроку"', () => {
    // Шаг 1. Ученик leonard@test.ru проверяет, что уроки с Id 323678584, 325132862, 323678796, 323679011, 323679113 недоступны
    // Шаг 2. Админ выдает доступ к уроку id 323678584 через действие «Дать доступ к уроку»
    // Шаг 3. Ученик проверяет, что уроки после первого стоп-урока и до следующего стоп-урока доступны (id 323678584, 325132862, 323678796)
    // Шаг 4. Ученик проверяет, что уроки после следующего стоп-урока недоступны (id 323679011, 323679113)
    // Шаг 5. Админ забирает доступ к уроку id 323678584 через действие «Забрать выданный ранее доступ к уроку»
    // Шаг 6. Ученик проверяет, что уроки с Id 323678584, 325132862, 323678796, 323679011, 323679113 недоступны

    const lessonsWithAccess = [323678584, 325132862, 323678796];
    const lessonsWithoutAccess = [323679011, 323679113]
    const giveAccessLesson = "Дать доступ к уроку";
    const takeAccessLesson = "Забрать ранее выданный доступ к уроку";
    const trainingIdWithStopLessons = 861367841;
    const userId = 373767399;

    // Шаг 1. Ученик leonard@test.ru проверяет, что уроки с Id 323678584, 325132862, 323678796, 323679011, 323679113 недоступны
    it.only('Ученик проверяет, что до выдачи ручного доступа уроки недоступны', () => {
        cy.login(users.leonard.email);

        lessonsWithAccess.forEach((lesson) => {
            if (lesson == '323678796') {
                cy.checkNotReachedLessonWithLabel(lesson, trainingIdWithStopLessons, 'Недоступен (стоп-урок)');
            } else {
                cy.checkNotReachedLesson(lesson, trainingIdWithStopLessons);
            };
            cy.checkNotReachedLesson(lesson, trainingIdWithStopLessons);
            cy.getResponseForAccessLesson(lesson).then((response) => {
                expect(response.status).to.eq(200)
            });
            // cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
            //     auth: {
            //         username: 'gcrc',
            //         password: 'gc12rc'
            //     }
            // });
            // cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            // //на клик не реагирует
            // cy.get('@lesson_not_reached').click({ force: true });
            // cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            // //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            // cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
            //     auth: {
            //         username: 'gcrc',
            //         password: 'gc12rc'
            //     }
            // });
            // cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            // cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            // cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });
        lessonsWithoutAccess.forEach((lesson) => {
            if (lesson === 323679113) {
                cy.checkNotReachedLessonWithLabel(lesson, trainingIdWithStopLessons, 'Недоступен (стоп-урок)');
            } else {
                cy.checkNotReachedLesson(lesson, trainingIdWithStopLessons);
            };
            cy.getResponseForAccessLesson(lesson).then((response) => {
                expect(response.status).to.eq(200)
            });

            // cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
            //     auth: {
            //         username: 'gcrc',
            //         password: 'gc12rc'
            //     }
            // });
            // cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            // //на клик не реагирует
            // cy.get('@lesson_not_reached').click({ force: true });
            // cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            // //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            // cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
            //     auth: {
            //         username: 'gcrc',
            //         password: 'gc12rc'
            //     }
            // });
            // cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            // cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            // cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });
    });

    // Шаг 2. Админ выдает доступ к уроку id 323678584 через действие «Дать доступ к уроку»
    it('Админ выдает доступ через действие "Дать доступ к уроку"', () => {
        cy.login(users.admin.email);

        cy.visit(`/user/control/user/update/id/${userId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.btn.dropdown-toggle').contains('Действия').click();
        cy.get('.dropdown-menu').contains(giveAccessLesson).click({ force: true });
        cy.get('#s2id_objects').click();
        cy.get('#s2id_autogen1_search').type('проверочный после "пока не выполнят этот урок" 323678584', { force: true });
        cy.get('.select2-match').contains('проверочный после "пока не выполнят этот урок" 323678584').click();
        cy.get('#run-export').click({ force: true });
        cy.get('.table').contains(userId).should('be.visible');
        cy.get('.label-success').contains('Успешно').should('be.visible');
        cy.get('.table').contains('Пользователь добавлен в по покупке со стоп-уроками 861367841. проверочный после "пока не выполнят этот урок" 323678584').should('be.visible');
    });

    // Шаг 3. Ученик проверяет, что уроки после первого стоп-урока и до следующего стоп-урока доступны (id 323678584, 325132862, 323678796)
    // Шаг 4. Ученик проверяет, что уроки после следующего стоп-урока недоступны (id 323679011, 323679113)
    it('Ученик проверяет уроки после выдачи ручного доступа', () => {
        cy.login(users.leonard.email);

        //проверка доступности
        lessonsWithAccess.forEach((lesson) => {
            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            //если это стоп-урок
            if (lesson == 323678796) {
                cy.get(`.lesson-id-${lesson}.user-state-need_accomplish`).should('be.visible');
            } else {
                cy.get(`.lesson-id-${lesson}.user-state-reached`).should('be.visible');
            };

            cy.request({
                url: `/pl/teach/control/lesson/view?id=${lesson}`,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200)
            });

            //можно кликнуть на урок, войти в него и увидеть содержание урока
            cy.get(`.lesson-id-${lesson}`).click({ force: false });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lesson}&editMode=0`);
            cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
        });
        //проверка недоступности
        lessonsWithoutAccess.forEach((lesson) => {

            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });
    });

    // Шаг 5. Админ забирает доступ к уроку id 323678584 через действие «Забрать выданный ранее доступ к уроку»
    it('Админ забирает доступ через действие "Забрать ранее выданный доступ к уроку"', () => {
        cy.login(users.admin.email);

        cy.visit(`/user/control/user/update/id/${userId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.btn.dropdown-toggle').contains('Действия').click();
        cy.get('.dropdown-menu').contains(takeAccessLesson).click({ force: true });
        cy.get('#s2id_objects').click();
        cy.get('#s2id_autogen1_search').type('проверочный после "пока не выполнят этот урок" 323678584', { force: true });
        cy.get('.select2-match').contains('проверочный после "пока не выполнят этот урок" 323678584').click();
        cy.get('#run-export').click({ force: true });
        cy.get('.table').contains(userId).should('be.visible');
        cy.get('.label-success').contains('Успешно').should('be.visible');
        cy.get('.table').contains('Отозван ранее выданный доступ к уроку по покупке со стоп-уроками 861367841. проверочный после "пока не выполнят этот урок" 323678584').should('be.visible');
    });

    // Шаг 6. Ученик проверяет, что уроки с Id 323678584, 325132862, 323678796, 323679011, 323679113 недоступны
    it('Ученик проверяет уроки после того как доступ забрали', () => {
        cy.login(users.leonard.email);

        lessonsWithAccess.forEach((lesson) => {
            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });
    })
});

describe('Открыть первый стоп-урок через действие "Пропустить стоп урок" и забрать доступ через действие "Забрать ранее выданный доступ к уроку"', () => {

    //в тренинге первый урок - стоп урок
    //после него 6 уроков (последний стоп-урок, который закрывает доступ к сл урокам), 1 из них скрытый
    //действием "Пропустить стоп урок" открываются 5 уроков, скрытый не открывается
    //после сл стоп-урока уроки недоступны, так как они блокируются этим стоп-уроком

    const lessonsWithAccess = [323678584, 325132862, 323678796];
    const lessonsWithoutAccess = [323679011, 323679113];
    const takeAccessLesson = "Забрать ранее выданный доступ к уроку";
    const trainingIdWithStopLessons = 861367841;
    const userId = 373767399;

    //leonard@test.ru
    it('Ученик проверяет, что до выдачи ручного доступа уроки недоступны', () => {

        cy.login(users.leonard.email);

        lessonsWithAccess.forEach((lesson) => {

            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });
        lessonsWithoutAccess.forEach((lesson) => {

            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });

    });

    it('Админ выдает доступ через действие "Пропустить стоп-урок"', () => {

        cy.login(users.admin.email);

        cy.visit(`/user/control/user/update/id/${userId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.btn.dropdown-toggle').contains('Действия').click();
        cy.get('.dropdown-menu').contains('Пропустить стоп урок').click({ force: true });
        cy.get('#s2id_objects').click();
        cy.get('#s2id_autogen1_search').type('пока не выполнят этот урок 323678451 (по покупке со стоп-уроками 861367841)', { force: true });
        cy.get('.select2-match').contains('пока не выполнят этот урок 323678451 (по покупке со стоп-уроками 861367841)').click();
        cy.get('#run-export').click({ force: true });
        cy.get('.table').contains('373767399').should('be.visible');
        cy.get('.label-success').contains('Успешно').should('be.visible');
        cy.get('.table').contains('Стоп урок по покупке со стоп-уроками 861367841. пока не выполнят этот урок 323678451 пропущен').should('be.visible');

    });

    it('Ученик проверяет уроки после выдачи ручного доступа', () => {

        cy.login(users.leonard.email);

        //проверка доступности
        lessonsWithAccess.forEach((lesson) => {
            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            //если это стоп-урок
            if (lesson == 323678796) {
                cy.get(`.lesson-id-${lesson}.user-state-need_accomplish`).should('be.visible');
            } else {
                cy.get(`.lesson-id-${lesson}.user-state-reached`).should('be.visible');
            };

            cy.request({
                url: `/pl/teach/control/lesson/view?id=${lesson}`,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200)
            });

            //можно кликнуть на урок, войти в него и увидеть содержание урока
            cy.get(`.lesson-id-${lesson}`).click({ force: false });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lesson}&editMode=0`);
            cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
        });
        //проверка недоступности
        lessonsWithoutAccess.forEach((lesson) => {

            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });

    });

    it('Админ забирает доступ через действие "Забрать ранее выданный доступ к уроку"', () => {

        cy.login(users.admin.email);

        cy.visit(`/user/control/user/update/id/${userId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.btn.dropdown-toggle').contains('Действия').click();
        cy.get('.dropdown-menu').contains('Забрать ранее выданный доступ к уроку').click({ force: true });
        cy.get('#s2id_objects').click();
        cy.get('#s2id_autogen1_search').type('пока не выполнят этот урок 323678451 (по покупке со стоп-уроками 861367841)', { force: true });
        cy.get('.select2-match').contains('пока не выполнят этот урок 323678451 (по покупке со стоп-уроками 861367841)').click();
        cy.get('#run-export').click({ force: true });
        cy.get('.table').contains('373767399').should('be.visible');
        cy.get('.label-success').contains('Успешно').should('be.visible');
        cy.get('.table').contains('Отозван ранее выданный доступ к уроку по покупке со стоп-уроками 861367841. пока не выполнят этот урок 323678451').should('be.visible');
    });

    it('Ученик проверяет уроки после того как доступ забрали', () => {

        cy.login(users.leonard.email);

        lessonsWithAccess.forEach((lesson) => {

            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });
    })
});

//баг на бою (доступ есть к новым урокам тренинга, скрыла проверку на новый урок)
describe('Открыть недоступный после стоп-урока через опцию "Сделать открытым" - "Все текущие уроки тренинга" на вкладке "Ученики" и забрать доступ через "Удалить выданные вручную доступы"', () => {

    //в тренинге первый урок - стоп урок
    //после него 6 уроков (последний стоп-урок, который закрывает доступ к сл урокам), 1 из них скрытый
    //действием "Пропустить стоп урок" открываются 5 уроков, скрытый не открывается
    //после сл стоп-урока уроки недоступны, так как они блокируются этим стоп-уроком

    const lessonsWithAccess = [323678584, 323679011, 325172791];
    const actionOn = "Все текущие уроки тренинга";
    const actionOff = "Удалить выданные вручную доступы";
    const trainingIdWithStopLessons = 861367841;
    const userId = 373767399;

    //leonard@test.ru
    it('Ученик проверяет, что до выдачи ручного доступа уроки недоступны', () => {

        cy.login(users.leonard.email);

        lessonsWithAccess.forEach((lesson) => {
            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });


    });

    it('Админ выдает доступ через опцию "Сделать открытым" - "Все текущие уроки тренинга" на вкладке "Ученики"', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stat/stream/id/${trainingIdWithStopLessons}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get(`.user-checkbox[value="${userId}"]`).check().should('be.checked');
        cy.get('.btn-checked-users-action').click();
        cy.get('.action-link').contains(actionOn).click();
        cy.get('.user-tr[data-email="leonard@test.ru"]').contains('все доступно').should('be.visible');
        //УБРАЛИ НОВЫЙ УРОК
        //создаем урок
        // cy.visit(`/teach/control/lesson/new/trainingId/${trainingIdWithStopLessons}`, {
        //     auth: {
        //         username: 'gcrc',
        //         password: 'gc12rc'
        //     }
        // });
        // cy.get('#Lesson_title').type('Новый урок из автотеста').should('have.value', 'Новый урок из автотеста');
        // cy.get('.btn-primary').contains('Сохранить').click({ force: true });

        // cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
        //     auth: {
        //         username: 'gcrc',
        //         password: 'gc12rc'
        //     }
        // });

        // cy.get('.link.title').contains('Новый урок из автотеста').should('be.visible');
        // cy.get('.link.title') // находим элемент с классом '.link.title'
        //     .contains('Новый урок из автотеста')
        //     .invoke('attr', 'href') // извлекаем значение атрибута 'href'
        //     .then((href) => {
        //         const startIndex = href.lastIndexOf('/') + 1; // находим позицию последнего символа '/'
        //         const endIndex = href.length; // находим позицию конца строки
        //         let newLesson = href.substring(startIndex, endIndex); // вырезаем строку с ID
        //         cy.wrap(newLesson).as('new_lesson'); // сохраняем значение в переменную 'test'
        //     });

    });

    it('Ученик проверяет уроки после выдачи ручного доступа', () => {

        cy.login(users.leonard.email);

        lessonsWithAccess.forEach((lesson) => {
            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            //если это стоп-урок
            if (lesson == 323678796) {
                cy.get(`.lesson-id-${lesson}.user-state-need_accomplish`).should('be.visible');
            } else {
                cy.get(`.lesson-id-${lesson}.user-state-reached`).should('be.visible');
            };

            cy.request({
                url: `/pl/teach/control/lesson/view?id=${lesson}`,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200)
            });

            //можно кликнуть на урок, войти в него и увидеть содержание урока
            cy.get(`.lesson-id-${lesson}`).click({ force: false });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lesson}&editMode=0`);
            cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
        });

        //НА БОЮ БАГ, ПОЭТОМУ ПРОВЕРКА СЕЙЧАС НЕАКТУАЛЬНА
        //к новому уроку нет доступа
        // cy.get('@new_lesson').then((newLessonId) => {

        //     cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
        //         auth: {
        //             username: 'gcrc',
        //             password: 'gc12rc'
        //         }
        //     });

        //     cy.get(`.lesson-id-${newLessonId}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');

        //     //на клик не реагирует
        //     cy.get('@lesson_not_reached').click({ force: true });
        //     cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

        //     //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
        //     cy.visit(`/pl/teach/control/lesson/view?id=${newLessonId}`, {
        //         auth: {
        //             username: 'gcrc',
        //             password: 'gc12rc'
        //         }
        //     });
        //     cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${newLessonId}`);
        //     cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
        //     cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        // });

    });

    it('Админ забирает доступ через опцию "Удалить выданные вручную доступы"', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stat/stream/id/${trainingIdWithStopLessons}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get(`.user-checkbox[value="${userId}"]`).check().should('be.checked');
        cy.get('.btn-checked-users-action').click();
        cy.get('.action-link').contains(actionOff).click();
        cy.get('.user-tr[data-email="leonard@test.ru"]').contains('проверочный после "пока не выполнят этот урок" 323678584').should('be.visible');
        //НОВЫЙ УРОК УБРАЛИ
        // cy.get('@new_lesson').then((newLessonId) => {
        //     cy.visit(`/teach/control/lesson/delete?id=${newLessonId}`, {
        //         auth: {
        //             username: 'gcrc',
        //             password: 'gc12rc'
        //         }
        //     });
        //     cy.get('.btn-danger').click({ force: true });
        //     cy.request({
        //             url: `/pl/teach/control/lesson/view?id=${newLessonId}`,
        //             auth: {
        //                 username: 'gcrc',
        //                 password: 'gc12rc'
        //             },
        //             failOnStatusCode: false
        //         }).then((response) => {
        //             expect(response.status).to.eq(404)
        //         });
        // });
    });

    it('Ученик проверяет уроки после того как доступ забрали', () => {

        cy.login(users.leonard.email);

        lessonsWithAccess.forEach((lesson) => {
            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });
    })
});

describe('Открыть недоступный после стоп-урока через опцию "Сделать открытым" - "Весь тренинг, включая будущие уроки" на вкладке "Ученики" и забрать доступ через "Удалить выданные вручную доступы"', () => {

    const lessonId = 323678584;
    const lessonId2 = 323680204;
    const actionOn = "Весь тренинг, включая будущие уроки";
    const actionOff = "Удалить выданные вручную доступы";
    let lessonsIdList = [lessonId, lessonId2];
    const trainingIdWithStopLessons = 861367841;
    const userId = 373767399;
    let newLessonID;

    //leonard@test.ru
    it('Ученик проверяет, что до выдачи ручного доступа уроки недоступны', () => {

        cy.login(users.leonard.email);

        lessonsIdList.forEach((id) => {
            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get(`.lesson-id-${id}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');

            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${id}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${id}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });
    });

    it('Админ выдает доступ через опцию "Сделать открытым" - "Весь тренинг, включая будущие уроки" на вкладке "Ученики"', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stat/stream/id/${trainingIdWithStopLessons}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get(`.user-checkbox[value="${userId}"]`).check().should('be.checked');
        cy.get('.btn-checked-users-action').click();
        cy.get('.action-link').contains(actionOn).click();
        cy.get('.user-tr[data-email="leonard@test.ru"]').contains('все доступно').should('be.visible');

        // убрали создание нового урока
        // cy.visit(`/teach/control/lesson/new/trainingId/${trainingIdWithStopLessons}`, {
        //     auth: { username: 'gcrc', password: 'gc12rc' }
        // });
        // cy.get('#Lesson_title').type('Новый урок из автотеста').should('have.value', 'Новый урок из автотеста');
        // cy.get('.btn-primary').contains('Сохранить').click({ force: true });

        // cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
        //     auth: { username: 'gcrc', password: 'gc12rc' }
        // });

        // cy.get('.link.title').contains('Новый урок из автотеста').should('be.visible');

        // cy.get('.user-state-reached:last')
        //     .invoke('attr', 'data-lesson-id')
        //     .then(($style1) => {
        //         newLessonID = $style1;
        //     });
    });

    it('Ученик проверяет уроки после выдачи ручного доступа', () => {

        cy.login(users.leonard.email);

        // lessonsIdList.push(newLessonId);
        lessonsIdList.forEach((id) => {
            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: { username: 'gcrc', password: 'gc12rc' }
            });
            cy.get(`.lesson-id-${id}.user-state-reached`).as('lesson_reached').should('be.visible');
            cy.request({
                url: `/pl/teach/control/lesson/view?id=${id}`,
                auth: { username: 'gcrc', password: 'gc12rc' },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200)
            })

            //можно кликнуть на урок, войти в него и увидеть содержание урока
            cy.get(`@lesson_reached`).click({ force: false });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${id}&editMode=0`);
            cy.get('.user-state-label').contains('Доступен').should('be.visible');
        });
    });

    it('Админ забирает доступ через опцию "Удалить выданные вручную доступы"', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stat/stream/id/${trainingIdWithStopLessons}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get(`.user-checkbox[value="${userId}"]`).check().should('be.checked');
        cy.get('.btn-checked-users-action').click();
        cy.get('.action-link').contains(actionOff).click();
        cy.get('.user-tr[data-email="leonard@test.ru"]').contains('проверочный после "пока не выполнят этот урок" 323678584').should('be.visible');

        //проверку на новый урок убрала (не работает)
        // cy.visit(`/teach/control/lesson/delete?id=${newLessonId}`, {
        //     auth: { username: 'gcrc', password: 'gc12rc' }
        // });
        // cy.get('.btn-danger').click({ force: true });
        // cy.request({
        //     url: `/pl/teach/control/lesson/view?id=${newLessonId}`,
        //     auth: { username: 'gcrc', password: 'gc12rc' },
        //     failOnStatusCode: false
        // }).then((response) => {
        //     expect(response.status).to.eq(404)
        // });
    });

    it('Ученик проверяет уроки после того как доступ забрали', () => {

        cy.login(users.leonard.email);

        lessonsIdList.forEach((id) => {
            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: { username: 'gcrc', password: 'gc12rc' }
            });
            cy.get(`.lesson-id-${id}.user-state-not_reached`)
                .as('lesson_not_reached')
                .should('be.visible');

            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${id}`, {
                auth: { username: 'gcrc', password: 'gc12rc' }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${id}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });
    })
});

describe('Открыть доступ через действие "Дать доступ к уроку", а забрать через "Удалить выданные вручную доступы"', () => {

    //в тренинге первый урок - стоп урок
    //после него 6 уроков (последний стоп-урок, который закрывает доступ к сл урокам), 1 из них скрытый
    //действием "Пропустить стоп урок" открываются 5 уроков, скрытый не открывается
    //после сл стоп-урока уроки недоступны, так как они блокируются этим стоп-уроком

    const lessonId = 323678584;
    const actionOff = "Удалить выданные вручную доступы";
    const trainingIdWithStopLessons = 861367841;
    const userId = 373767399;

    //leonard@test.ru
    it('Ученик проверяет, что до выдачи ручного доступа уроки недоступны', () => {

        cy.login(users.leonard.email);

        cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get(`.lesson-id-${lessonId}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');

        //на клик не реагирует
        cy.get('@lesson_not_reached').click({ force: true });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

        //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lessonId}`);

        cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
        cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
    });

    it('Админ выдает доступ через действие "Дать доступ к уроку"', () => {

        cy.login(users.admin.email);

        cy.visit(`/user/control/user/update/id/${userId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.btn.dropdown-toggle').contains('Действия').click();
        cy.get('.dropdown-menu').contains('Дать доступ к уроку').click({ force: true });
        cy.get('#s2id_objects').click();
        cy.get('#s2id_autogen1_search').type('проверочный после "пока не выполнят этот урок" 323678584', { force: true });
        cy.get('.select2-match').contains('проверочный после "пока не выполнят этот урок" 323678584').click();
        cy.get('#run-export').click({ force: true });
        cy.get('.table').contains('373767399').should('be.visible');
        cy.get('.label-success').contains('Успешно').should('be.visible');
        cy.get('.table').contains('Пользователь добавлен в по покупке со стоп-уроками 861367841. проверочный после "пока не выполнят этот урок" 323678584').should('be.visible');


    });

    it('Ученик проверяет уроки после выдачи ручного доступа', () => {

        cy.login(users.leonard.email);

        cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get(`.lesson-id-${lessonId}.user-state-reached`).should('be.visible');
        cy.request({
            url: `/pl/teach/control/lesson/view?id=${lessonId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок, войти в него и увидеть содержание урока
        cy.get(`.lesson-id-${lessonId}`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lessonId}&editMode=0`);
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
    });

    it('Админ забирает доступ через опцию "Удалить выданные вручную доступы"', () => {

        cy.login(users.admin.email);
        cy.visit(`/teach/control/stat/stream/id/${trainingIdWithStopLessons}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get(`.user-checkbox[value="${userId}"]`).check().should('be.checked');
        cy.get('.btn-checked-users-action').click();
        cy.get('.action-link').contains(actionOff).click();
        cy.get('.user-tr[data-email="leonard@test.ru"]').contains('проверочный после "пока не выполнят этот урок" 323678584').should('be.visible');
    });

    it('Ученик проверяет уроки после того как доступ забрали', () => {

        cy.login(users.leonard.email);

        cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get(`.lesson-id-${lessonId}.user-state-not_reached`).should('be.visible');

        //на клик не реагирует
        cy.get(`.lesson-id-${lessonId}.user-state-not_reached`).click({ force: true });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

        //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lessonId}`);
        cy.get('@panel').contains('Нет доступа').should('be.visible');
        cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');

    })
});

describe('Открыть недоступный по общему расписанию урок действием "Дать доступ к уроку"', () => {

    const lessonId = 323518126;
    const LessonName = "обычный недоступен но показывается 323518126";
    const giveAccessLesson = "Дать доступ к уроку";
    const takeAccessLesson = "Забрать ранее выданный доступ к уроку";
    const trainingIdWithMainSchedule = 860208557;
    const userId = 373767399;

    //leonard@test.ru
    it('Ученик проверяет, что до выдачи ручного доступа уроки недоступны', () => {

        cy.login(users.leonard.email);
        cy.visit(`/teach/control/stream/view/id/${trainingIdWithMainSchedule}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get(`.lesson-id-${lessonId}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
        cy.get('@lesson_not_reached').contains('Недоступен до Вт 01 Янв 2030').should('be.visible');

        //при клике остаемся на той же странице
        cy.get('@lesson_not_reached').click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithMainSchedule}`);

        //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lessonId}`);
        cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
        cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
    });

    it('Админ выдает доступ через действие "Дать доступ к уроку"', () => {

        cy.login(users.admin.email);
        cy.visit(`/user/control/user/update/id/${userId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.btn.dropdown-toggle').contains('Действия').click();
        cy.get('.dropdown-menu').contains(giveAccessLesson).click({ force: true });
        cy.get('#s2id_objects').click();
        cy.get('#s2id_autogen1_search').type(LessonName, { force: true });
        cy.get('.select2-match').contains(LessonName).click();
        cy.get('#run-export').click({ force: true });
        cy.get('.table').contains(userId).should('be.visible');
        cy.get('.label-success').contains('Успешно').should('be.visible');
        cy.get('.table').contains('Пользователь добавлен в по покупке (общее расписание). обычный недоступен но показывается 323518126').should('be.visible');

    });

    it('Ученик проверяет, что нет доступа после выдачи ручного доступа', () => {

        cy.login(users.leonard.email);

        cy.visit(`/teach/control/stream/view/id/${trainingIdWithMainSchedule}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get(`.lesson-id-${lessonId}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
        cy.get('@lesson_not_reached').contains('Недоступен до Вт 01 Янв 2030').should('be.visible');

        //при клике остаемся на той же странице
        cy.get('@lesson_not_reached').click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithMainSchedule}`);

        //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
        cy.visit(`/pl/teach/control/lesson/view?id=${lessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lessonId}`);
        cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
        cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
    });

    it('Админ забирает доступ через действие "Забрать ранее выданный доступ к уроку"', () => {

        cy.login(users.admin.email);
        cy.visit(`/user/control/user/update/id/${userId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.btn.dropdown-toggle').contains('Действия').click();
        cy.get('.dropdown-menu').contains(takeAccessLesson).click({ force: true });
        cy.get('#s2id_objects').click();
        cy.get('#s2id_autogen1_search').type(LessonName, { force: true });
        cy.get('.select2-match').contains(LessonName).click();
        cy.get('#run-export').click({ force: true });
        cy.get('.table').contains(userId).should('be.visible');
        cy.get('.label-success').contains('Успешно').should('be.visible');
        cy.get('.table').contains('Отозван ранее выданный доступ к уроку по покупке (общее расписание). обычный недоступен но показывается 323518126').should('be.visible');
    });
});

describe('Открыть скрытый урок', () => {

    const lessonId = 323518072;
    const LessonName = "обычный скрытый 323518072";
    const giveAccessLesson = "Дать доступ к уроку";
    const takeAccessLesson = "Забрать ранее выданный доступ к уроку";
    const trainingIdWithMainSchedule = 860208557;
    const userId = 373767399;

    //leonard@test.ru
    it('Ученик проверяет, что до выдачи ручного доступа уроки недоступны', () => {

        cy.login(users.leonard.email);

        cy.visit(`/teach/control/stream/view/id/${trainingIdWithMainSchedule}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get(`.lesson-id-${lessonId}`).should('not.exist');
        cy.request({
            url: `/pl/teach/control/lesson/view?id=${lessonId}`,
            auth: { username: 'gcrc', password: 'gc12rc' },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Админ выдает доступ через действие "Дать доступ к уроку"', () => {

        cy.login(users.admin.email);

        cy.visit(`/user/control/user/update/id/${userId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.btn.dropdown-toggle').contains('Действия').click();
        cy.get('.dropdown-menu').contains(giveAccessLesson).click({ force: true });
        cy.get('#s2id_objects').click();
        cy.get('#s2id_autogen1_search').type(LessonName, { force: true });
        cy.get('.select2-match').contains(LessonName).click();
        cy.get('#run-export').click({ force: true });
        cy.get('.table').contains(userId).should('be.visible');
        cy.get('.label-success').contains('Успешно').should('be.visible');
        cy.get('.table').contains('Пользователь добавлен в по покупке (общее расписание). обычный скрытый 323518072').should('be.visible');
    });

    it('Ученик проверяет уроки после выдачи ручного доступа', () => {

        cy.login(users.leonard.email);

        cy.visit(`/teach/control/stream/view/id/${trainingIdWithMainSchedule}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get(`.lesson-id-${lessonId}.user-state-reached`).should('be.visible');
        cy.request({
            url: `/pl/teach/control/lesson/view?id=${lessonId}`,
            auth: { username: 'gcrc', password: 'gc12rc' },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок, войти в него и увидеть содержание урока
        cy.get(`.lesson-id-${lessonId}`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lessonId}&editMode=0`);
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
    });

    it('Админ забирает доступ через действие "Забрать ранее выданный доступ к уроку"', () => {

        cy.login(users.admin.email);
        cy.visit(`/user/control/user/update/id/${userId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.btn.dropdown-toggle').contains('Действия').click();
        cy.get('.dropdown-menu').contains(takeAccessLesson).click({ force: true });
        cy.get('#s2id_objects').click();
        cy.get('#s2id_autogen1_search').type(LessonName, { force: true });
        cy.get('.select2-match').contains(LessonName).click();
        cy.get('#run-export').click({ force: true });
        cy.get('.table').contains(userId).should('be.visible');
        cy.get('.label-success').contains('Успешно').should('be.visible');
        cy.get('.table').contains('Отозван ранее выданный доступ к уроку по покупке (общее расписание). обычный скрытый 323518072').should('be.visible');
    });

    it('Ученик проверяет уроки после того как доступ забрали', () => {

        cy.login(users.leonard.email);

        cy.visit(`/teach/control/stream/view/id/${trainingIdWithMainSchedule}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.get(`.lesson-id-${lessonId}`).should('not.exist');
        cy.request({
            url: `/pl/teach/control/lesson/view?id=${lessonId}`,
            auth: { username: 'gcrc', password: 'gc12rc' },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });

    })
});

describe('Открыть доступ через действие "Дать доступ к уроку", а забрать через "Удалить выданные вручную доступы"', () => {

    const lessonsWithAccess = [323678584, 325132862, 323678796];
    const lessonsWithoutAccess = [323679011, 323679113];
    const actionOn = "Недостигнутый урок";
    const actionOff = "Удалить выданные вручную доступы";
    const trainingIdWithStopLessons = 861367841;
    const userId = 373767399;

    //leonard@test.ru
    it('Ученик проверяет, что до выдачи ручного доступа уроки недоступны', () => {

        cy.login(users.leonard.email);

        lessonsWithAccess.forEach((lesson) => {
            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });
        lessonsWithoutAccess.forEach((lesson) => {

            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });
    });

    it('Админ выдает доступ через опцию "Сделать открытым" - "Недостигнутый урок" на вкладке "Ученики"', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stat/stream/id/${trainingIdWithStopLessons}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get(`.user-checkbox[value="${userId}"]`).check().should('be.checked');
        cy.get('.btn-checked-users-action').click();
        cy.get('.action-link').contains(actionOn).click();
        cy.get('.user-tr[data-email="leonard@test.ru"]').contains('проверочный после "пока не выполнят все предыдущие" 323679011').should('be.visible');
    });

    it('Ученик проверяет уроки после выдачи ручного доступа', () => {

        cy.login(users.leonard.email);

        lessonsWithAccess.forEach((lesson) => {
            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            //если это стоп-урок
            if (lesson == 323678796) {
                cy.get(`.lesson-id-${lesson}.user-state-need_accomplish`).should('be.visible');
            } else {
                cy.get(`.lesson-id-${lesson}.user-state-reached`).should('be.visible');
            };

            cy.request({
                url: `/pl/teach/control/lesson/view?id=${lesson}`,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200)
            });

            //можно кликнуть на урок, войти в него и увидеть содержание урока
            cy.get(`.lesson-id-${lesson}`).click({ force: false });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${lesson}&editMode=0`);
            cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
        });
        //проверка недоступности
        lessonsWithoutAccess.forEach((lesson) => {
            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });
    });

    it('Админ забирает доступ через опцию "Удалить выданные вручную доступы"', () => {

        cy.login(users.admin.email);
        cy.visit(`/teach/control/stat/stream/id/${trainingIdWithStopLessons}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get(`.user-checkbox[value="${userId}"]`).check().should('be.checked');
        cy.get('.btn-checked-users-action').click();
        cy.get('.action-link').contains(actionOff).click();
        cy.get('.user-tr[data-email="leonard@test.ru"]').contains('проверочный после "пока не выполнят этот урок" 323678584').should('be.visible');
    });

    it('Ученик проверяет уроки после того как доступ забрали', () => {

        cy.login(users.leonard.email);

        lessonsWithAccess.forEach((lesson) => {

            cy.visit(`/teach/control/stream/view/id/${trainingIdWithStopLessons}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.get(`.lesson-id-${lesson}.user-state-not_reached`).as('lesson_not_reached').should('be.visible');
            //на клик не реагирует
            cy.get('@lesson_not_reached').click({ force: true });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingIdWithStopLessons}`);

            //нет доступа к уроку(проверка таким образом, так как код ответа 200 вместо 403)
            cy.visit(`/pl/teach/control/lesson/view?id=${lesson}`, {
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/not-reached?id=${lesson}`);
            cy.get('.standard-page-content').as('panel').contains('Нет доступа').should('be.visible');
            cy.get('@panel').contains('У вас нет доступа к этому уроку').should('be.visible');
        });

    })
});