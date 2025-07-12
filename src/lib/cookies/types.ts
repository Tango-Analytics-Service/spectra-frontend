export interface CookieOptions {
    /**
     * domain in example.com format
     * The host to which the cookie will be sent. If not specified, this
     * defaults to the host portion of the current document location and the
     * cookie is not available on subdomains. If a domain is specified,
     * subdomains are always included. Contrary to earlier specifications,
     * leading dots in domain names are ignored, but browsers may decline to
     * set the cookie containing such dots.
     */
    domain?: string | undefined;
    /**
     * date in UTCString format
     * The expiry date of the cookie. If neither expires nor max-age is
     * specified, it will expire at the end of session.
     * See Date.toUTCString() for help formatting this value.
     */
    expires?: string | undefined;
    /**
     * max age in seconds
     * The maximum age of the cookie in seconds (e.g., 60*60*24*365 or 31536000 for a year).
     */
    "max-age"?: string | undefined;
    /**
     * ndicates that the cookie should be stored using partitioned storage.
     * See Cookies Having Independent Partitioned State (CHIPS)
     * <https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Privacy_sandbox/Partitioned_cookies>
     * for more details.
     */
    partitioned?: boolean | undefined;
    /**
     * The value of the cookie's Path attribute (See Define where cookies are sent for more information).
     * <https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_where_cookies_are_sent>
     */
    path?: string | undefined;
    /**
     * The SameSite attribute of a Set-Cookie header can be set by a server to
     * specify when the cookie will be sent. Possible values are lax, strict
     * or none (see also Controlling third-party cookies with SameSite).
     *
     * The lax value will send the cookie for all same-site requests and
     * top-level navigation GET requests. This is sufficient for user tracking,
     * but it will prevent many Cross-Site Request Forgery (CSRF) attacks.
     * This is the default value in modern browsers.
     *
     * The strict value will prevent the cookie from being sent
     * by the browser to the target site in all cross-site browsing contexts,
     * even when following a regular link.
     *
     * The none value explicitly states no restrictions will be applied.
     * The cookie will be sent in all requests—both cross-site and same-site.
     */
    samesite?: "lax" | "strict" | "none" | undefined;
    /**
     * Specifies that the cookie should only be transmitted over a secure protocol.
     */
    secure?: boolean | undefined;
}
