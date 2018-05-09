import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  ThemeConsumer,
  Button,
} from 'former-kit'
import ReactGA from 'react-ga'
import copy from 'copy-to-clipboard'
import { propOr } from 'ramda'

import { DarkButton } from './../../'
import { formatToBRL } from '../../../utils/masks/'
import SuccessIcon from '../../../images/confirmacao_sucesso.svg'
import CopyIcon from '../../../images/copy.svg'
import DownloadIcon from '../../../images/download.svg'
import CloseXIcon from '../../../images/closeX.svg'
import OrderIcon from '../../../images/pedido.svg'

const consumeTheme = ThemeConsumer('UISuccessMessageInfo')

const Success = ({
  amount,
  boleto,
  closeCheckout,
  creditCard,
  orderUrl,
  theme,
}) => {
  const openLink = url => () => window.open(url, '_blank')

  const formatExpirationAt = value => (
    value
      ? moment(value).format('L')
      : moment().add(1, 'days').format('L')
  )

  const handleBarcodeCopy = barcode => (
    () => {
      ReactGA.event({
        category: 'Boleto',
        action: 'Copy Bar Code',
      })

      copy(barcode)
    }
  )

  const handleBoletoSaveFile = fileUrl =>
    () => {
      ReactGA.event({
        category: 'Boleto',
        action: 'Download boleto',
      })

      openLink(fileUrl)
    }

  const renderTexts = () => {
    const installmentText = propOr('', 'installmentText', creditCard)
    if (installmentText.length > 0) {
      return (
        <Fragment>
          <h3 className={theme.infoField}>Parcelamento:</h3>
          <p className={theme.infoValue}>
            {creditCard.installmentText}
          </p>
        </Fragment>
      )
    }

    if (boleto.url) {
      return (
        <Fragment>
          <h3 className={theme.infoField}>Vencimento:</h3>
          <p className={theme.infoValue}>
            {formatExpirationAt(boleto.expirationAt)}
          </p>
          <h3 className={theme.infoField}>Código de barras:</h3>
          <p className={theme.infoValue}>
            {boleto.barcode}
          </p>
          <div className={theme.boletoButtonsWrapper}>
            <DarkButton
              onClick={handleBarcodeCopy(boleto.barcode)}
              title="Copiar código"
              icon={<CopyIcon className={theme.whiteIcon} />}
            />
            <DarkButton
              onClick={handleBoletoSaveFile(boleto.url)}
              title="Salvar código"
              icon={<DownloadIcon className={theme.whiteIcon} />}
            />
          </div>
        </Fragment >
      )
    }

    return null
  }

  return (
    <div className={theme.wrapper}>
      <div className={theme.box}>
        <SuccessIcon className={theme.icon} />
        <h1 className={theme.title}>Deu tudo certo!</h1>
        <hr className={theme.line} />
        <h3 className={theme.infoField}>
          {
            boleto.url ? 'Valor a pagar:' : 'Valor pago:'
          }
        </h3>
        <p className={theme.infoValue}>{formatToBRL(amount)}</p>
        { renderTexts() }
        <div
          className={theme.buttonsWrapper}
        >
          {
            orderUrl &&
            <Button
              fill="outline"
              icon={<OrderIcon className={theme.whiteIcon} />}
              onClick={openLink(orderUrl)}
            >
              Ver pedido
            </Button>
          }
          <Button
            fill="gradient"
            icon={<CloseXIcon className={theme.whiteIcon} />}
            onClick={closeCheckout}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}

Success.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  boleto: PropTypes.shape({
    barcode: PropTypes.number,
    name: PropTypes.string,
    url: PropTypes.string,
    expirationAt: PropTypes.string,
  }),
  creditCard: PropTypes.shape({
    installmentText: PropTypes.string,
  }),
  theme: PropTypes.shape({
    boletoButtonsWrapper: PropTypes.string,
    box: PropTypes.string,
    buttonsWrapper: PropTypes.string,
    icon: PropTypes.string,
    infoField: PropTypes.string,
    infoValue: PropTypes.string,
    line: PropTypes.string,
    title: PropTypes.string,
    whiteIcon: PropTypes.string,
    wrapper: PropTypes.string,
  }).isRequired,
  closeCheckout: PropTypes.func,
  orderUrl: PropTypes.string,
}

Success.defaultProps = {
  boleto: {},
  creditCard: {},
  closeCheckout: null,
  orderUrl: '',
}

export default consumeTheme(Success)
