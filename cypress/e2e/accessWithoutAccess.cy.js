// describe('проверка тренинга и уроков на подходящие под условия тест-кейсов', () => {

//     beforeEach('Auth', () => {
//         cy.visit('/login', {
//             auth: {
//                 username: 'gcrc',
//                 password: 'gc12rc'
//             }
//         });
//         //вход под администратором admin@yandex.ru
//         cy.get('.xdget-form-field-email:first').type('admin@yandex.ru');
//         cy.get('.xdget-form-field-password').type('1234{enter}');
//         cy.get('.gc-user-logined').should('exist');
//     });

//     it('Проверка уроков в тренинге 860208557', () => {

//         //открыли страницу расписания
//         cy.visit('/pl/teach/training/lessons-schedule?id=860208557', {
//             auth: {
//                 username: 'gcrc',
//                 password: 'gc12rc'
//             }
//         });

//         //айдишники элементов чекбокса для промоуроков
//         let promoIdInSchedule = ['#w11', '#w17', '#w35', '#w53', '#w71', '#w89', '#w101']

//         //проверили, что все нужные уроки имеют признак ПРОМО
//         promoIdInSchedule.forEach((item) => {
//             cy.get(item)
//                 .should('have.attr', 'value')
//                 .and('eq', '1');
//         });

//         //айдишники элементов чекбокса для уроков, которые НЕ промо
//         let noPromoIdInSchedule = ['#w5', '#w22', '#w29']

//         //проверили, что все нужные обычные уроки НЕ имеют признак ПРОМО
//         noPromoIdInSchedule.forEach((item) => {
//             cy.get(item)
//                 .should('have.attr', 'value')
//                 .and('eq', '0');
//         });

//         //айдишники элементов чекбокса для скрытых уроков
//         let hideIdInSchedule = ['#w27', '#w33']

//         //проверили, что уроки имеют признак СКРЫТЫЙ
//         hideIdInSchedule.forEach((item) => {
//             cy.get(item)
//                 .should('have.attr', 'value')
//                 .and('eq', '1');
//         });

//         //айдишники элементов чекбокса для НЕ скрытых уроков
//         let notHideIdInSchedule = ['w3', 'w9', 'w15', 'w21', 'w51', 'w69', 'w87', 'w99']

//         //проверили, уроки НЕ скрыты
//         notHideIdInSchedule.forEach((item) => {
//             cy.get(item)
//                 .should('have.attr', 'value')
//                 .and('eq', '0');
//         });
//     });

//     it('Проверка уроков в тренинге 860208557', () => {

//         //открыли страницу расписания
//         cy.visit('/pl/teach/training/lessons-schedule?id=860208557', {
//             auth: {
//                 username: 'gcrc',
//                 password: 'gc12rc'
//             }
//         });

//         //айдишники элементов чекбокса для промоуроков
//         let promoIdInSchedule = ['#w11', '#w17', '#w35', '#w53', '#w71', '#w89', '#w101']

//         //проверили, что все нужные уроки имеют признак ПРОМО
//         promoIdInSchedule.forEach((item) => {
//             cy.get(item)
//                 .should('have.attr', 'value')
//                 .and('eq', '1');
//         });

//         //айдишники элементов чекбокса для уроков, которые НЕ промо
//         let noPromoIdInSchedule = ['#w5', '#w22', '#w29']

//         //проверили, что все нужные обычные уроки НЕ имеют признак ПРОМО
//         noPromoIdInSchedule.forEach((item) => {
//             cy.get(item)
//                 .should('have.attr', 'value')
//                 .and('eq', '0');
//         });

//         //айдишники элементов чекбокса для скрытых уроков
//         let hideIdInSchedule = ['#w27', '#w33']

//         //проверили, что уроки имеют признак СКРЫТЫЙ
//         hideIdInSchedule.forEach((item) => {
//             cy.get(item)
//                 .should('have.attr', 'value')
//                 .and('eq', '1');
//         });

//         //айдишники элементов чекбокса для НЕ скрытых уроков
//         let notHideIdInSchedule = ['w3', 'w9', 'w15', 'w21', 'w51', 'w69', 'w87', 'w99']

//         //проверили, уроки НЕ скрыты
//         notHideIdInSchedule.forEach((item) => {
//             cy.get(item)
//                 .should('have.attr', 'value')
//                 .and('eq', '0');
//         });
//     });
// });

const users = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/users1.json");

describe('проверка видимости уроков (промоуроков) и доступа к ним, если нет доступа к тренингу (включена настройка "показать в списке тренингов")', () => {

    before('Auth', () => {
        cy.login(users.anton.email);
    });

    beforeEach('Переадресация на страницу списка тренингов', () => {
        cy.visit('/teach/control', {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
    });

    it('Обычный урок', () => {

        //заходим в тренинг
        cy
            .get('.training-row[data-training-id="860208557"]')
            .click({ force: false });

        //урок отображается в списке и недоступен
        cy
            .get('.lesson-id-323517859.user-state-not_reached')
            .as('lesson')
            .contains('Недоступен')
            .should('be.visible');

        //урок на клик не реагирует
        cy
            .get('@lesson')
            .click({ force: true });
        cy
            .url()
            .should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/860208557');

        //нет доступа к уроку (403)
        cy
            .request({
                url: '/pl/teach/control/lesson/view?id=323517859',
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(403)
            })
    });

    it('Урок для тест-драйва', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860208557"]').click({ force: false });

        //урок отображается в списке и недоступен
        cy.get('.lesson-id-323517866.user-state-not_reached')
            .as('lesson')
            .contains('Недоступен')
            .should('be.visible');

        //урок на клие не реагирует
        cy.get('@lesson').click({ force: true });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/860208557');

        //нет доступа к уроку (403)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323517866',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        })
    });

    it('Промоурок + проверка отправки задания', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860208557"]').click({ force: false });

        //урок отображается в списке и есть надпись "есть задание" 
        cy.get('.lesson-id-323517863.user-state-has_mission').as('lesson');
        cy.get('@lesson')
            .contains('Есть задание')
            .should('be.visible');

        //есть доступ к уроку (200)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323517863',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок и войти в него
        cy.get('.lesson-id-323517863').click({ force: false });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=323517863&editMode=0');

        //можно отправить ответ на задание
        cy.get('#LessonAnswer_answer_text').type('Ответ на задание в промоуроке от ученика без доступа');
        cy.get('.btn-send-answer').click();
        cy.get('.answer-edit-link').should('exist');
        cy.get('.answer-status-label').contains('Задание ожидает проверки').should('exist');

        //можно оставить комментарий в ленте комментариев
        cy.get(`[placeholder="добавить комментарий к уроку (ответ на задание здесь давать не нужно)"]`).type('Новый комментарий в промоуроке от ученика без доступа').should('have.value', 'Новый комментарий в промоуроке от ученика без доступа');
        cy.get('.answer-comment > .btn-send').click({ force: false });
        cy.get('.answer-content').contains('Новый комментарий в промоуроке от ученика без доступа').should('exist');

        //учитель удаляет оставленный ответ и комментарий
        cy.login(users.teacher.email);

        cy.visit({
            url: '/pl/teach/control/lesson/view?id=323517863',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        //удаляем ответ
        cy.get('.answer-status:first').contains('Модерация').click({ force: false });
        cy.get('.dropdown-toggle:first').click({ force: false });
        cy.get('.dropdown-menu > li').contains('Удалить').click({ force: false });

        //удаляем комментарий
        cy.get('.answer-status').contains('Модерация').click({ force: false });
        cy.get('.dropdown-toggle:first').click({ force: false });
        cy.get('.dropdown-menu > li').contains('Удалить').click({ force: false });

        cy.get('.answer-status').should('not.exist');

        cy.login(users.anton.email);
    });

    it('Промо урок (нельзя оставлять комментарии и отвечать)', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860208557"]').click({ force: false });

        //урок отображается в списке как доступный
        cy.get('.lesson-id-323517872.user-state-reached')
            .as('lesson')
            .should('be.visible');

        //нет надписи "Есть задание", так как в уроке нельзя отвечать тем, у кого нет доступа
        cy.get('@lesson')
            .contains('Есть задание')
            .should('not.exist');

        //есть доступ к уроку (200)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323517872',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок и войти в него
        cy.get('.lesson-id-323517872').click({ force: false });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=323517872&editMode=0');

        //нет формы для отправки ответа на задание
        cy.get('#LessonAnswer_answer_text')
            .should('not.exist');
        //есть подсказка, почему нет формы
        cy.get('.why-no-form')
            .contains('Вы не можете отвечать в этом уроке')
            .should('be.visible');
        //нет ленты комментариев
        cy.get(`[placeholder="добавить комментарий к уроку (ответ на задание здесь давать не нужно)"]`)
            .should('not.exist');
    });

    it('Общее расписание. Промоурок без расписания, но после урока с расписанием', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860208557"]').click({ force: false });

        //урок отображается в списке как доступный
        cy.get('.lesson-id-323520038.user-state-reached')
            .as('lesson')
            .should('be.visible');

        //нет надписи "Есть задание" так как задания в уроке и правда нет
        cy.get('@lesson')
            .contains('Есть задание')
            .should('not.exist');

        //есть доступ к уроку (200)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323520038',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок и войти в него и увидеть содержание 
        cy.get('.lesson-id-323520038').click({ force: false });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=323520038&editMode=0');
        cy.get('.modal-block-content')
            .contains('проверочный текст в содержании урока')
            .should('be.visible');
    });

    it('Общее расписание. Промо недоступен но показывается', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860208557"]').click({ force: false });

        cy.get('.lesson-id-323518130.user-state-not_reached').as('lesson');

        //урок отображается в списке как недоступный и видно дату начала
        cy.get('@lesson')
            .contains('Недоступен до Вт 01 Янв 2030')
            .should('be.visible');

        //при клике остаемся на той же странице
        cy.get('@lesson').click({ force: false });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/860208557');

        //нет доступа к уроку (403)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323518130',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        })
    });

    it('Общее расписание. Промо недоступен и не отображается', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860208557"]').click({ force: false });

        //урок НЕ отображается в списке
        cy.get('.lesson-id-323518119')
            .should('not.exist');

        //нет доступа к уроку (403)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323518119',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        })
    });

    it('Общее расписание. Промо доступен', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860208557"]').click({ force: false });

        //урок отображается в списке как доступный
        cy.get('.lesson-id-323518135.user-state-reached')
            .as('lesson')
            .contains('Дата начала Вт 01 Янв 2030')
            .should('be.visible');

        //нет надписи "Есть задание" так как задания в уроке и правда нет
        cy.get('@lesson')
            .contains('Есть задание')
            .should('not.exist');

        //есть доступ к уроку (200)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323518135',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок и войти в него и увидеть содержание
        cy.get('.lesson-id-323518135').click({ force: false });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=323518135&editMode=0');
        cy.get('.modal-block-content')
            .contains('проверочный текст в содержании урока')
            .should('be.visible');

    });

    it('Индивидуальное расписание. Промо недоступен но показывается', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860870424"]').click({ force: false });

        cy.get('.lesson-id-323622237.user-state-reached').as('lesson');

        //урок отображается в списке как доступный и НЕ видно дату начала
        cy.get('@lesson')
            .contains('Недоступен до')
            .should('not.exist');

        //есть доступ к уроку (200)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323622237',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок, войти в него и увидеть содержание
        cy.get('.lesson-id-323622237').click({ force: false });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=323622237&editMode=0');
        cy.get('.modal-block-content')
            .contains('проверочный текст в содержании урока')
            .should('be.visible');

    });

    it('Индивидуальное расписание. Промо недоступен и не отображается', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860870424"]').click({ force: false });

        cy.get('.lesson-id-323622234.user-state-reached').as('lesson');

        //урок отображается в списке как доступный и НЕ видно дату начала
        cy.get('@lesson')
            .contains('Недоступен до')
            .should('not.exist');

        //есть доступ к уроку (200)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323622234',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок и войти в него и уивдеть содержание
        cy.get('.lesson-id-323622234').click({ force: false });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=323622234&editMode=0');
        cy.get('.modal-block-content')
            .contains('проверочный текст в содержании урока')
            .should('be.visible');

    });

    it('Индивидуальное расписание. Промо доступен', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860870424"]').click({ force: false });

        cy.get('.lesson-id-323622240.user-state-reached').as('lesson');

        //урок отображается в списке как доступный и НЕ видно дату начала
        cy.get('@lesson')
            .contains('Недоступен до')
            .should('not.exist');

        //есть доступ к уроку (200)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323622240',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок и войти в него и увидеть содержание
        cy.get('.lesson-id-323622240').click({ force: false });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=323622240&editMode=0');
        cy.get('.modal-block-content')
            .contains('проверочный текст в содержании урока')
            .should('be.visible');

    });

    it('Промо скрытый', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860208557"]').click({ force: false });

        //урок отображается в списке как доступный
        cy.get('.lesson-id-323518082.user-state-reached')
            .as('lesson')
            .should('be.visible');

        //нет надписи "Есть задание" так как задания в уроке и правда нет
        cy.get('@lesson')
            .contains('Есть задание')
            .should('not.exist');

        //есть доступ к уроку (200)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323518082',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок и войти в него и увидеть содержание
        cy.get('.lesson-id-323518082').click({ force: false });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=323518082&editMode=0');
        cy.get('.modal-block-content')
            .contains('проверочный текст в содержании урока')
            .should('be.visible');

    });

    it('Обычный скрытый', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860208557"]').click({ force: false });

        //урок НЕ отображается в списке
        cy.get('.lesson-id-323518072')
            .should('not.exist');

        //нет доступа к уроку (403)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323518072',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        })
    });

    it('Промоурок в архивном тренинге, без редиректа', () => {

        //код ответа в промоурок архивного тренинга 200
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323617603',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //проверяем, что есть надпись и кнопка на странице урока
        cy.visit({
            url: '/pl/teach/control/lesson/view?id=323617603',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.archived-content')
            .contains('Тренинг в архиве, обратитесь в администрацию')
            .should('be.visible');

        cy.get('.btn')
            .should('have.attr', 'href', '/pl/talks/conversation')
            .and('be.visible');
    });

    it('Промоурок в архивном тренинге, есть редирект', () => {

        //код ответа в промоурок архивного тренинга 200
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323617668',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        });

        //есть переадресация на страницу page0
        cy.visit({
            url: '/pl/teach/control/lesson/view?id=323617668',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/page0');
    });

    it('Промоурок после стоп урока "пока не выполнят этот урок"', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860817699"]').click({ force: false });

        //урок отображается в списке как доступный
        cy.get('.lesson-id-323617752.user-state-reached')
            .as('lesson')
            .should('be.visible');

        //нет надписи "Есть задание" так как задания в уроке и правда нет
        cy.get('@lesson')
            .contains('Есть задание')
            .should('not.exist');

        //нет надписи о недоступности из-за стоп-уроков (ПРОВЕРИТЬ, ЧТО ВЕРНО)
        cy.get('.lesson-list')
            .contains('Чтобы получить доступ к следующим урокам, вам необходимо выполнить задание в предыдущем')
            .should('not.exist');

        //нет надписи в предыдущем уроке о том, что это стоп урок
        cy.get('.lesson-id-323617750')
            .contains('Необходимо выполнить задание (стоп-урок)')
            .should('not.exist');

        //есть доступ к уроку (200)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323617752',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок и войти в него и увидеть содержание
        cy.get('.lesson-id-323617752').click({ force: false });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=323617752&editMode=0');
        cy.get('.modal-block-content')
            .contains('проверочный текст в содержании урока')
            .should('be.visible');

    });

    it('Промоурок после стоп урока "пока не выполнят все предыдущие"', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860817699"]').click({ force: false });

        //урок отображается в списке как доступный
        cy.get('.lesson-id-323617755.user-state-reached')
            .as('lesson')
            .should('be.visible');

        //нет надписи "Есть задание" так как задания в уроке и правда нет
        cy.get('@lesson')
            .contains('Есть задание')
            .should('not.exist');

        //нет надписи о недоступности из-за стоп-уроков (ПРОВЕРИТЬ, ЧТО ВЕРНО)
        cy.get('.lesson-list')
            .contains('Чтобы получить доступ к следующим урокам, вам необходимо выполнить задание в предыдущем')
            .should('not.exist');

        //нет надписи в предыдущем уроке о том, что это стоп урок
        cy.get('.lesson-id-323617753')
            .contains('Необходимо выполнить задание (стоп-урок)')
            .should('not.exist');

        //есть доступ к уроку (200)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323617755',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок и войти в него и увидеть содержание
        cy.get('.lesson-id-323617755').click({ force: false });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=323617755&editMode=0');
        cy.get('.modal-block-content')
            .contains('проверочный текст в содержании урока')
            .should('be.visible');

    });

    it('Промоурок после стоп урока "отложенный"', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860817699"]').click({ force: false });

        //урок отображается в списке как доступный
        cy.get('.lesson-id-323617765.user-state-reached')
            .as('lesson')
            .should('be.visible');

        //нет надписи "Есть задание" так как задания в уроке и правда нет
        cy.get('@lesson')
            .contains('Есть задание')
            .should('not.exist');

        //нет надписи о недоступности из-за стоп-уроков (ПРОВЕРИТЬ, ЧТО ВЕРНО)
        cy.get('.lesson-list')
            .contains('Чтобы получить доступ к следующим урокам, вам необходимо выполнить задание в предыдущем')
            .should('not.exist');

        //нет надписи в предыдущем (отложенном) уроке о том, что это стоп урок
        cy.get('.lesson-id-323617763')
            .contains('Необходимо выполнить задание (стоп-урок)')
            .should('not.exist');

        //есть доступ к уроку (200)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323617765',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок и войти в него и увидеть содержание
        cy.get('.lesson-id-323617765').click({ force: false });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=323617765&editMode=0');
        cy.get('.modal-block-content')
            .contains('проверочный текст в содержании урока')
            .should('be.visible');

    });

    it('Промоурок после стоп урока "отложенный", ответ отклонен', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860817699"]').click({ force: false });

        //урок отображается в списке как доступный
        cy.get('.lesson-id-323617773.user-state-reached')
            .as('lesson')
            .should('be.visible');

        //нет надписи "Есть задание" так как задания в уроке и правда нет
        cy.get('@lesson')
            .contains('Есть задание')
            .should('not.exist');

        //нет надписи о недоступности из-за стоп-уроков (ПРОВЕРИТЬ, ЧТО ВЕРНО)
        cy.get('.lesson-list')
            .contains('Чтобы получить доступ к следующим урокам, вам необходимо выполнить задание в предыдущем')
            .should('not.exist');

        //есть надпись в предыдущем стоп-уроке о том, что это стоп урок
        cy.get('.lesson-id-323617766')
            .contains('Необходимо выполнить задание (стоп-урок)')
            .should('be.visible');

        //есть доступ к уроку (200)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323617773',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //можно кликнуть на урок и войти в него и увидеть содержание
        cy.get('.lesson-id-323617773').click({ force: false });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=323617773&editMode=0');
        cy.get('.modal-block-content')
            .contains('проверочный текст в содержании урока')
            .should('be.visible');

    });

    it('Обычный урок в родительском тренинге, подтренинг с настройкой "показать в списке"', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860926717"]').click({ force: false });

        //урок НЕ отображается в списке
        cy.get('.lesson-id-323631323')
            .should('not.exist');

        //нет доступа к уроку (403)
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323631323',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });

        //проверяем, что подтренинг с настройкой "показывать в списке" отображается в списке
        cy.get('.training-row[data-training-id="860926718"]')
            .should('be.visible');
    });

    it('Промоурок в родительском тренинге, подтренинг с настройкой "показать в списке"', () => {

        //заходим в тренинг
        cy.get('.training-row[data-training-id="860926717"]').click({ force: false });

        //проверяем, что подтренинг с настройкой "показывать в списке" отображается в списке
        cy.get('.training-row[data-training-id="860926718"]')
            .should('be.visible');

        //урок НЕ отображается в списке
        cy.get('.lesson-id-323631326')
            .should('not.exist');

        //есть доступ к промоуроку
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323631326',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        });

        //можно войти в урок по прямой ссылке и увидеть содержимое
        cy.visit('/pl/teach/control/lesson/view?id=323631326', {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=323631326');
        cy.get('.modal-block-content')
            .contains('проверочный текст в содержании урока')
            .should('be.visible');

    });
});
