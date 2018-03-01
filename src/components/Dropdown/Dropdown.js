import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import shortid from 'shortid'
import MdArrowDropDown from 'react-icons/lib/md/arrow-drop-down'

import {
  propEq,
  pipe,
  find,
  prop,
  defaultTo,
} from 'ramda'

class Dropdown extends React.Component {
  constructor (props) {
    super(props)

    this.instanceId = `${props.name}-${shortid.generate()}`
    this.selectedName = this.selectedName.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    const { disabled, onChange } = this.props

    if (!disabled) {
      onChange(event)
    }
  }

  selectedName () {
    const {
      options,
      value,
    } = this.props

    const selected = pipe(
      find(propEq('value', value)),
      defaultTo({}),
      prop('name'),
      defaultTo(this.props.placeholder || 'Selecione')
    )

    return selected(options)
  }

  renderOptions () {
    const {
      theme,
      options,
      value,
    } = this.props

    return options.map(({ value: optValue, name }) => {
      const optionClasses = classNames(
        theme.option,
        {
          [theme.active]: value === optValue,
        }
      )

      return (
        <option
          key={optValue}
          className={optionClasses}
          value={optValue}
        >
          {name}
        </option>
      )
    })
  }

  render () {
    const {
      disabled,
      error,
      label,
      placeholder,
      theme,
      value,
      name,
    } = this.props

    const rootClasses = classNames(
      theme.dropdown,
      {
        [theme.disabled]: disabled,
        [theme.error]: error,
      }
    )

    const hasSecondaryText = theme.secondaryText && error
    const hasLabel = theme.label && label

    return (
      <div className={rootClasses}>
        {hasLabel &&
          <label
            htmlFor={this.instanceId}
            className={theme.label}
          >
            {label}
          </label>
        }

        <select
          id={this.instanceId}
          className={theme.select}
          onChange={this.handleChange}
          disabled={disabled}
          value={value}
          name={name}
        >
          <option
            disabled
            hidden
            value="placeholder"
            className={classNames(theme.option, theme.placeholder)}
          >
            {placeholder}
          </option>
          {this.renderOptions()}
        </select>

        <MdArrowDropDown
          className={theme.arrow}
        />

        {hasSecondaryText &&
          <p className={theme.secondaryText}>
            {error}
          </p>
        }
      </div>
    )
  }
}

Dropdown.propTypes = {
  theme: PropTypes.shape({
    arrow: PropTypes.string,
    disabled: PropTypes.string,
    dropdown: PropTypes.string,
    error: PropTypes.string,
    select: PropTypes.string,
    placeholder: PropTypes.string,
    secondaryText: PropTypes.string,
    success: PropTypes.string,
  }),
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  error: PropTypes.string,
}

Dropdown.defaultProps = {
  theme: {},
  value: 'placeholder',
  disabled: false,
  placeholder: '',
  error: '',
  label: '',
}

export default Dropdown
