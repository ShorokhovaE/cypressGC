const users = require("/Users/elenasorohova/Desktop/autotests/cypress-1/cypress/fixtures/users1.json");

describe('проверка видимости и доступа к тренингу', () => {
    const lessonName = "проверочный урок";

    it('Доступ всем зарегистрированным пользователям, код ответа 200', () => {

        const trainingId = 857502050;
        const lessonId = 322748865;
        const lessonName = "проверочный урок";
        const pages = [
            `/pl/teach/control/lesson/view?id=${lessonId}`,
            `/teach/control/stream/view/id/${trainingId}`
        ]

        //вход под ru2hm@yandex.ru
        cy.login(users.lena.email);

        //проверяем код ответа доступа "200"
        pages.forEach((page) => {
            cy.request({
                url: page,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200)
            })
        })

        //проверяем видимость тренинга и урока внутри него
        cy.get(`.training-row[data-training-id="${trainingId}"]`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
        cy.get(`.lesson-id-${lessonId}`).contains(lessonName).click({ force: true });
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
    });

    it('Доступ к тренингу по покупке, покупка бессрочная, код ответа 200', () => {

        const trainingId = 857501950;
        const lessonId = 322748456;
        const lessonName = "проверочный урок";
        const pages = [
            `/pl/teach/control/lesson/view?id=${lessonId}`,
            `/teach/control/stream/view/id/${trainingId}`
        ]

        //вход под ru2hm@yandex.ru
        cy.login(users.lena.email);

        //проверяем код ответа доступа "200"
        pages.forEach((page) => {
            cy.request({
                url: page,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200)
            })
        })

        //проверяем видимость тренинга и урока внутри него
        cy.get(`.training-row[data-training-id="${trainingId}"]`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
        cy.get(`.lesson-id-${lessonId}`).contains(lessonName).click({ force: true });
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
    });

    it('Доступ к тренингу по покупке, покупка со сроком, активная, код ответа 200', () => {

        const trainingId = 857501950;
        const lessonId = 322748456;
        const lessonName = "проверочный урок";
        const pages = [
            `/pl/teach/control/lesson/view?id=${lessonId}`,
            `/teach/control/stream/view/id/${trainingId}`
        ]

        //maksim@test.ru
        cy.login(users.maksim.email);

        //проверяем код ответа доступа "200"
        pages.forEach((page) => {
            cy.request({
                url: page,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200)
            })
        })

        //проверяем видимость тренинга и урока внутри него
        cy.get(`.training-row[data-training-id="${trainingId}"]`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
        cy.get(`.lesson-id-${lessonId}`).contains(lessonName).click({ force: true });
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
    });

    it('Доступ к тренингу по покупке, покупка завершена, код ответа 403', () => {

        const trainingId = 857501950;
        const lessonId = 322748456;
        const pages = [
            `/pl/teach/control/lesson/view?id=${lessonId}`,
            `/teach/control/stream/view/id/${trainingId}`
        ];

        //anton@test.ru
        cy.login(users.anton.email);

        cy.get(`.training-row[data-training-id="${trainingId}"]`).should('not.exist');

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
            })
        })
    });

    it('Доступ к тренингу по покупке, покупка не началась, код ответа 403', () => {

        const items = [
            '/teach/control/stream/view/id/857501950',
            '/pl/teach/control/lesson/view?id=322748456'
        ]

        //вход под mariarty@test.ru
        cy.login(users.mariarty.email);

        cy.get('.training-row[data-training-id="857501950"]')
            .should('not.exist');

        items.forEach((item) => {
            cy.request({
                url: item,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(403)
            })
        })
    });

    it('Доступ к тренингу по покупке, покупки нет, код ответа 403', () => {

        //leonard@test.ru
        cy.login(users.leonard.email);

        cy.get('.training-row[data-training-id="857501950"]')
            .should('not.exist');

        let items = [
            '/teach/control/stream/view/id/857501950',
            '/pl/teach/control/lesson/view?id=322748456'
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
                expect(response.status).to.eq(403)
            })
        })
    });

    it('Доступ к тренингу по покупке, разрешена част оплата, внесен мин платеж, код ответа 200', () => {

        const trainingId = 857501950;
        const lessonId = 322748456;
        const lessonName = "проверочный урок";

        //sherlok@test.ru
        cy.login(users.sherlok.email);

        cy.get('.training-row[data-training-id="857501950"]')
            .should('be.visible');

        let items = [
            '/teach/control/stream/view/id/857501950',
            '/pl/teach/control/lesson/view?id=322748456'
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
        });

        //проверяем видимость тренинга и урока внутри него
        cy.get(`.training-row[data-training-id="${trainingId}"]`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
        cy.get(`.lesson-id-${lessonId}`).contains(lessonName).click({ force: true });
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
    });

    it('Доступ к тренингу по покупке, разрешена част оплата, внесен недостаточный платеж, код ответа 403', () => {

        //vatson@test.ru
        cy.login(users.vatson.email);

        cy.get('.training-row[data-training-id="857501950"]')
            .should('not.exist');

        let items = [
            '/teach/control/stream/view/id/857501950',
            '/pl/teach/control/lesson/view?id=322748456'
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
                expect(response.status).to.eq(403)
            })
        })
    });

    it('Доступ к тренингу по покупке, НЕ разрешена част оплата, частич оплата, код ответа 403', () => {

        //mary@test.ru
        cy.login(users.mary.email);

        cy.get('.training-row[data-training-id="857501950"]')
            .should('not.exist');

        let items = [
            '/teach/control/stream/view/id/857501950',
            '/pl/teach/control/lesson/view?id=322748456'
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
                expect(response.status).to.eq(403)
            })
        })
    });

    it('Доступ к тренингу по покупке, активная подписка, код ответа 200', () => {

        const trainingId = 857501950;
        const lessonId = 322748456;
        const items = [
            '/teach/control/stream/view/id/857501950',
            '/pl/teach/control/lesson/view?id=322748456'
        ]

        //sheldon@test.ru
        cy.login(users.sheldon.email);

        cy.get('.training-row[data-training-id="857501950"]')
            .should('be.visible');

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
        });

        //проверяем видимость тренинга и урока внутри него
        cy.get(`.training-row[data-training-id="${trainingId}"]`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
        cy.get(`.lesson-id-${lessonId}`).contains(lessonName).click({ force: true });
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
    });

    it('Доступ к тренингу по покупке, подписка завершена, код ответа 403', () => {

        //penny@test.ru
        cy.login(users.penny.email);

        cy.get('.training-row[data-training-id="857501950"]')
            .should('not.exist');

        let items = [
            '/teach/control/stream/view/id/857501950',
            '/pl/teach/control/lesson/view?id=322748456'
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
                expect(response.status).to.eq(403)
            })
        })
    });

    it('Доступ к тренингу по покупке, заморозка, код ответа 403', () => {

        const items = [
            '/teach/control/stream/view/id/857501950',
            '/pl/teach/control/lesson/view?id=322748456'
        ];

        //leonard@test.ru
        cy.login(users.leonard.email);

        //проверяем, что покупка, дающая доступ, заморожена
        cy.visit('/sales/control/userProduct/update/id/412378256', {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.label-info').contains('Заморожена').should('exist');

        cy.visit('/teach/control/stream', {
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            }
        });

        cy.get('.training-row[data-training-id="857501950"]')
            .should('not.exist');

        items.forEach((item) => {
            cy.request({
                url: item,
                auth: {
                    username: 'gcrc',
                    password: 'gc12rc'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(403)
            })
        })
    });

    it('Доступ по группе, ученик в группе, код ответа 200', () => {

        const trainingId = 857502070;
        const lessonId = 322748921;
        const items = [
            '/teach/control/stream/view/id/857502070',
            '/pl/teach/control/lesson/view?id=322748921'
        ]

        //ru2hm@yandex.ru
        cy.login(users.lena.email);

        cy.get('.training-row[data-training-id="857502070"]')
            .should('be.visible');

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
        });

        //проверяем видимость тренинга и урока внутри него
        cy.get(`.training-row[data-training-id="${trainingId}"]`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
        cy.get(`.lesson-id-${lessonId}`).contains(lessonName).click({ force: true });
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
    });

    it('Доступ по группе, ученик НЕ в группе, код ответа 403', () => {

        //вход под stas@test.ru
        cy.login(users.stas.email);

        cy.get('.training-row[data-training-id="857502070"]')
            .should('not.exist');

        let items = [
            '/teach/control/stream/view/id/857502070',
            '/pl/teach/control/lesson/view?id=322748921'
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
                expect(response.status).to.eq(403)
            })
        })
    });

    it('Доступ по группе, ученик НЕ в группе, есть покупка, код ответа 200', () => {

        const trainingId = 857502070;
        const lessonId = 322748921;
        const items = [
            '/teach/control/stream/view/id/857502070',
            '/pl/teach/control/lesson/view?id=322748921'
        ];

        //вход под yana@test.ru
        cy.login(users.yana.email);

        cy.get('.training-row[data-training-id="857502070"]')
            .should('be.visible');

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

        //проверяем видимость тренинга и урока внутри него
        cy.get(`.training-row[data-training-id="${trainingId}"]`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
        cy.get(`.lesson-id-${lessonId}`).contains(lessonName).click({ force: true });
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
    });

    it('Доступ по род тренингу, код ответа 200', () => {

        const trainingId = 857502065;
        const lessonId = 322748907;
        const items = [
            '/teach/control/stream/view/id/857502065',
            '/pl/teach/control/lesson/view?id=322748907'
        ]

        //вход под ru2hm@yandex.ru
        cy.login(users.lena.email);

        //переходим в род тренинги
        cy.get('.training-row[data-training-id="857501950"]').click({ force: false });

        //проверяем, что подтренинг отображается в списке
        cy.get('.training-row[data-training-id="857502065"]')
            .should('be.visible')

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
        });

        //проверяем видимость тренинга и урока внутри него
        cy.get(`.training-row[data-training-id="${trainingId}"]`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
        cy.get(`.lesson-id-${lessonId}`).contains(lessonName).click({ force: true });
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
    });

    it('Доступ по род тренингу, код ответа 403', () => {

        //вход под stas@test.ru
        cy.login(users.stas.email);

        //проверяем, что род тренинга нет в списке
        cy.get('.training-row[data-training-id="857501950"]')
            .should('not.exist')

        let items = [
            '/teach/control/stream/view/id/857502065',
            '/pl/teach/control/lesson/view?id=322748907'
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
                expect(response.status).to.eq(403)
            })
        })
    });

    it('Доступ по род тренингу + группа, код ответа 200', () => {

        const trainingId = 857502067;
        const lessonId = 322748917;
        const items = [
            '/teach/control/stream/view/id/857502067',
            '/pl/teach/control/lesson/view?id=322748917'
        ];

        cy.login(users.lena.email);

        //переходим в род тренинг
        cy.get('.training-row[data-training-id="857501950"]').click({ force: false });

        //проверяем, что подтренинг отображается в списке
        cy.get('.training-row[data-training-id="857502067"]')
            .should('be.visible')

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
        });

        //проверяем видимость тренинга и урока внутри него
        cy.get(`.training-row[data-training-id="${trainingId}"]`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
        cy.get(`.lesson-id-${lessonId}`).contains(lessonName).click({ force: true });
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');

    });

    it('Доступ по род тренингу + группа, в группе не состоит, код ответа 403', () => {

        cy.login(users.yana.email);

        //переходим в род тренинги
        cy.get('.training-row[data-training-id="857501950"]').click({ force: false });

        //проверяем, что подтренинга НЕТ в списке
        cy.get('.training-row[data-training-id="857502067"]')
            .should('not.exist')

        let items = [
            '/teach/control/stream/view/id/857502067',
            '/pl/teach/control/lesson/view?id=322748917'
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
                expect(response.status).to.eq(403)
            })
        })
    });

    it('Доступ по род тренингу + группа, нет доступа к род тренингу, код ответа 403', () => {

        cy.login(users.stas.email);

        //Родительского тренинга нет в списке
        cy.get('.training-row[data-training-id="857501950"]')
            .should('not.exist')

        let items = [
            '/teach/control/stream/view/id/857502067',
            '/pl/teach/control/lesson/view?id=322748917'
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
                expect(response.status).to.eq(403)
            })
        })
    });

    it('Доступ по потренингу, код ответа 200', () => {

        const trainingId = 857502057;
        const lessonId = 322748871;
        const items = [
            '/teach/control/stream/view/id/857502057',
            '/pl/teach/control/lesson/view?id=322748871'
        ]

        cy.login(users.lena.email);

        //В списке тренингов отображается
        cy.get('.training-row[data-training-id="857502057"]')
            .should('be.visible')

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
        });

        //проверяем видимость тренинга и урока внутри него
        cy.get(`.training-row[data-training-id="${trainingId}"]`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
        cy.get(`.lesson-id-${lessonId}`).contains(lessonName).click({ force: true });
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');

    });

    it('Доступ по потренингу, нет доступа к подтренингу, код ответа 403', () => {

        cy.login(users.stas.email);

        //В списке тренингов НЕ отображается
        cy.get('.training-row[data-training-id="857502057"]')
            .should('not.exist')

        let items = [
            '/teach/control/stream/view/id/857502057',
            '/pl/teach/control/lesson/view?id=322748871'
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
                expect(response.status).to.eq(403)
            })
        })
    });

    it('Доступ по завершению, код ответа 200', () => {

        const trainingId = 857603976;
        const lessonId = 322822605;
        const items = [
            `/teach/control/stream/view/id/${trainingId}`,
            `/pl/teach/control/lesson/view?id=${lessonId}`
        ];

        cy.login(users.lena.email);

        //В списке тренингов отображается
        cy.get('.training-row[data-training-id="857603976"]').should('be.visible')

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
        });

        //проверяем видимость тренинга и урока внутри него
        cy.get(`.training-row[data-training-id="${trainingId}"]`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
        cy.get(`.lesson-id-${lessonId}`).contains(lessonName).click({ force: true });
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
    });

    it('Доступ по завершению, тренинг завершен и доступ утрачен, код ответа 200', () => {

        const trainingId = 857603976;
        const lessonId = 322822605;
        const items = [
            `/teach/control/stream/view/id/${trainingId}`,
            `/pl/teach/control/lesson/view?id=${lessonId}`
        ];

        cy.login(users.yana.email);

        //проверяем, что тренинг для завершения недоступен
        cy.request({
            url: '/teach/control/stream/view/id/857603979',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        })

        //В списке тренингов отображается
        cy.get('.training-row[data-training-id="857603976"]')
            .should('be.visible')

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
        });

        //проверяем видимость тренинга и урока внутри него
        cy.get(`.training-row[data-training-id="${trainingId}"]`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
        cy.get(`.lesson-id-${lessonId}`).contains(lessonName).click({ force: true });
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
    });

    it('Доступ по завершению, тренинг не завершен, код ответа 403', () => {

        cy.login(users.stas.email);

        //проверяем, что тренинг для завершения доступен
        cy.request({
            url: '/teach/control/stream/view/id/857603979',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })

        //проверяем, что тренинг для завершения отображается в списке тренингов
        cy.get('.training-row[data-training-id="857603979"]')
            .should('be.visible')

        //В списке тренингов проверяемый тренинг НЕ отображается
        cy.get('.training-row[data-training-id="857603976"]')
            .should('not.exist')

        let items = [
            '/teach/control/stream/view/id/857603976',
            '/pl/teach/control/lesson/view?id=322822605'
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
                expect(response.status).to.eq(403)
            })
        })
    });

    it('Доступ по завершению, вкл "закрыть доступ, если тренинг не доступен", код ответа 200', () => {

        const trainingId = 857997103;
        const lessonId = 323050828;
        const items = [
            `/teach/control/stream/view/id/${trainingId}`,
            `/pl/teach/control/lesson/view?id=${lessonId}`
        ];

        cy.login(users.lena.email);

        //В списке тренингов отображается
        cy.get('.training-row[data-training-id="857997103"]')
            .should('be.visible');

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
        });

        //проверяем видимость тренинга и урока внутри него
        cy.get(`.training-row[data-training-id="${trainingId}"]`).click({ force: false });
        cy.url().should('eq', `https://autotestsshorokhova.eshorohova.gcrc.ru/teach/control/stream/view/id/${trainingId}`);
        cy.get(`.lesson-id-${lessonId}`).contains(lessonName).click({ force: true });
        cy.get('.modal-block-content').contains('проверочный текст в содержании урока').should('be.visible');
    });

    it('Доступ по завершению, вкл "закрыть доступ, если тренинг не доступен", доступ утерян, код ответа 403', () => {

        cy.login(users.yana.email);

        //проверяем, что тренинг для завершения недоступен
        cy.request({
            url: '/teach/control/stream/view/id/857603979',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
        })

        //В списке тренингов проверяемый НЕ отображается
        cy.get('.training-row[data-training-id="857997103"]')
            .should('not.exist')

        let items = [
            '/teach/control/stream/view/id/857997103',
            '/pl/teach/control/lesson/view?id=323050828'
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
                expect(response.status).to.eq(403)
            })
        })
    });

    it('Доступ по завершению, вкл "закрыть доступ, если тренинг не доступен", тренинг не завершен, код ответа 403', () => {

        cy.login(users.stas.email);

        //проверяем, что тренинг для завершения доступен
        cy.request({
            url: '/teach/control/stream/view/id/857603979',
            auth: {
                username: 'gcrc',
                password: 'gc12rc'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
        })
        //в списке тренинг для завершения отображается (проверка, что он НЕ архивный)
        cy.get('.training-row[data-training-id="857603979"]')
            .should('be.visible')

        //В списке тренингов проверяемый НЕ отображается
        cy.get('.training-row[data-training-id="857997103"]')
            .should('not.exist')

        let items = [
            '/teach/control/stream/view/id/857997103',
            '/pl/teach/control/lesson/view?id=323050828'
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
                expect(response.status).to.eq(403)
            })
        })
    });

});