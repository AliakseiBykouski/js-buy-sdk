import Resource from './resource';
import defaultResolver from './default-resolver';
import handleCheckoutMutation from './handle-checkout-mutation';

// GraphQL
import cartCreateMutation from './graphql/cartCreateMutation.graphql';
import handleCartMutation from "./handle-cart-mutation";

/**
 * The JS Buy SDK checkout resource
 * @class
 */
class CartResource extends Resource {

  /**
   * Creates a cart.
   *
   * @example
   * const input = {
   *   lines: [
   *     {merchandiseId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yOTEwNjAyMjc5Mg==', quantity: 5}
   *   ]
   * };
   *
   * client.cart.create(input).then((cart) => {
   *   // Do something with the newly created checkout
   * });
   *
   * @param {Object} [input] An input object containing zero or more of:
   *   @param {Object[]} [input.attributes] A list of custom attributes for the cart. See the {@link https://shopify.dev/api/storefront/2022-04/input-objects/AttributeInput|Storefront API reference} for valid input fields.
   *   @param {Object[]} [input.buyerIdentity] The customer associated with the cart. See the {@link https://shopify.dev/api/storefront/2022-04/input-objects/CartBuyerIdentityInput|Storefront API reference} for valid input fields.
   *   @param {String} [input.discountCodes] The discount codes to apply to the cart.
   *   @param {Object[]} [input.lines] A list of line items in the cart. See the {@link https://shopify.dev/api/storefront/2022-04/input-objects/CartInput|Storefront API reference} for valid input fields for each line item.
   *   @param {String} [input.note] A note for the checkout.
   * @return {Promise|GraphModel} A promise resolving with the created checkout.
   */
  create(input = {}) {
    return this.graphQLClient
      .send(cartCreateMutation, {input})
      .then(handleCartMutation('cartCreate', this.graphQLClient));
  }
}

export default CartResource;
