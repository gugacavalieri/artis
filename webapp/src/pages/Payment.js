import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { themr } from 'react-css-themr'
import PaymentCard from 'react-payment-card-component'

import { Grid, Row, Col } from './../components/Grid'
import SegmentedSwitch from './../components/SegmentedSwitch'
import Input from './../components/Input'
import Dropdown from './../components/Dropdown'
import Button from './../components/Button'
import { amountBRLParse } from './../helpers/parsers'
import installmentsData from './../helpers/installments'
import Barcode from './../images/barcode.svg'

const applyThemr = themr('UIPaymentPage')

const isDesktop = window.innerWidth > 640

const isCreditCard = ({ value }) => (value === 'creditcard')

const defaultColSize = 12
const mediumColSize = 6
const defaultCardNumber = '•••• •••• •••• ••••'
const defaultCvv = '•••'
const defaultExpirationDate = 'MM/AA'
const defaultCardName = 'Nome Completo'

class Payment extends Component {
  constructor (props) {
    super(props)

    const paymentOptions = [
      {
        value: 'creditcard',
        title: 'Cartão de Crédito',
        subtitle: 'Em até 2x sem juros',
      },
      {
        value: 'bankbill',
        title: 'Boleto bancário',
        subtitle: '10% de desconto',
      },
    ]

    this.state = {
      paymentOptions,
      selected: paymentOptions[0],
      cardNumber: '',
      name: '',
      dateValidate: '',
      cvv: '',
      nameEmail: '',
      email: '',
      amount: 100,
      flipped: false,
      barcode: '',
      showEmailForm: false,
    }

    this.flipCard = this.flipCard.bind(this)
    this.handleSwitchChange = this.handleSwitchChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.generateBoleto = this.generateBoleto.bind(this)
    this.toggleSendByEmail = this.toggleSendByEmail.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleSwitchChange (selected) {
    this.setState({ selected })
  }

  handleInputChange (e) {
    const { name, value } = e.target

    this.setState({ [name]: value })
  }

  flipCard () {
    this.setState(({ flipped }) => ({ flipped: !flipped }))
  }

  generateBoleto () {
    this.setState({
      barcode: '12345 00006 00007  00000 00008 9 10110000012134',
    })
  }

  toggleSendByEmail () {
    this.setState(({ showEmailForm }) => ({ showEmailForm: !showEmailForm }))
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.toggleSendByEmail()
    }
  }

  renderAmount () {
    const { amount } = this.state
    const { theme } = this.props

    return (
      <h4 className={theme.amount} >
        Valor a pagar: {amountBRLParse(amount)}
      </h4>
    )
  }

  renderCreditCard () {
    const {
      cardNumber,
      name,
      expiration,
      cvv,
      installments,
      flipped,
    } = this.state

    const { theme } = this.props

    return (
      <Row>
        <Col
          tv={mediumColSize}
          desk={mediumColSize}
          tablet={mediumColSize}
          palm={defaultColSize}
          alignCenter
          className={theme.cardContainer}
          hidden={!isDesktop}
        >
          <PaymentCard
            number={cardNumber || defaultCardNumber}
            cvv={cvv || defaultCvv}
            holderName={name || defaultCardName}
            expiration={expiration || defaultExpirationDate}
            flipped={flipped}
          />
          { this.renderAmount() }
        </Col>
        <Col
          className={theme.cardForm}
          tv={mediumColSize}
          desk={mediumColSize}
          tablet={mediumColSize}
          palm={defaultColSize}
        >
          <Row>
            <Col
              tv={defaultColSize}
              desk={defaultColSize}
              tablet={defaultColSize}
              palm={defaultColSize}
            >
              <Input
                name="cardNumber"
                label="Número do cartão"
                value={cardNumber}
                type="number"
                max="9999999999999999999"
                onChange={this.handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col
              tv={defaultColSize}
              desk={defaultColSize}
              tablet={defaultColSize}
              palm={defaultColSize}
            >
              <Input
                name="name"
                label="Nome"
                hint="(Igual no cartão)"
                value={name}
                placeholder=""
                onChange={this.handleInputChange}
              />
            </Col>
          </Row>
          <Row>
            <Col
              tv={7}
              desk={7}
              tablet={defaultColSize}
              palm={defaultColSize}
            >
              <Input
                name="expiration"
                label="Data de validade"
                hint=""
                mask=""
                value={expiration}
                placeholder=""
                onChange={this.handleInputChange}
              />
            </Col>
            <Col
              tv={5}
              desk={5}
              tablet={defaultColSize}
              palm={defaultColSize}
            >
              <Input
                name="cvv"
                label="CVV"
                value={cvv}
                type="number"
                maxLength="3"
                onChange={this.handleInputChange}
                onFocus={this.flipCard}
                onBlur={this.flipCard}
              />
            </Col>
          </Row>
          <Row>
            <Col
              tv={defaultColSize}
              desk={defaultColSize}
              tablet={defaultColSize}
              palm={defaultColSize}
            >
              <Dropdown
                options={installmentsData}
                name="installments"
                label="Quantidade de Parcelas"
                value={installments}
                onChange={this.handleInputChange}
                title="Selecione"
              />
            </Col>
          </Row>
          <Row hidden={isDesktop}>
            <Col
              tv={defaultColSize}
              desk={defaultColSize}
              tablet={defaultColSize}
              palm={defaultColSize}
            >
              { this.renderAmount() }
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  renderGenerateBoleto () {
    const {
      amount,
      barcode,
    } = this.state

    const { theme } = this.props

    return (
      <Col
        tv={mediumColSize}
        desk={mediumColSize}
        tablet={mediumColSize}
        palm={defaultColSize}
      >
        <div className={theme.generateBoletoContainer} >
          <img src={Barcode} alt="barcode" className={theme.barcodeImg} />
          {!barcode && <Button
            fill="outline"
            className={theme.generateBoleto}
            onClick={this.generateBoleto}
            size="small"
          >
            Gerar Boleto
          </Button>}
          {barcode && <p className={theme.barcode} >{barcode}</p>}
          <h4 className={`${theme.amount} ${theme.boletoAmount}`} >
            Valor a pagar: {amountBRLParse(amount)}
          </h4>
        </div>
      </Col>
    )
  }

  renderEmailForm () {
    const {
      nameEmail,
      email,
    } = this.state

    const { theme } = this.props

    return (
      <div className={theme.emailForm}>
        <Row>
          <Col
            tv={defaultColSize}
            desk={defaultColSize}
            tablet={defaultColSize}
            palm={defaultColSize}
          >
            <h4 className={theme.emailFormTitle}>
              Encaminhar por e-mail
            </h4>
          </Col>
        </Row>
        <Row>
          <Col
            tv={defaultColSize}
            desk={defaultColSize}
            tablet={defaultColSize}
            palm={defaultColSize}
          >
            <Input
              name="nameEmail"
              label="Digite seu nome - opcional"
              hint=""
              mask=""
              value={nameEmail}
              placeholder=""
              onChange={this.handleInputChange}
            />
          </Col>
        </Row>
        <Row>
          <Col
            tv={defaultColSize}
            desk={defaultColSize}
            tablet={defaultColSize}
            palm={defaultColSize}
          >
            <Input
              name="email"
              label="Digite o e-mail"
              value={email}
              placeholder=""
              onKeyPress={this.handleKeyPress}
              onChange={this.handleInputChange}
            />
          </Col>
        </Row>
      </div>
    )
  }

  renderOptions () {
    const {
      barcode,
    } = this.state

    const { theme } = this.props

    return (
      <Fragment>
        <Row>
          <Col
            tv={defaultColSize}
            desk={defaultColSize}
            tablet={defaultColSize}
            palm={defaultColSize}
          >
            <Button
              textAlign="left"
              relevance="low"
              disabled={!barcode}
              full
              size="extra-large"
              className={theme.boletoOption}
            >
              Salvar arquivo
            </Button>
          </Col>
        </Row>
        <Row>
          <Col
            tv={defaultColSize}
            desk={defaultColSize}
            tablet={defaultColSize}
            palm={defaultColSize}
          >
            <Button
              relevance="low"
              textAlign="left"
              disabled={!barcode}
              full
              size="extra-large"
              className={theme.boletoOption}
              onClick={this.toggleSendByEmail}
            >
              Encaminhar por e-mail
            </Button>
          </Col>
        </Row>
        <Row>
          <Col
            tv={defaultColSize}
            desk={defaultColSize}
            tablet={defaultColSize}
            palm={defaultColSize}
          >
            <Button
              relevance="low"
              textAlign="left"
              disabled={!barcode}
              full
              size="extra-large"
              className={theme.boletoOption}
            >
              Copiar código de barras
            </Button>
          </Col>
        </Row>
      </Fragment>
    )
  }

  renderBoletoOptions () {
    const {
      barcode,
      showEmailForm,
    } = this.state

    const { theme } = this.props

    return (
      <Col
        tv={mediumColSize}
        desk={mediumColSize}
        tablet={mediumColSize}
        palm={defaultColSize}
        className={theme.optionsContainer}
      >
        { showEmailForm ? this.renderEmailForm() : this.renderOptions() }
        <Row hidden={isDesktop} >
          <Col
            tv={defaultColSize}
            desk={defaultColSize}
            tablet={defaultColSize}
            palm={defaultColSize}
          >
            { this.renderAmount() }
          </Col>
        </Row>
        <Row hidden={isDesktop} >
          <Col
            tv={defaultColSize}
            desk={defaultColSize}
            tablet={defaultColSize}
            palm={defaultColSize}
          >
            <Button
              relevance="low"
              textAlign="center"
              disabled={!barcode}
              full
              size="extra-large"
              className={theme.boletoOption}
            >
              Fechar
            </Button>
          </Col>
        </Row>
      </Col>
    )
  }

  renderBoleto () {
    const {
      barcode,
    } = this.state

    if (!isDesktop && !barcode) {
      return this.renderGenerateBoleto()
    }

    if (!isDesktop && barcode) {
      return this.renderBoletoOptions()
    }

    return (
      <Row>
        { this.renderGenerateBoleto() }
        { this.renderBoletoOptions() }
      </Row>
    )
  }

  render () {
    const {
      paymentOptions,
      selected,
    } = this.state

    const { theme } = this.props

    return (
      <Grid className={theme.grid}>
        <Row>
          <Col
            tv={defaultColSize}
            desk={defaultColSize}
            tablet={defaultColSize}
            palm={defaultColSize}
          >
            <SegmentedSwitch
              onChange={this.handleSwitchChange}
              items={paymentOptions}
              selected={selected}
              name="paymentOptions"
            />
          </Col>
        </Row>
        { isCreditCard(selected) ?
          this.renderCreditCard() :
          this.renderBoleto() }
      </Grid>
    )
  }
}

Payment.propTypes = {
  theme: PropTypes.shape({
    amount: PropTypes.string,
    cardContainer: PropTypes.string,
    cardForm: PropTypes.string,
    grid: PropTypes.string,
    page: PropTypes.string,
    title: PropTypes.string,
    barcode: PropTypes.string,
    barcodeImg: PropTypes.string,
    generateBoleto: PropTypes.string,
    generateBoletoContainer: PropTypes.string,
    boletoAmount: PropTypes.string,
    boletoOption: PropTypes.string,
    boletoContainer: PropTypes.string,
    optionsContainer: PropTypes.string,
    emailForm: PropTypes.string,
    emailFormTitle: PropTypes.string,
  }),
}

Payment.defaultProps = {
  theme: {},
}

export default applyThemr(Payment)
