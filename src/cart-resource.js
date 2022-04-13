import Resource from './resource';
import defaultResolver from "./default-resolver";
import handleCartMutation from "./handle-cart-mutation";

// GraphQL
import cartCreateMutation from './graphql/cartCreateMutation.graphql';
import cartLinesAddMutation from "./graphql/cartLinesAddMutation.graphql";
import cartLinesRemoveMutation from "./graphql/cartLinesRemoveMutation.graphql";
import cartLinesUpdateMutation from "./graphql/cartLinesUpdateMutation.graphql";
import cartAttributesUpdateMutation from "./graphql/cartAttributesUpdateMutation.graphql";
import cartNodeQuery from "./graphql/cartNodeQuery.graphql";

/**
 * The JS Buy SDK cart resource
 * @class
 */
class CartResource extends Resource {

  /**
   * Fetches a cart by ID.
   *
   * @example
   * client.cart.fetch('FlZj9rZXlN5MDY4ZDFiZTUyZTUwNTE2MDNhZjg=').then((cart) => {
   *   // Do something with the cart
   * });
   *
   * @param {String} id The id of the cart to fetch.
   * @return {Promise|GraphModel} A promise resolving with a `GraphModel` of the cart.
   */
  fetch(id) {
    return this.graphQLClient
      .send(cartNodeQuery, {id})
      .then(defaultResolver('cart'))
      .then((cart) => {
        if (!cart) { return null; }

        return this.graphQLClient.fetchAllPages(cart.lines, {pageSize: 250}).then((lineItems) => {
          cart.attrs.lineItems = lineItems;

          return cart;
        });
      });
  }

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
   *   // Do something with the newly created cart
   * });
   *
   * @param {Object} [input] An input object containing zero or more of:
   *   @param {Object[]} [input.attributes] A list of custom attributes for the cart. See the {@link https://shopify.dev/api/storefront/2022-04/input-objects/AttributeInput|Storefront API reference} for valid input fields.
   *   @param {Object[]} [input.buyerIdentity] The customer associated with the cart. See the {@link https://shopify.dev/api/storefront/2022-04/input-objects/CartBuyerIdentityInput|Storefront API reference} for valid input fields.
   *   @param {String} [input.discountCodes] The discount codes to apply to the cart.
   *   @param {Object[]} [input.lines] A list of line items in the cart. See the {@link https://shopify.dev/api/storefront/2022-04/input-objects/CartInput|Storefront API reference} for valid input fields for each line item.
   *   @param {String} [input.note] A note for the cart.
   * @return {Promise|GraphModel} A promise resolving with the created cart.
   */
  create(input = {}) {
    return this.graphQLClient
      .send(cartCreateMutation, {input})
      .then(handleCartMutation('cartCreate', this.graphQLClient));
  }

  /**
   * Adds line items to an existing cart.
   *
   * @example
   * const cartId = 'Z2lkOi8vc2hvcGlmeS9DaGVja291dC9kMTZmM2EzMDM4Yjc4N=';
   * const lineItems = [{variantId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yOTEwNjAyMjc5Mg==', quantity: 5}];
   *
   * client.cart.addLineItems(cartId, lineItems).then((cart) => {
   *   // Do something with the updated cart
   * });
   *
   * @param {String} cartId The ID of the cart to add line items to.
   * @param {Object[]} lineItems A list of line items to add to the cart. See the {@link https://shopify.dev/api/storefront/2022-01/input-objects/CartLineInput|Storefront API reference} for valid input fields for each line item.
   * @return {Promise|GraphModel} A promise resolving with the updated cart.
   */
  addLineItems(cartId, lineItems) {
    return this.graphQLClient
      .send(cartLinesAddMutation, {cartId, lines: lineItems})
      .then(handleCartMutation('cartLinesAdd', this.graphQLClient));
  }

  /**
   * Removes line items from an existing cart.
   *
   * @example
   * const cartId = 'Z2lkOi8vc2hvcGlmeS9DaGVja291dC9kMTZmM2EzMDM4Yjc4N=';
   * const lineItemIds = ['TViZGE5Y2U1ZDFhY2FiMmM2YT9rZXk9NTc2YjBhODcwNWIxYzg0YjE5ZjRmZGQ5NjczNGVkZGU='];
   *
   * client.cart.removeLineItems(cartId, lineItemIds).then((cart) => {
   *   // Do something with the updated cart
   * });
   *
   * @param {String} cartId The ID of the cart to remove line items from.
   * @param {String[]} lineIds A list of the ids of line items to remove from the cart.
   * @return {Promise|GraphModel} A promise resolving with the updated cart.
   */
  removeLineItems(cartId, lineIds) {
    return this.graphQLClient
      .send(cartLinesRemoveMutation, {cartId, lineIds})
      .then(handleCartMutation('cartLinesRemove', this.graphQLClient));
  }

  /**
   * Updates line items on an existing cart.
   *
   * @example
   * const cartId = 'Z2lkOi8vc2hvcGlmeS9DaGVja291dC9kMTZmM2EzMDM4Yjc4N=';
   * const lineItems = [
   *   {
   *     id: 'TViZGE5Y2U1ZDFhY2FiMmM2YT9rZXk9NTc2YjBhODcwNWIxYzg0YjE5ZjRmZGQ5NjczNGVkZGU=',
   *     quantity: 5,
   *     variantId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yOTEwNjAyMjc5Mg=='
   *   }
   * ];
   *
   * client.cart.updateLineItems(cartId, lineItems).then(cart => {
   *   // Do something with the updated cart
   * });
   *
   * @param {String} cartId The ID of the cart to update a line item on.
   * @param {Object[]} lineItems A list of line item information to update. See the {@link https://shopify.dev/api/storefront/2022-04/input-objects/CartLineUpdateInput|Storefront API reference} for valid input fields for each line item.
   * @return {Promise|GraphModel} A promise resolving with the updated cart.
   */
  updateLineItems(cartId, lineItems) {
    return this.graphQLClient
      .send(cartLinesUpdateMutation, {cartId, lines: lineItems})
      .then(handleCartMutation('cartLinesUpdate', this.graphQLClient));
  }

  /**
   * Updates the attributes on a cart
   *
   * @example
   * const cartId = 'Z2lkOi8vc2hvcGlmeS9DaGVja291dC9kMTZmM2EzMDM4Yjc4N=';
   * const input = [{key: "MyKey", value: "MyValue"}];
   *
   * client.cart.updateAttributes(cartId, input).then((cart) => {
   *   // Do something with the updated cart
   * });
   *
   * @param {String} cartId The ID of the cart to update.
   * @param {Object[]} [attributes] A list of custom attributes for the cart. See the {@link https://shopify.dev/api/storefront/2022-01/input-objects/AttributeInput|Storefront API reference} for valid input fields.
   * @return {Promise|GraphModel} A promise resolving with the updated cart.
   */
  updateAttributes(cartId, attributes = []) {
    return this.graphQLClient
      .send(cartAttributesUpdateMutation, {cartId, input})
      .then(handleCartMutation('cartAttributesUpdate', this.graphQLClient));
  }
}

export default CartResource;
