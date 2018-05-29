import reducer from './'

describe('checkout reduceres', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      pageInfo: {},
      cart: {
        collapsed: true,
      },
      transactionValues: {
        amount: 0,
        defaultMethod: 'boleto',
        paymentMethods: [],
        paymentConfig: {
          boleto: {},
          creditcard: {
            installments: [],
          },
        },
      },
    })
  })

  it('should handle ADD_PAGE_INFO', () => {
    expect(
      reducer({}, {
        type: 'ADD_PAGE_INFO',
        payload: {
          page: 'main_page',
          pageInfo: {
            isCheckout: true,
            haveAnAwesomeTeam: true,
          },
        },
      })
    ).toHaveProperty('pageInfo', {
      main_page: {
        isCheckout: true,
        haveAnAwesomeTeam: true,
      },
    })

    expect(
      reducer({
        pageInfo: {
          main_page: {
            isCheckout: true,
            haveAnAwesomeTeam: true,
          },
        },
      }, {
        type: 'ADD_PAGE_INFO',
        payload: {
          page: 'second_page',
          pageInfo: {
            currentPage: 2,
            ruleThemAll: true,
          },
        },
      })
    ).toHaveProperty('pageInfo', {
      main_page: {
        isCheckout: true,
        haveAnAwesomeTeam: true,
      },
      second_page: {
        currentPage: 2,
        ruleThemAll: true,
      },
    })

    expect(
      reducer({}, {
        type: 'ADD_PAGE_INFO',
      })
    ).toHaveProperty('pageInfo', {})

    expect(
      reducer({
        pageInfo: {
          defaultPage: 'just a test',
        },
      }, {
        type: 'ADD_PAGE_INFO',
      })
    ).toHaveProperty('pageInfo', {
      defaultPage: 'just a test',
    })
  })

  it('should handle UPDATE_FINAL_AMOUNT', () => {
    expect(
      reducer({}, {
        type: 'UPDATE_FINAL_AMOUNT',
        payload: 88712,
      })
    ).toEqual({
      pageInfo: {},
      cart: {
        collapsed: true,
      },
      transactionValues: {
        amount: 0,
        defaultMethod: 'boleto',
        finalAmount: 88712,
        paymentConfig: {
          boleto: {},
          creditcard: {
            installments: [],
          },
        },
        paymentMethods: [],
      },
    })
  })

  it('should handle TOGGLE', () => {
    expect(
      reducer({}, {
        type: 'TOGGLE',
      })
    ).toEqual({
      pageInfo: {},
      cart: {
        collapsed: false,
      },
      transactionValues: {
        amount: 0,
        defaultMethod: 'boleto',
        paymentConfig: {
          boleto: {},
          creditcard: {
            installments: [],
          },
        },
        paymentMethods: [],
      },
    })
  })
})
