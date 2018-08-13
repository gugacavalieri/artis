describe('Custom', () => {
  describe('API', () => {
    describe('Customer', () => {
      describe('Should open', () => {
        it('with customer', () => {
          const api = `
            const key = 'ek_test_sjQXl3mVUFu1QQYpiSvUBaybtXtXjz';

            const customer = {
              name: 'Dan Abramov',
              documentNumber: '19981596639',
              email: 'mercurio@pagar.me',
              phoneNumber: '1130442277',
              allowedDocuments: ['CPF', 'CNPJ'],
            }

            const transaction = {
              amount: 10000,
            }

            const checkout = createCheckout({
              customer,
              key,
              transaction,
            })

            checkout
              .open()
            `

          cy.visit('/')

          cy.get('#btn-open-textarea').click()
          cy.get('#textarea-code').type(api)
          cy.get('#btn-open-checkout').click()
          cy.wait(300)

          cy.get('.customerPage__title').should('not.exist')
          cy.get('.addressesPage__title').then((elem) => {
            expect(elem[0].innerHTML).to.eq('Qual é seu endereço de cobrança?')
          })
        })
      })
    })
  })
})

