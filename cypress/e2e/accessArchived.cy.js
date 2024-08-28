const users = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/users1.json");
//добавить проверку отображения архивного тренинга в "те, кто прошел другой тренинг"
describe('Проверка видимости и доступа к архивным тренингам с настройкой "Не показывать в списке тренингов"', () => {

    before('Авторизация', () => {
        cy.login(users.lena.email);
    });

    it('Ученик не имеет доступ к разделу "Архивные тренинги"', () => {

        //нет кнопки "Архивные тренинги" на странице списка тренингов
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control`);
        cy.contains('Архивные тренинги').should('not.exist');

        //нет доступа к странице архивных тренингов
        cy.getResponseForAccess(`/pl/teach/training/archived`).then((response) => {
            expect(response.status).to.eq(403);
        });
    });

    it('Ученик не имеет доступа к архивной странице тренинга', () => {
        const trainingId = 857997767;

        cy.getResponseForAccess(`/pl/teach/training/archived?id=${trainingId}`).then((response) => {
            expect(response.status).to.eq(403);
        });
    });

    it('Доступ к тренингу по покупке, тренинг архивирован, код ответа 200, заглушка', () => {
        const answerId = 361254011;
        const trainingId = 857997767;
        const lessonId = 323056183;
        const trainingName = "Доступ по покупке (тренинг архивирован)";
        const lessonName = "проверочный"

        //архивированный тренинг не отображается в списке
        cy.checkHiddenTraining(trainingId);

        //код ответа доступа к архивированному тренингу 200
        cy.getResponseForAccess(`/teach/control/stream/view/id/${trainingId}`).then((response) => {
            expect(response.status).to.eq(200);
        });
        //в архивированном тренинге отображается заглушка
        cy.checkArchivedContentTraining(trainingId);

        //код ответа доступа к уроку в архивированном тренинге 200
        cy.getResponseForAccess(`/pl/teach/control/lesson/view?id=${lessonId}`).then((response) => {
            expect(response.status).to.eq(200);
        });

        //в уроке архивированного тренинга отображается заглушка
        cy.checkArchivedContentLesson(lessonId);

        //проверка ленты ответов
        cy.archivedAnswerInAnswersPage(trainingName, lessonName, answerId, 'ответ из архивированного тренинга');
    });

    it('Доступ по группе, ученик в группе, тренинг архивирован, код ответа 200, заглушка', () => {
        const answerId = 361262426;
        const trainingId = 857997873;
        const lessonId = 323056670;
        const trainingName = "Доступ по группе (архивирован)";
        const lessonName = "проверочный"

        //архивированный тренинг не отображается в списке
        cy.checkHiddenTraining(trainingId);

        //код ответа доступа к архивированному тренингу 200
        cy.getResponseForAccess(`/teach/control/stream/view/id/${trainingId}`).then((response) => {
            expect(response.status).to.eq(200);
        });
        //в архивированном тренинге отображается заглушка
        cy.checkArchivedContentTraining(trainingId);

        //код ответа доступа к уроку в архивированном тренинге 200
        cy.getResponseForAccess(`/pl/teach/control/lesson/view?id=${lessonId}`).then((response) => {
            expect(response.status).to.eq(200);
        });

        //в уроке архивированного тренинга отображается заглушка
        cy.checkArchivedContentLesson(lessonId);

        //проверка ленты ответов
        cy.archivedAnswerInAnswersPage(trainingName, lessonName, answerId, 'ответ из архивированного тренинга');
    });

    it('Доступ по завершению, тренинг завершен и архивирован, код ответа 200', () => {
        const answerId = 361376588;
        const archivedTrainingId = 858031414;
        const trainingId = 858051027;
        const lessonId = 323110312;
        const trainingName = "те, кто прошел другой тренинг (тренинг для завершения архивирован)";
        const lessonName = "проверочный"

        //проверяем, что тренинг для завершения архивирован
        cy.checkArchivedContentTraining(archivedTrainingId);

        //проверяем, что проверяемый тренинг отображается в списке и доступен
        cy.clickTraining(trainingId);

        //проверяем, что есть доступ к проверяемому уроку со статусом "Ответ ожидает проверки"
        cy.checkAnsweredLesson(lessonId, trainingId);

        //проверка ленты ответов
        cy.ordinaryAnswerInAnswersPage(trainingName, lessonName, answerId, 'ответ из автотеста в уроке 323110312');
    });

    it('Доступ по завершению, вкл "закрыть доступ, если тренинг не доступен", тренинг архивирован, код ответа 403', () => {
        const archivedTrainingId = 858031414;
        const trainingId = 858058728;
        const lessonId = 323117623;

        //проверяем, что тренинг для завершения архивирован
        cy.checkArchivedContentTraining(archivedTrainingId);

        //проверяем, что проверяемый тренинг не отображается в списке тренингов
        cy.checkHiddenTraining(trainingId);

        //проверяем, что нет доступа к тренингу и уроку
        cy.getResponseForAccess(`/teach/control/stream/view/id/${trainingId}`).then((response) => {
            expect(response.status).to.eq(403);
        });
        cy.getResponseForAccess(`/pl/teach/control/lesson/view?id=${lessonId}`).then((response) => {
            expect(response.status).to.eq(403);
        });
    });

    it('Доступ по потренингу, подтренинг архивирован, код ответа 403', () => {
        const archivedChildTrainingId = 858104527;
        const parentTrainingId = 858104525;
        const lessonId = 323124832;
        const trainingName = `"Все, у кого есть доступ хотя бы к одному из подтренингов" , подтренинг архивирован`;
        const lessonName = "проверочный";
        const answerId = 361383218;

        cy.login(users.yana.email);

        //подтренинг архивирован и есть заглушка
        cy.checkArchivedContentTraining(archivedChildTrainingId);

        //проверяем, что род тренинг не отображается в списке тренингов
        cy.checkHiddenTraining(parentTrainingId);

        //проверяем, что нет доступа к род тренингу и уроку
        cy.getResponseForAccess(`/teach/control/stream/view/id/${parentTrainingId}`).then((response) => {
            expect(response.status).to.eq(403);
        });
        cy.getResponseForAccess(`/pl/teach/control/lesson/view?id=${lessonId}`).then((response) => {
            expect(response.status).to.eq(403);
        });
        //проверка ленты ответов
        cy.archivedAnswerInAnswersPage(trainingName, lessonName, answerId, 'ответ из автотеста в уроке 323124832');
    });

    it('Доступ по потренингу, подтренинг архивирован, есть покупка к род тренингу, код ответа 200', () => {
        const archivedChildTrainingId = 858104527;
        const parentTrainingId = 858104525;
        const lessonId = 323124832;

        cy.login(users.maksim.email);

        //подтренинг архивирован и есть заглушка
        cy.checkArchivedContentTraining(archivedChildTrainingId);

        //проверяемый тренинг отображается в списке и можно в него войти
        cy.clickTraining(parentTrainingId);

        //есть доступ к уроку
        cy.checkReachedLessonWithMission(lessonId, parentTrainingId);
    });
});

describe('Проверка видимости и доступа к архивным тренингам с настройкой "Показать в списке тренингов"', () => {

    before('Авторизация', () => {
        cy.login(users.lena.email);
    });

    it('Доступ к тренингу по покупке, тренинг архивирован, код ответа 200, заглушка', () => {
        const answerId = 361255419;
        const trainingId = 859889528;
        const lessonId = 323380413;
        const trainingName = `Доступ по покупке (тренинг архивирован), "Показать в списке тренингов"`;
        const lessonName = "проверочный"

        //архивированный тренинг не отображается в списке
        cy.checkHiddenTraining(trainingId);

        //код ответа доступа к архивированному тренингу 200
        cy.getResponseForAccess(`/teach/control/stream/view/id/${trainingId}`).then((response) => {
            expect(response.status).to.eq(200);
        });
        //в архивированном тренинге отображается заглушка
        cy.checkArchivedContentTraining(trainingId);

        //код ответа доступа к уроку в архивированном тренинге 200
        cy.getResponseForAccess(`/pl/teach/control/lesson/view?id=${lessonId}`).then((response) => {
            expect(response.status).to.eq(200);
        });

        //в уроке архивированного тренинга отображается заглушка
        cy.checkArchivedContentLesson(lessonId);

        //проверка ленты ответов
        cy.archivedAnswerInAnswersPage(trainingName, lessonName, answerId, 'ответ из архивированного тренинга в уроке 361255419');
    });

    it('Доступ по группе, ученик в группе, тренинг архивирован, код ответа 200, заглушка', () => {
        const answerId = 361388747;
        const trainingId = 859889539;
        const lessonId = 323380470;
        const trainingName = `Доступ по группе (архивирован), "Показать в списке тренингов"`;
        const lessonName = "проверочный"

        //архивированный тренинг не отображается в списке
        cy.checkHiddenTraining(trainingId);

        //код ответа доступа к архивированному тренингу 200
        cy.getResponseForAccess(`/teach/control/stream/view/id/${trainingId}`).then((response) => {
            expect(response.status).to.eq(200);
        });
        //в архивированном тренинге отображается заглушка
        cy.checkArchivedContentTraining(trainingId);

        //код ответа доступа к уроку в архивированном тренинге 200
        cy.getResponseForAccess(`/pl/teach/control/lesson/view?id=${lessonId}`).then((response) => {
            expect(response.status).to.eq(200);
        });

        //в уроке архивированного тренинга отображается заглушка
        cy.checkArchivedContentLesson(lessonId);

        //проверка ленты ответов
        cy.archivedAnswerInAnswersPage(trainingName, lessonName, answerId, 'ответ из архивированного тренинга в уроке 323380470');
    });

    it('Доступ по завершению, тренинг завершен и архивирован, код ответа 200', () => {
        const answerId = 361389477;
        const archivedTrainingId = 858031414;
        const trainingId = 859890053;
        const lessonId = 323385659;
        const trainingName = `те, кто прошел другой тренинг (тренинг для завершения архивирован), "Показать в списке тренингов"`;
        const lessonName = "проверочный"

        //проверяем, что тренинг для завершения архивирован
        cy.checkArchivedContentTraining(archivedTrainingId);

        //проверяем, что проверяемый тренинг отображается в списке и доступен
        cy.clickTraining(trainingId);

        //проверяем, что есть доступ к проверяемому уроку со статусом "Ответ ожидает проверки"
        cy.checkAnsweredLesson(lessonId, trainingId);

        //проверка ленты ответов
        cy.ordinaryAnswerInAnswersPage(trainingName, lessonName, answerId, 'ответ из автотеста в уроке 323385659');
    });

    it('Доступ по завершению, вкл "закрыть доступ, если тренинг не доступен", тренинг архивирован, код ответа к тренингу 200, к уроку 403', () => {
        const archivedTrainingId = 858031414;
        const trainingId = 859890175;
        const lessonId = 323386289;

        //проверяем, что тренинг для завершения архивирован
        cy.checkArchivedContentTraining(archivedTrainingId);

        //проверяем, что проверяемый тренинг отображается, сам тренинг доступен, но уроки недоступны
        cy.clickTraining(trainingId);
        cy.checkNotReachedLesson(lessonId, trainingId);
        cy.getResponseForAccess(`/pl/teach/control/lesson/view?id=${lessonId}`).then((response) => {
            expect(response.status).to.eq(403);
        });
    });

    it('Доступ по потренингу, подтренинг архивирован, код ответа к тренингу 200, к уроку 403', () => {
        const archivedChildTrainingId = 859898042;
        const parentTrainingId = 859891893;
        const lessonId = 327345960;
        const trainingName = `"Все, у кого есть доступ хотя бы к одному из подтренингов" , подтренинг архивирован, "Показать в списке тренингов"`;
        const lessonName = "проверочный с заданием";
        const answerId = 361393527;

        cy.login(users.yana.email);

        //подтренинг архивирован и есть заглушка
        cy.checkArchivedContentTraining(archivedChildTrainingId);

        //проверяем, что проверяемый тренинг отображается, сам тренинг доступен, но уроки недоступны
        cy.clickTraining(parentTrainingId);
        cy.NotReachedLessonWithLabel(lessonId, parentTrainingId, 'Недоступен');
        cy.getResponseForAccess(`/pl/teach/control/lesson/view?id=${lessonId}`).then((response) => {
            expect(response.status).to.eq(403);
        });

        //проверка ленты ответов
        cy.archivedAnswerInAnswersPage(trainingName, lessonName, answerId, 'ответ из автотеста в уроке 327345960');
    });

    it('Доступ по потренингу, подтренинг архивирован, есть покупка к род тренингу, код ответа 200', () => {
        const archivedChildTrainingId = 859898042;
        const parentTrainingId = 859891893;
        const lessonId = 327345960;
        const answerId = 361395483;
        const trainingName = `"Все, у кого есть доступ хотя бы к одному из подтренингов" , подтренинг архивирован, "Показать в списке тренингов"`;
        const lessonName = `проверочный с заданием`

        cy.login(users.maksim.email);

        //подтренинг архивирован и есть заглушка
        cy.checkArchivedContentTraining(archivedChildTrainingId);

        //проверяем, что проверяемый тренинг доступен и отображается в списке
        cy.clickTraining(parentTrainingId);

        //проверяем, что урок доступен и отображается как урок со статусом "Ответ ожидает проверки"
        cy.checkAnsweredLesson(lessonId, parentTrainingId);

        //проверяем ленту ответов
        cy.ordinaryAnswerInAnswersPage(trainingName, lessonName, answerId, 'ответ из автотеста в уроке 327345960');
    });

    it('Доступ по потренингу, подтренинг архивирован, видимость в архивном потренинге, код ответа 403', () => {
        const archivedChildTrainingId = 859903069;
        const parentTrainingId = 859903064;
        const lessonId = 323425057;

        cy.login(users.yana.email);

        //подтренинг архивирован и есть заглушка
        cy.checkArchivedContentTraining(archivedChildTrainingId);

        //проверяем, что род тренинг не отображается в списке
        cy.checkHiddenTraining(parentTrainingId);

        //проверяем, что нет доступа к род тренингу и уроку
        cy.getResponseForAccess(`/pl/teach/control/lesson/view?id=${lessonId}`).then((response) => {
            expect(response.status).to.eq(403);
        });
        cy.getResponseForAccess(`/teach/control/stream/view/id/${parentTrainingId}`).then((response) => {
            expect(response.status).to.eq(403);
        });
    });
});

describe('Проверка видимости и доступа к архивным тренингам с настройкой "Показать в списке тренингов" и ссылкой для переадресации', () => {

    before('Авторизация', () => {
        cy.login(users.lena.email);
    });

    beforeEach('Переадресация на страницу списка тренингов', () => {
        cy.visit('/teach/control', {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
    });

    it('Доступ к тренингу по покупке, тренинг архивирован, код ответа 200, переадресация', () => {

        //в списке не отображается
        cy.get('.training-row[data-training-id="859904350"]')
            .should('not.exist');

        //проверяем, что код ответа 200 и переадресация на страницу page0
        let items = [
            '/teach/control/stream/view/id/859904350',
            '/pl/teach/control/lesson/view?id=323432763'
        ]

        items.forEach((item) => {
            cy.request({
                url: item,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200)
            })
            cy.visit({
                url: item,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                }
            });
            cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/page0');
        })
    });

    it('Доступ по завершению, тренинг завершен и архивирован, код ответа 200', () => {

        //проверяем, что тренинг для завершения архивирован и не отображается в списке
        cy.get('.training-row[data-training-id="859889539"]')
            .should('not.exist');
        cy.visit({
            url: '/teach/control/stream/view/id/858031414',
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

        //проверяем, что проверяемый тренинг отображается в списке и доступен
        cy.visit({
            url: '/teach/control/stream',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.training-row[data-training-id="859890053"]')
            .should('be.visible');

        let items = [
            '/teach/control/stream/view/id/859890053',
            '/pl/teach/control/lesson/view?id=323385659'
        ]

        items.forEach((item) => {
            cy.request({
                url: item,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200)
            })
        })
    });

    it('Доступ по завершению, вкл "закрыть доступ, если тренинг не доступен", тренинг архивирован, тренинг - переадресация, урок 403', () => {

        //проверяем, что тренинг для завершения архивирован
        cy.get('.training-row[data-training-id="858031414"]')
            .should('not.exist');
        cy.visit({
            url: '/teach/control/stream/view/id/858031414',
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

        //проверяемый тренинг отображается
        cy.visit({
            url: '/teach/control/stream',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.training-row[data-training-id="859904635"]')
            .should('be.visible');

        //для тренинга переадресация на page0
        cy.request({
            url: '/teach/control/stream/view/id/859904635',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })
        cy.visit({
            url: '/teach/control/stream/view/id/859904635',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/page0');

        //урок недоступен
        cy.request({
            url: '/pl/teach/control/lesson/view?id=323434352',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        })
    });
});

describe('Проверка доступности архивного тренинга для администратора', () => {
    const archivedTrainingTitle = 'архивный тренинг 868344057';
    const archivedTrainingId = 868344057;
    const archivedTrainingLessonTitle = 'урок';
    const archivedTrainingLessonId = 325209180;
    const archivedTrainingChildTitle = 'архивный подтренинг 868344058';
    const archivedTrainingChildId = 868344058;
    const archivedOptions = ['Вернуть из архива', 'Настройки', 'Удалить'];
    const archivedOptionsUrl = ['/teach/training/extractArchived/id/', '/teach/control/stream/update/id/', '/teach/control/stream/delete/id/'];

    before('Авторизация', () => {
        cy.login(users.admin.email);
    });

    beforeEach('Переадресация на страницу списка тренингов', () => {
        cy.visit('/teach/control', {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
    });

    it('Проверка страницы "архивные тренинги', () => {

        cy.get('a[href="/pl/teach/training/archived"]').contains('Архивные тренинги').as('archived').should('be.visible');

        cy.get('@archived').click({ force: false });

        cy.url().should('eq', 'https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/training/archived');
        cy.get('h1').contains('Архивные тренинги').should('be.visible');
        cy.get('p').contains('Здесь находятся недоступные для ваших учеников тренинги.').should('be.visible');

        //проверяем отображение архивного род тренинга
        cy.get('.archived-title').contains(archivedTrainingTitle).should('have.attr', 'href', `/pl/teach/training/archived?id=${archivedTrainingId}`).and('be.visible').as('archivedTraining');

        //проверяем отображение архивного подтренинга
        cy.get('.archived-title').contains(archivedTrainingChildTitle).should('have.attr', 'href', `/pl/teach/training/archived?id=${archivedTrainingChildId}`).and('be.visible');

        let i = 0;
        archivedOptionsUrl.forEach((optionUrl) => {
            cy.get('a[href="' + optionUrl + archivedTrainingId + '"]').should('have.attr', 'title', archivedOptions[i]).and('be.visible');
            cy.get('a[href="' + optionUrl + archivedTrainingChildId + '"]').should('have.attr', 'title', archivedOptions[i]).and('be.visible');
            i++;
        });
    });

    it('Проверка страницы архивного родительского тренинга', () => {

        cy.visit('/pl/teach/training/archived', {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //проверяем архивную страницу род тренинга
        cy.get('.archived-title').contains(archivedTrainingTitle).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/training/archived?id=${archivedTrainingId}`);
        cy.get('a[href="/pl/teach/training/archived"]').contains('Архивные тренинги').as('archivedNavigation').should('be.visible');
        cy.get('h1').contains(archivedTrainingTitle).should('be.visible');
        cy.get('p').contains('Здесь находятся недоступные для ваших учеников тренинги.').should('be.visible');
        cy.get('a[href="' + archivedOptionsUrl[0] + archivedTrainingId + '"]').contains('Вернуть из Архива').should('be.visible');
        cy.get('.archived-title').contains(archivedTrainingChildTitle).should('have.attr', 'href', `/pl/teach/training/archived?id=${archivedTrainingChildId}`).and('be.visible');
        let i = 0;
        archivedOptionsUrl.forEach((optionUrl) => {
            cy.get('a[href="' + optionUrl + archivedTrainingChildId + '"]').should('have.attr', 'title', archivedOptions[i]).and('be.visible');
            i++;
        });
        cy.get(`a[href="/pl/teach/control/lesson/view/?id=${archivedTrainingLessonId}"]`).contains(archivedTrainingLessonTitle).should('be.visible');
    });

    it('Проверка кнопки "Вернуть из архива" на странице тренинга', () => {

        cy.visit(`/pl/teach/training/archived?id=${archivedTrainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        //проверяем кнопку "Вернуть из архива" на странице тренинга
        cy.get('a[href="' + archivedOptionsUrl[0] + archivedTrainingId + '"]').contains('Вернуть из Архива').click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${archivedTrainingId}`);
        cy.get('.page-menu').contains('Достижения').should('be.visible');
        cy.get('a[href="/pl/teach/training/archived"]').should('not.exist');
        cy.get('.stream-table .stream-title').contains(archivedTrainingChildTitle).should('be.visible');
        cy.get('.title[href="/teach/control/lesson/view/id/' + archivedTrainingLessonId + '"]').should('be.visible');

        //возвращаем в архив
        cy.visit(`/teach/control/stream/update/id/${archivedTrainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('#settings-link').click();
        cy.get('#send_to_archive').check();
        cy.get('.btn-primary').click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/update/id/${archivedTrainingId}`);
        cy.get('a[href="/pl/teach/training/archived"]').contains('Архивные тренинги').should('be.visible');
    });

    it('Проверка урока в архивном тренинге', () => {

        const lessonOptions = ['Задание', 'Настройки', 'Создать новое уведомление', 'Перенести урок', 'Копировать урок', 'Удалить урок'];

        cy.visit(`/pl/teach/training/archived?id=${archivedTrainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get(`a[href="/pl/teach/control/lesson/view/?id=${archivedTrainingLessonId}"]`).click({ force: true });

        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view/?id=${archivedTrainingLessonId}`);
        cy.get('a[href="/pl/teach/training/archived"]').contains('Архивные тренинги').as('archivedNavigation').should('be.visible');
        cy.get(`a[href="/pl/teach/training/archived?id=${archivedTrainingId}"]`).contains(archivedTrainingTitle).should('be.visible');

        cy.get('.page-actions').contains('Редактировать урок').should('be.visible');
        cy.get('.page-actions').contains('Редактировать урок').click({ force: true });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/pl/teach/control/lesson/view?id=${archivedTrainingLessonId}&editMode=1`);
        cy.get('.btn').contains('Вернуться к просмотру').click({ force: true });

        cy.get('.page-actions').contains('Действия').should('be.visible');
        cy.get('.page-actions').contains('Действия').click();
        lessonOptions.forEach((lessonOption) => {
            cy.get('.dropdown-menu > li').contains(lessonOption).should('be.visible');
        });
    });

    it('Проверка страницы "Содержание" в архивном тренинге', () => {

        cy.visit(`/teach/control/stream/view/id/${archivedTrainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('a[href="/pl/teach/training/archived"]').contains('Архивные тренинги').as('archivedNavigation').should('be.visible');
        cy.get('.stream-table .stream-title').contains(archivedTrainingChildTitle).should('be.visible');
        cy.get('.title[href="/teach/control/lesson/view/id/' + archivedTrainingLessonId + '"]').should('be.visible');
    });

    it('Проверка страницы "Доступ" в архивном тренинге', () => {

        cy.visit(`/teach/control/stream/access/id/${archivedTrainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('a[href="/pl/teach/training/archived"]').contains('Архивные тренинги').as('archivedNavigation').should('be.visible');
        cy.get('.panel-heading').contains('Доступ к тренингу имеют').should('be.visible');
    });

    it('Можно изменить тип доступа на "все зарегистрированные пользователи" в архивном тренинге', () => {

        cy.visit(`/teach/control/stream/access/id/${archivedTrainingId}`, {
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
        cy.get('#ParamsObject_access_type_2[value="all"]').as('all').check();
        cy.get('@none').should('not.be.checked');
        cy.get('button[name="saveAccess"]').as('save').click({ force: true });
        cy.get('.flash-success').contains('Настройки доступа сохранены').should('be.visible');
        cy.get('@all').should('be.checked');

        //Проверяем, что выбор группы и тренинга для доступа скрыты
        cy.get('.select-users').should('exist').and('not.be.visible');
        cy.get('.select-other-training').should('exist').and('not.be.visible');

        //возвращаем настройки по-умолчанию
        cy.get('@none').check().should('be.checked');
        cy.get('@save').click({ force: true });
        cy.get('@none').should('be.checked');
    });

    it('В ленте ответов не отображаются ответы архивированных тренингов', () => {
        const lessonId = 323056183;  //доступ по покупке
        const answerId = 361254011;

        //открыли ленту ответов
        cy.visit(`/teach/control/answers/unanswered/lesson/${lessonId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        cy.get('.col-md-8 > h3').contains('Доступ по покупке (тренинг архивирован). проверочный').should('be.visible');
        cy.contains('В этом уроке больше нет непроверенных ответов').should('be.visible');
        cy.get(`.user-answer[data-id="${answerId}"]`).should('not.exist');
        cy.contains('Ответ из автотеста').should('not.exist');
    });

});

describe('Проверка доступности архивного тренинга для сотрудника НЕ учителя', () => {

    const archivedTrainingId = 868344057;
    const archivedTrainingLessonId = 325209180;

    before('Авторизация', () => {
        cy.login(users.teacher.email);
    });

    beforeEach('Переадресация на страницу списка тренингов', () => {
        cy.visit('/teach/control', {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
    });

    it('Проверка страницы "архивные тренинги', () => {

        //нет кнопки "Архивные тренинги" на странице списка тренингов
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control`);
        cy.contains('Архивные тренинги').should('not.exist');

        //нет доступа к странице архивных тренингов
        cy.request({
            url: `/pl/teach/training/archived`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Архивная страница тренинга возвращает 403', () => {

        cy.request({
            url: `/pl/teach/training/archived?id=${archivedTrainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Заглушка на уроке архивного тренинга', () => {

        cy.visit(`/pl/teach/control/lesson/view/?id=${archivedTrainingLessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.archived-content').contains('Тренинг в архиве, обратитесь в администрацию')
            .should('be.visible');

        cy.get('.btn')
            .should('have.attr', 'href', '/pl/talks/conversation')
            .and('be.visible');
    });

    it('Заглушка вкладки "Содержание" в архивном тренинге', () => {

        cy.visit(`/teach/control/stream/view/id/${archivedTrainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.archived-content').contains('Тренинг в архиве, обратитесь в администрацию')
            .should('be.visible');

        cy.get('.btn')
            .should('have.attr', 'href', '/pl/talks/conversation')
            .and('be.visible');
    });

    it('Вкладка "Доступ" в архивном тренинге возвращает 403', () => {

        cy.request({
            url: `/teach/control/stream/access/id/${archivedTrainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Вкладка "Настройки" в архивном тренинге возвращает 403', () => {

        cy.request({
            url: `/teach/control/stream/update/id/${archivedTrainingId}`,
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

describe('Проверка доступности архивного тренинга для сотрудника основного учителя', () => {

    const archivedTrainingId = 868344057;
    const archivedTrainingLessonId = 325209180;
    const teacher = "учитель";
    const no_teacher = "<не выбран>";

    it('Назначение сотрудника основным учителем', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stream/update/id/${archivedTrainingId}`, {
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

    it('Проверка страницы "архивные тренинги', () => {

        cy.login(users.teacher.email);

        //нет кнопки "Архивные тренинги" на странице списка тренингов

        cy.visit('/teach/control', {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control`);
        cy.contains('Архивные тренинги').should('not.exist');

        //нет доступа к странице архивных тренингов
        cy.request({
            url: `/pl/teach/training/archived`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Архивная страница тренинга возвращает 403', () => {

        cy.request({
            url: `/pl/teach/training/archived?id=${archivedTrainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Заглушка на уроке архивного тренинга', () => {

        cy.visit(`/pl/teach/control/lesson/view/?id=${archivedTrainingLessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.archived-content').contains('Тренинг в архиве, обратитесь в администрацию')
            .should('be.visible');

        cy.get('.btn')
            .should('have.attr', 'href', '/pl/talks/conversation')
            .and('be.visible');
    });

    it('Заглушка вкладки "Содержание" в архивном тренинге', () => {

        cy.visit(`/teach/control/stream/view/id/${archivedTrainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.archived-content').contains('Тренинг в архиве, обратитесь в администрацию')
            .should('be.visible');

        cy.get('.btn')
            .should('have.attr', 'href', '/pl/talks/conversation')
            .and('be.visible');
    });

    it('Заглушка вкладки "Доступ" в архивном тренинге', () => {

        cy.visit(`/teach/control/stream/access/id/${archivedTrainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.archived-content').contains('Тренинг в архиве, обратитесь в администрацию')
            .should('be.visible');

        cy.get('.btn')
            .should('have.attr', 'href', '/pl/talks/conversation')
            .and('be.visible');
    });

    it('Заглушка вкладки "Настройки" в архивном тренинге', () => {

        cy.visit(`/teach/control/stream/update/id/${archivedTrainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.archived-content').contains('Тренинг в архиве, обратитесь в администрацию')
            .should('be.visible');

        cy.get('.btn')
            .should('have.attr', 'href', '/pl/talks/conversation')
            .and('be.visible');
    });

    it('Удаление сотрудника из числа основных учителей', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stream/update/id/${archivedTrainingId}`, {
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

describe('Проверка доступности архивного тренинга для сотрудника дополнительного учителя', () => {

    const archivedTrainingId = 868344057;
    const archivedTrainingLessonId = 325209180;
    const teacher = "учитель";
    const no_teacher = "Дополнительные преподаватели не выбраны";

    it('Назначение сотрудника дополнительным учителем', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stream/update/id/${archivedTrainingId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //выбираем дополнительных учителей
        cy.get('#no-selected-teachers').contains(no_teacher).should('be.visible');
        cy.get('.all-link').contains('все сотрудники').click();
        cy.get('#ParamsObject_teachers_2').check().should('be.checked');
        cy.get('.btn-primary').contains('Сохранить').click({ force: true });
        cy.get('#additional-teachers').contains(teacher).should('be.visible');

    });

    it('Проверка страницы "архивные тренинги', () => {

        cy.login(users.teacher.email);

        cy.visit('/teach/control', {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //нет кнопки "Архивные тренинги" на странице списка тренингов
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control`);
        cy.contains('Архивные тренинги').should('not.exist');

        //нет доступа к странице архивных тренингов
        cy.request({
            url: `/pl/teach/training/archived`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Архивная страница тренинга возвращает 403', () => {

        cy.request({
            url: `/pl/teach/training/archived?id=${archivedTrainingId}`,
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        });
    });

    it('Заглушка на уроке архивного тренинга', () => {

        cy.visit(`/pl/teach/control/lesson/view/?id=${archivedTrainingLessonId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });
        cy.get('.archived-content').contains('Тренинг в архиве, обратитесь в администрацию')
            .should('be.visible');

        cy.get('.btn')
            .should('have.attr', 'href', '/pl/talks/conversation')
            .and('be.visible');
    });

    it('Заглушка вкладки "Содержание" в архивном тренинге', () => {

        cy.visit(`/teach/control/stream/view/id/${archivedTrainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.archived-content').contains('Тренинг в архиве, обратитесь в администрацию')
            .should('be.visible');

        cy.get('.btn')
            .should('have.attr', 'href', '/pl/talks/conversation')
            .and('be.visible');
    });

    it('Заглушка вкладки "Доступ" в архивном тренинге', () => {

        cy.visit(`/teach/control/stream/access/id/${archivedTrainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.archived-content').contains('Тренинг в архиве, обратитесь в администрацию')
            .should('be.visible');

        cy.get('.btn')
            .should('have.attr', 'href', '/pl/talks/conversation')
            .and('be.visible');
    });

    it('Заглушка вкладки "Настройки" в архивном тренинге', () => {

        cy.visit(`/teach/control/stream/update/id/${archivedTrainingId}`, {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.archived-content').contains('Тренинг в архиве, обратитесь в администрацию')
            .should('be.visible');

        cy.get('.btn')
            .should('have.attr', 'href', '/pl/talks/conversation')
            .and('be.visible');
    });

    it('Удаление сотрудника из числа дополнительных учителей', () => {

        cy.login(users.admin.email);

        cy.visit(`/teach/control/stream/update/id/${archivedTrainingId}`, {
            auth: { username: 'gcrc', password: 'gc12rc' }
        });

        //убираем дополнительного учителя
        cy.get('#ParamsObject_teachers_2').uncheck().should('not.be.checked');
        cy.get('.btn-primary').contains('Сохранить').click({ force: true });
        cy.get('#no-selected-teachers').contains(no_teacher).should('be.visible');
    })
});