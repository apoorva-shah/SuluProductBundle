/*
 * This file is part of the Sulu CMS.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

define([], function() {

    'use strict';

    // TODO inject default values at server when implemented
    // Defaults should include taxes, currency, unit, locale

    var defaults = {
            discount: 0,
            currency: 'EUR',
            taxRate: 0.20,
            locale: 'en',
            unit: 'pc'
        },

        constants = {
            invalidInputTranslation: 'products.price-calculation.invalid.input'
        },

        /**
         * Checks if a value is greater or equals zero
         * @param {Object} sandbox
         * @param {String|Number} value
         * @returns {boolean}
         */
        isGreaterThanOrEqualsZero = function(sandbox, value) {
            if (!!sandbox.dom.isNumeric(value)) {
                value = parseFloat(value);
                return !!(!isNaN(value) && value >= 0);
            }
            return false;
        },

        /**
         * Returns taxrate as float value between 0 and 1
         * If none is present the default tax rate will be returned
         * If invalid taxrate is provided (> 100%) an error will be thrown
         * @param {Object} sandbox
         * @param {Number} taxRate
         * @returns {Number}
         */
        getTaxRate = function(sandbox, taxRate) {
            if (!!isGreaterThanOrEqualsZero(sandbox, taxRate)) {
                return parseFloat(taxRate) / 100;
            } else if (!taxRate) {
                return defaults.taxRate;
            } else {
                // TODO handle invalid value everywhere correctly
                sandbox.logger.error('Invalid argument for tax rtae!', taxRate);
                throw new Error(sandbox.translate(constants.invalidInputTranslation));
            }
        },

        /**
         * Returns discount as float value between 0 and 1
         * If discount is greater than 100 or negativ an error will be thrown
         * If none discount is provided the default discount will be returned
         * @param {Object} sandbox
         * @param {Number} discount
         * @returns {Number}
         */
        getDiscount = function(sandbox, discount) {
            if (!!isGreaterThanOrEqualsZero(sandbox, discount) && parseFloat(discount) <= 100) {
                var result = parseFloat(discount) / 100;
                if(result <= 1){
                    return result;
                }
            } else if(!discount) {
                return parseFloat(constants.discount);
            } else {
                // TODO handle invalid value everywhere correctly
                sandbox.logger.error('Invalid argument for discount!', discount);
                throw new Error(sandbox.translate(constants.invalidInputTranslation));
            }
        },

        /**
         * Decides if currency should be appended or prepended
         * @param locale
         * @returns {boolean}
         */
        appendCurrencyToPrice = function(locale) {
            return locale !== 'en';
        },

        /**
         * Checks if price, taxrate, discount, amount have valid values
         * @param sandbox
         * @param price
         * @param taxRate
         * @param discount
         * @param amount
         */
        validCalculationParams = function(sandbox, price, taxRate, discount, amount) {
            if (!isGreaterThanOrEqualsZero(sandbox, price) ||
                !isGreaterThanOrEqualsZero(sandbox, taxRate) ||
                !isGreaterThanOrEqualsZero(sandbox, discount) ||
                parseFloat(discount) > 100 ||
                !isGreaterThanOrEqualsZero(sandbox, amount)
            ) {
                sandbox.logger.error('Invalid parameter(s) for price calculation!');
                return false;
            }

            return true;
        },

        /**
         * Processes elements for getTotalPricesAndTaxes
         * @param sandbox
         * @param items
         */
        processPriceCalculationItem = function(sandbox, items) {
            var tax = 0, i, item, discount, netPrice,
                result = {
                    taxes: {},
                    netPrice: 0,
                    grossPrice: 0
                };

            for (i in items) {
                if (validCalculationParams(sandbox, items[i].price, items[i].tax, items[i].discount, 1)) {
                    item = items[i];
                    discount = getDiscount(sandbox, item.discount);
                    netPrice = parseFloat(item.price);
                    netPrice = netPrice * item.quantity;
                    if(!!discount) {
                        netPrice -= (parseFloat(item.price) * discount);
                    }

                    // TODO test function - wrong discount value?

                    result.netPrice += netPrice;
                    tax = result.netPrice * getTaxRate(sandbox, item.tax);
                    if (tax > 0) {
                        if (!!result.taxes[item.tax]) {
                            result.taxes[item.tax] += tax;
                        } else {
                            result.taxes[item.tax] = tax;
                        }
                    }
                    result.grossPrice += netPrice + tax;
                } else {
                    throw new Error(sandbox.translate(constants.invalidInputTranslation));
                }
            }

            return result;
        };

    return {

        /**
         * Returns formatted gross price
         * @param {Object} sandbox
         * @param {Number} price net
         * @param {String} currency
         * @param {Number} taxRate percentage value
         * @return {String} formatted price including currency
         */
        getFormattedGrossPrice: function(sandbox, price, currency, taxRate) {
            if (!validCalculationParams(sandbox, price, taxRate, 0, 0)) {
                return sandbox.translate(constants.invalidInputTranslation);
            }

            var total, locale;

            // TODO add amount and discount and add try catch

            price = parseFloat(price);
            taxRate = getTaxRate(sandbox, taxRate);
            currency = currency || defaults.currency;
            locale = sandbox.globalize.getLocale() || defaults.locale;
            total = price + (price * taxRate);

            return this.getFormattedNumberWithAddition(sandbox, total, currency, appendCurrencyToPrice(locale));
        },

        /**
         * Returns formatted net price
         * @param {Object} sandbox
         * @param {Number} price gross
         * @param {String} currency
         * @param {Number} taxRate
         * @return {String} formatted price including currency
         */
        getFormattedNetPrice: function(sandbox, price, currency, taxRate) {

            if (!validCalculationParams(sandbox, price, taxRate, 0, 0)) {
                return sandbox.translate(constants.invalidInputTranslation);
            }

            var total, locale;

            price = parseFloat(price);
            taxRate = getTaxRate(sandbox, taxRate);
            currency = currency || defaults.currency;
            locale = sandbox.globalize.getLocale() || defaults.locale;
            total = price - (price * taxRate);

            // TODO test

            return this.getFormattedNumberWithAddition(sandbox, total, currency, appendCurrencyToPrice(locale));
        },

        /**
         * Formats an amount of something and adds an addition (unit, currency, ...)
         * @param {Object} sandbox
         * @param {Number} amount
         * @param {String} unit
         * @return {String} formatted string
         */
        getFormattedAmountAndUnit: function(sandbox, amount, unit) {
            if (!isGreaterThanOrEqualsZero(sandbox, amount)) {
                sandbox.logger.error('Invalid parameter in getFormattedAmountAndUnit!');
                return sandbox.translate(constants.invalidInputTranslation);
            }

            unit = unit || defaults.unit;
            return this.getFormattedNumberWithAddition(sandbox, amount, unit, true);
        },

        /**
         * Will format a number and append or prepend the addition
         * @param sandbox
         * @param value
         * @param addition
         * @param {Boolean} append addition if true else prepend
         * @returns {String}
         */
        getFormattedNumberWithAddition: function(sandbox, value, addition, append) {
            var formatted = sandbox.numberFormat(value, 'n');

            if (!append) {
                return addition + '' + formatted;
            } else {
                return formatted + ' ' + addition;
            }
        },

        /**
         * Calculates a price from a price and subtracts a discount from the net price
         * @param {Object} sandbox
         * @param {Number} price gross or net
         * @param {String} currency percentage value
         * @param {Number} discount
         * @param amount
         * @param {Number} taxRate
         * @param {Boolean} isNetPrice
         */
        getTotalPrice: function(sandbox, price, currency, discount, amount, taxRate, isNetPrice) {
            if (!validCalculationParams(sandbox, price, taxRate, discount, amount)) {
                return sandbox.translate(constants.invalidInputTranslation);
            }

            var total, locale;

            try {
                price = parseFloat(price);
                amount = parseFloat(amount);
                taxRate = getTaxRate(sandbox, taxRate);
                discount = getDiscount(sandbox, discount);
                currency = currency || defaults.currency;
                locale = sandbox.globalize.getLocale() || defaults.locale;

                // TODO test

            } catch (ex) {
                return sandbox.translate(constants.invalidInputTranslation);
            }

            if (!isNetPrice) {
                price = price - (price * taxRate);
            }

            total = price * amount;
            total = total - (total * discount);

            return this.getFormattedNumberWithAddition(sandbox, total, currency, appendCurrencyToPrice(locale));
        },

        /**
         * Sums up all prices to a total net price, calculates a total tax amount per tax class/rate
         * and returns the taxes, a total net and a total gross price
         * @param {Object} sandbox
         * @param {Object} items
         * [
         *  {
         *   price: 100,
         *   taxRate: 20,
         *   discount: 5
         *  }
         * ]
         *
         * @return {Object}
         */
        getTotalPricesAndTaxes: function(sandbox, items) {

            if (!!items) {
                try {
                    return processPriceCalculationItem.call(this, sandbox, items);
                } catch (ex) {
                    return null;
                }
            }

            return null;
        }
    };
});
