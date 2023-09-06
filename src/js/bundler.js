import { Bundler } from "@parcel/plugin";

/**
 * [#]: https://parceljs.org/plugin-system/bundler#relevant-api
 *
 * @see
 * [Bundler API]{@link [#]}
 */
export default new Bundler({
  async bundle({ graph }) {
    // ...
  },

  async optimize({ graph }) {
    // ...
  },
});
