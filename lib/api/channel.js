const ApiResource = require('./api_resource')
const PageableApiResource = require('./pageable_api_resource')
const qs = require('qs')

/**
 * @class Channel
 */
class Channel extends ApiResource {
  /**
   * Retrieves channel details.
   *
   * @param {Number}    channelId
   * @param {{}}        opts
   * @param {string}    opts.detail_level - Verbosity level. Possible value: "minimal". If set to "minimal",
   *                                        the result set is limited to id, title, picture, owner and locks data.
   *                                        If the channel is protected, only minimal data can be retrieved without
   *                                        valid access token.
   *
   * @returns {*}
   */
  get (channelId, opts = {}) {
    return new Promise((resolve, reject) => {
      this.context.authRequest('get', `/channels/${channelId}.json`, qs.stringify(opts)).then((res) => {
        resolve(res.channel)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  /**
   * Creates a new channel.
   *
   * @param {string}    title - Channel title
   * @param {{}}        opts
   * @param {string}    opts.description - Channel description
   *
   * @returns {*}
   */
  create (title, opts = {}) {
    opts.title = title
    return new Promise((resolve, reject) => {
      this.context.authRequest('post', '/users/self/channels.json', qs.stringify(opts)).then((res) => {
        resolve(res.channel)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  /**
   * Edits an existing channel.
   *
   * @param {Number}    channelId
   * @param {string}    title - Channel title
   * @param {{}}        opts
   * @param {string}    opts.description - Channel description.
   * @param {string}    opts.tags - Comma separated list of channel tags.
   *
   * @returns {Promise}
   */
  edit (channelId, title, opts = {}) {
    opts.title = title
    return this.context.authRequest('put', `/channels/${channelId}.json`, qs.stringify(opts))
  }

  /**
   * Deletes an existing channel.
   *
   * @param {Number} channelId
   *
   * @returns {Promise}
   */
  remove (channelId) {
    return this.context.authRequest('delete', `/channels/${channelId}.json`)
  }

  /**
   * Lists all channels on an account.
   *
   * @param {Number} pageSize - The number of results to show per page.
   * @param {Number} page     - The page to retrieve.
   * @returns {Promise}
   */
  list (pageSize = 100, page = 1) {
    return new Promise((resolve, reject) => {
      try {
        /**
         * @var {{channels, paging}} res
         */
        this.context.authRequest('get', `/users/self/channels.json?pagesize=${pageSize}&page=${page}`).then((res) => {
          resolve(new PageableApiResource(this.context, 'channels', res.channels, res.paging))
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * Returns the password protection status.
   *
   * @param {Number} channelId
   *
   * @returns {Promise}
   */
  getPasswordProtectionStatus (channelId) {
    return this.context.authRequest('get', `/channels/${channelId}/locks/password.json`)
  }

  /**
   * Sets the channel password and enables password protection as well.
   *
   * @param {Number} channelId
   * @param {string} password
   *
   * @returns {Promise}
   */
  enablePasswordProtection (channelId, password) {
    return this.context.authRequest('put', `/channels/${channelId}/locks/password.json`, qs.stringify({
      password: password
    }))
  }

  /**
   * Removes the channel password, disables password protection status.
   *
   * @param {Number} channelId
   *
   * @returns {Promise}
   */
  disablePasswordProtection (channelId) {
    return this.context.authRequest('delete', `/channels/${channelId}/locks/password.json`)
  }

  /**
   * Check if channel content may be embedded on public applications.
   *
   * By default all Ustream channels can be embedded anywhere across the internet. By restricting the embed URLs,
   * you can control the viewing experience and limit distribution to your own preferred partners. To enable
   * restricted embeds, see setEmbedLock().
   *
   * After enabling the embed restrictions, see addUrlToWhiteList() to allow specific domains to access your content.
   *
   * @link http://developers.Ustream.tv/broadcasting-api/channel.html#embed-restriction_9
   * @see addUrlToWhitelist
   * @see setEmbedLock
   *
   * @param {Number} channelId
   *
   * @returns {Promise}
   */
  getEmbedLockStatus (channelId) {
    return this.context.authRequest('get', `/channels/${channelId}/locks/embed.json`)
  }

  /**
   * Enables/disables embed restrictions.
   *
   * @param {Number}   channelId
   * @param {boolean}  isEmbedLocked - True to enable restricted embed access. False to disable restricted access.
   *
   * @returns {Promise}
   */
  setEmbedLock (channelId, isEmbedLocked) {
    return this.context.authRequest('put', `/channels/${channelId}/locks/embed.json`, qs.stringify({
      locked: isEmbedLocked
    }))
  }

  /**
   * Retrieves a list of domains white listed to embed a channel's content.
   *
   * @param {Number} channelId
   *
   * @returns {Promise}
   */
  getUrlWhitelist (channelId) {
    return this.context.authRequest('get', `/channels/${channelId}/locks/embed/allowed-urls.json`)
  }

  /**
   * Add a URL to a set of white listed so a channel's content may be embedded on that domain.
   *
   * Embed locking must be enabled on the channel for the whitelist to take affect.
   *
   * @see SetEmbedLock
   *
   * @param channelId
   * @param url
   *
   * @returns {Promise}
   */
  addUrlToWhitelist (channelId, url) {
    return this.context.authRequest('post', `/channels/${channelId}/locks/embed/allowed-urls.json`, qs.stringify({
      url: url
    }))
  }

  /**
   * Removes all white listed domains.
   *
   * @param channelId
   *
   * @returns {Promise}
   */
  emptyUrlWhiteList (channelId) {
    return this.context.authRequest('delete', `/channels/${channelId}/locks/embed/allowed-urls.json`)
  }

  /**
   * Enable/disable users' ability to share a channel's video content.
   *
   * @param {Number}   channelId
   * @param {boolean}  canShare
   *
   * @returns {Promise}
   */
  setSharingControl (channelId, canShare) {
    return this.context.authRequest('put', `/channels/${channelId}/settings/viewer.json`, qs.stringify({
      sharing: canShare
    }))
  }

  /**
   * Sets the channel's branding type.
   *
   * @param {string} channelId
   * @param {string} type
   *
   * @returns {Promise}
   */
  setBrandingType (channelId, type) {
    return this.context.authRequest('put', `/channels/${channelId}/branding.json`, qs.stringify({
      type: type
    }))
  }
}

module.exports = Channel
