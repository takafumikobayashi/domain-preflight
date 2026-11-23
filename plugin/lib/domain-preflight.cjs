#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/tldts/dist/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/tldts/dist/cjs/index.js"(exports2) {
    "use strict";
    function shareSameDomainSuffix(hostname, vhost) {
      if (hostname.endsWith(vhost)) {
        return hostname.length === vhost.length || hostname[hostname.length - vhost.length - 1] === ".";
      }
      return false;
    }
    function extractDomainWithSuffix(hostname, publicSuffix) {
      const publicSuffixIndex = hostname.length - publicSuffix.length - 2;
      const lastDotBeforeSuffixIndex = hostname.lastIndexOf(".", publicSuffixIndex);
      if (lastDotBeforeSuffixIndex === -1) {
        return hostname;
      }
      return hostname.slice(lastDotBeforeSuffixIndex + 1);
    }
    function getDomain$1(suffix, hostname, options) {
      if (options.validHosts !== null) {
        const validHosts = options.validHosts;
        for (const vhost of validHosts) {
          if (
            /*@__INLINE__*/
            shareSameDomainSuffix(hostname, vhost)
          ) {
            return vhost;
          }
        }
      }
      let numberOfLeadingDots = 0;
      if (hostname.startsWith(".")) {
        while (numberOfLeadingDots < hostname.length && hostname[numberOfLeadingDots] === ".") {
          numberOfLeadingDots += 1;
        }
      }
      if (suffix.length === hostname.length - numberOfLeadingDots) {
        return null;
      }
      return (
        /*@__INLINE__*/
        extractDomainWithSuffix(hostname, suffix)
      );
    }
    function getDomainWithoutSuffix$1(domain, suffix) {
      return domain.slice(0, -suffix.length - 1);
    }
    var CONTROL_CHARS = /[\t\n\r]/g;
    var extractedHostnameValidated = false;
    function isValidHostnameChar(code) {
      return code >= 97 && code <= 122 || // a-z
      code >= 48 && code <= 57 || // 0-9
      code > 127 || // non-ASCII (accepted, not punycode-checked)
      code >= 65 && code <= 90 || // A-Z (becomes valid once lowercased)
      code === 45 || // '-'
      code === 95;
    }
    function getSpecialScheme(url, schemeStart, colonIndex) {
      const length = colonIndex - schemeStart;
      const c0 = url.charCodeAt(schemeStart) | 32;
      if (length === 2) {
        return c0 === 119 && (url.charCodeAt(schemeStart + 1) | 32) === 115 ? 1 : 0;
      } else if (length === 3) {
        const c1 = url.charCodeAt(schemeStart + 1) | 32;
        const c2 = url.charCodeAt(schemeStart + 2) | 32;
        if (c0 === 119 && c1 === 115 && c2 === 115)
          return 1;
        if (c0 === 102 && c1 === 116 && c2 === 112)
          return 1;
        return 0;
      } else if (length === 4) {
        const c1 = url.charCodeAt(schemeStart + 1) | 32;
        const c2 = url.charCodeAt(schemeStart + 2) | 32;
        const c3 = url.charCodeAt(schemeStart + 3) | 32;
        if (c0 === 104 && c1 === 116 && c2 === 116 && c3 === 112)
          return 1;
        if (c0 === 102 && c1 === 105 && c2 === 108 && c3 === 101)
          return 2;
        return 0;
      } else if (length === 5) {
        return c0 === 104 && (url.charCodeAt(schemeStart + 1) | 32) === 116 && (url.charCodeAt(schemeStart + 2) | 32) === 116 && (url.charCodeAt(schemeStart + 3) | 32) === 112 && (url.charCodeAt(schemeStart + 4) | 32) === 115 ? 1 : 0;
      }
      return 0;
    }
    function extractHostname(url, urlIsValidHostname, validate = false) {
      let start = 0;
      let end = url.length;
      let hasUpper = false;
      let isSpecial = true;
      extractedHostnameValidated = false;
      if (!urlIsValidHostname) {
        while (start < url.length && url.charCodeAt(start) <= 32) {
          start += 1;
        }
        if (url.charCodeAt(start + 4) === 58 && (url.charCodeAt(start) | 32) === 100 && (url.charCodeAt(start + 1) | 32) === 97 && (url.charCodeAt(start + 2) | 32) === 116 && (url.charCodeAt(start + 3) | 32) === 97 || url.charCodeAt(start + 10) === 58 && (url.charCodeAt(start) | 32) === 106 && (url.charCodeAt(start + 1) | 32) === 97 && (url.charCodeAt(start + 2) | 32) === 118 && (url.charCodeAt(start + 3) | 32) === 97 && (url.charCodeAt(start + 4) | 32) === 115 && (url.charCodeAt(start + 5) | 32) === 99 && (url.charCodeAt(start + 6) | 32) === 114 && (url.charCodeAt(start + 7) | 32) === 105 && (url.charCodeAt(start + 8) | 32) === 112 && (url.charCodeAt(start + 9) | 32) === 116) {
          return null;
        }
        while (end > start + 1 && url.charCodeAt(end - 1) <= 32) {
          end -= 1;
        }
        if ((url.charCodeAt(start) === 47 || url.charCodeAt(start) === 92) && (url.charCodeAt(start + 1) === 47 || url.charCodeAt(start + 1) === 92)) {
          start += 2;
        } else {
          let indexOfProtocol = url.indexOf(":/", start);
          if (indexOfProtocol !== -1) {
            const special = getSpecialScheme(url, start, indexOfProtocol);
            if (special === 1) {
              start = indexOfProtocol + 2;
              while (url.charCodeAt(start) === 47 || url.charCodeAt(start) === 92) {
                start += 1;
              }
            } else if (special === 2) {
              start = indexOfProtocol + 1;
              let slashes = 0;
              while ((url.charCodeAt(start) === 47 || url.charCodeAt(start) === 92) && slashes < 2) {
                start += 1;
                slashes += 1;
              }
              if (slashes < 2) {
                return null;
              }
            } else {
              for (let i = start; i < indexOfProtocol; i += 1) {
                const code = url.charCodeAt(i);
                if (!((code | 32) >= 97 && (code | 32) <= 122 || // [a-zA-Z] (fold letters only)
                code >= 48 && code <= 57 || // [0, 9]
                code === 46 || // '.'
                code === 45 || // '-'
                code === 43)) {
                  if (code === 9 || code === 10 || code === 13) {
                    return extractHostname(url.replace(CONTROL_CHARS, ""), urlIsValidHostname, validate);
                  }
                  for (let j = i; j < indexOfProtocol; j += 1) {
                    const c = url.charCodeAt(j);
                    if (c === 47 || c === 92 || c === 63 || c === 35) {
                      indexOfProtocol = -1;
                      break;
                    }
                  }
                  if (indexOfProtocol !== -1) {
                    return null;
                  }
                  break;
                }
              }
              if (indexOfProtocol !== -1) {
                if (url.charCodeAt(indexOfProtocol + 2) === 47) {
                  isSpecial = false;
                  start = indexOfProtocol + 3;
                } else {
                  return null;
                }
              }
            }
          }
          if (indexOfProtocol === -1 && url.charCodeAt(start) !== 91) {
            let indexOfColon = -1;
            for (let i = start; i < end; i += 1) {
              const code = url.charCodeAt(i);
              if (code === 9 || code === 10 || code === 13) {
                return extractHostname(url.replace(CONTROL_CHARS, ""), urlIsValidHostname, validate);
              }
              if (code === 58) {
                indexOfColon = i;
                break;
              }
              if (code === 47 || code === 92 || code === 63 || code === 35) {
                break;
              }
            }
            if (indexOfColon !== -1) {
              let hasIdentifier = false;
              for (let i = indexOfColon + 1; i < end; i += 1) {
                const code = url.charCodeAt(i);
                if (code === 47 || code === 92 || code === 63 || code === 35) {
                  break;
                }
                if (code === 64) {
                  hasIdentifier = true;
                  break;
                }
              }
              if (!hasIdentifier) {
                let allDigits = true;
                let i = indexOfColon + 1;
                for (; i < end; i += 1) {
                  const code = url.charCodeAt(i);
                  if (code === 47 || code === 92 || code === 63 || code === 35) {
                    break;
                  }
                  if (code < 48 || code > 57) {
                    allDigits = false;
                    break;
                  }
                }
                if (i === indexOfColon + 1) {
                  allDigits = false;
                }
                if (!allDigits) {
                  const special = getSpecialScheme(url, start, indexOfColon);
                  if (special === 0) {
                    let isBareIpv6 = false;
                    for (let j = indexOfColon + 1; j < end; j += 1) {
                      const code = url.charCodeAt(j);
                      if (code === 47 || code === 92 || code === 63 || code === 35) {
                        break;
                      }
                      if (code === 58) {
                        isBareIpv6 = true;
                        break;
                      }
                    }
                    if (!isBareIpv6) {
                      return null;
                    }
                  } else {
                    start = indexOfColon + 1;
                    if (special === 2) {
                      let slashes = 0;
                      while ((url.charCodeAt(start) === 47 || url.charCodeAt(start) === 92) && slashes < 2) {
                        start += 1;
                        slashes += 1;
                      }
                      if (slashes < 2) {
                        return null;
                      }
                    } else {
                      while (url.charCodeAt(start) === 47 || url.charCodeAt(start) === 92) {
                        start += 1;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        let indexOfIdentifier = -1;
        let indexOfClosingBracket = -1;
        let indexOfPort = -1;
        let indexOfFirstColon = -1;
        let hasControl = false;
        let vValid = validate;
        let vLastDot = start - 1;
        let vLastCode = -1;
        if (validate && start < end) {
          const c0 = url.charCodeAt(start);
          if (
            // Keep these parens: they scope /*@__INLINE__*/ for terser.
            // prettier-ignore
            !/*@__INLINE__*/
            (isValidHostnameChar(c0) || c0 === 46 || c0 === 95) || c0 === 45
          ) {
            vValid = false;
          }
        }
        for (let i = start; i < end; i += 1) {
          const code = url.charCodeAt(i);
          if (code < 64) {
            if (code === 47 || code === 35 || code === 63) {
              end = i;
              break;
            } else if (code === 58) {
              if (indexOfFirstColon === -1) {
                indexOfFirstColon = i;
              }
              indexOfPort = i;
            } else if (code === 9 || code === 10 || code === 13) {
              hasControl = true;
            } else if (validate) {
              if (code === 46) {
                if (i - vLastDot > 64 || vLastCode === 46 || vLastCode === 45) {
                  vValid = false;
                }
                vLastDot = i;
              } else if (code < 48 || code > 57) {
                if (code !== 45 || vLastCode === 46) {
                  vValid = false;
                }
              }
            }
          } else if (isSpecial && code === 92) {
            end = i;
            break;
          } else if (code === 64) {
            indexOfIdentifier = i;
            indexOfFirstColon = -1;
          } else if (code === 93) {
            indexOfClosingBracket = i;
          } else if (code >= 65 && code <= 90) {
            hasUpper = true;
          } else if (validate && !/*@__INLINE__*/
          isValidHostnameChar(code)) {
            vValid = false;
          }
          if (validate) {
            vLastCode = code;
          }
        }
        if (hasControl) {
          return extractHostname(url.replace(CONTROL_CHARS, ""), urlIsValidHostname, validate);
        }
        if (indexOfIdentifier !== -1 && indexOfIdentifier >= start && indexOfIdentifier < end) {
          start = indexOfIdentifier + 1;
        }
        if (url.charCodeAt(start) === 91) {
          if (indexOfClosingBracket !== -1) {
            return url.slice(start + 1, indexOfClosingBracket).toLowerCase();
          }
          return null;
        } else if (indexOfPort !== -1 && indexOfPort > start && indexOfPort < end && // A host:port has exactly one ':' in the host (so its first ':' is its
        // last); a bare, unbracketed IPv6 literal ("2a01:e35::1") has >= 2, so
        // its first ':' precedes the last. Only the former has a ':port' to trim.
        indexOfFirstColon === indexOfPort) {
          end = indexOfPort;
        }
        if (start >= end) {
          return null;
        }
        if (validate && vValid && indexOfIdentifier === -1 && indexOfPort === -1 && indexOfClosingBracket === -1 && url.charCodeAt(end - 1) !== 46 && end - start <= 255 && // total length
        end - vLastDot - 1 <= 63 && // last label length
        vLastCode !== 45) {
          extractedHostnameValidated = true;
        }
      }
      while (end > start + 1 && url.charCodeAt(end - 1) === 46) {
        end -= 1;
      }
      const hostname = start !== 0 || end !== url.length ? url.slice(start, end) : url;
      if (hasUpper) {
        return hostname.toLowerCase();
      }
      return hostname;
    }
    function isProbablyIpv4(hostname) {
      if (hostname.length < 7) {
        return false;
      }
      if (hostname.length > 15) {
        return false;
      }
      let numberOfDots = 0;
      for (let i = 0; i < hostname.length; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46) {
          numberOfDots += 1;
        } else if (code < 48 || code > 57) {
          return false;
        }
      }
      return numberOfDots === 3 && hostname.charCodeAt(0) !== 46 && hostname.charCodeAt(hostname.length - 1) !== 46;
    }
    function isProbablyIpv6(hostname) {
      if (hostname.length < 3) {
        return hostname === "::";
      }
      let start = hostname.startsWith("[") ? 1 : 0;
      let end = hostname.length;
      if (hostname[end - 1] === "]") {
        end -= 1;
      }
      if (end - start > 39) {
        return false;
      }
      let hasColon = false;
      for (; start < end; start += 1) {
        const code = hostname.charCodeAt(start);
        if (code === 58) {
          hasColon = true;
        } else if (!(code >= 48 && code <= 57 || // 0-9
        code >= 97 && code <= 102 || // a-f
        code >= 65 && code <= 70)) {
          return false;
        }
      }
      return hasColon;
    }
    function isIp(hostname) {
      return isProbablyIpv6(hostname) || isProbablyIpv4(hostname);
    }
    var SPECIAL_USE_DOMAINS = [
      "test",
      // RFC 6761
      "localhost",
      // RFC 6761
      "invalid",
      // RFC 6761
      "example",
      // RFC 6761
      "example.com",
      // RFC 6761
      "example.net",
      // RFC 6761
      "example.org",
      // RFC 6761
      "local",
      // RFC 6762 (mDNS)
      "onion",
      // RFC 7686 (Tor)
      "alt",
      // RFC 9476
      "home.arpa",
      // RFC 8375
      "ipv4only.arpa",
      // RFC 8880
      "resolver.arpa",
      // RFC 9462
      "service.arpa",
      // RFC 9665
      "6tisch.arpa",
      // RFC 9031
      "eap.arpa"
      // RFC 9965
    ];
    function isSpecialUse(hostname) {
      for (const name of SPECIAL_USE_DOMAINS) {
        if (hostname.endsWith(name) && (hostname.length === name.length || hostname.charCodeAt(hostname.length - name.length - 1) === 46)) {
          return true;
        }
      }
      return false;
    }
    function isValidAscii(code) {
      return code >= 97 && code <= 122 || code >= 48 && code <= 57 || code > 127;
    }
    function isValidHostname(hostname) {
      if (hostname.length > 255) {
        return false;
      }
      if (hostname.length === 0) {
        return false;
      }
      if (
        /*@__INLINE__*/
        !isValidAscii(hostname.charCodeAt(0)) && hostname.charCodeAt(0) !== 46 && // '.' (dot)
        hostname.charCodeAt(0) !== 95
      ) {
        return false;
      }
      let lastDotIndex = -1;
      let lastCharCode = -1;
      const len = hostname.length;
      for (let i = 0; i < len; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46) {
          if (
            // Check that previous label is < 63 bytes long (64 = 63 + '.')
            i - lastDotIndex > 64 || // Check that previous character was not already a '.'
            lastCharCode === 46 || // Check that the previous label does not end with '-' (RFC 1035 §2.3.1 LDH).
            // '_' is intentionally NOT restricted: DNS allows any octet (RFC 2181 §11) and
            // WHATWG URL does not treat '_' as a forbidden host code point.
            lastCharCode === 45
          ) {
            return false;
          }
          lastDotIndex = i;
        } else if (
          // A forbidden character in the label...
          // Keep these parens: they scope /*@__INLINE__*/ for terser.
          // prettier-ignore
          !/*@__INLINE__*/
          (isValidAscii(code) || code === 45 || code === 95) || // ...or a '-' starting a label (the byte right after a '.'). A label must
          // not begin with a hyphen (RFC 1034 §3.5 / RFC 1035 §2.3.1 LDH, as amended
          // by RFC 1123 §2.1; cf. UTS #46 CheckHyphens). The first label is covered by
          // the leading-character guard above; mirrors the trailing-'-' rule below.
          code === 45 && lastCharCode === 46
        ) {
          return false;
        }
        lastCharCode = code;
      }
      return (
        // Check that last label is shorter than 63 chars
        len - lastDotIndex - 1 <= 63 && // Check that the last character is an allowed trailing label character.
        // Since we already checked that the char is a valid hostname character,
        // we only need to check that it's different from '-'.
        lastCharCode !== 45
      );
    }
    function setDefaultsImpl({ allowIcannDomains = true, allowPrivateDomains = false, detectIp = true, detectSpecialUse = false, extractHostname: extractHostname2 = true, mixedInputs = true, validHosts = null, validateHostname = true }) {
      return {
        allowIcannDomains,
        allowPrivateDomains,
        detectIp,
        detectSpecialUse,
        extractHostname: extractHostname2,
        mixedInputs,
        validHosts,
        validateHostname
      };
    }
    var DEFAULT_OPTIONS = (
      /*@__INLINE__*/
      setDefaultsImpl({})
    );
    function setDefaults(options) {
      if (options === void 0) {
        return DEFAULT_OPTIONS;
      }
      return (
        /*@__INLINE__*/
        setDefaultsImpl(options)
      );
    }
    function getSubdomain$1(hostname, domain) {
      if (domain.length === hostname.length) {
        return "";
      }
      return hostname.slice(0, -domain.length - 1);
    }
    function getEmptyResult() {
      return {
        domain: null,
        domainWithoutSuffix: null,
        hostname: null,
        isIcann: null,
        isIp: null,
        isPrivate: null,
        isSpecialUse: null,
        publicSuffix: null,
        subdomain: null
      };
    }
    function resetResult(result2) {
      result2.domain = null;
      result2.domainWithoutSuffix = null;
      result2.hostname = null;
      result2.isIcann = null;
      result2.isIp = null;
      result2.isPrivate = null;
      result2.isSpecialUse = null;
      result2.publicSuffix = null;
      result2.subdomain = null;
    }
    function parseImpl(url, step, suffixLookup2, partialOptions, result2) {
      const options = (
        /*@__INLINE__*/
        setDefaults(partialOptions)
      );
      if (typeof url !== "string") {
        return result2;
      }
      let urlIsValid = false;
      if (!options.extractHostname) {
        result2.hostname = url;
      } else if (options.mixedInputs) {
        urlIsValid = isValidHostname(url);
        result2.hostname = extractHostname(url, urlIsValid, options.validateHostname);
      } else {
        result2.hostname = extractHostname(url, false, options.validateHostname);
      }
      if (options.detectIp && result2.hostname !== null) {
        result2.isIp = isIp(result2.hostname);
        if (result2.isIp) {
          return result2;
        }
      }
      if (options.validateHostname && options.extractHostname && result2.hostname !== null && // Skip the re-scan when `url` was already validated and extractHostname
      // returned it unchanged (same reference => identical string, still valid).
      !(urlIsValid && result2.hostname === url) && // Skip the re-scan when extractHostname already validated the host inline
      // (a confirmed-valid simple authority — see extract-hostname.ts).
      !extractedHostnameValidated && !isValidHostname(result2.hostname)) {
        result2.hostname = null;
        return result2;
      }
      if (step === 0 || result2.hostname === null) {
        return result2;
      }
      if (step === 5 && options.detectSpecialUse) {
        result2.isSpecialUse = isSpecialUse(result2.hostname);
      }
      suffixLookup2(result2.hostname, options, result2);
      if (step === 2 || result2.publicSuffix === null) {
        return result2;
      }
      result2.domain = getDomain$1(result2.publicSuffix, result2.hostname, options);
      if (step === 3 || result2.domain === null) {
        return result2;
      }
      result2.subdomain = getSubdomain$1(result2.hostname, result2.domain);
      if (step === 4) {
        return result2;
      }
      result2.domainWithoutSuffix = getDomainWithoutSuffix$1(result2.domain, result2.publicSuffix);
      return result2;
    }
    function fastPathLookup(hostname, options, out) {
      if (!options.allowPrivateDomains && options.allowIcannDomains && hostname.length > 3) {
        const last = hostname.length - 1;
        const c3 = hostname.charCodeAt(last);
        const c2 = hostname.charCodeAt(last - 1);
        const c1 = hostname.charCodeAt(last - 2);
        const c0 = hostname.charCodeAt(last - 3);
        if (c3 === 109 && c2 === 111 && c1 === 99 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = "com";
          return true;
        } else if (c3 === 103 && c2 === 114 && c1 === 111 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = "org";
          return true;
        } else if (c3 === 117 && c2 === 100 && c1 === 101 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = "edu";
          return true;
        } else if (c3 === 118 && c2 === 111 && c1 === 103 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = "gov";
          return true;
        } else if (c3 === 116 && c2 === 101 && c1 === 110 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = "net";
          return true;
        } else if (c3 === 101 && c2 === 100 && c1 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = "de";
          return true;
        }
      }
      return false;
    }
    var nodeFlags = /* @__PURE__ */ new Uint8Array([1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 0, 2, 2, 2, 2, 0, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 0, 2, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 2, 0, 0, 0, 1, 1, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 2, 2, 0, 0, 0, 2, 0, 1, 1, 0, 2, 0, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 2, 2, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 2, 2, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]);
    var edgeStart = /* @__PURE__ */ new Uint16Array([0, 0, 0, 10, 11, 18, 106, 111, 117, 124, 130, 136, 145, 146, 147, 148, 149, 150, 151, 153, 154, 156, 157, 158, 160, 162, 234, 247, 249, 250, 251, 266, 273, 274, 277, 278, 279, 282, 284, 303, 304, 306, 315, 320, 337, 338, 341, 342, 344, 346, 382, 383, 385, 388, 389, 393, 395, 399, 402, 434, 437, 450, 451, 459, 460, 462, 472, 486, 487, 488, 489, 498, 499, 536, 541, 557, 577, 583, 625, 627, 628, 629, 656, 683, 684, 832, 838, 841, 842, 843, 848, 853, 862, 884, 885, 886, 887, 888, 889, 890, 908, 910, 911, 914, 916, 917, 919, 921, 936, 951, 956, 957, 959, 960, 961, 962, 963, 965, 968, 973, 974, 975, 977, 978, 981, 984, 985, 986, 999, 1001, 1013, 1024, 1032, 1034, 1074, 1077, 1081, 1082, 1084, 1087, 1098, 1100, 1110, 1112, 1118, 1120, 1121, 1123, 1126, 1127, 1128, 1181, 1183, 1185, 1205, 1206, 1207, 1208, 1210, 1221, 1252, 1263, 1264, 1277, 1287, 1296, 1304, 1305, 1310, 1324, 1335, 1347, 1359, 1373, 1374, 1385, 1419, 1420, 1421, 1437, 1453, 1465, 1538, 1539, 1541, 1542, 1578, 1597, 1598, 1599, 1600, 1601, 1604, 1608, 1611, 1613, 1647, 1648, 1656, 1657, 1658, 1659, 1660, 1661, 1663, 1665, 1667, 1668, 1672, 1673, 1674, 1676, 1678, 1679, 1681, 1682, 1683, 1694, 1696, 1697, 1701, 1702, 1705, 1712, 1713, 1718, 1722, 1723, 1725, 1726, 1727, 1728, 1729, 1730, 1731, 1732, 1733, 1734, 1735, 1736, 1737, 1738, 1740, 1741, 1742, 2202, 2205, 2206, 2208, 2215, 2222, 2232, 2236, 2247, 2248, 2249, 2261, 2262, 2264, 2266, 2267, 2274, 2275, 2277, 2278, 2280, 2281, 2282, 2283, 2284, 2359, 2361, 2382, 2383, 2384, 2386, 2388, 2389, 2442, 2443, 2445, 2452, 2458, 2468, 2478, 2531, 2532, 2533, 2543, 2557, 2558, 2561, 2568, 2569, 2577, 2579, 2580, 2581, 2582, 2593, 2594, 2595, 2597, 2598, 2599, 2608, 2620, 2626, 2658, 2662, 2664, 2665, 2667, 2668, 2679, 2680, 2682, 2690, 2697, 2703, 2708, 2709, 2715, 2718, 2724, 2731, 2732, 2739, 2747, 2748, 2749, 2787, 2793, 2808, 2809, 2814, 2832, 2863, 2881, 2883, 2886, 2894, 2896, 2903, 2955, 2979, 2980, 2981, 2982, 2983, 2984, 2985, 2992, 2993, 2994, 2995, 2996, 2997, 2999, 3e3, 3004, 3084, 3097, 3098, 3535, 3539, 3553, 3605, 3633, 3655, 3713, 3735, 3750, 3813, 3864, 3902, 3938, 3963, 4105, 4151, 4202, 4221, 4255, 4270, 4290, 4320, 4351, 4374, 4405, 4435, 4467, 4494, 4569, 4591, 4629, 4639, 4673, 4692, 4718, 4760, 4810, 4836, 4905, 4906, 4908, 4931, 4954, 4990, 5021, 5038, 5095, 5108, 5132, 5161, 5163, 5197, 5213, 5241, 5546, 5555, 5564, 5571, 5588, 5592, 5598, 5637, 5639, 5646, 5653, 5662, 5669, 5670, 5671, 5683, 5686, 5701, 5702, 5711, 5712, 5721, 5730, 5736, 5738, 5739, 5740, 5777, 5778, 5780, 5788, 5795, 5808, 5812, 5814, 5815, 5821, 5828, 5842, 5852, 5857, 5865, 5873, 5879, 5880, 5884, 5886, 5887, 5899, 5971, 5972, 5973, 5974, 5976, 5977, 5980, 5982, 5985, 5989, 5990, 5991, 5997, 5998, 5999, 6001, 6003, 6005, 6006, 6007, 6010, 6012, 6015, 6016, 6018, 6216, 6223, 6224, 6225, 6235, 6240, 6257, 6271, 6280, 6281, 6282, 6286, 6287, 6289, 6291, 6297, 6298, 6301, 6302, 6304, 6305, 6306, 7206, 7209, 7213, 7231, 7240, 7243, 7250, 7251, 7253, 7254, 7255, 7257, 7309, 7310, 7313, 7314, 7431, 7432, 7443, 7457, 7464, 7467, 7476, 7477, 7478, 7493, 7548, 7740, 7742, 7744, 7745, 7747, 7752, 7765, 7780, 7787, 7796, 7799, 7802, 7809, 7817, 7821, 7822, 7823, 7837, 7841, 7850, 7851, 7852, 7856, 7891, 7892, 7912, 7919, 7927, 7928, 7933, 7941, 7985, 7986, 7992, 7995, 8007, 8012, 8013, 8015, 8017, 8053, 8054, 8060, 8067, 8068, 8078, 8087, 8102, 8106, 8108, 8160, 8161, 8166, 8167, 8170, 8172, 8173, 8174, 8183, 8197, 8205, 8219, 8230, 8231, 8233, 8235, 8257, 8268, 8274, 8275, 8287, 8299, 8386, 8398, 8406, 8409, 8415, 8440, 8443, 8444, 8445, 8446, 8448, 8451, 8454, 8465, 8467, 8469, 8497, 8572, 8579, 8583, 8584, 8593, 8615, 8616, 8621, 8622, 8704, 8706, 8708, 8717, 8721, 8727, 8733, 8739, 8749, 8754, 8755, 8773, 8784, 8789, 8794, 8804, 8810, 8814, 8820, 8826, 10433, 10434, 10435, 10442, 10444]);
    var edgeLength = /* @__PURE__ */ new Uint8Array([3, 3, 3, 3, 3, 3, 3, 3, 5, 8, 8, 2, 2, 3, 3, 3, 3, 3, 8, 5, 5, 5, 5, 5, 3, 3, 5, 5, 9, 12, 19, 8, 19, 8, 11, 9, 9, 8, 7, 7, 6, 8, 9, 16, 10, 7, 7, 11, 8, 6, 6, 9, 7, 11, 7, 14, 4, 4, 4, 4, 4, 4, 10, 7, 6, 6, 6, 6, 10, 10, 6, 10, 10, 22, 11, 9, 10, 10, 10, 9, 10, 8, 7, 7, 7, 8, 21, 13, 11, 11, 9, 10, 9, 13, 10, 8, 8, 9, 12, 9, 7, 10, 7, 7, 13, 7, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 6, 3, 3, 3, 3, 3, 3, 2, 5, 3, 3, 3, 7, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 7, 8, 5, 2, 2, 7, 4, 5, 7, 2, 2, 1, 4, 1, 11, 9, 9, 5, 5, 8, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 5, 11, 9, 9, 8, 9, 9, 13, 7, 14, 7, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 10, 7, 11, 9, 4, 4, 4, 4, 4, 6, 6, 6, 6, 13, 6, 8, 7, 10, 9, 9, 7, 9, 8, 9, 8, 7, 10, 6, 9, 8, 10, 10, 7, 8, 1, 9, 10, 12, 12, 12, 10, 9, 9, 10, 10, 9, 9, 1, 1, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 4, 3, 3, 3, 7, 4, 4, 4, 3, 3, 6, 7, 3, 4, 1, 2, 2, 2, 6, 1, 2, 2, 2, 2, 2, 12, 5, 3, 8, 9, 13, 4, 4, 13, 9, 9, 11, 7, 3, 12, 9, 2, 2, 2, 3, 3, 3, 3, 3, 8, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 7, 10, 15, 15, 7, 15, 20, 15, 9, 10, 10, 12, 14, 14, 14, 12, 12, 12, 12, 12, 14, 14, 10, 10, 10, 10, 14, 9, 9, 9, 9, 10, 14, 14, 14, 13, 13, 14, 9, 9, 9, 9, 9, 9, 7, 8, 6, 8, 8, 6, 8, 13, 8, 8, 6, 13, 8, 11, 13, 8, 6, 13, 8, 6, 9, 10, 10, 12, 14, 14, 14, 12, 12, 12, 12, 14, 14, 10, 10, 10, 10, 9, 9, 9, 10, 14, 14, 11, 13, 13, 9, 9, 9, 9, 9, 9, 2, 6, 9, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 2, 3, 3, 3, 3, 3, 3, 7, 7, 2, 3, 2, 2, 5, 3, 3, 3, 3, 3, 3, 4, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 5, 7, 4, 2, 2, 12, 8, 10, 8, 10, 7, 18, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 2, 2, 3, 3, 3, 5, 5, 3, 8, 8, 6, 8, 6, 6, 4, 6, 7, 7, 7, 10, 11, 2, 5, 5, 3, 3, 3, 3, 3, 3, 5, 5, 6, 11, 10, 7, 7, 7, 4, 4, 4, 2, 3, 3, 3, 3, 3, 2, 2, 7, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 7, 7, 7, 11, 7, 6, 9, 6, 6, 8, 10, 8, 6, 8, 13, 4, 4, 4, 4, 4, 10, 8, 11, 8, 8, 8, 10, 10, 7, 5, 4, 4, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 7, 10, 13, 7, 8, 7, 11, 8, 8, 6, 9, 8, 8, 6, 6, 6, 8, 8, 6, 6, 6, 6, 6, 9, 7, 6, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 9, 7, 8, 10, 8, 8, 2, 3, 3, 3, 3, 3, 2, 8, 9, 9, 2, 2, 2, 3, 3, 3, 2, 3, 3, 3, 9, 2, 2, 3, 3, 3, 3, 3, 3, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 12, 5, 5, 3, 5, 4, 2, 3, 2, 4, 3, 9, 2, 2, 2, 2, 2, 5, 5, 3, 8, 8, 13, 6, 10, 9, 4, 7, 9, 11, 2, 3, 7, 3, 3, 4, 1, 3, 4, 2, 9, 3, 3, 12, 5, 3, 7, 10, 10, 7, 4, 4, 6, 14, 7, 9, 7, 13, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 8, 15, 4, 4, 2, 3, 3, 3, 7, 4, 9, 9, 2, 3, 3, 3, 5, 3, 2, 2, 7, 2, 7, 6, 6, 7, 2, 4, 2, 2, 2, 2, 2, 2, 8, 8, 8, 9, 5, 2, 3, 3, 3, 3, 3, 3, 10, 7, 4, 4, 4, 4, 3, 4, 2, 3, 3, 3, 3, 3, 10, 7, 4, 4, 4, 4, 2, 3, 3, 3, 3, 10, 7, 4, 4, 4, 4, 3, 9, 6, 6, 6, 9, 13, 9, 2, 2, 2, 8, 7, 9, 5, 3, 3, 3, 5, 5, 13, 12, 9, 10, 7, 8, 7, 6, 8, 6, 11, 12, 7, 10, 4, 4, 7, 8, 11, 6, 7, 9, 8, 7, 10, 8, 9, 15, 7, 8, 5, 4, 7, 2, 3, 3, 3, 2, 14, 10, 2, 14, 10, 2, 14, 3, 9, 13, 13, 10, 14, 16, 17, 11, 2, 14, 2, 14, 3, 9, 13, 10, 14, 16, 17, 11, 14, 10, 14, 2, 7, 3, 10, 7, 14, 10, 2, 14, 10, 9, 9, 17, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 10, 10, 10, 12, 9, 4, 10, 10, 11, 8, 8, 8, 7, 9, 5, 3, 3, 3, 3, 3, 3, 3, 3, 5, 8, 4, 4, 4, 4, 4, 4, 6, 16, 3, 3, 14, 3, 14, 2, 14, 9, 13, 10, 10, 14, 16, 17, 11, 6, 9, 10, 10, 12, 14, 14, 14, 12, 12, 12, 12, 14, 14, 10, 10, 10, 10, 14, 9, 9, 9, 10, 14, 14, 14, 9, 9, 9, 9, 9, 9, 2, 14, 9, 13, 10, 10, 14, 16, 17, 11, 6, 14, 2, 14, 9, 17, 13, 10, 10, 14, 17, 16, 17, 11, 6, 2, 14, 9, 13, 10, 14, 17, 16, 17, 11, 2, 14, 9, 13, 10, 14, 16, 17, 11, 2, 14, 9, 13, 10, 17, 16, 11, 17, 2, 14, 10, 19, 7, 2, 14, 9, 13, 10, 19, 10, 7, 14, 17, 16, 17, 11, 6, 2, 14, 9, 13, 10, 19, 7, 14, 16, 17, 11, 2, 14, 9, 13, 10, 10, 14, 17, 16, 17, 11, 6, 2, 14, 9, 13, 10, 10, 14, 17, 16, 17, 11, 6, 2, 14, 9, 13, 17, 13, 10, 10, 14, 17, 16, 17, 11, 6, 3, 2, 14, 9, 13, 10, 10, 14, 16, 17, 11, 6, 9, 10, 12, 14, 14, 14, 12, 12, 12, 12, 12, 14, 14, 14, 10, 10, 10, 14, 9, 9, 9, 9, 14, 14, 14, 13, 13, 14, 9, 9, 9, 9, 9, 9, 4, 11, 2, 14, 9, 13, 17, 13, 10, 19, 10, 7, 14, 17, 16, 17, 11, 6, 2, 14, 9, 13, 17, 13, 10, 19, 10, 7, 14, 17, 16, 17, 11, 6, 2, 14, 9, 13, 10, 19, 7, 14, 17, 16, 17, 11, 2, 9, 10, 10, 7, 17, 3, 3, 12, 12, 16, 15, 15, 12, 14, 14, 14, 20, 20, 13, 12, 12, 12, 12, 12, 12, 20, 25, 14, 14, 12, 12, 10, 10, 10, 10, 14, 9, 9, 9, 25, 4, 9, 17, 10, 7, 14, 16, 21, 13, 13, 14, 20, 14, 13, 17, 24, 9, 12, 13, 25, 13, 21, 20, 17, 9, 9, 9, 9, 9, 9, 12, 17, 4, 4, 9, 9, 9, 10, 10, 12, 14, 14, 14, 12, 12, 12, 12, 12, 14, 14, 10, 10, 10, 10, 14, 9, 9, 9, 9, 10, 14, 14, 14, 13, 13, 14, 9, 9, 9, 9, 9, 9, 9, 10, 14, 12, 12, 14, 14, 10, 9, 9, 9, 10, 14, 14, 14, 9, 9, 9, 9, 2, 1, 5, 8, 7, 11, 11, 1, 3, 3, 3, 5, 3, 3, 4, 8, 9, 10, 10, 12, 14, 14, 14, 12, 12, 12, 12, 14, 14, 10, 10, 10, 10, 14, 9, 9, 9, 10, 14, 14, 14, 13, 13, 14, 9, 9, 9, 9, 9, 9, 7, 4, 4, 4, 4, 4, 4, 4, 4, 4, 10, 2, 2, 6, 7, 6, 2, 3, 2, 3, 6, 2, 7, 6, 10, 7, 4, 9, 12, 6, 14, 4, 12, 7, 2, 2, 1, 2, 7, 6, 4, 4, 4, 6, 8, 8, 7, 2, 2, 13, 2, 2, 2, 2, 6, 2, 8, 12, 2, 7, 7, 6, 8, 10, 12, 2, 2, 2, 3, 3, 13, 2, 2, 3, 3, 6, 7, 6, 4, 5, 6, 3, 3, 3, 3, 4, 16, 8, 5, 4, 3, 3, 3, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 11, 12, 7, 7, 13, 9, 10, 17, 12, 8, 9, 7, 17, 17, 8, 5, 12, 10, 13, 14, 5, 5, 5, 13, 5, 5, 5, 3, 3, 3, 5, 16, 5, 5, 5, 5, 7, 12, 14, 8, 12, 8, 10, 12, 9, 11, 7, 9, 7, 10, 7, 13, 13, 9, 7, 12, 8, 17, 7, 7, 16, 10, 13, 13, 8, 10, 10, 14, 17, 7, 16, 16, 15, 8, 10, 10, 12, 17, 17, 7, 17, 14, 7, 10, 17, 8, 7, 7, 7, 8, 15, 15, 7, 14, 10, 10, 10, 11, 11, 7, 7, 13, 8, 10, 7, 16, 7, 8, 7, 14, 17, 12, 10, 11, 21, 8, 9, 7, 13, 9, 8, 6, 13, 6, 12, 7, 6, 13, 10, 10, 10, 8, 18, 9, 17, 13, 10, 12, 6, 13, 6, 11, 8, 13, 10, 13, 18, 13, 11, 13, 8, 16, 7, 10, 8, 16, 12, 10, 8, 8, 14, 11, 8, 15, 8, 8, 7, 7, 12, 7, 8, 9, 14, 15, 8, 9, 10, 9, 15, 7, 8, 8, 12, 13, 9, 10, 15, 13, 7, 10, 10, 20, 7, 6, 9, 6, 6, 14, 11, 14, 11, 12, 9, 10, 16, 16, 12, 7, 11, 28, 8, 11, 10, 7, 21, 8, 7, 9, 4, 4, 4, 17, 7, 8, 6, 9, 6, 6, 13, 6, 6, 6, 6, 18, 20, 14, 8, 11, 12, 9, 10, 13, 15, 15, 19, 8, 9, 12, 7, 10, 16, 12, 9, 9, 9, 14, 12, 11, 10, 9, 12, 11, 18, 9, 9, 9, 10, 7, 7, 16, 8, 9, 7, 13, 12, 10, 14, 18, 7, 8, 11, 7, 7, 8, 8, 13, 7, 7, 7, 11, 15, 13, 11, 7, 8, 15, 11, 7, 8, 18, 14, 13, 18, 15, 10, 12, 12, 9, 7, 11, 11, 8, 7, 10, 8, 14, 12, 10, 18, 7, 10, 9, 7, 8, 13, 10, 14, 10, 8, 8, 23, 7, 7, 11, 12, 12, 17, 7, 7, 11, 11, 17, 16, 16, 7, 8, 11, 14, 14, 8, 10, 7, 7, 16, 16, 13, 9, 11, 9, 15, 15, 11, 11, 7, 7, 14, 7, 9, 7, 7, 16, 10, 13, 10, 11, 14, 7, 11, 10, 11, 7, 11, 10, 11, 15, 11, 15, 10, 12, 10, 14, 13, 11, 11, 12, 13, 10, 7, 13, 16, 12, 21, 15, 9, 10, 10, 7, 11, 14, 17, 7, 7, 8, 11, 13, 12, 8, 15, 14, 14, 8, 17, 12, 10, 10, 7, 9, 11, 7, 10, 7, 11, 18, 7, 11, 7, 12, 11, 8, 8, 14, 12, 7, 8, 15, 3, 7, 7, 5, 2, 9, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 5, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 5, 11, 6, 4, 7, 10, 7, 7, 11, 1, 10, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 5, 7, 3, 5, 6, 3, 3, 5, 2, 2, 5, 3, 4, 13, 11, 3, 3, 6, 3, 5, 14, 2, 2, 3, 8, 2, 2, 12, 5, 18, 5, 3, 3, 3, 3, 16, 5, 5, 5, 10, 7, 13, 12, 13, 9, 12, 14, 19, 9, 9, 21, 9, 9, 10, 6, 9, 6, 15, 10, 6, 12, 8, 6, 10, 15, 4, 4, 6, 6, 9, 9, 12, 16, 14, 23, 7, 7, 7, 14, 9, 7, 7, 11, 14, 10, 7, 10, 10, 10, 12, 6, 11, 10, 13, 11, 15, 11, 7, 12, 10, 3, 7, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 3, 7, 1, 5, 2, 2, 2, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 5, 5, 10, 9, 11, 8, 7, 12, 8, 9, 7, 6, 13, 11, 6, 13, 7, 9, 9, 4, 4, 4, 4, 4, 6, 10, 7, 8, 13, 8, 8, 9, 14, 7, 8, 10, 7, 9, 7, 7, 9, 6, 9, 7, 2, 12, 5, 3, 3, 13, 4, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 2, 2, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 1, 7, 6, 4, 12, 3, 3, 3, 3, 3, 8, 7, 3, 3, 3, 3, 3, 3, 4, 4, 11, 15, 14, 2, 8, 3, 5, 5, 8, 10, 8, 6, 4, 7, 17, 7, 4, 5, 2, 6, 3, 2, 2, 12, 5, 5, 3, 15, 13, 8, 11, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 5, 3, 3, 3, 3, 4, 18, 2, 12, 5, 3, 3, 3, 3, 3, 5, 16, 8, 8, 9, 6, 6, 4, 4, 4, 4, 31, 6, 6, 10, 11, 21, 10, 9, 7, 10, 7, 7, 2, 4, 4, 4, 4, 6, 5, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 2, 2, 2, 5, 3, 3, 3, 7, 7, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 8, 2, 3, 3, 3, 3, 3, 5, 9, 11, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 5, 10, 9, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 11, 10, 10, 10, 10, 10, 11, 10, 11, 10, 11, 10, 9, 9, 11, 3, 3, 3, 3, 3, 3, 5, 3, 7, 8, 8, 7, 6, 6, 11, 4, 4, 4, 7, 8, 9, 9, 2, 3, 7, 4, 4, 2, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 2, 2, 5, 5, 5, 5, 5, 3, 3, 5, 5, 5, 7, 7, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 8, 8, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 6, 9, 12, 3, 7, 10, 7, 2, 2, 3, 3, 3, 3, 3, 4, 3, 3, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 8, 8, 6, 6, 8, 6, 7, 4, 4, 4, 4, 4, 4, 6, 7, 5, 5, 20, 19, 8, 10, 9, 7, 10, 6, 8, 11, 6, 6, 6, 6, 13, 12, 8, 6, 7, 14, 11, 9, 2, 5, 3, 6, 2, 3, 2, 2, 2, 2, 2, 2, 2, 5, 4, 3, 7, 6, 4, 7, 4, 3, 6, 4, 7, 2, 7, 7, 7, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 9, 10, 10, 11, 7, 8, 20, 7, 8, 9, 8, 12, 6, 6, 6, 8, 9, 8, 12, 6, 6, 8, 13, 10, 12, 6, 6, 7, 7, 9, 6, 4, 4, 4, 4, 4, 4, 10, 6, 6, 6, 7, 14, 11, 10, 7, 8, 10, 8, 11, 14, 11, 11, 9, 7, 9, 8, 11, 9, 17, 10, 9, 2, 2, 2, 9, 3, 3, 3, 3, 15, 14, 9, 5, 5, 2, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 15, 12, 22, 19, 17, 18, 18, 19, 21, 7, 16, 16, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 7, 16, 11, 11, 7, 7, 7, 7, 17, 7, 8, 12, 15, 9, 19, 7, 19, 8, 21, 11, 12, 19, 14, 22, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 16, 16, 19, 24, 12, 7, 14, 7, 12, 7, 8, 10, 10, 13, 7, 12, 12, 7, 7, 10, 18, 15, 12, 16, 7, 14, 12, 17, 10, 16, 17, 12, 17, 25, 7, 7, 7, 13, 6, 9, 6, 9, 18, 6, 6, 11, 20, 10, 6, 6, 6, 6, 6, 6, 17, 6, 6, 6, 15, 6, 6, 6, 6, 6, 8, 14, 11, 12, 11, 15, 13, 19, 17, 21, 7, 18, 8, 13, 13, 8, 12, 8, 6, 6, 13, 6, 15, 15, 16, 6, 6, 16, 6, 6, 6, 14, 6, 18, 6, 6, 6, 17, 18, 9, 13, 15, 8, 19, 8, 15, 15, 18, 14, 16, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 11, 10, 11, 6, 21, 23, 12, 17, 12, 11, 14, 13, 22, 15, 15, 11, 12, 14, 12, 7, 12, 8, 12, 14, 12, 18, 10, 8, 16, 19, 17, 12, 14, 15, 8, 19, 17, 12, 13, 13, 15, 18, 13, 23, 24, 23, 21, 17, 24, 8, 21, 8, 14, 14, 16, 20, 14, 8, 8, 15, 20, 8, 19, 21, 9, 8, 13, 12, 13, 15, 11, 8, 11, 9, 9, 8, 11, 8, 21, 14, 21, 15, 15, 13, 7, 19, 7, 7, 7, 7, 7, 7, 16, 12, 17, 18, 7, 7, 11, 11, 7, 9, 9, 2, 2, 3, 3, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 10, 10, 7, 9, 7, 7, 7, 6, 8, 6, 6, 6, 6, 6, 6, 6, 7, 6, 8, 6, 6, 9, 7, 7, 7, 4, 4, 4, 4, 4, 4, 4, 4, 8, 9, 8, 7, 8, 7, 8, 10, 7, 5, 5, 5, 5, 5, 5, 3, 9, 7, 7, 8, 6, 6, 6, 6, 6, 6, 6, 6, 9, 6, 6, 9, 11, 13, 7, 8, 9, 9, 5, 5, 5, 7, 8, 6, 6, 6, 6, 6, 6, 6, 7, 8, 9, 7, 10, 9, 10, 7, 8, 5, 5, 5, 5, 5, 5, 7, 7, 9, 8, 7, 7, 6, 6, 6, 6, 6, 6, 10, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9, 10, 4, 4, 4, 4, 8, 7, 7, 10, 10, 9, 8, 8, 15, 9, 8, 8, 8, 8, 8, 9, 10, 9, 10, 7, 8, 13, 5, 5, 5, 5, 5, 3, 3, 7, 7, 8, 6, 6, 6, 4, 4, 11, 9, 7, 8, 9, 10, 7, 5, 5, 5, 5, 5, 3, 3, 7, 6, 6, 13, 7, 9, 8, 7, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 7, 8, 7, 8, 13, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 8, 8, 6, 6, 6, 6, 7, 6, 7, 6, 6, 9, 7, 4, 4, 4, 4, 4, 4, 4, 7, 8, 7, 8, 9, 8, 8, 8, 7, 10, 7, 8, 5, 5, 5, 5, 5, 5, 5, 5, 3, 7, 7, 7, 7, 9, 7, 10, 9, 6, 6, 6, 6, 6, 8, 8, 6, 6, 6, 7, 6, 6, 6, 9, 9, 4, 4, 13, 7, 10, 9, 9, 12, 7, 8, 8, 10, 8, 8, 8, 8, 8, 8, 5, 5, 5, 5, 3, 7, 7, 11, 7, 9, 8, 8, 6, 6, 10, 6, 8, 8, 8, 6, 7, 6, 6, 12, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 8, 8, 16, 8, 9, 8, 7, 5, 5, 5, 5, 5, 3, 3, 7, 7, 7, 10, 15, 8, 9, 8, 9, 9, 6, 6, 6, 6, 6, 6, 7, 4, 8, 7, 8, 8, 7, 8, 11, 8, 5, 5, 5, 5, 5, 3, 7, 7, 6, 11, 16, 7, 6, 4, 4, 4, 4, 9, 9, 8, 8, 8, 13, 12, 8, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 11, 7, 8, 8, 9, 13, 7, 7, 7, 9, 8, 8, 9, 12, 7, 12, 7, 12, 8, 7, 10, 12, 9, 9, 6, 6, 8, 8, 6, 6, 6, 6, 6, 6, 6, 9, 8, 9, 11, 8, 6, 6, 6, 6, 6, 12, 7, 6, 6, 6, 9, 7, 7, 6, 6, 6, 6, 6, 11, 9, 6, 6, 6, 6, 6, 7, 9, 4, 4, 4, 4, 4, 4, 4, 4, 9, 9, 9, 9, 7, 7, 7, 7, 7, 11, 7, 7, 8, 8, 8, 8, 8, 8, 9, 8, 9, 9, 7, 7, 11, 11, 7, 12, 8, 8, 8, 8, 8, 7, 8, 8, 8, 8, 8, 13, 12, 8, 8, 8, 8, 7, 7, 7, 9, 5, 5, 5, 5, 5, 5, 5, 3, 3, 7, 7, 11, 7, 8, 8, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 10, 11, 6, 7, 9, 4, 4, 4, 4, 4, 4, 9, 9, 8, 9, 8, 8, 8, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 11, 7, 7, 7, 9, 6, 6, 11, 8, 10, 6, 6, 6, 12, 8, 8, 7, 6, 6, 8, 7, 4, 4, 4, 4, 4, 4, 4, 4, 9, 10, 9, 9, 8, 10, 9, 11, 8, 5, 5, 5, 7, 6, 6, 8, 7, 4, 4, 4, 4, 8, 7, 7, 8, 7, 8, 8, 5, 5, 5, 5, 7, 7, 8, 8, 8, 6, 6, 6, 6, 6, 10, 8, 9, 13, 6, 7, 6, 6, 8, 7, 8, 4, 4, 4, 4, 11, 8, 8, 8, 10, 5, 5, 8, 7, 8, 13, 8, 7, 6, 8, 6, 9, 7, 8, 7, 5, 5, 5, 5, 5, 5, 3, 3, 7, 8, 9, 6, 4, 8, 10, 10, 8, 12, 9, 13, 2, 7, 5, 5, 5, 5, 5, 7, 7, 10, 6, 6, 6, 6, 6, 6, 6, 8, 4, 4, 9, 8, 8, 8, 14, 8, 8, 8, 9, 8, 5, 5, 5, 5, 5, 3, 3, 9, 6, 6, 6, 6, 10, 12, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 4, 11, 8, 7, 8, 8, 8, 5, 5, 3, 3, 3, 3, 7, 7, 6, 8, 6, 8, 11, 7, 6, 6, 6, 7, 4, 8, 11, 9, 10, 5, 5, 5, 3, 3, 3, 7, 7, 8, 9, 8, 15, 9, 6, 6, 6, 6, 6, 6, 11, 11, 4, 4, 4, 4, 4, 7, 9, 9, 10, 8, 7, 5, 5, 5, 5, 5, 5, 3, 3, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9, 7, 4, 4, 4, 4, 4, 9, 9, 8, 8, 10, 13, 5, 5, 5, 3, 17, 7, 7, 7, 7, 7, 8, 6, 8, 13, 6, 6, 6, 6, 6, 6, 6, 6, 4, 4, 4, 9, 10, 8, 8, 8, 5, 5, 5, 5, 3, 7, 7, 7, 8, 8, 6, 6, 6, 8, 8, 8, 9, 10, 8, 4, 8, 10, 9, 8, 8, 8, 9, 13, 10, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 7, 8, 9, 9, 7, 7, 7, 10, 9, 9, 8, 9, 8, 8, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 8, 12, 6, 6, 6, 6, 6, 6, 6, 6, 6, 12, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 11, 8, 8, 9, 9, 10, 8, 9, 7, 7, 5, 5, 5, 5, 5, 5, 3, 7, 8, 7, 6, 6, 8, 6, 6, 10, 4, 7, 8, 9, 12, 8, 7, 7, 5, 5, 5, 5, 5, 5, 3, 3, 7, 14, 7, 9, 8, 8, 6, 6, 8, 12, 12, 6, 6, 7, 7, 10, 4, 4, 4, 4, 4, 9, 9, 14, 9, 13, 8, 7, 5, 5, 5, 6, 6, 6, 7, 4, 8, 7, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 7, 7, 7, 8, 6, 6, 6, 6, 6, 6, 12, 6, 6, 6, 6, 4, 4, 9, 9, 8, 8, 11, 7, 7, 7, 5, 5, 5, 3, 9, 8, 6, 6, 7, 4, 4, 4, 4, 4, 4, 8, 8, 11, 5, 5, 5, 7, 7, 7, 9, 6, 6, 6, 6, 6, 6, 9, 8, 4, 4, 4, 4, 7, 12, 9, 8, 8, 8, 7, 10, 10, 5, 5, 5, 5, 5, 5, 5, 3, 11, 14, 8, 7, 8, 8, 6, 6, 6, 6, 6, 8, 7, 6, 6, 6, 7, 6, 8, 9, 4, 4, 4, 7, 8, 9, 7, 9, 7, 7, 9, 8, 5, 5, 5, 5, 5, 5, 5, 5, 5, 11, 3, 9, 7, 7, 12, 14, 8, 6, 6, 12, 11, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 15, 7, 4, 4, 4, 16, 9, 9, 9, 8, 9, 9, 9, 9, 9, 8, 8, 8, 13, 11, 8, 5, 5, 5, 5, 3, 7, 6, 6, 8, 8, 8, 6, 6, 7, 10, 7, 4, 4, 4, 4, 9, 7, 8, 7, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 7, 7, 7, 9, 6, 6, 6, 6, 6, 8, 8, 7, 7, 9, 6, 6, 6, 7, 6, 6, 6, 6, 6, 15, 4, 4, 4, 4, 4, 8, 8, 7, 8, 12, 9, 8, 8, 8, 8, 8, 9, 8, 8, 10, 8, 8, 8, 8, 16, 9, 10, 2, 5, 5, 5, 5, 5, 5, 5, 9, 7, 6, 8, 9, 4, 4, 4, 4, 4, 7, 8, 8, 8, 9, 8, 11, 10, 5, 5, 5, 5, 3, 7, 8, 6, 6, 6, 6, 6, 8, 6, 6, 6, 6, 4, 12, 10, 12, 7, 7, 7, 7, 7, 7, 7, 5, 5, 5, 5, 3, 3, 7, 7, 10, 8, 9, 7, 6, 10, 7, 6, 6, 4, 4, 8, 9, 7, 9, 9, 9, 9, 8, 8, 8, 8, 10, 5, 5, 5, 5, 5, 5, 8, 7, 6, 6, 6, 10, 6, 7, 10, 7, 4, 4, 4, 4, 4, 4, 4, 12, 9, 10, 7, 7, 10, 8, 10, 5, 12, 9, 6, 6, 6, 6, 6, 7, 6, 4, 4, 4, 10, 9, 9, 8, 7, 7, 5, 5, 5, 5, 5, 5, 3, 3, 13, 7, 7, 9, 7, 7, 7, 8, 9, 9, 7, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 13, 9, 15, 15, 4, 4, 4, 4, 4, 10, 10, 9, 8, 9, 8, 8, 9, 7, 8, 7, 8, 5, 5, 7, 6, 6, 6, 4, 4, 4, 7, 8, 11, 8, 5, 5, 5, 5, 5, 5, 5, 7, 6, 6, 6, 6, 6, 6, 9, 11, 10, 7, 4, 4, 4, 9, 8, 8, 5, 5, 5, 5, 5, 9, 9, 6, 6, 6, 6, 6, 6, 6, 9, 9, 4, 4, 4, 4, 8, 8, 8, 9, 9, 8, 8, 8, 13, 2, 4, 2, 7, 5, 5, 5, 5, 5, 5, 9, 9, 6, 6, 6, 6, 10, 8, 8, 8, 6, 6, 6, 4, 4, 9, 8, 10, 8, 9, 8, 8, 8, 9, 8, 8, 5, 3, 3, 3, 11, 6, 6, 6, 7, 6, 6, 6, 4, 4, 9, 8, 5, 5, 5, 5, 5, 3, 11, 8, 6, 6, 6, 6, 6, 9, 7, 4, 4, 14, 10, 9, 8, 12, 8, 8, 8, 11, 15, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 11, 11, 11, 10, 10, 7, 7, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 7, 11, 7, 7, 11, 11, 7, 8, 9, 10, 7, 7, 9, 9, 9, 9, 7, 7, 10, 8, 13, 8, 8, 8, 8, 11, 10, 6, 6, 8, 10, 11, 14, 14, 6, 6, 6, 6, 6, 6, 9, 11, 7, 7, 6, 8, 12, 11, 11, 6, 6, 10, 6, 6, 6, 6, 6, 10, 7, 7, 6, 6, 11, 6, 6, 6, 11, 8, 9, 7, 6, 10, 11, 9, 10, 11, 7, 11, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 6, 6, 8, 9, 10, 9, 6, 6, 6, 10, 6, 6, 6, 6, 11, 10, 11, 10, 9, 8, 7, 7, 7, 7, 11, 14, 8, 10, 9, 9, 8, 8, 7, 11, 8, 8, 8, 11, 11, 10, 10, 9, 10, 8, 11, 10, 8, 11, 9, 12, 8, 10, 8, 11, 8, 9, 9, 11, 11, 10, 11, 13, 8, 7, 8, 8, 9, 7, 8, 8, 8, 8, 7, 8, 2, 2, 2, 2, 2, 2, 2, 4, 4, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 2, 3, 3, 3, 3, 3, 3, 3, 3, 8, 6, 4, 4, 4, 11, 7, 11, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5, 5, 3, 3, 3, 3, 8, 7, 7, 8, 8, 4, 8, 7, 7, 7, 9, 7, 8, 9, 8, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 3, 3, 3, 3, 3, 3, 3, 3, 4, 2, 2, 3, 3, 3, 3, 3, 3, 4, 5, 5, 3, 3, 8, 8, 6, 9, 4, 4, 10, 7, 3, 3, 3, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 2, 2, 2, 3, 3, 3, 3, 3, 4, 10, 2, 3, 3, 3, 3, 3, 3, 3, 4, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 5, 2, 4, 2, 6, 2, 2, 9, 5, 5, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 9, 8, 7, 9, 6, 6, 11, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 7, 7, 11, 8, 8, 6, 5, 11, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 2, 2, 3, 3, 3, 3, 3, 3, 6, 4, 4, 4, 4, 3, 3, 3, 3, 5, 7, 2, 3, 3, 3, 3, 3, 8, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 4, 4, 4, 4, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 2, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 6, 3, 3, 8, 10, 3, 4, 4, 1, 1, 1, 1, 1, 1, 1, 8, 9, 10, 7, 7, 1, 14, 18, 13, 18, 13, 10, 10, 16, 13, 18, 16, 13, 16, 18, 13, 22, 16, 16, 16, 14, 21, 16, 9, 14, 16, 9, 9, 14, 10, 10, 14, 12, 14, 19, 12, 11, 18, 13, 17, 15, 15, 15, 15, 16, 14, 13, 19, 18, 15, 19, 18, 12, 18, 12, 11, 20, 14, 15, 10, 17, 17, 16, 19, 20, 21, 15, 13, 16, 15, 15, 15, 1, 1, 3, 8, 7, 7, 8, 8, 8, 1, 6, 1, 1, 6, 3, 3, 4, 7, 3, 3, 5, 5, 4, 4, 4, 4, 4, 2, 7, 7, 8, 12, 3, 4, 5, 1, 3, 4, 4, 10, 4, 3, 3, 3, 8, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 12, 9, 20, 7, 5, 5, 5, 9, 13, 5, 5, 5, 5, 5, 3, 3, 3, 16, 5, 5, 5, 13, 7, 8, 8, 11, 8, 7, 9, 7, 11, 12, 9, 9, 8, 8, 11, 10, 14, 7, 12, 10, 11, 13, 7, 9, 11, 17, 17, 14, 13, 7, 8, 7, 10, 10, 7, 16, 13, 7, 8, 17, 12, 9, 8, 6, 7, 10, 6, 6, 12, 6, 8, 10, 8, 8, 8, 6, 8, 6, 14, 6, 6, 6, 13, 6, 10, 6, 6, 7, 14, 8, 6, 6, 10, 11, 10, 9, 9, 7, 7, 6, 6, 6, 9, 9, 7, 9, 10, 9, 13, 12, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 8, 8, 6, 8, 9, 10, 9, 7, 10, 10, 8, 7, 8, 7, 10, 12, 9, 8, 15, 8, 7, 8, 8, 7, 7, 15, 13, 7, 10, 9, 14, 18, 16, 7, 24, 7, 8, 10, 11, 16, 8, 14, 7, 9, 9, 9, 13, 19, 14, 15, 14, 11, 7, 13, 9, 10, 7, 13, 9, 10, 11, 12, 8, 9, 2, 3, 5, 8, 7, 4, 4, 15, 10, 5, 3, 3, 3, 3, 3, 5, 4, 4, 4, 2, 2, 2, 2, 2, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 2, 12, 5, 3, 8, 10, 15, 6, 7, 2, 3, 2, 5, 5, 12, 2, 5, 5, 5, 5, 2, 2, 5, 5, 12, 9, 5, 2, 2, 9, 5, 5, 12, 12, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 12, 5, 8, 8, 9, 5, 5, 5, 8, 19, 7, 16, 15, 14, 9, 9, 9, 9, 7, 11, 11, 11, 7, 14, 10, 10, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 14, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 12, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 9, 12, 9, 9, 12, 12, 12, 15, 7, 11, 7, 14, 11, 18, 13, 8, 18, 15, 18, 12, 14, 12, 8, 8, 8, 8, 9, 9, 9, 12, 7, 10, 10, 8, 8, 12, 12, 12, 7, 12, 12, 9, 7, 7, 7, 7, 7, 8, 15, 12, 9, 10, 10, 7, 10, 10, 13, 11, 10, 9, 22, 11, 9, 8, 8, 8, 8, 8, 13, 18, 13, 9, 15, 19, 9, 7, 7, 10, 7, 7, 7, 11, 8, 13, 17, 7, 7, 10, 10, 10, 7, 20, 16, 7, 7, 7, 7, 7, 7, 11, 21, 12, 12, 13, 11, 14, 16, 8, 8, 13, 11, 7, 7, 13, 7, 7, 14, 15, 15, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 13, 10, 18, 6, 6, 6, 6, 6, 6, 6, 6, 6, 11, 8, 8, 12, 12, 11, 11, 8, 12, 9, 9, 9, 13, 13, 9, 9, 9, 9, 9, 9, 6, 10, 12, 6, 6, 6, 6, 17, 11, 7, 7, 7, 7, 14, 14, 12, 6, 7, 7, 6, 6, 15, 10, 13, 10, 6, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 13, 9, 9, 15, 13, 6, 12, 12, 6, 19, 11, 10, 7, 7, 16, 8, 19, 17, 9, 9, 9, 9, 9, 6, 6, 6, 10, 8, 16, 8, 6, 6, 9, 6, 6, 6, 6, 6, 6, 6, 6, 8, 8, 8, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 14, 6, 6, 6, 6, 20, 6, 9, 6, 14, 9, 9, 9, 6, 9, 8, 8, 12, 9, 8, 8, 8, 8, 7, 8, 12, 7, 8, 8, 8, 6, 8, 6, 6, 6, 6, 6, 6, 6, 9, 8, 8, 6, 6, 13, 9, 12, 13, 12, 14, 13, 12, 11, 11, 6, 8, 8, 8, 6, 13, 12, 11, 11, 12, 6, 11, 12, 11, 13, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 15, 6, 6, 6, 6, 6, 6, 6, 13, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 8, 8, 8, 8, 6, 18, 6, 12, 13, 13, 13, 9, 10, 15, 9, 12, 6, 6, 6, 6, 6, 6, 6, 6, 9, 15, 10, 9, 10, 13, 9, 19, 8, 18, 17, 10, 10, 8, 8, 6, 6, 6, 6, 6, 6, 10, 14, 8, 16, 16, 9, 8, 15, 8, 8, 10, 12, 14, 7, 7, 8, 8, 7, 7, 7, 7, 8, 13, 13, 11, 9, 9, 9, 12, 10, 17, 8, 11, 9, 7, 7, 14, 8, 14, 14, 7, 7, 7, 7, 7, 7, 14, 7, 7, 7, 7, 7, 10, 10, 8, 14, 7, 7, 7, 7, 8, 8, 8, 8, 8, 17, 9, 7, 15, 7, 8, 12, 7, 9, 14, 7, 7, 7, 9, 13, 8, 14, 7, 16, 18, 13, 15, 14, 12, 13, 10, 15, 9, 7, 7, 7, 10, 13, 15, 15, 9, 9, 9, 9, 19, 11, 7, 11, 11, 13, 8, 8, 8, 8, 7, 12, 19, 17, 9, 9, 13, 7, 7, 7, 9, 7, 7, 7, 12, 13, 15, 10, 8, 8, 14, 15, 12, 13, 13, 8, 12, 14, 7, 11, 7, 14, 15, 13, 12, 8, 8, 8, 8, 11, 13, 15, 15, 8, 13, 12, 8, 8, 8, 13, 10, 16, 14, 11, 8, 8, 12, 12, 9, 15, 15, 12, 12, 13, 8, 8, 9, 12, 13, 9, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 11, 12, 11, 7, 14, 7, 13, 13, 13, 12, 18, 16, 7, 12, 11, 10, 10, 15, 9, 9, 9, 21, 7, 7, 7, 11, 16, 8, 8, 11, 11, 7, 7, 7, 7, 7, 19, 7, 7, 7, 7, 7, 7, 7, 7, 7, 12, 8, 9, 12, 14, 11, 9, 9, 9, 22, 12, 3, 3, 4, 8, 8, 15, 4, 2, 2, 5, 5, 3, 3, 3, 3, 3, 3, 6, 6, 4, 4, 4, 12, 7, 10, 2, 3, 3, 3, 3, 3, 3, 3, 6, 7, 3, 7, 5, 14, 4, 4, 7, 8, 10, 4, 1, 3, 3, 6, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 4, 2, 2, 5, 3, 4, 2, 2, 2, 2, 2, 2, 11, 5, 5, 5, 11, 5, 5, 3, 5, 5, 5, 5, 11, 14, 13, 9, 11, 9, 12, 8, 11, 11, 8, 11, 16, 9, 9, 7, 10, 9, 12, 8, 15, 6, 7, 6, 6, 13, 10, 8, 11, 8, 6, 6, 6, 12, 16, 6, 11, 7, 8, 9, 18, 6, 6, 9, 4, 4, 6, 13, 6, 6, 6, 6, 8, 8, 9, 16, 7, 7, 14, 7, 8, 8, 8, 7, 7, 7, 7, 7, 7, 15, 13, 7, 10, 7, 7, 10, 12, 16, 15, 7, 9, 9, 14, 11, 11, 10, 9, 10, 8, 12, 7, 8, 7, 7, 10, 12, 7, 12, 8, 7, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 3, 3, 5, 5, 5, 10, 7, 4, 4, 8, 7, 10, 9, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 7, 4, 5, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 8, 2, 2, 2, 8, 12, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 7, 11, 9, 8, 8, 8, 7, 8, 9, 7, 7, 9, 7, 7, 7, 10, 7, 7, 10, 9, 10, 6, 6, 6, 6, 6, 6, 15, 7, 8, 9, 9, 8, 6, 6, 10, 9, 6, 8, 13, 9, 7, 6, 6, 6, 6, 6, 6, 12, 6, 6, 7, 6, 7, 6, 6, 6, 10, 10, 7, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 14, 6, 6, 7, 7, 9, 6, 6, 6, 6, 9, 9, 8, 9, 10, 9, 8, 9, 12, 7, 7, 7, 8, 7, 10, 12, 11, 9, 10, 7, 7, 7, 9, 10, 10, 8, 12, 9, 7, 7, 9, 8, 8, 8, 10, 7, 7, 8, 9, 9, 7, 7, 7, 8, 2, 4, 2, 4, 6, 3, 4, 2, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 5, 8, 6, 4, 7, 3, 3, 3, 3, 3, 3, 3, 12, 3, 3, 3, 3, 3, 3, 4, 4, 2, 3, 5, 3, 4, 7, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 6, 4, 3, 4, 2, 2, 2, 5, 3, 3, 3, 3, 3, 5, 4, 4, 4, 4, 7, 6, 8, 9, 2, 2, 2, 2, 3, 3, 3, 5, 7, 2, 3, 3, 8, 7, 7, 2, 2, 8, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 8, 8, 7, 7, 6, 10, 6, 9, 7, 11, 4, 6, 8, 8, 7, 8, 4, 5, 5, 5, 5, 3, 3, 3, 11, 8, 9, 6, 6, 8, 7, 4, 4, 7, 6, 8, 7, 2, 2, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 7, 2, 2, 5, 3, 3, 2, 3, 3, 3, 3, 3, 3, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 12, 5, 5, 3, 3, 3, 5, 10, 12, 6, 15, 4, 6, 6, 7, 14, 9, 3, 3, 3, 3, 3, 8, 2, 2, 3, 5, 5, 3, 3, 3, 3, 3, 3, 8, 8, 8, 7, 5, 8, 4, 6, 11, 2, 2, 7, 3, 3, 2, 9, 8, 5, 5, 3, 3, 3, 5, 5, 7, 7, 6, 6, 10, 6, 8, 6, 8, 9, 7, 4, 4, 4, 4, 7, 6, 6, 7, 7, 10, 9, 9, 8, 11, 8, 3, 3, 3, 3, 3, 4, 4, 2, 3, 3, 3, 3, 3, 7, 6, 2, 5, 5, 6, 7, 6, 4, 8, 9, 11, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 5, 3, 3, 3, 3, 3, 9, 9, 6, 4, 8, 7, 7, 5, 9, 8, 6, 2, 6, 8, 7, 8, 5, 5, 5, 5, 5, 3, 3, 3, 16, 8, 7, 7, 7, 8, 7, 7, 7, 7, 9, 6, 9, 6, 10, 7, 7, 7, 6, 10, 8, 9, 11, 11, 8, 4, 4, 10, 8, 8, 6, 9, 6, 11, 8, 8, 8, 15, 7, 8, 9, 5, 3, 3, 3, 3, 3, 5, 2, 2, 3, 8, 9, 10, 3, 2, 2, 2, 2, 2, 2, 3, 6, 4, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 2, 3, 3, 3, 3, 3, 3, 3, 11, 5, 3, 3, 3, 3, 3, 3, 3, 3, 6, 7, 4, 4, 2, 3, 3, 3, 3, 3, 3, 3, 12, 7, 4, 12, 4, 6, 5, 4, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 11, 10, 6, 4, 6, 10, 8, 3, 3, 3, 3, 3, 3, 3, 3, 5, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 5, 3, 4, 4, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10, 5, 5, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 7, 8, 8, 7, 13, 12, 10, 10, 8, 8, 7, 7, 9, 12, 11, 6, 6, 8, 8, 9, 7, 7, 7, 10, 15, 10, 4, 4, 4, 4, 4, 11, 8, 8, 9, 7, 9, 14, 14, 12, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 12, 5, 5, 5, 11, 10, 7, 9, 3, 8, 7, 3, 15, 13, 11, 4, 4, 2, 2, 2, 19, 7, 5, 5, 3, 3, 3, 3, 3, 3, 3, 5, 22, 18, 6, 14, 17, 4, 4, 19, 16, 18, 2, 3, 3, 7, 2, 3, 2, 3, 3, 6, 4, 2, 3, 3, 2, 5, 3, 3, 3, 3, 3, 3, 3, 9, 9, 2, 3, 2, 2, 2, 3, 3, 3, 5, 7, 14, 7, 7, 12, 9, 13, 6, 11, 6, 10, 9, 7, 7, 8, 12, 12, 8, 8, 8, 10, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 5, 8, 10, 7, 8, 11, 8, 12, 9, 4, 14, 7, 7, 9, 13, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 1, 2, 2, 3, 3, 3, 3, 3, 3, 5, 2, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 4, 4, 4, 3, 2, 3, 3, 3, 3, 5, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 12, 9, 8, 8, 9, 8, 6, 17, 6, 6, 6, 8, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 4, 4, 8, 8, 9, 9, 9, 7, 7, 7, 7, 7, 7, 7, 9, 9, 9, 7, 8, 8, 8, 10, 7, 13, 10, 8, 9, 3, 3, 5, 13, 3, 3, 3, 3, 3, 7, 7, 6, 6, 10, 13, 11, 11, 8, 8, 9, 8, 9, 9, 10, 10, 10, 11, 10, 10, 13, 13, 16, 15, 11, 12, 9, 9, 10, 9, 11, 10, 9, 9, 14, 7, 8, 3, 10, 7, 7, 3, 2, 2, 2, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 7, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 11, 6, 7, 4, 6, 2, 2, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 6, 4, 4, 2, 2, 2, 3, 3, 3, 3, 4, 4, 6, 6, 6, 6, 5, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 11, 6, 10, 9, 12, 7, 7, 11, 14, 9, 7, 12, 3, 3, 7, 12, 11, 12, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 9, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 11, 5, 5, 5, 5, 5, 5, 5, 5, 11, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 10, 3, 3, 3, 11, 3, 5, 9, 11, 8, 12, 14, 9, 7, 8, 7, 7, 11, 11, 7, 7, 10, 9, 8, 10, 9, 7, 7, 7, 7, 7, 7, 8, 8, 7, 11, 8, 8, 8, 7, 7, 10, 8, 7, 13, 12, 7, 17, 10, 8, 8, 11, 7, 11, 11, 14, 7, 11, 7, 8, 6, 9, 20, 8, 7, 9, 16, 7, 10, 6, 11, 10, 8, 9, 7, 16, 11, 11, 9, 8, 9, 8, 8, 8, 11, 8, 15, 8, 8, 9, 7, 8, 8, 11, 10, 7, 5, 7, 10, 10, 15, 7, 7, 7, 8, 7, 8, 8, 10, 11, 10, 10, 10, 11, 11, 7, 8, 6, 8, 8, 10, 6, 8, 6, 6, 7, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 16, 6, 15, 6, 7, 11, 11, 7, 9, 10, 11, 13, 10, 6, 16, 8, 10, 12, 11, 6, 6, 6, 6, 6, 6, 6, 10, 6, 10, 7, 7, 7, 11, 7, 11, 6, 6, 6, 6, 6, 6, 17, 7, 7, 6, 6, 12, 22, 6, 6, 6, 6, 6, 8, 6, 6, 6, 6, 7, 6, 6, 5, 6, 6, 8, 11, 6, 9, 14, 11, 9, 11, 7, 7, 8, 6, 6, 6, 8, 10, 9, 6, 6, 6, 6, 9, 7, 6, 6, 6, 6, 6, 15, 6, 4, 4, 4, 6, 4, 17, 8, 11, 6, 6, 9, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 10, 6, 10, 6, 6, 6, 6, 12, 8, 6, 6, 6, 6, 6, 6, 6, 6, 6, 9, 6, 6, 6, 6, 18, 6, 6, 6, 8, 9, 10, 7, 8, 9, 10, 11, 7, 13, 6, 8, 8, 6, 6, 14, 7, 7, 7, 7, 10, 7, 14, 9, 6, 6, 9, 15, 9, 7, 14, 6, 11, 14, 13, 7, 12, 8, 7, 7, 7, 7, 7, 12, 7, 10, 9, 16, 6, 8, 6, 5, 17, 6, 8, 10, 4, 6, 4, 10, 15, 17, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 4, 4, 11, 7, 4, 4, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 19, 17, 6, 10, 11, 6, 6, 6, 6, 18, 6, 6, 11, 4, 4, 4, 5, 6, 6, 6, 9, 5, 6, 4, 6, 6, 4, 6, 6, 6, 6, 10, 6, 6, 4, 6, 6, 10, 6, 10, 6, 6, 6, 6, 11, 6, 6, 10, 6, 6, 8, 6, 6, 6, 8, 6, 11, 4, 11, 9, 10, 9, 11, 4, 8, 4, 11, 12, 7, 9, 8, 6, 7, 7, 8, 12, 12, 11, 13, 10, 11, 7, 7, 7, 9, 7, 11, 10, 7, 7, 7, 16, 11, 10, 11, 17, 9, 9, 8, 8, 7, 7, 7, 9, 7, 7, 7, 14, 7, 13, 9, 11, 10, 14, 10, 10, 12, 11, 10, 7, 10, 5, 14, 8, 8, 8, 9, 7, 8, 7, 7, 9, 8, 7, 8, 7, 7, 7, 7, 7, 7, 7, 11, 8, 10, 8, 7, 8, 14, 11, 8, 9, 9, 9, 8, 24, 10, 10, 12, 7, 7, 15, 11, 8, 8, 12, 11, 8, 9, 9, 7, 8, 9, 10, 11, 10, 11, 7, 12, 7, 7, 11, 9, 8, 14, 13, 12, 8, 11, 10, 8, 8, 7, 7, 14, 9, 10, 8, 9, 11, 7, 14, 8, 8, 13, 8, 8, 12, 7, 10, 14, 14, 11, 9, 10, 9, 9, 7, 7, 11, 11, 13, 9, 13, 5, 5, 5, 7, 9, 5, 11, 12, 14, 8, 7, 7, 11, 10, 9, 7, 8, 8, 7, 10, 11, 11, 5, 5, 7, 5, 5, 5, 7, 7, 15, 7, 7, 8, 7, 15, 12, 12, 10, 7, 8, 7, 11, 7, 7, 7, 23, 11, 8, 8, 11, 10, 7, 8, 11, 7, 19, 7, 7, 6, 9, 9, 9, 11, 3, 4, 7, 8, 6, 6, 4, 10, 8, 2, 2]);
    var edgeChild = /* @__PURE__ */ new Uint16Array([0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 12, 1, 1, 1, 1, 1, 17, 1, 1, 1, 1, 1, 1, 12, 1, 12, 1, 12, 13, 1, 1, 1, 1, 12, 1, 12, 1, 1, 1, 1, 1, 14, 23, 1, 1, 1, 1, 1, 20, 1, 1, 1, 1, 21, 12, 1, 1, 1, 1, 1, 1, 1, 1, 22, 1, 1, 1, 16, 18, 1, 1, 15, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 24, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 19, 1, 1, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 1, 26, 27, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 12, 12, 12, 12, 1, 34, 0, 0, 0, 1, 1, 1, 1, 37, 36, 1, 1, 1, 1, 1, 35, 1, 1, 1, 1, 39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 41, 42, 0, 0, 0, 0, 12, 1, 1, 1, 12, 1, 1, 1, 45, 47, 47, 47, 45, 47, 45, 45, 46, 47, 45, 47, 45, 45, 45, 45, 45, 45, 47, 45, 45, 46, 45, 45, 45, 45, 47, 48, 48, 46, 47, 45, 45, 45, 45, 45, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 51, 53, 51, 51, 51, 53, 51, 52, 51, 54, 51, 52, 52, 51, 51, 51, 52, 54, 52, 54, 51, 52, 52, 12, 56, 56, 55, 57, 52, 54, 51, 51, 49, 50, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 61, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 68, 69, 12, 1, 1, 67, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 12, 78, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 82, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 80, 83, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 81, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 12, 1, 1, 1, 1, 93, 1, 95, 1, 1, 1, 1, 1, 1, 1, 1, 98, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 101, 101, 1, 1, 12, 1, 104, 1, 1, 1, 1, 1, 1, 1, 102, 1, 103, 1, 105, 1, 1, 1, 1, 1, 106, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 114, 115, 1, 1, 1, 1, 1, 1, 117, 117, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 125, 126, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 126, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 126, 1, 1, 1, 1, 1, 1, 1, 1, 1, 130, 127, 129, 124, 1, 128, 1, 1, 118, 1, 1, 1, 1, 121, 1, 131, 1, 1, 1, 1, 1, 1, 123, 1, 112, 1, 113, 1, 12, 132, 110, 116, 1, 1, 1, 1, 1, 111, 119, 1, 12, 12, 12, 122, 120, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 12, 12, 1, 1, 1, 1, 1, 12, 138, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 140, 1, 1, 1, 1, 1, 1, 1, 1, 141, 142, 12, 12, 139, 137, 47, 47, 144, 51, 51, 143, 146, 145, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 149, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 147, 0, 0, 0, 0, 1, 0, 148, 136, 1, 0, 1, 1, 12, 12, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 152, 151, 22, 1, 1, 12, 12, 1, 22, 12, 12, 1, 1, 1, 1, 1, 138, 1, 1, 156, 1, 1, 1, 1, 157, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 1, 1, 140, 1, 1, 156, 1, 1, 1, 1, 157, 1, 1, 1, 138, 1, 1, 1, 156, 1, 161, 1, 1, 1, 157, 1, 1, 138, 1, 1, 1, 161, 1, 1, 1, 1, 1, 138, 1, 1, 1, 1, 1, 1, 1, 1, 138, 1, 1, 161, 1, 1, 161, 1, 1, 1, 1, 1, 1, 1, 167, 1, 1, 1, 156, 1, 1, 161, 1, 1, 1, 157, 1, 1, 167, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 140, 1, 1, 156, 1, 161, 1, 1, 1, 157, 1, 1, 138, 1, 1, 156, 1, 161, 1, 1, 1, 157, 1, 1, 138, 1, 1, 1, 1, 156, 1, 161, 1, 1, 1, 157, 1, 1, 1, 138, 1, 1, 156, 1, 1, 1, 1, 173, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 1, 176, 1, 1, 167, 1, 1, 1, 1, 1, 156, 1, 1, 161, 1, 1, 1, 157, 1, 1, 167, 1, 1, 1, 1, 1, 156, 1, 1, 161, 1, 1, 1, 157, 1, 1, 167, 1, 1, 1, 1, 1, 161, 1, 1, 1, 1, 171, 163, 163, 12, 1, 12, 175, 1, 1, 1, 1, 1, 164, 164, 164, 158, 1, 1, 1, 162, 164, 168, 174, 1, 1, 1, 1, 162, 162, 1, 1, 160, 158, 171, 162, 166, 179, 170, 179, 1, 1, 177, 1, 170, 159, 162, 1, 1, 1, 1, 162, 1, 165, 1, 1, 1, 12, 1, 180, 1, 169, 1, 1, 1, 169, 168, 172, 178, 160, 171, 1, 1, 1, 1, 1, 1, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 183, 182, 182, 183, 182, 182, 182, 182, 184, 184, 182, 182, 183, 182, 183, 182, 182, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 186, 12, 1, 12, 12, 12, 12, 1, 12, 12, 12, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 199, 1, 201, 202, 200, 199, 199, 1, 1, 205, 1, 206, 204, 1, 12, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 217, 199, 199, 199, 199, 217, 1, 1, 1, 1, 220, 221, 219, 1, 1, 1, 1, 1, 1, 223, 223, 1, 1, 1, 223, 223, 225, 226, 224, 1, 228, 1, 1, 1, 1, 12, 234, 235, 236, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 203, 207, 1, 1, 1, 1, 155, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 231, 1, 1, 1, 198, 1, 1, 1, 1, 242, 1, 1, 239, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 189, 214, 1, 1, 1, 210, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 196, 1, 1, 1, 1, 1, 1, 1, 215, 1, 1, 1, 1, 230, 1, 1, 1, 1, 181, 1, 218, 1, 213, 1, 1, 1, 216, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 194, 1, 12, 1, 1, 12, 1, 1, 1, 1, 197, 1, 1, 1, 212, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 243, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 229, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 188, 12, 1, 1, 1, 191, 12, 1, 1, 1, 1, 1, 1, 1, 233, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 190, 1, 1, 1, 1, 1, 1, 1, 238, 1, 1, 1, 195, 1, 1, 1, 211, 1, 12, 1, 227, 208, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 215, 1, 1, 1, 1, 193, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 185, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 209, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 240, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 241, 1, 1, 12, 1, 1, 1, 1, 192, 1, 1, 1, 209, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 232, 1, 1, 1, 187, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 222, 1, 1, 1, 12, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 237, 1, 1, 12, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 253, 0, 0, 0, 0, 0, 254, 0, 0, 0, 0, 0, 0, 1, 12, 1, 1, 1, 258, 1, 1, 1, 0, 259, 256, 257, 1, 1, 1, 1, 1, 1, 264, 1, 266, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 262, 1, 1, 1, 1, 1, 268, 1, 1, 12, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 267, 1, 1, 1, 12, 1, 1, 1, 1, 263, 1, 1, 1, 261, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 265, 1, 1, 1, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 1, 12, 1, 1, 1, 12, 1, 1, 274, 1, 13, 1, 1, 1, 12, 12, 271, 272, 1, 1, 1, 1, 273, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 275, 1, 1, 12, 16, 1, 1, 1, 1, 1, 1, 276, 1, 1, 1, 12, 12, 1, 1, 1, 1, 1, 1, 1, 276, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 285, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 289, 289, 1, 0, 0, 0, 0, 0, 1, 12, 0, 0, 0, 0, 0, 0, 0, 0, 182, 1, 294, 295, 1, 12, 1, 1, 1, 1, 12, 297, 1, 1, 296, 1, 1, 299, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 303, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 12, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 12, 0, 314, 0, 0, 315, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 61, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 339, 0, 0, 0, 0, 0, 0, 0, 0, 0, 341, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 357, 357, 358, 357, 0, 209, 1, 1, 13, 353, 1, 351, 0, 0, 0, 0, 0, 0, 0, 354, 1, 1, 359, 1, 239, 1, 1, 1, 1, 352, 1, 349, 1, 355, 1, 347, 1, 356, 1, 348, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 12, 350, 350, 1, 1, 1, 198, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 12, 1, 1, 1, 1, 346, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 362, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 299, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 402, 402, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 394, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 370, 381, 1, 1, 369, 404, 1, 375, 1, 1, 367, 399, 1, 1, 385, 366, 371, 1, 1, 1, 378, 409, 387, 1, 1, 1, 1, 1, 1, 388, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 397, 401, 0, 0, 83, 1, 1, 0, 395, 372, 408, 373, 376, 383, 1, 398, 0, 1, 0, 83, 392, 390, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 411, 1, 1, 382, 1, 83, 1, 0, 1, 1, 1, 414, 1, 0, 0, 83, 389, 0, 1, 368, 1, 1, 1, 0, 1, 1, 391, 1, 0, 1, 1, 1, 0, 1, 416, 379, 1, 1, 0, 1, 0, 0, 407, 0, 1, 1, 1, 83, 400, 1, 1, 396, 393, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 374, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 406, 0, 83, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 410, 1, 1, 1, 0, 0, 413, 0, 0, 0, 1, 386, 1, 0, 83, 412, 1, 0, 0, 0, 0, 415, 1, 1, 0, 0, 1, 0, 1, 0, 384, 0, 380, 0, 1, 1, 1, 0, 1, 1, 0, 403, 377, 405, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 12, 1, 1, 1, 12, 431, 431, 1, 1, 12, 12, 1, 431, 1, 1, 12, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 443, 1, 1, 0, 1, 1, 1, 1, 239, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 461, 461, 1, 1, 0, 0, 347, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 474, 1, 473, 1, 1, 1, 1, 1, 1, 1, 1, 1, 478, 1, 12, 12, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 486, 1, 1, 1, 488, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 485, 1, 480, 1, 1, 1, 1, 467, 1, 1, 1, 1, 1, 1, 1, 1, 481, 12, 1, 1, 1, 1, 487, 1, 1, 1, 482, 476, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 347, 1, 464, 1, 1, 12, 484, 1, 1, 347, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 469, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 487, 1, 1, 1, 1, 347, 1, 483, 1, 1, 1, 477, 471, 1, 1, 1, 1, 1, 472, 1, 489, 475, 1, 1, 1, 1, 1, 470, 1, 1, 1, 1, 1, 1, 1, 1, 1, 465, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 479, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 468, 1, 1, 1, 1, 1, 466, 1, 253, 490, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 12, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 496, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 12, 1, 69, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 500, 0, 500, 500, 500, 500, 500, 500, 500, 0, 500, 500, 500, 500, 500, 1, 500, 500, 500, 0, 500, 500, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 505, 504, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 509, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 503, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 511, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 508, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 501, 0, 0, 512, 507, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 506, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 501, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 510, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 522, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 233, 233, 1, 526, 1, 1, 1, 525, 1, 1, 1, 1, 521, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 523, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 527, 1, 1, 524, 1, 1, 1, 1, 1, 1, 1, 1, 402, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 528, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 539, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 12, 1, 542, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 12, 12, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 61, 1, 1, 12, 12, 12, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 561, 1, 1, 1, 1, 1, 1, 1, 562, 1, 1, 1, 1, 1, 1, 1, 560, 1, 1, 12, 1, 1, 564, 272, 1, 1, 1, 12, 12, 1, 1, 12, 1, 12, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 568, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 574, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 136, 1, 12, 579, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 111, 1, 1, 12, 1, 1, 1, 1, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 584, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 148, 1, 1, 1, 261, 1, 1, 12, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 609, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 253, 1, 358, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 614, 1, 1, 1, 1, 0, 616, 0, 83, 0, 615, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 12, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 623, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 618, 618, 0, 622, 620, 618, 618, 618, 618, 618, 624, 618, 618, 628, 618, 618, 618, 618, 618, 618, 618, 618, 618, 618, 625, 622, 618, 618, 622, 618, 618, 618, 618, 618, 618, 618, 618, 618, 618, 618, 618, 618, 620, 618, 618, 618, 618, 618, 626, 618, 618, 618, 618, 618, 618, 0, 0, 0, 1, 627, 1, 1, 1, 1, 621, 1, 1, 1, 1, 1, 619, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 12, 632, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 12, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 12, 1, 1, 12, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 66, 311, 337, 442, 570, 0, 4, 70, 269, 287, 313, 338, 364, 418, 444, 0, 533, 554, 571, 634, 9, 0, 62, 92, 428, 440, 460, 612, 0, 531, 553, 567, 649, 0, 32, 6, 0, 495, 534, 639, 597, 72, 0, 7, 316, 288, 419, 497, 447, 573, 83, 635, 0, 613, 340, 449, 499, 9, 109, 319, 540, 6, 32, 0, 342, 83, 421, 83, 517, 10, 6, 135, 281, 306, 0, 650, 544, 0, 600, 0, 65, 6, 6, 284, 99, 2, 463, 429, 441, 633, 0, 6, 0, 6, 317, 107, 6, 598, 535, 575, 0, 498, 420, 304, 318, 8, 73, 108, 636, 578, 422, 343, 331, 450, 150, 76, 321, 582, 545, 638, 601, 365, 360, 513, 6, 77, 153, 11, 0, 282, 557, 583, 602, 549, 587, 607, 648, 38, 6, 293, 326, 363, 335, 251, 32, 563, 590, 251, 43, 249, 298, 327, 336, 437, 454, 515, 305, 0, 75, 599, 0, 434, 448, 330, 83, 280, 83, 0, 617, 581, 538, 323, 452, 83, 423, 417, 0, 0, 0, 9, 592, 608, 250, 0, 455, 438, 566, 551, 610, 652, 89, 251, 44, 328, 426, 456, 606, 0, 546, 324, 307, 83, 248, 84, 30, 420, 32, 6, 424, 361, 334, 641, 629, 559, 586, 548, 0, 291, 85, 32, 436, 453, 0, 32, 457, 0, 252, 630, 552, 9, 439, 458, 251, 281, 90, 255, 631, 611, 594, 516, 459, 427, 283, 260, 91, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 657, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 445, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 133, 0, 0, 541, 585, 0, 0, 0, 0, 0, 0, 0, 29, 0, 588, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 445, 0, 0, 0, 0, 537, 0, 290, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 325, 0, 0, 0, 0, 0, 0, 0, 654, 0, 0, 0, 0, 0, 653, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 425, 0, 0, 0, 518, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 71, 0, 0, 0, 0, 0, 0, 529, 0, 0, 0, 0, 0, 0, 435, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 244, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 550, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 530, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 302, 312, 0, 0, 0, 0, 0, 565, 308, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 547, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 491, 0, 0, 0, 345, 0, 0, 0, 0, 79, 0, 286, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, 605, 0, 0, 0, 0, 637, 556, 0, 0, 0, 0, 277, 0, 0, 0, 0, 0, 0, 493, 0, 0, 514, 0, 0, 0, 0, 0, 63, 0, 0, 0, 300, 59, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 279, 0, 0, 0, 0, 0, 310, 647, 0, 74, 0, 0, 0, 0, 0, 0, 0, 0, 0, 656, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 154, 0, 309, 0, 0, 0, 0, 0, 0, 604, 0, 0, 0, 0, 0, 0, 558, 0, 0, 0, 0, 0, 0, 0, 0, 0, 603, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 246, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 88, 0, 536, 0, 0, 0, 0, 0, 591, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 88, 87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 520, 0, 519, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 292, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 492, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 320, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 572, 0, 0, 0, 0, 0, 0, 0, 0, 329, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 71, 270, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 88, 0, 643, 0, 0, 589, 0, 0, 0, 0, 0, 0, 0, 0, 0, 278, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 646, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 555, 0, 0, 0, 88, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 532, 0, 651, 0, 0, 462, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 433, 0, 0, 0, 580, 0, 97, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 33, 0, 0, 0, 0, 0, 0, 31, 96, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 322, 0, 0, 0, 247, 0, 0, 0, 0, 0, 0, 595, 0, 0, 0, 0, 134, 0, 0, 0, 0, 0, 596, 0, 0, 0, 0, 0, 0, 0, 445, 451, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 430, 0, 344, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 332, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 569, 0, 0, 0, 446, 0, 0, 432, 0, 0, 0, 0, 0, 0, 640, 0, 0, 0, 576, 0, 0, 94, 0, 577, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 543, 494, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 301, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 445, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 645, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 644, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 655, 0, 0, 0, 0, 0, 593, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 333, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 642, 0, 0, 245, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 660, 660, 660, 660, 660, 660, 660, 659, 661]);
    var labelText = "orgmilcomschnetedugovdrrformsfeedbackofficialaccoorgmilschnetgovmagazinemediaunioncargopilotgroupcaarespressworksaerodromeworkinggroupair-traffic-controlaircraftaccident-preventioneducatormarketplaceambulanceinsurancecateringairportrepbodyenginesoftwaremodellingair-surveillanceconsultingchartertrainermaintenanceservicesdesignflightskydivingfreightassociationstudentgroundhandlingdgcafuelclubtaxicrewshowballooningexpresstraderbrokerauthoragentsairtrafficjournalistsafetyconsultantmicrolightaccident-investigationparachutingequipmentproductionfederationrecreationscientistnavigationengineertradingglidingleasingresearchpassenger-associationentertainmentparaglidinghangglidingaerobaticrotorcraftemergencycertificationgovernmentaeroclubexchangelogisticschampionshiphomebuiltcouncilconferencecontrolairlinecivilaviationjournalorgcomnetedugovcoorgcomnomnetobjofforgcomnetuwukiloappsframerorgmilcomnetedugovcoradioorgcomnetcommuneedogpbcoitgvorgedugov*spreviewfrontendrelayononstagingauthcloudsandboxupid*mtls*privatelinktypedreamdeveloperbravemochawindsurfaivenmirenupsunwnextbegetngrokclerkwale2bwebcsbrunputerflutterflowcloudzyrospawnbasesliplanemodelenceshiptodaymagicpatternsnetlifyondigitaloceanrailwayhostedclaudehasurabotdashretoolvercelgithubluyanigadgetreplitcloudflaretelebitedgecomputeevervaultexponyatnoopencrpplxzeaburwasmerframerzeropsrocketpreviewconvexmedusajsspritesonherculeseasypanelstreamlitglideossnowflakemesserliloginlinehackclubcodepennorthflankbase44corespeedleapcellngrok-freeclerkstagelovableon-fleek*us-west-3ap-south-2us-central-2us-central-1eu-central-1ap-south-1us-west-2us-east-2eu-north-1ap-north-1us-west-1us-east-1*rcloudintsegorgmilcomgobbetnetintedugovturmusicasenasamutualcoopip6uriurnin-addre164homeirisgovdixdaemoncloudnssthwien*inexexkunden4accogvormymyspreadshop4lima2ixortsinfofuturecmsfuturehosting12hpprivfuturemailinglima-cityfunkfeuer123webseitednshomemelmyspreadshopcloudletswasantqldvicactnswtascatholicwasaqldvictasidwasantozqldorgcomvicasnactnetedugovnswtasconfcomairflowlambda-urltransfer-webapptransfer-webappairflowtransfer-webapptransfer-webapp-fipstransfer-webappeu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1mx-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2ap-east-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5us-gov-west-1us-gov-east-1ap-southeast-6ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1privatenotebookstudiolabelingnotebookstudionotebooknotebook-fipslabelingnotebookstudionotebook-fipsnotebookstudio-fipsnotebook-fipsnotebookstudionotebook-fipsnotebookstudioeu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1us-west-2eu-west-2us-east-2eu-north-1ap-southeast-2ap-northeast-2experimentsus-gov-west-1us-gov-east-1ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1onrepostsagemakercopporgmilcompronetintedugovbiznameinfoshoprsorgmilcomnetedugovbrendlyresolvenzauscotvstoreorgcomnetedugovbizinfoidacaicoittvorgmilcomschnetedugovinfocloudezproxysiteacmymyspreadshopkuleuvenwebhostingtransurl123websitecloudnsinterhostsolutionsddns5476103298edgfacbmlonihkjutwvqpsryxzbarsycoororgcomedumyftpno-iporxcloud-ipfor-somemmafanfor-morewebhopselfipjozidyndnscloudnsdscloudfor-thefor-betteractivetrailcoeconorestooteorgcomeconeteduassurmoneyafricaarchitectesrestaurantloisirstourismavocatsinfoagrounivcoorgcomnetedugoviatvdeportesaludtksatorgmilcomwebgobnetinteducienciaboliviarevistacooperativaempresanombreindustriamusicapatriamedicinademocraciapoliticapuebloindigenaplurinacionalarteblogwikiinfoagrotransportenoticiasprofesionalacademiaeconomiaecologiamovimientotecnologianaturalpagesappsgroksimplesitecepesebamapadfmgalampbacscpirngorotomtrjspaprrprrsesmscepesebamapadfmgalampbacscpirngorotomtrjspaprrprrsesms*biaamfmtcmptvfeirasampajampanatalbelemananiradiog12medindfndbmdtrdthepoaggfjdfdefinfenflegsegongengcngorgzlgslglogppgmillelqslcimcomnomadmjabimbbibbsbabcrectecsjcetcpscpvhudieticriapipsiecnbiorioecogeoteoodoproatoartfstmatvetdetbetnetcntnotfotgrueduajuespappreptmpemparqsrvadvdevgovntrturagrjorfarjusmusdesvixxyzcozfozslzbhzmaringasantamariacampinagrandegoianiasorocabafloripasaobernardocuritibaboavistarecifeaparecidasaogoncasalvadorcuiabamorenamacapalondrinacontagemsocialfortalmaceioleilaoosascoriobranconiteroi9guacutcheblogflogvlogwikitaxicoopmanauspalmascaxiasjoinvillebaruericampinassantoandreribeiraoriopretoweorgcomnetedugovv0windsurfshiptodaycloudsitecoaccoorgnetgovofmilcomgovmediatechzacoorgcomnetedugsjgovmydnspenfnlabnbmbgcbcqconcontnuyksknsmyspreadshopno-ipawdevboxbarsyonidatemfuinabusavinstanceseceuguukussryzespawncsxcloud-ipmyphotosfantasyleaguetwmailcleverappsscrappingccwucloudnsftpaccessgame-serverccgovobjectsrmalpgcust*svcalp1aeappenginermalpgmyspreadshop4lima2ixsquare7cloudscale123websitefirenet12hpflowgotdnslinkyard-cloudcloudnslima-citydnskingobjectstorageedaccogoorusorgcomnetintedua\xE9roportxn--aroport-byaassogouvcomilgobgovcloudnses-1eu-west-1us-east-1euvipit1eurarubait1s3lbwebsites3websiteru-spbru-mskelasticcsrunstnukukcaukusnl-ams-1fr-par-1fr-par-2functionsnodess3ddlwhmrdbfnck8sifrs3-websitecockpitscblmgdbdtwhkafkpubprivs3ddlwhmrdbk8sifrs3-websitecockpitscblmgdbdtwhkafks3ddlrdbk8sifrs3-websitecockpitscblmgdbdtwhkafkk8sscalebookpl-wawfr-parnl-amsbaremetalsmartlabelinginstancesdechk2kuleuvenlaravelvoorloperurownoxazapscwhstgrvaporonline-serverobservablehqelementorantagonistreclaimjoteluluencowaydiademjelasticmatlabmagentositetrendhostingaxarnetjenv-arubajelejoteravendbemergenttrafficplexconvexkeliwebserveboltbegetcdnstaticson-rancherprimetelonstackitunison-servicesdnshomelinkyardbarsyjelecloudnscocomnetgovmycn-northwest-1cn-north-1s3s3-accesspoints3-websites3s3-accesspointrdsdualstacks3-deprecatedemrappui-prods3-websiteemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apis3s3-accesspoints3s3-accesspointrdsdualstackemrappui-prods3-websiteemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicn-northwest-1cn-north-1cn-northwest-1ebcomputeelbcn-north-1airflowcn-northwest-1cn-north-1oncn-northwest-1cn-north-1amazonawssagemakeramazonwebservicesdirectasgdsdhehahljlnmhbacscahqhshhihnlnynsnmofjbjzjxjtjhkcqtwgsjssxnxjxgxxzgz\u7DB2\u7D61\u7F51\u7EDC\u516C\u53F8orgmilcomnetedugovxn--55qx5dcanva-appsxn--io0a7iquickconnectcanvasitekhsjxn--od0algcanva-codemyqnapcloudsrvrlessclustersrealtimestorageleadpagescarrdcrdorgmilcomnomnetedugovhidnssupabaserdpareplmypiumsoxmitotaplpagesfirewalledreplitowodevwebview-assetsvfswebview-assetss3s3-accesspointdualstackemrappui-prods3-websiteaws-cloud9emrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9eu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1s3s3-accesspointdualstackemrappui-prods3-websiteaws-cloud9emrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9consent-portals3s3-accesspointdualstackanalytics-gatewayemrappui-prods3-websiteaws-cloud9emrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstackemrappui-prods3-websiteemrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apis3s3-accesspointdualstackemrappui-prods3-websiteemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apis3s3-accesspointdualstacks3-deprecateds3-websitebedrock-agentcores3-object-lambdaexecute-apibedrock-agentcores3s3-accesspoints3-websites3-accesspoint-fipss3-fipss3s3-accesspointdualstackemrappui-prods3-websites3-accesspoint-fipsaws-cloud9s3-fipsemrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstackemrappui-prods3-websites3-accesspoint-fipss3-fipsemrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apis3s3-accesspointdualstackemrappui-prods3-websiteaws-cloud9emrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstackemrappui-prods3-websiteaws-cloud9emrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstacks3-deprecatedanalytics-gatewayemrappui-prods3-websiteaws-cloud9emrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9vfss3s3-accesspointdualstackemrappui-prods3-websiteaws-cloud9emrstudio-prods3-object-lambdaemrnotebooks-prodexecute-apicloud9eu-west-3ap-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1mx-central-1me-central-1ca-central-1il-central-1ap-northeast-1us-northeast-1ap-southeast-1me-south-1af-south-1ap-south-1ap-southeast-7us-west-2eu-west-2ap-east-2us-east-2ap-southeast-2ap-northeast-2ap-southeast-5us-gov-west-1us-gov-east-1ap-southeast-6ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1mrapaccesspoints3s3-accesspointdualstacks3-deprecatedanalytics-gatewayemrappui-prods3-websites3-accesspoint-fipsaws-cloud9s3-fipsemrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstacks3-deprecatedanalytics-gatewayemrappui-prods3-websites3-accesspoint-fipsaws-cloud9s3-fipsemrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apicloud9s3s3-accesspointdualstackemrappui-prods3-websites3-accesspoint-fipss3-fipsemrstudio-prodbedrock-agentcores3-object-lambdaemrnotebooks-prodexecute-apis3eu-west-3ap-south-2eu-south-2computes3-ap-northeast-2elbrdss3-ap-east-1s3-sa-east-1s3-us-gov-west-1s3-eu-central-1s3-ca-central-1eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3s3-website-us-west-2s3-website-eu-west-1s3-external-1eu-central-1me-central-1ca-central-1il-central-1s3-us-west-1s3-eu-west-1s3-website-sa-east-1s3-website-ap-southeast-2ap-northeast-1ap-southeast-1s3-us-west-2s3-eu-west-2me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2us-east-2s3-website-ap-southeast-1s3-1s3-globals3-ap-northeast-3eu-north-1airflowap-southeast-2s3-us-gov-east-1s3-fips-us-gov-east-1s3-me-south-1s3-ap-south-1ap-northeast-2s3-website-us-west-1ap-southeast-5s3-eu-north-1s3-ap-southeast-1s3-website-us-gov-west-1compute-1s3-eu-west-3us-gov-west-1s3-website-ap-northeast-1us-gov-east-1s3-fips-us-gov-west-1s3-website-us-east-1s3-ap-southeast-2ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1s3-us-east-2s3-ap-northeast-1authauthauth-fipsauth-fipseu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1mx-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2ap-east-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5us-gov-west-1us-gov-east-1ap-southeast-6ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1eu-west-3eu-south-2ap-southeast-3eu-central-1ca-central-1ap-northeast-1ap-southeast-1ap-south-1us-west-2eu-west-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5eu-west-1us-east-1ap-east-1sa-east-1csrframeservicesbuilderstg-builderdev-builder*ociocpocsazuregcpawsdemoinstanceeu-west-3ap-south-2eu-south-2eu-central-2ap-southeast-3ap-southeast-4ap-northeast-3eu-central-1me-central-1ca-central-1il-central-1ap-northeast-1ap-southeast-1me-south-1af-south-1eu-south-1ap-south-1ap-southeast-7us-west-2eu-west-2us-east-2eu-north-1ap-southeast-2ap-northeast-2ap-southeast-5us-gov-west-1us-gov-east-1ap-southeast-6ca-west-1us-west-1eu-west-1us-east-1ap-east-1sa-east-1previeweu-4us-4us-1eu-1us-2eu-2us-3eu-3appss3-websitekrkrobjectprivateobjectkrkrskrkrsobjectkrprivateobjectkr-privatecomputepaasrag-cloudrag-cloud-chjcloudjcloud-ver-jpcdemonodebalancermembersipeuxvsoncillaocelotonzayalilynxsphinxfentigercustomercaracalsgkrobjectstoragedesgkrusobjectkrkr-naverkr-naver-devkrprivatewebsiteobjectkr-naverkr-privatekr-naver-devjpjpkrjp4jp5s3-website-jpjpkrjp4jp5objectprivateobjecto365cloudstaticxendevapp001testcode-builder-stgplatformmediasiteprojedrydpagesjsx0desazacncoitrueu4uhkukgrbrushatenadiarymyspreadshopfrom-flfrom-wvwebspace-hosttheworkpchatenablogcursorusercontentservesarcasmapplinzisakuratanwixsitefin-ncloudstoragegov-ncloudstorageappchizigiizeis-into-carsdnsiskinkyadobeaemcloudis-a-therapistpgfogmyvncdojinis-an-actress1kappfldrvkozowqa2jpnmexprgmrfirewall-gatewaydynnscafjsfbsbxooguyfrom-gawoltlab-demois-a-anarchistwiardwebteaches-yogadattowebtb-hostinglive-websiteservegamegotpantheonfrom-nhsubsc-payfrom-ohvipsinaappfrom-cadyndns-officeztna-dingtalkhomelinuxfrom-mahercules-appservebbsstreakusercontentfrom-okfrom-wyfastly-terrariumis-a-llamaqualyhqportalserveexchangeon-vaporvivenushopciscofreakgrayjayleaguesmetaaiusercontentfrom-iais-a-libertariansaves-the-whalestaveusercontentyolasiteoperaunitepoint2thisis-a-catererclaudeusercontentlinodeusercontentfrom-vagithubusercontentsells-for-lesshosteurcanva-appsplaystation-cloudddnsfreefrom-pafrom-prfrom-waddnskingoutsystemscloudhotelwithflightmydattois-a-nascarfanmydbserverminiserverdamnserverservehumouris-a-playerfrom-nvfrom-nmemergentagentgentappsamplifyappfrom-kyis-an-accountantnfshostserveircfrom-akpythonanywherestackhero-networkpostman-echolikescandydyndns-mailobservableusercontentserveftpfreeboxosfrom-utcdn77-storageamazonawsneat-urlnclouddyndns-serverlinodeis-a-teacherfrom-vtgleezemythic-beastsus1-pleniteu1-plenitla1-plenitpaywhirlservecounterstrikejdevcloudhealth-carereformis-into-animegoogleapisis-a-painterafricaisa-hockeynutatmetais-an-actora2hostedis-a-democratdatadetectest-le-patrondigitaloceanspacesis-a-designeris-a-hunterlinodeobjectstemp-dnsissmarterthanyoufrom-arsimplesiteevennodetownnews-stagingis-a-liberalgooglecodejelasticservemp3qualyhqpartnerdyndns-free1cooldnsest-a-la-masiondrayddnsdynuddnsfrom-orfrom-miis-a-bloggerfrom-himydobisscanvacodeis-an-engineerest-a-la-maisonupsunappdevinappswafflecellmyasustorwpenginepoweredfrom-ctservep2psame-appmyshopblocksthingdustdatalikes-piediscordsezis-with-thebandlpusercontentis-leetshopitsite3utilitiesis-a-personaltrainersinaappladeskis-a-cheflogoipselfipbase44-sandboxnospamproxyalibabacloudcsmesswithdnsauthgearappsiamallamawithgooglelutrausercontentmochausercontentframercanvasmytabitdyndns-homew-credentialless-staticblitzcpserverdiscordsaysis-a-nurseappspotatlassian-isolated-3premotewdfrom-mtwixstudiocode0emm180rmyactivedirectoryawsappsmytuleapdnsabrpolyspaceqbuserrenderbuiltwithdarkboutirgotdnsabrdnsdopaascanva-hosted-embedawsglobalacceleratorhomesecuritypcmyiphostditchyouripclever-clouddyndns-ipon-aptibleis-a-musicianhosted-by-filessecuritytacticsappspaceusercontenthomeunixstrapiappsame-previewcf-ipfsmycloudnaselasticbeanstalkis-certifieddontexistkasserverik-serverdrive-platformatlassian-3pfirebaseappncpstorageherokuappawsapprunnerbarsycenteris-a-cubicle-slaveservehttpmyshopifyis-a-guruquicksytessiiitesorsitesmagicpatternsappis-a-cpameteorappfrom-wiis-a-rockstarbumbleshrimpdattolocaldatabricksappsreadthedocs-hostedfrom-rifamilydsdyndns-picsplesknsbplaceddnsaliasdynaliasdyndns-remotedoomdnsip-ddnsblogdnsis-a-doctorroutingthecloudamazoncognitobarsyonlinedsmynasddnsgurucloudflare-ipfsdeus-canvasfrom-idsmushcdnpagespeedmobilizerdyndns-at-homeunusualpersonhosted-by-previderis-a-republicandyn-o-saurstreamlitappworkisboringonthewificprapidqualifioappis-uberleetis-slickgetmyipwpdevcloudtypeformdyndns-at-workgentlentapismynascloudw-corp-staticblitzfrom-ingeekgalaxyservebeerfrom-mdonrenderspace-to-rentaivencloudappspacehostedwafaicloudcodespotblogspotatlassian-3p-us-gov-modfrom-ndfrom-msis-a-techieis-a-studentcustomer-ociis-a-photographerdurumisfrom-ksmassivegriddyndns-wikiis-an-entertaineris-a-hard-workermysecuritycamerafrom-mnrackmazedyndns-blogis-a-bulls-fanwritesthisblogfreemyipsimple-urlfrom-sdreservdauthgear-stagingest-mon-blogueuris-into-gamesrice-labsxtooldevicesakurawebis-an-anarchistoraclecloudappsdyndns-worksells-for-urhcloudfrom-dcfastvps-serverwpmucdnis-a-geekscrysecfrom-txis-into-cartoonsmodelscapetrycloudflarelocaltonetstreak-linkbalena-devicesfrom-njforgeblocksfreebox-oswebadorsitefrom-ncdoesntexisthobby-sitestreaklinkshomesecuritymacownprovidertuleap-partnersdattorelaywphostedmailservequakeis-a-socialistservehalflifepivohostingdynuhostingquipelementsw-staticblitzdyndns-webfrom-deproject-studyis-not-certifiedhercules-devis-a-financialadvisoramazonlightsailservepicsis-a-greenloseyouripfrom-ilwithyoutubemwcloudnonprodwiredbladehostingdnsdojofrom-tnpixolinomyqnapcloudncloudstorageis-an-artisthostedpiis-a-landscaperauiusercontentoaiusercontenton-forgeis-a-conservativedreamhostersnet-freaksapps-1and1is-goneencoreapifastly-edgefrom-nesalesforcefrom-scdeployagentoraclegovcloudappsfrom-alis-a-lawyercechirevultrobjectsstufftoreadisa-geekddnsgeeklovableprojecttry-snowplowfrom-moblogsyteis-a-bookkeepernogmyforumravendbmyboxdeelementoredsaacficogoorinforgcomgobnatneteduidstoreorgcomnetintedudevnomepublorgcomneteduathgovtestscalculatorspaynowinfoquizzesresearchedcloudnsfunnelsassessmentsjscaleforcetmacltdorgmilcompronetgovbizpresseklogesrsccloudcustomfltusrcloude4corealmgovmunicontentproxy9metacentrumdyndyndyndnsdynpagespages-researchitionoccustomercomymyspreadshopipv64diskussionsbereich4limacomrubgov2ixfirewall-gatewayddnssspdnsbarsykeymachinesquare7myhome-serverspeedpartnercommunity-proschuldockxenonconnectg\xFCnstigliefernbwcloud-os-instancedyndnssecmy-routerxn--gnstigliefern-wobin-butterl-o-g-i-nisteingeekin-dslin-berlinin-brbfuettertdasnetzleitungsenin-vpnlcube-serverdyn-ip24logoipdyn-berlinruhr-uni-bochum12hpgoipsrvdnsfruskygit-repossvn-reposinternet-dnsg\xFCnstigbestellenhome-webserverxn--gnstigbestellen-zvbbplacedheimdnscosidnswebspaceconfiglima-citydyndns1istmeinvirtualuserschulplattformmy-gatewayddnsseclebtimnetztest-iservmein-iservvirtual-userhome64iservschuletaifun-dnstraeumtgeradeschulserverdynamisches-dns123webseitednshomehs-heilbronndnsupdaterbssgraphicdwadpdwdaepeweaawapaafpfwfabwbpbacwcpcciwebuserapiobjects*teamst3r2lpabymebravepanelngrokiservstglclcrmerpflypagesbarsyvivenushoplocalcertlocalplayerbearbloggatewaydeno-stagingis-not-ais-a-goodbotdashvercelmocha-sandboxplatter-appreplitgithubpreviewworkersinbrowserevervaultis-ahrsndenoxmitmodxmyaddrstorageapipayloadgrebedocruncontainersstgstagelclstageloginlineis-a-fullstackcodepenleapcellngrok-freeis-coolpagelemonstoragewebharemediatechlibp2pdiscourseimaginecomyspreadshopstoreregbiz123hjemmesidefirmcoorgcomnetedugovsldorgmilcomwebgobartnetedugovtmorgpolcomsocartnetedugovassoagrondiscoodontk12medcuegyecpaabgengorgmilgalsaltulcomadmesmgobpubdocmonfindgnriouioproartlatvetnetfotedulojgovntrturibrbarxxxofficialbasechefprofmktgpsictechinfoarqtcontdentrrpppsiqgit-pagesritmedfieorgcomlibprieduaipgovriikmeactvsportorgmilcomscieunnetedugovnameinfopintouchtawktotawkmyspreadshoporgcomnomgobedu123miwebcomputeorgcomnetedugovbiznameinfocognito-idptransfer-webappeusc-de-east-1onjelasticnxaspdnsbarsydirectwpdeuxfleurstransurldogadoprvwcloudnsamazonwebservicesdnshomeuserpartycokoobinmkmfidymyspreadshopalandkapsiikixn--hkkinen-5wacloudplatformh\xE4kkinen123kotisivuidacorgmilcompronetedugovbiznameinforadioorgcomneteduuserexperts-comptablestmmyspreadshopgretaprdcomnomynhccifbxoshuissier-justicenotairesaeroportfreeboxoson-webavocatassoportgouvkdnschirurgiens-dentistes-en-franceavouesfbx-os123sitewebveterinairechirurgiens-dentistespharmacienchambagrimedecinfreebox-osdediboxgoupilemszicpyicpvicppleysheezypagesedugovcnpyorgcomcybllcpvtnetedugovtnxonlineschooldaemond6atcopanelorgnetplybotdashstackitkaasorgmilcomnetedugovbizmodltdorgcomedugovcoorgcomneteduappwriteacorgcomnetedugovcloudtranslateusercontentorgcomnetedumobiassoorgcomnetedugovbarsysimplesitediscourseindorgmilcomgobneteduorgcomwebnetedugovguaminfonxhra\u6559\u80B2\u654E\u80B2\u7DB2\u7D61\u7F51\u7D61\u7EC4\u7E54\u7D44\u7E54\u7F51\u7EDC\u7DB2\u7EDC\u7EC4\u7EC7\u7D44\u7EC7\u516C\u53F8\u653F\u5E9C\u500B\u4EBA\u4E2A\u4EBA\u7B87\u4EBAltdorgcomincneteduidvgovxn--uc0ay4axn--55qx5dxn--mk0axixn--io0a7ixn--uc0atvxn--zf0avxxn--lcvr32dxn--od0algxn--wcvs22dxn--gmqw5axn--od0aq3bxn--mxtq1mxn--ciqpnxn--tn0agxn--gmq050iorgmilcomgobneteduiservwp2tempurlmircloudfreesitewpmudevmyfastgadgetcloudaccessjelehalfboltfastvpsemergenteasypanelopencraftizcombrendlynamefromrtpersoadultmedorgpolrelcomproartnetedufirminfoassoshopcoopgouvtmcomediahotelforumvideosportorgsexagrargameslakaseroticaerotikatozsdereklamcasino2000filmsuliinfoboltshopprivnewsszexcityutazasjogaszkonyveloingatlaneacaicogoormy\u1B29\u1B2E\u1B36milwebschnetkopbizzonedesaponpesxn--9tfkymyspreadshopgovmytabittabitorderravpageaccok12idforgnetgovmuniltdplcaccotttvorgcomnetmeca6g5gpgamubacaicniocoukuptverdruscsdelhiindorgmilcomwebnicfingenpronetintedugovresbizbiharbarsyinternetbusinessschooltravelsupabasealumnigujaratfirminfoaeropostbankcoopindevscloudnsno-ipbarsybarrell-of-knowledgebarrel-of-knowledgensupdategroks-thisdnsupdatefor-ourknowsitalldvrcammittwalddynamic-dnsv-infowebhopselfipdyndnshere-for-moreilovecollegemayfirstforumzcloudnsmittwaldservertypo3servergroks-theeusekd1cdndyndnsidrawsainaueuapjpusstagemocksysdevicesclientcustreservdcustdevdisrecprodtestingcobeebyteutwenteboxfusebravepstmndedynngrokorgmilcomnomnetedugovqcxqzzbarsythingdustmo-siemensrb-hostingfh-muenstergitbookbluebitecloudbeesusercontentnodeartkiloappsforgerockdarklangresinstagingapigeebubbleb-datascryptedhypernodedappnodepantheonsitegitlabgithubkeeneticvirtualservercleverappshostyhostingon-rioedugitticketstelebitwixstudioon-k3sicp0icp12038jeleqotolairbubbleappsmyaddrstolosmyrdbxwebflowdrive-platformbeagleboardhasura-applolipopdefinimavaporcloudmusicianwebflowtestazurecontainerresindevicereadthedocsloginlineeditorxmoonscalesandcatsbasicserverwebthingsbrowsersafetymarkbeebyteappbitbucketidaccovistablogorgschnetgovxn--mgba3a4f16axn--mgba3a4fraarvanedge\u0627\u064A\u0631\u0627\u0646\u0627\u06CC\u0631\u0627\u0646jclaspeziapdudcefegelemeperetevebacanatavaparasabgagfgogrgpgalclblimfmrmcbmbvbfclcmcvcrcpcchlimifibicivipirisimncnbnanenrnpntnnolomobocoaogorosopotoptvtatctbtmtltotpusulunutpspapaqsvpvvvtvavvrtrsrprgrfrcrbrarorkrvstsssbscsmsispzczbzbozen-suedtirolmyspreadshopxn--bulsan-sdtirol-nsbxn--valledaoste-ebbtrentinoaltoadigetrentin-sued-tirolxn--forlcesena-c8axn--forl-cesena-fcbxn--bozen-sdtirol-2obtriestetrentinsuedtiroltrentino-s-tirollecceudineaostesienaparmaluccapaviagenoapaduaaostamonzaabruzzoternirietiturinmilanbozenlaziofermoleccocuneonuoropratola-speziavdataaligfvgpugmolcalcamlomumbsicpmnvenvaoedugovabrsarmaremrbastoslazibxosfirenzetrentinos\xFCdtirolval-d-aostavalle-aostamessinacremonaravennatoscanatrentin-suedtirolbolognacalabriaurbinopesarofriuli-v-giuliaogliastraxn--valle-aoste-ebblaquilaandriatranibarlettasyncloudxn--valle-d-aoste-ehbaostavalleyvalled-aostatrentino-alto-adigevallee-d-aostexn--balsan-sdtirol-nsbpistoiasicilialucaniacataniaiserniaperugiabresciaveneziagorizialiguriaimperiabulsan-suedtirolbalsan-suedtirolbarlettatraniandriaxn--trentino-sdtirol-szbforl\xEC-cesenatuscanyvall\xE9e-d-aostemantovavall\xE9e-aostecasertapiemontevalleaostaval-daostafriulivgiuliatrevisoforli-cesenavall\xE9edaosteferrarapescaravald-aostatrentino-altoadigefriuli-vegiuliavallee-aostecarboniaiglesiastarantomediocampidanovalleedaostetrentinosud-tirolcampobassotrentins\xFCd-tiroltrentinos\xFCd-tirolmonzabrianzatrentino-s\xFCdtirolxn--trentino-sd-tirol-c3bpotenzacosenzavicenzaemiliaromagnavenicefrosinonemarchepordenonetrentinosued-tirolvaresemolisevall\xE9eaostefriuli-veneziagiuliabasilicatalatinaanconasavonaveronamodenabiellabolzano-altoadigepugliafoggiaumbriatrentino-stirolgenovapadovamateranovararagusapiacenzatrentinostirolvalleeaostetempio-olbiasudsardegnatrentinsudtirolmassa-carrarafriuliveneziagiuliatrentinosuedtirolandria-barletta-tranitrapanixn--cesenaforl-i8amaceratacaltanissettaascoli-picenobrindisicarraramassacagliaririmininapolivibo-valentiachietibulsan-sudtirolbalsan-sudtiroltrentino-a-adigebulsanbalsaniglesiascarboniamilanotorinoteramodell-ogliastraarezzotrentinoalto-adigerovigotrentovenetoiglesias-carboniatrentino-sud-tirolaltoadigereggio-emiliareggio-calabriasardegnatranibarlettaandriapiedmontxn--sdtirol-n2amedio-campidanotrentino-s\xFCd-tirolfriuli-vgiuliafriuli-ve-giuliaromeennaromapisa32-b16-b64-blodiastibarineencomonaplesforlicesenailiadboxosalessandriasicilytrani-barletta-andriaxn--trentin-sdtirol-7vbpesarourbinotrentinsued-tirolcesena-forliforl\xECcesenaemilia-romagnamonzaebrianzaxn--trentinsdtirol-nsbtrentinos-tiroltrentins\xFCdtirolvalledaostaolbia-tempiocampidanomediovibovalentiasassarivalle-daostalombardysud-sardegnafriulivegiuliareggioemiliamonzaedellabrianzaalto-adigevercellitrentin-sudtiroltraniandriabarlettatrentino-sudtirolascolipicenobozen-s\xFCdtirolfriulive-giuliaflorencexn--cesena-forl-mcbcarbonia-iglesiasaosta-valleycarrara-massadellogliastratrentinoa-adigexn--valleaoste-e7apesaro-urbinoxn--trentinosdtirol-7vbxn--trentin-sd-tirol-rzbxn--trentinsd-tirol-6vbtrani-andria-barlettatrentin-s\xFCd-tirolxn--trentinosd-tirol-rzbgrossetomonza-e-della-brianzas\xFCdtirolreggiocalabriatrentinoaadigetrentin-s\xFCdtirolverbano-cusio-ossolafriuliv-giuliaverbaniacampaniatrentino-aadigefriulivenezia-giuliasardiniaandriabarlettatranibarletta-trani-andriacatanzarooristanourbino-pesarocesena-forl\xECvalle-d-aostacampidano-medio123homepagesiracusatempioolbiasuedtirollombardiaavellinocesenaforl\xECtrentinofriuli-venezia-giuliabozen-sudtirolandria-trani-barlettabulsan-s\xFCdtirolbalsan-s\xFCdtirolmonza-brianzabolzanotrentino-sued-tirolbellunosalernolivornocrotonesondriodnshometrentinsud-tirolmassacarraratrentin-sud-tiroltrentino-suedtirolviterbobergamocesenaforliolbiatempiopalermobeneventoagrigentoofcoorgnetfmaitvphdengorgmilcomschnetedugovperagrikanieasukehandachitatokaiaisaikonanoharuamaobuhigashiuraowariasahiinuyamatobishimaiwakurashitarainazawatoyonegamagorimihamatoyotataharakariyayatomioguchikomakimiyoshinishiotokonamekiyosuchiryutoyohashiokazakiisshikikasugaikotakiratoeianjotogofusosetohazutsushimashinshirotakahamanisshinshikatsuhekinantoyokawaichinomiyatoyoakeodateogataakitaikawakyowahonjoogayurihonjonoshirokamiokakatagamimitanegojomeyokotekosakadaisenkazunonikahohonjyomoriyoshimisatohappoukamikoanihachirogatahigashinarusesembokufujisatokitaakitaitayanagiowanitakkomutsutsurutahirosakigonoheoirasetowadamisawanohejiaomorishingohiranairokunohehashikamitsugarushichinohehachinohenakadomarisannohekuroishisakaeisumiasahiotakiinzaiabikomatsudoyachiyomutsuzawakujukuriomigawakashiwatoganemihamanaritasakuranagaramobarahanamigawachoshishiroichoseikozakishisuikatorimidorichonankyonanfuttsuonjukufunabashinagareyamanodasosatakochuotohnoshourayasukimitsuyokaichibayotsukaidosodegauratateyamakamagayayokoshibahikariyachimatakatsuuratomisatokisarazukamogawaichikawanarashinoichinomiyashimofusaminamibososhirakoichiharaoamishirasatoikatahonaiainansaijoseiyoiyoozuuwajimaniihamanamikatamasakiuchikokihokutobetoonshikokuchuomatsuyamaimabarikamijimakumakogenyawatahamamatsunosabaeikedaobamasakaifukuiohionotsurugamihamawakasaminamiechizeneiheijikatsuyamatakahamaechizensoedaukihaomutaokawanishiogoribuzenonojosueumiokiotochikugosasagurisaigawamizumakishinyoshitomikurumekurateyamadakasuganakamamiyamanogatatakatahakataiizukakawaratagawakasuyaashiyainatsukimunakataminamitsuikishonaikurogifukuchikeisenhigashimiyakoshinguyukuhashiokagakiyamekogaongausuikahotohochuotoyotsumiyawakadazaifuhisayamatachiaraiyanagawanakagawahirokawachikujochikushinochikuhochikuzennamieotamaokumashowateneiiwakikoorinangoononishigoshimogoomotegomishimafukushimaasakawakagamiishishirakawaiitatefutabahiratayugawahanawakitakatakawamatakunimiyabukibandaihigashihironoyamatomiharuyamatsuriaizubangedatesomaaizuwakamatsuyanaizuaizumisatonishiaizuizumizakikitashiobarataishinkaneyamakoriyamainawashirotanagurafurudonosamegawasukagawaishikawatamakawaikedaogakitaruiginanenahashimahichisonakatsugawaibigawashirakawamizunamiminokamomitakekawauesekigaharatomikasakahogikitagatayamagatatajimianpachimotosuyaotsukakamigaharahidakanisekitokigujominogodoyorogifukasamatsutakayamawanouchihigashishirakawakasaharashimonitatsumagoichiyodakannakanrashowameiwakiryuotaoratomiokafujiokaitakuranaganoharahigashiagatsumatakasakishibukawaminakamikatashinatsukiyonokawabanumataannakaoizumimidorishintoisesakiuenoyoshiokakusatsutakayamanakanojonanmokutamamuratatebayashimaebashiotakekaitadaiwahongofuchukuietajimashobaramiharahatsukaichihigashihiroshimamiyoshikumanokurenakasakaseraseranishiasaminamifukuyamashinichionomichiosakikamijimajinsekikogentakeharaotobenanaeikedatohmaozoraobiraabirakyowaeniwataikibibaisharirebunerimohiroooketootarupippunishiokoppechitosefurubirahakodateshiranukakitahiroshimakushiroobihironanporoiwamizawaniikappukunneppufukushimanakasatsunaitoyourakuromatsunaiakabirakamisunagawashibechaurakawakamifuranonakatombetsuasahikawashimokawakayabeokoppebiratoriabashirisaromaatsumanumatahidakabifukamukawamikasahorokanaitoyotomisarufutsuhigashikawaishikarikitamiyoichiesashiiwanaitomariminamifuranoakkeshifuranotoyakoyakumootoineppushikaoishiraoinemuronayorohaboroashorobihororishirifujiutashinaihokutotakasuebetsuurausuassabukikonaishimamakinaiedatetoyabieinikiesanuryuoumuteshikagarikubetsuashibetsukimobetsuaibetsutobetsusobetsuembetsushimizuchippubetsurishirihokuryuhoronobeshintokutsubetsushibetsuhonbetsumombetsutsukigatakuriyamakoshimizushiriuchikutchanmurorannoboribetsukamishihorowassamushinshinotsukembuchiwakkanaikamoenaikiyosatotakinoueshikabesunagawafukagawanakagawatakikawakamikawahigashikagurahamatonbetsumatsumaemoseushirankoshishakotanimakanemashikeotofuketomakomaisandatambaitamiawajikasaiasagoshisoonoakoyashirotoyookaminamiawajiinagawafukusakitakasagokamigorikasugaharimayokawaashiyahimejiakashitaishiaogakisannantakinosumototakarazukanishinomiyashingugoshikinishiwakiyokatakaaioimikisayoyabukawanishiamagasakisasayamashinonsenkakogawaichikawakamikawatatsunotsukubaiwamaogawaasahisakaitokaioaraiitakobandodaigosuifuinaamikasumigaurakashimaomitamayachiyoshimodatetomobetoridehitachinakainashikisakuragawakasamayawaramoriyahitachiomiyanamegatayamagatahitachikamisuushikutakahagiibarakitonekoganakasowayukimihojosomitoryugasakishimotsumafujishirotsuchiurachikuseihitachiotashirosatotamatsukuriuchiharashikahakuinanaotsubatawajimakahokukawakitatsurugikaganominotosuzuuchinadakomatsuanamizunakanotohakusannonoichikanazawaiwateshiwafudaikawaimoriokaofunatohanamakikuzumakikitakamininohekunoheyamadayahabasumitaichinosekitanohatahiraizumirikuzentakatajobojiotsuchihironomiyakoiwaizumikarumaiichinohenodakujitonooshushizukuishifujisawamizusawakamaishikanegasakimannoutazukotohiraayagawazentsujihigashikagawauchinomikanonjisanukimarugamemitoyotakamatsutadotsunaoshimatonoshoakuneamamiizumihiokiyusuikinkoisasookouyamanakatanekagoshimakanoyaisenkawanabeminamitanemakurazakitarumizunishinoomotematsumotosatsumasendaioimatsudaayaseebinamiurazushinakaiodawaraiseharasagamiharahakoneaikawakaiseiatsugitsukuihadanoyamatoyamakitazamaoisochigasakininomiyayokosukakamakuraminamiashigarafujisawasamukawakiyokawahiratsukayugawaraokawaumajikochitsunootoyoakiinonishitosayasudahidakamiharasakawaniyodogawahigashitsunokagamigeiseisusakiotsukinaharisukumomurototosakamiochitoyotosashimizumotoyamanankokunakamurakitagawayusuharaogunichoyoukiasoutoozugyokutoamakusamifunetakamoriyamagaminamataminamiogunikikuchisumotoyamatonagasumashikiaraokumamotokamiamakusanishiharayatsushiroayabeseikasakyoideineujinakagyokameokakyotangokyotanabekyotambaminamiyamashiroyamashinatanabeyawatawazukaminaminantanmiyazuhigashiyamafukuchiyamakitamukokamojoyokizumaizuruujitawaraoyamazakinagaokakyokumiyamakawagoeinabeshimameiwaasahitaikiudonoisetsukisosakikuwanamihamamiyamasuzukatamakimisuginabarikumanokomonominamiisewataraitobakiwatakikihotadomatsusakayokkaichikameyamaureshinoishinomakishichikashukuohirataiwaosakizaohigashimatsushimashikamaiwanumashibataogawaraonagawakawasakiseminemarumoriminamisanrikukakudamuratawakuyatomiyanatoriwataritagajomisatotomekamirifushiroishimatsushimayamamotoshiogamafurukawahyugaebinotsunosaitoayakushimanobeokakitauramiyazakitakazakigokaseshiibamimatashintomikunitomikitakatakobayashikawaminamitakaharukijotakanabemiyakonojonishimeranichinankitagawakadogawamorotsukakisofukushimaminamimakisakaeobuseikedaogawamiasaokayaasahiotakiotarichinoinaomichikumakomaganechikuhokukaruizawayasuokaooshikaikusakaminamiaikitogakushimatsukawakawakamitateshinatakamorikitaaikishiojirimiyadahakubaiizunaiijimaiiyamamiyotasuzakayasakatoguraookuwanagawaminowahirayayamagataminamiminowafujimiomachisakakitakaginaganonakanosakuhokomoronagisoshinanomachiwadauedaiidaharasuwatomiachiaokianankisosakunozawaonsenagematsutakayamashimosuwamatsumotoyamanouchinakagawamochizukiazuminotatsunoobamaomuraseihiunzenosetofutsuikichijiwanagasakiisahayahasamisaikaikawatanasasebohiradokuchinotsugototogitsutsushimashimabarashinkamigotomatsuurayamazoekashibaikomakawaitenrioyodosangokoryoudaojiikarugayamatokoriyamatenkawakatsuragikurotakikawakamimiyakemitsuetakatorikamikitayamayamatotakadahegurishinjokanmakisakuraitawaramotogoseoudanarasoniandokawanishishimoichihigashiyoshinokashiharashimokitayamanosegawayoshinomintsivorytopazsakuragehirnsumomoaseinetopalmail-boxmokurenyoitamuikaojiyagosensanjoaganomyokoseiroagaomishibataniigatanagaokamurakamiuonumayuzawakariwatagamitainaitsunanminamiuonumatochioyahikojoetsuseiroukamosadoizumozakitokamachiitoigawasekikawakashiwazakitsubamemitsukekokonoesaikiusukibeppuusahimeshimakunisakihasamataketatsukumihitaoitahijikusuyufukujukamitsuebungoonobungotakadaibaraniimibizentsuyamaokayamakasaokahayashimayakagemaniwaakaiwamisakishinjotamanotakahashikibichuowakesojanagishookumenannishiawakurakurashikiasakuchisetouchikagaminosatoshotomigusukunakagusukuyaeseizenaurumaiheyaaguniogiminanjokinminamidaitokitanakagusukuyonaguniokinawaishigakikunigamiurasoekadenataramahiraraginozataketomishimojizamamitonakiitomanhigashimotobuyonabarugushikamionnanahanagohaebarukumejimakitadaitonakijinnishiharayomitanginowantokashikiishikawaikedasuitaminohizuminishisakaikananabenodaitoosakasayamayaokishiwadatadaokakaizukatondabayashichihayaakasakakumatorikadomasayamahigashiosakashijonawatehirakatataishimisakitajirihannansennankatanotoyonominatosettsuhigashiyodogawaibarakinosekitachuohigashisumiyoshifujiiderakashiwaraizumiotsutoyonakamatsubaramoriguchiizumisanoshimamototakatsukineyagawahabikinotakaishikawachinaganoyoshinogarikamiminearitaouchiimarihizenogikashimaariakekiyamafukudomikitagatakitahataomachigenkaikanzakinishiaritakyuragisagataratosutakushiroishikaratsuhamatamakouhokukawagoeyoshidasatteogoseirumaasakaurawaogawaniizaomiyayoriiotakishikihonjooganohannohanyuinasaitamaokegawaarakawayoshikawayokozehasudasayamahidakafukayachichibuiwatsukiryokamiyoshimikamiizumifujimiwarabiranzanmiyoshiminanoyashiosakadosugitomisatohigashichichibutodasokakukiyonokazoshiraokakasukabekounosukawajimatsurugashimamiyashirokitamotohatoyamamoroyamahatogayakumagayakawaguchinagatorokamisatomatsubushinamegawatokigawakamikawafujiminohigashimatsuyamakoshigayatokorozawas3isk01isk02ryuohkoseikonanaishorittotakashimamaibarahikonetorahimenishiazaikokagamokotoyasuotsukusatsunagahamamoriyamatoyosatotakatsukinotogawaomihachimanhigashiomiakagiunnanizumogotsuamayatsukakakinokimatsuehamadamasudahikawahikimiokuizumoyasugiyakumomisatotamayuohdahigashiizumookinoshimanishinoshimatsuwanoshimaneshimadafujiedayoshidashimodagotembaiwataatamikosaiyaizuitoizumishimahaibaramakinoharaomaezakikawanehonkannamisusonohigashiizufukuroinumazukawazufujiaraishizuokahamamatsushimizuizunokunimatsuzakimorimachiminamiizunishiizukikugawakakegawafujikawafujinomiyaujiietsugaoyamayaitaohiranikkoashikagakuroisokanumasakurashioyakarasuyamamotegiichikaikaminokawatochigihagamokanogisanobatonasumibunasushiobaranishikatautsunomiyaiwafunemashikoshimotsukeohtawaratakanezawaitanokomatsushimatokushimaichibaminamiaizumiwajikikainanmiyoshinarutomimamugiananmatsushigesanagochishishikuinakagawamachidachiyodakomaefussainagitaitochofufuchuomeotahigashiyamatotoshimaokutamaaogashimakodairaedogawaarakawahachiojishinagawatachikawashibuyasuginamihinodekiyosesumidaoshimanerimamitakahamuraadachinakanomizuhobunkyomegurominatokoganeihigashikurumekokubunjihigashimurayamamusashimurayamatamakitahinochuokotokatsushikakouzushimaogasawaraakishimakunitachishinjukusetagayamusashinohachijoitabashiakirunohinoharachizunanbukotouramisasawakasayonagokogehinoyazutottorinichinansakaiminatokawaharaoyabetairainamiasahinantoimizufuchutakaokakurobeyamadajohanatoyamatonaminyuzenfunahashinakaniikawanamerikawaunazukitogahimiuozufukumitsutateyamakamiichiiwadearidayuasainamitaijikatsuragiaridagawatanabemihamahidakakainankiminomisatoshingushirahamakamitondayurakozakoyagobokitayamawakayamakudoyamahashimotokushimotokozagawahirogawakinokawanachikatsuurarsuseroeoishidasagaeoguniasahinagaitendonanyoobanazawanishikawasakataohkuratozawamikawamamurogawayamagatafunagatatakahatashonaishinjokahokuiideyuzakawanishitsuruokakaminoyamayamanobeshiratakamurayamanakayamakaneyamahigashineyonezawasakegawamitouubeyuuabushimonosekitabuseoshimatoyotaiwakunihikarishunannagatohagihofukudamatsutokuyamashowadoshitsurunanbukoshukaiminami-alpsnirasakikosugeotsukioshinohokutominobuyamanashifuefukichuokofuichikawamisatoyamanakakonakamichitabayamanishikatsuranarusawafujikawahayakawafujiyoshidafujikawaguchikouenohara\u9577\u91CE\u4EAC\u90FD\u5C90\u961C\u5927\u962A\u4E09\u91CD\u7FA4\u99AC\u5343\u8449\u6ECB\u8CC0\u4F50\u8CC0\u5948\u826Fadednelgaccogogror\u79CB\u7530\u611B\u77E5\u9AD8\u77E5\u57FC\u7389\u6C96\u7E04\u6803\u6728\u718A\u672C\u5CA9\u624B\u9752\u68EE\u5C71\u68A8\u65B0\u6F5F\u5CF6\u6839\u9CE5\u53D6\u9577\u5D0E\u9999\u5DDD\u5BAE\u57CE\u77F3\u5DDD\u5927\u5206\u5BAE\u5D0E\u8328\u57CE\u5C71\u53E3\u5175\u5EAB\u5C71\u5F62\u5FB3\u5CF6\u5E83\u5CF6\u798F\u5CF6\u798F\u5CA1\u5CA1\u5C71\u5BCC\u5C71\u9759\u5CA1\u611B\u5A9B\u798F\u4E95\u6771\u4EACxn--4it168dhatenadiaryxn--vgu402ckawaiishophatenablogcocottenamaste\u5317\u6D77\u9053penneehimeiwateversestabachibashigagonnagunmapermahaccaakitaosakauh-ohblushkochiaichifukuikuroncapooitigohyogotokyokyotopunyuthickcheap0t00g00j0mie2-ddaapyawjg0amfemsubxiiboomoobutchueekpgwrgrherskrboyrdyupperunderflierchipsmydnsheavyangryhippygirlyrulez\u795E\u5948\u5DDD\u9E7F\u5150\u5CF6\u548C\u6B4C\u5C71bambinaxn--nit225kokayamasaitamaxn--k7yn95exn--1lqs03nsapporoparasitelolipopmcxn--efvn9sniigatafukuokatokushimafukushimahiroshimakagoshimafakefurokinawaxn--8pvr4ucoolblogxn--0trq7p7nnkawasakinagasakimiyazakichilloutxn--8ltr62kxn--klty5xpeeweezombiecutegirlxn--rny31hxn--uuwu58axn--ntso0iqx3axn--djrs72d6uytoyamanikitanyantakagawamimozanagoyaboyfriendxn--2m4a15egreaterchowderegoismyamagatafashionstorexn--elqq16hxn--pssu33lsendaimiyagixn--rht27zpecoriaomorisaloonwatsonvivianxn--djty4knobushipigboatnaganopinokoxn--f6qx53asadistvelvetsecretxn--5js045dchicappayamanashiibarakidigickgirlfriendxn--1lqs71dmongolianxn--c3s14mxn--qqqt11mtochigixn--5rtq34kparallelo0o0mondkobesagabonadecaoitanarafoolkilldecimainhiholomosblokilociaoundopupugifutankcrapflopnooroopsmodsholyjeezstripperpepperbittershizuokaxn--rht3dkitakyushureadymadeicurusversusmatrixxn--rht61ehungryfloppygloomycrankyhandcraftedlittlestarxn--klt787dxn--kltx9awhitesnowsunnydaytottorilovepoptheshopbuyshopxn--5rtp49cxn--d5qv7z876cwebaccelxn--kbrq7oxn--4pvxsxn--1ctwolovesickkumamotocatfoodxn--tor131oyokohamawakayamatonkotsuxn--ehqz56nxn--uist22hxn--6btw5axn--kltp7dyamaguchifrenchkisspussycatxn--4it797kxn--uisz3gbabybluexn--zbx025dnetgamersxn--7t0a264ckanagawaxn--6orx2rishikawaxn--ntsq17ghalfmoonschoolbusjellybeanxn--mkru45iusercontentlolitapunkxn--32vp30hsakurastoragehokkaidoshimanecandypopbabymilksupersaleweblikeraindropbackdropwebsozaikikirarahateblodaynightmeneacsccogoormobiinfoaeusxxorgmilcomnetedugovorgcomnetedugovbizinfotmprdorgmilcomnomedugovassnotairespresseassocoopgouvveterinairemedecinpharmaciensorgnetedugovtraorgcomedurepgovmeneperekgacscaiiocogoitoresmshsseoulbusanulsandaeguc01milvkimmvchungnamjeonnamjeonbukeliv-dnsgyeonggijejueliv-cdnincheondaejeongangwongyeongbukgwangjuchungbukgyeongnameliv-apicoeduindorgcomembnetedugovorgmilcomnetedugovjcloudorgcomnetintedugovperbnrinfocooyorgcomnetedugovethipfscanvamypepethw3sstorachakeeneticjoinmcinbrowserdwebcyonnftstoragemyfritzaemewphlxachotelltdorgcomwebsocschngonetintedugrpgovassnomgacsccoorgnetedugovbizinfo123websiteidorgmilcomasnnetedugovconfidmedorgcomplcschnetedugovaccoorgnetgovpresstmassoirseproxaccosoundcasthoptocraftvp4c66orgnetedugovitsmcdirmyboxbarsyedgestacksynologylogintoopencloudnohostwebhopdiskstationi234tcp4hoocgroknoipprivmydsddnsdnsforlohmustransipdscloudfilegear-sgbrasiliafilegearframerbarsybarsyonlinecoprdorgmilcomnomedugovinforgcomnetedugovnameacprorgcomartnetedugovpresseinfoassoinstgouvorgnycedugovbarsydscloudjuorgcomnetedugovminisiteaccoororgcomnetgovorgmilcompronetintedugovbizmuseumnameinfoaerocoopaccoorgcomnetintedugovbizcooporgcomgobneteduorgmilcomnetedugovbiznameaccoorgmilneteduadvgovcoorgcomnetaltgovforgotherhiskeeneticispmanagernomassoprod5476132eastasiacentraluswesteuropewestus2eastus2pnortheurope-01newzealandnorth-01southindia-01southcentralus2-01norwaywest-01eastus2-01westus2-01australiaeast-01italynorth-01israelnorthwest-01swedencentral-01westeurope-01centraluseuap-01taiwannorthwest-01uaecentral-01northcentralusstage-01israelcentral-01mexicocentral-01canadacentral-01austriaeast-01germanywestcentral-01francecentral-01ukwest-01denmarkeast-01polandcentral-01eastus-01westus-01swedensouth-01eastus3-01westus3-01brazilsouth-01centralus-01francesouth-01australiacentral-01westindia-01uaenorth-01jioindiacentral-01canadaeast-01belgiumcentral-01spaincentral-01koreacentral-01chilecentral-01qatarcentral-01westcentralus-01eastus2euap-01norwayeast-01southafricanorth-01brazilsoutheast-01germanynorth-01switzerlandnorth-01switzerlandwest-01japanwest-01southafricawest-01japaneast-01eastasia-01indiasouthcentral-01taiwannorth-01centralindia-01uksouth-01southcentralus-01northcentralus-01eastasiastage-01indonesiacentral-01australiacentral2-01australiasoutheast-01malaysiawest-01koreasouth-01southeastasia-01southeastus5-01northeastus5-01jioindiawest-01rucdnwest1-usfra1-desandboxjls-sto1jls-sto3jls-sto2aglobalabglobalsslmapprodfreetlsmapvpslon-1lon-2ny-1fr-1sg-1ny-2paassnwebpaashostingjelasticnordeste-idcsocuserpagescwebfileblobservicebuscoreatlricnjsjelasticwebsitestoragesezagbinruhuukjptsmyspreadshopmynetnameakamaiorigin-stagingfrom-coipv64dynv6cdn77serveblogadobeaemcloudhicamsprytdnsupno-ipownipde5ovhicpfirewall-gatewaysytesmypsxbarsyusgovcloudapimyamazemyradwebakamaihdsaveincloudfastlylbfrom-lasubsc-paysquare7in-the-bandblackbaudcdnhomelinuxoninfernoctfcloudservebbsdns-dynamiccloudfrontakamai-stagingipifonyham-radio-opsenseeringclickrisingcommunity-profrom-nylocalcertgrafana-devedgesuite-stagingcloudflareanycasteating-organicatlassian-devmydattofeste-iplocaltotorprojectknx-serveredgekeycloudflareglobalcloudyclustercasacamserveftpakamaized-stagingakamaiorigindns-cloudmyeffectboomlabotdashbuyshousestwmailhetemlazure-mobilein-dslthruhereredirectmedynuddnsbouncemesupabaseluyanicloudappakamaicloudfunctionsdebiannhlfanpgafanstatic-accessin-vpnmysynologymafeloappudohomeftptrafficmanagersiteleafseidatmemsetcloudflarecloudaccesskeyword-onazure-apiis-a-chefdoes-itgets-itwebhopselfiphomeipkicks-assedgesuitewindowsserver-ontunnelmolemydissentscrapper-sitecloudflarecnuni5srcfggffiobbzabchrsndenodynuopikddnsvpndnsakadnselastxkinghostvps-hostfastlyhomeunixazureedgeshopselectdontexistmyfritzcloudjiffyalwaysdatasells-itsquaresbroke-itazurefddattolocalat-band-campmeinforumfamilydsazurestaticappsdefinimabplaceddnsaliasdynaliasnow-dnsblogdnsroutingthecloudendofinternetdsmynasakamaiedgemymediapcadobeio-staticakamaiedge-stagingakamaihd-stagingddns-ipprivatizehealthinsurancelive-onkrellianschokokeksmassivegridmysecuritycamerarackmazeserveminecraftfrom-azis-a-geekakamaizedmoonscaleoffice-on-theusgovtrafficmanageradobeioruntimeedgekey-stagingreserve-onlinechannelsdvrdnsdojousgovcloudappcdn77-sslapps-1and1podzoneazurewebsitesdynathomescaleforceyandexcloudvusercontentisa-geekcdn-edgescoaemalcesappwriteazimuthtlonarvobuiltwithrocketnoticeablestorecomwebrecnetperotherfirminfoartslgdloncogoiltdorgmilcolcomplcschgenngonetedugovbiznamefirmmobiacincoorgmilcomnomwebgobnetintedubizinfocomyspreadshopdemongovtransurl123websitehosting-clusterkhplaycistrongsnesosvalerv\xE5lerxn--vler-qoaossandeheroysandeher\xF8yb\xF8boheroyher\xF8yxn--hery-iraxn--b-5gavalerb\xF8boxn--b-5gasandesandexn--hery-iraxn--vler-qoav\xE5lerh\xE5re\xE5laahavaofsfvfhlolnlalrlhmfmtmahcostntbu\xE5strmreigersundmyspreadshopg\xE1ls\xE1eidsvolltingvollgildeskalflor\xF8vads\xF8vard\xF8vanylvenxn--bhccavuotna-k7astrandaxn--kvnangen-k0axn--sknland-fxaxn--mosjen-eyarakkestadhyllestadnannestadvevelstadvaapstenordre-landsondre-lands\xF8ndre-landtjieltexn--vrggt-xqads\xF8r-aurdalsor-aurdalheradstordmoldefordef\xF8rdeseljefedjeryggehemnexn--krehamn-dxasognegranes\xF8gnebrynetjomevallebykletokkegiskedovretj\xF8mehob\xF8lvoldasaudatolgas\xF8mnaviknad\xF8nnasomnadonnatranafrananesnaraumasmolatr\xE6nafr\xE6nalesjasm\xF8la\xF8rstaorstahitrafloraaukraloppafr\xF8yarissasnasahalsagalsaromsaraisar\xE1isafroyasn\xE5sagronghobolfjelltydal\xE5rdalardalaskimharamkraanghkekr\xE5anghkesorumbarumhurumb\xE6rums\xF8rummodums\xE1l\xE1tb\xE1l\xE1tfrognbjugnv\xE5ganvagangulenskienl\xF8tenlotenstrynvefsnxn--merker-kuaskaunsveiob\xF8mlobomloskj\xE5kvardoflorovadsosalatbalats\xE1latkl\xE6buklabuselbubarduulvikskjakkleppris\xF8rxn--nttery-byaefl\xE5eidflahofmilgolholsellomskifetvikdepvgsfhsaskerrisorhamarasnes\xE5snesr\xF8rosrorosxn--slat-5namasoynaroyvaroyluroydyroyaskoyradoyandoyrodoymeloyrad\xF8yand\xF8yr\xF8d\xF8ymel\xF8yask\xF8ylur\xF8ydyr\xF8ym\xE5s\xF8yv\xE6r\xF8yn\xE6r\xF8yhoylandeth\xF8ylandetdivtasvuodnal\xF8renskoglorenskognesoddtangenxn--tjme-hraxn--smla-hraxn--stjrdal-s1aunjargalillehammerunj\xE1rgaxn--hamary-fyadavvenjargaxn--bearalvhki-y4a123hjemmesidegjerdrumxn--brnnysund-m8acxn--tnsberg-q1axn--mlatvuopmi-s4axn--snsa-roaxn--skierv-utaxn--brum-voatysfjordkvafjordeidfjordkv\xE6fjordsongdalenmjondalenmj\xF8ndalenxn--gls-elackragerog\xE1\u014Bgaviikagangaviikas\xF8rreisasorreisas\xF8r-varangersor-varangerxn--risr-iraskiervaxn--frna-woaxn--trna-woakvinesdalleksvikleirvikr\xF8yrvikroyrviksvelvikvenneslaevje-og-hornnessandnessj\xF8enmarnardalvindafjordsandefjordenebakksnillfjordullensvangxn--trany-yuabr\xF8nn\xF8ysundnamsskoganaustevollxn--stjrdalshalsen-sqbnord-aurdalnord-frontr\xF8gstadtrogstadgrimstadflakstadgjerstadxn--sandy-yuaxn--leagaviika-52bnore-og-uvdalvegarsheixn--rlingen-mxaxn--ggaviika-8ya47hveg\xE5rsheikarlsoykvitsoymasfjordenhamaroyinderoyosteroydavvenj\xE1rgasauheradguovdageaidnuxn--vre-eiker-k8abronnoysiellakkr\xF8dsheradkrodsheradkvinnheradbr\xF8nn\xF8yxn--mtta-vrjjat-k7afxn--lrenskog-54akvits\xF8yv\xE1rgg\xE1tkarls\xF8yoster\xF8yinder\xF8yhamar\xF8ybronnoysundxn--aurskog-hland-jnbbahccavuotnab\xE1hccavuotnagiehtavuoatnastor-elvdalmidtre-gauldalxn--gildeskl-g0akarasjokevenassixn--bievt-0qaxn--yer-znalebesbynessebyxn--hbmer-xqamalselvm\xE5lselvxn--unjrga-rtam\xF8re-og-romsdalmore-og-romsdalhareidmeland\xF8rlandorlandstrand\xE5lg\xE5rdsolundalgardafjord\xE5fjorddielddanuorrikautokeinoxn--stre-toten-zcbskodjeaejriestangeliernebamblestokkefauskesn\xE5asesnaasekongsvingerlangevagberlevagxn--flor-jrahattfjelldalostre-toten\xF8stre-totenvestfoldxn--mely-ira\xE1laheadjualaheadjunordreisaxn--troms-zuaxn--lgrd-poacporsangerflatangerstavangerleikangerbremangersamnangergieldakarasjohkaxn--rdy-0nabfrostautsirasnoasatromsaxn--sr-aurdal-l8aflekkefjordj\xF8lsterjolsteraremarkhedmarkn\xE5\xE5mesjevuemienaamesjevuemiexn--vard-jrarollagmer\xE5kermerakerorskog\xF8rskogxn--bdddj-mrabd\xE1k\u014Boluoktaxn--osyro-wuaaknoluoktatrysilskjerv\xF8ymandaljondalbindalrindalmeldalsuldalorkdalsigdalalvdall\xE6rdalhurdalsirdalverdallerdallardaloppdal\xE5seralaseralhadselkrager\xF8divttasvuotnaoverhallasteinkjerxn--hnefoss-q1askedsmokorsettroms\xF8xn--dyry-iravestre-totenmuseumxn--sandnessjen-ogbrahkkeravjufylkesbiblb\xE1jddarbajddarxn--laheadju-7yarennes\xF8yxn--koluokta-7ya57hxn--hgebostad-g3aleirfjordstorfjordbalsfjordb\xE5tsfjordbatsfjordmuos\xE1tbiev\xE1tloab\xE1tk\xE1r\xE1\u0161johkan\xF8tter\xF8yxn--mjndalen-64anordkappl\xE1hppilahppialstahaugsiljanverranr\xF8ykenroykenhaldenlyngenbergenhortenh\xF8nefosshonefosstroandinbeiarnvarggatosoyroos\xF8yrotromsoidrettmuosatbievatruovatloabatvoagattynsetnessetxn--indery-fyask\xE1nitskanitraholtr\xE5holtxn--ystre-slidre-ujbandebusarpsborgbearduxn--karlsy-fyahordalandjorpelandj\xF8rpelanddeatnuringsakers\xF8r-odalsor-odalxn--slt-elabringerikeaudnedalnittedalnissedalhemsedalslattumsurnadalxn--blt-elabelverumstj\xF8rdalnaustdalhjartdalgj\xF8vikfyresdalhasviknarviklarvikgjovikmalvikgamviklenvikporsgrunnstjordalengerdaldrobakdr\xF8bakxn--msy-ula0hvestvagoyxn--vgan-qoaxn--ryken-vuaxn--lten-graxn--stfold-9xaxn--hpmir-xqaxn--lury-iram\xE1latvuopmimalatvuopmitysv\xE6rkirkenesbirkenesmoskenesb\xE1id\xE1rxn--fjord-lraxn--rdal-poabahcavuotnab\xE1hcavuotnaxn--frde-gralind\xE5sbearalvahkixn--hobl-irar\xE1hkker\xE1vjuxn--loabt-0qav\xE5g\xE5\xE1lt\xE1bod\xF8sundlundrader\xE5deetnetimeholeauregrueoddavagavegaranatanaarnasolasulaaltalekafusavangbergkvam\xE5mliamlibokntinnroangranosenoslobodor\xF8stroststat\xE5motamotivgupriv\xF8yeroyerliermossvossxn--nvuotna-hwalusterlunnermarkerh\xE1bmerhabmerhvalerfjalerxn--rholt-mratysvarbaidarfitjargaularh\xE1pmirhapmirmelhusfosnes\xF8ksnesoksnestysneshemnesevenesflesbergeidsbergtonsbergt\xF8nsberglindasxn--sndre-land-0cbnamsosxn--srum-gra\xF8ystre-slidreoystre-slidrevestre-slidretrondheimbalestrandxn--langevg-jxaaustrheimxn--skjk-soavagsoyaveroysandoykarmoyfinnoytranoyvestbytranbysykkylvenxn--hyanger-q1aspjelkavikandasuoloxn--fl-ziaxn--drbak-wuastathellexn--sr-varanger-ggbtelemarkxn--bhcavuotna-s4axn--porsgu-sta26f\u010D\xE1hcesuolocahcesuoloakrehamn\xE5krehamnsand\xF8ykarm\xF8yfinn\xF8ytran\xF8yv\xE5gs\xF8yaver\xF8ynamdalseidxn--lesund-huabadaddjaxn--vegrshei-c0axn--btsfjord-9zagildesk\xE5lporsanguxn--trgstad-r1an\xE1vuotnanavuotnahammerfestxn--sgne-graxn--brnny-wuacibestadharstadnarviikaeven\xE1\u0161\u0161ivestnesgjemnessandnesagdenesrennesoyxn--avery-yuaxn--tysvr-vrabearalv\xE1hkikongsbergspydebergrandabergxn--andy-iradavvesiidaxn--krdsherad-m8apors\xE1\u014Bgufredrikstadbjerkreimringeburennebuaurskog-holandnotteroyxn--vgsy-qoa0jxn--rmskog-byaskierv\xE1ivelandbyglandfrolandaurlandforsandxn--bjddar-ptamidsund\xE5lesundalesundfetsundfarsundovre-eiker\xF8vre-eikerakershusxn--moreke-juas\xF8rfold\xF8stfoldostfoldsorfoldh\xF8yangerhoyangerlevangerorkangertanangerxn--vestvgy-ixa6olillesandulsteinxn--rennesy-v1agranvinskjervoyxn--klbu-woalavagisxn--h-2faxn--ryrvik-byakafjordk\xE5fjordseljordfolkebiblxn--gjvik-wuajevnakerxn--kfjord-iuabudejjuxn--kranghke-b0axn--davvenjrga-y4axn--rland-uuaxn--ldingen-q1axn--mlselv-iuaxn--rady-iraxn--linds-prabrumunddalxn--ygarden-p1amo-i-ranaeidskogr\xF8mskogromskoghjelmelandxn--finny-yuaxn--sr-odal-q1axn--skjervy-v1aballangenkvanangenkv\xE6nangengratangenxn--hmmrfeasta-s4acvossevangensuohkanxn--rde-ulaxn--mli-tlaxn--ksnes-uuanordlandskanlandsk\xE5nlandsortlandfuoiskuxn--rros-graxn--hcesuolo-7ya35bxn--eveni-0qa01gagaivuotnag\xE1ivuotnaxn--seral-lradrammenmodalenmosjoenjan-mayentorskensteigengloppenxn--snes-poamatta-varjjatxn--sr-fron-q1aomasvuotnajessheimb\xE5d\xE5ddj\xE5xn--krager-gyaxn--kvfjord-nxaxn--asky-iraxn--snase-nraxn--bidr-5nacholt\xE5lenxn--vads-jraxn--jlster-byamosj\xF8enxn--rst-0nastavernxn--ostery-fyaxn--oppegrd-ixaxn--sknit-yqaxn--risa-5naoppeg\xE5rdskiptvetrendalenholtalenxn--mot-tlaxn--lhppi-xqaxn--holtlen-hxaxn--srreisa-q1akopervikxn--muost-0qaxn--bmlo-grahokksundkvalsundegersundxn--karmy-yuaullensakerxn--hylandet-54axn--kvitsy-fyaxn--bod-2nalangev\xE5gberlev\xE5gkristiansandxn--rsta-frahornindalstj\xF8rdalshalsenstjordalshalsensandnessjoenh\xE1mm\xE1rfeastaxn--lrdal-sras\xF8r-fronsor-fronnord-odalkristiansundm\xE1tta-v\xE1rjjatvestv\xE5g\xF8ynesoddennotoddenbuskerud\xF8ygardenoygardensalangenlavangenralingenr\xE6lingenlodingenl\xF8dingenlea\u014Bgaviikalaakesvuemieleangaviikauenorgexn--srfold-byaaskvollxn--rskog-uuaxn--nry-yla5gxn--vry-yla5ghammarfeastaxn--rhkkervju-01afxn--givuotna-8yakommunekrokstadelvanedre-eikerhagebostadh\xE6gebostadxn--berlevg-jxakviteseidxn--s-1faxn--l-1faxn--nmesjevuemie-tcbafuosskomo\xE5rekemoarekexn--lt-liacxn--jrpeland-54asvalbardoppegardholmestrandtvedestrandsogndalsokndalarendalsunndalfolldalxn--krjohka-hwab49jlyngdaletnedalnorddalsaltdalgausdalskedsmovaksdalgjesdalstordalxn--frya-hraaarbortedrangedalxn--smna-graaurskog-h\xF8landxn--vg-yiabtjeldsundhaugesundlindesnesxn--mre-og-romsdal-qqbxn--dnna-gradyntmpheremerseineshacknetenterprisecloudmineaccomaorim\u0101oriorgmilcriiwigennetschoolhealthkiwigovtgeekxn--mori-qsacloudnsparliamentcomedorgcompronetedugovmuseumwebsitekinservicebarsywebsitebuildereerobookheimdnsleapcelleero-stagetechcrscsslorigingohomecdbedeeeiemesecabgngilnlalplchfisiincnnoroptatitmtltruauhulumkdkukskjplvtrgrfrkrhrusesismycynzcznetinteduassoososcloudstgbetaaezaeuhkusjshatenadiarycdn77hoptozaptois-a-knightmyftpno-ipjpnddnssdpdnsspdnsbarsysweetpepperis-a-bruinsfanis-very-sweetservegameis-a-soxfanhomelinuxcdn77-secureservebbsmisconfusedwebredirectblogsitefreedesktopcouchpotatofriestoolforgeaccesscamis-lostreadmyblogsmall-webfedorapeopleserveftpis-a-celticsfanmywirepotagertwmailin-dslsellsyourhomeread-booksfreeddnscable-modemis-savednflfanufcfanmlbfanstuff-4-saleendoftheinternetin-vpnmy-firewallhomeftpis-localis-a-chefboldlygoingnowherewebhopselfipkicks-assroxatunkcamdvrfedoraprojectgotdnsdvrdnsdyndnspubtlspimientahomeunixdontexistfedorainfracloudwmflabsfspagesbmoattachmentsteckidsfamilydsdnsaliasdynaliasnow-dnscloudnsdoomdnsduckdnsblogdnshomednsroutingthecloudendofinternetdsmynasip-dynamicpoivronhttpbinmyfirewallis-very-evilmysecuritycamerais-a-linux-userwmcloudis-a-geektuxfamilyis-a-candidatedoesntexistis-very-badhobby-sitegame-hostaltervistais-foundis-a-patsfandnsdojohepforgepodzonedynservcollegefanis-very-goodfrom-meis-very-niceisa-geeknerdpolacmedsldingorgcomnomgobabonetedupleskaemhlxmyboxrockyprvcydeuxfleursvibekitprodpdnscodebergheyflowstatichostlinkyhostorgmilcomnomgobneteduorgcomeduiorgmilcomngonetedugovcloudns1337ngrokacorggogfamcomwebgobnetedugokgopgkpgovgosbizpasaugumicsopozpapuwmwsrprusiskwpspkppspkmpspokeoiawsawifoumsdnskokwpmuppuppsppiwwiwoowuzswkzoschrzpisdnwzmiuwwitdpssewsseumigugimoirmpinbwinbwiihupporzgwgriwupowwskrwioswuozstarostwokonsulattmpccopruszkowmyspreadshopostrodakartuzyopolegminamediaustkazgorajgoraolawailawalomzawloclradombytomjaworznotargilubinkoninzagantorunkutnokepnonakloczestsopotsanokturekplockslasksklepzarowlukowmedaidgdaorgmilrelcomnomatmgsmartneteduelkgovwawsossexbiztgorysejnytychypomorzeboleslawiechomesklepsdscloudunicloudzakopanelegnicarawa-mazbydgoszczswidnikkrasnikwloclawekbielawamragowograjeworealestatebeskidykaszubymalopolskaprzeworskswiebodzinlecznadfirmaszkolawarmiagdyniamiastakazimierz-dolnymalborkswidnicadlugolekaostrolekapodlasieelblagtravelsimplesitezachpomormielecszczecinnieruchomosciwalbrzychlezajsklublinbedzinpoznanwielunmielnooleckostarachowicedkontopowiatwroclawrybniksuwalkileborkslupskgdanskostrowwlkptarnobrzegtourismwegrowkrakowglogowyou2pilanysamailwrocinfoagroautobeepshoppriviqhslapypiszlodzcfolksecommerce-shopmazurypulawyskoczowrzeszowpomorskiezgierzkaliszolkuszlowiczostrowiecsosnowiecmazowszewodzislawbialowiezazgorzeleckatowicepabianicejelenia-gorawolominkarpaczsieradznowarudaczeladzkonskowolaskierniewiceswinoujscieturystykabieszczadycieszynketrzynolsztynbialystokbabia-goraprochowicewarszawastalowa-wolapolkowicegorlicegliwiceponiatowalimanowalubartowaugustowkobierzyceopocznognieznoszczytnokolobrzegshoparenapodhalebielskoklodzkostargardcoshipatwithplayitownnamecoorgnetedugovacorgcomproestnetedugovbiznameislaprofinforechtngrokmedaaaacacpaenglawjurbarbarsykeeneticavocatacctcloudnsorgcomsecplonetedugov123paginaweborgcomnetintedugovnomepublidkinbarsygovx443cloudnsorgmilcomnetedugovcooporgmilcomschnetedugovnamecomcannetlibassoaemclantmcontstoreorgcomnomrecwwwbarsyfirminfoshopartsstackitmyddnswebspacelima-cityacincooxorgedugovbarsybrendlyhbvpsvpsspectrumlandinghostingacppmordoviamcprecbgorgmilcomspbnetintedumsknovgovbirrasmcdirmytismircloudvladimirnalchikadygeyamarinepyatigorskmyjinobashkiriaeurodirvladikavkazna4ugroznykustanaikalmykiacldmaildagestaniranbuildcloudcanvaliaravalrwxwixdevelopmentappwritemigrationneedleverceldatabasestackitcodereplravendbsanityonporterlovableaccoorgmilnetgovcoopmedorgcompubschnetedugovservicemecomygovorggovtvmedorgcomnetedugovinfoedgfacbmlonihkutwpsryxzbdtmacfhppmyspreadshopbrandpartiorgcomfhvpress123minsidaitcouldbeworlanbibkommunalforbundfhskiopsyskomvuxkomforbnaturbruksgymnloginlineorgcomnetedugovenscaledeuusentsurgebotdaorgmilcomnetgovnowteleporthashbangplatformlovablebarsyshopwarebasehoplixbarsyonlinemsf5gitpagewawamscofigma-govcaffeinefigmacanvasoltstscwputerbarsysupportchatgptsquareomniweopensocialcpanelplaycodenotionnovecorewpsquaredpreviewjelecyonbyensrhtfastvpspieboxconvexjouwwebheyflowplatformshdocsflowyloginlinemadethissourcecraftclouderaorgorgcomartedugouvunivmeorgcomnetedugovsurveysstatichfheiyumanusxs4allprojectmyfastubervibehostapp-ionosdeployagentmecoorgcomschnetedugovbizcncostoreorgmilcomneteduembaixadaconsuladokiraranohoprincipesaotomeheliohobarsystorebaseshopwaresellfyaisanityabkhaziavologdamordoviapenzalenugsochinavoiexnetspbmsknovnorth-kazakhstanashgabadkareliaarmeniageorgiavladimirnalchikivanovobukharaadygeyakhakassiakalugakrasnodarjambylaktyubinsktroitskbryanskobninskkurganazerbaijanpokrovskbashkiriatselinogradvladikavkazmurmansktulatuvamangyshlaktashkentchimkentgroznykaragandatermezarkhangelskkustanaikalmykiabalashoveast-kazakhstankaracoldagestantogliattibarsyredorgcomgobedumirenaccoorgjelasticdiscoursecleverappsschacmiincogoornetonlineshopcogoorgmilcomwebnicnetintedugovbiznametestcoorgmilcomnomnetedugovorangecloudpersoindorgcomfinnatnetgovensmincomtourismintlinfox0611orgmilcomnetedugovquickconnectvpnplusnettprequalifymeaddrmyaddrntdllwadlnctvavdrk12orgmilpolbeltelcomwebgennetedutskkepgovbbsbiznameinfocoorgmilcompronetedugovbiznameinfobetter-thanworse-thansakurafromdyndnson-the-webmymailerorgmilurlcomneteduidvgovmydnsgameclubebizmeneacsccogotvorhotelmilmobiinfovodteiflgplkmsmsbcckhincndnvncoztltmkckppzpdprvcvkvlvcrkrkscxuzchernovtsyrivneyaltaodesavolynrovnolutskltdinforgcomnetedugovbizvinnicazhitomirternopilpoltavakropyvnytskyizaporizhzhiasevastopolsebastopoluzhgoroduzhhorodkharkovkharkivvinnytsiakhmelnytskyizaporizhzhecrimeaodessazhytomyrnikolaevcherkassydonetskluganskluhanskkirovogradivano-frankivskchernivtsikrymkievkyivlvivsumyzakarpattiamykolaivcherkasychernigovkhersonchernihivdnipropetrovskdnepropetrovskkhmelnitskiyneacsccogoorusorgmilcomedugovmyspreadshopadimono-ipbarsybarsyonlinelayershiftnh-servretrosnubapicampaignservicelugaffinitylotteryweeklylotteryraffleentrygluglugsmeaccoindependent-inquestnimsitecopropymntltdorgplcschnetgovnhsbarsyindependent-commissionindependent-reviewpolicepublic-inquiryindependent-panelconnhospindependent-inquiryroyal-commissionoraclegovcloudappscck12libaws-govccphxcclibpvtparochchtrcck12libcceatonk12coglibtecgendstmusann-arborwashtenawcck12glghcck12sealibforksolympiabainbridge-islkeyporthoquiamyarrow-pointcentraliaport-townsendsequimport-ludlowrentonsilverdalebremertonredmondsheltonbellevueport-orchardport-angeleskingstonchehalisaberdeengig-harborseattlepoulsboidmdndsddemenegacalamaiavawapailalflnmdcncscohnhmihiviwiriinmntnmocoutvtctmtgunjokakwvnvprarorasmskstxwynykyazisadninsnngosrvis-bymircloudservernamepointtoenscaledland-4-salefreeddnsstuff-4-saleazure-apinoipdatabricksappscloudnsgolffanheliohostazurewebsitesgvorgmilcomgubneteducoorgcomnetd0egvorgmilcomnetedugovmydnsiacostoree12orgmilcomnomwebgobbibrectecnetintedugovraremprendefirminfoartseducok12orgcomnethidnsadidacaionioapsonlahanamhanoicamauhueorgcompronetintedugovbizbacninhtayninhhoabinhnamdinhtravinhhaiphongvinhlonghaiduongquangnamquangtrithuathienhuequangninhbacgianghaugiangquangbinhsoctrangbentrethanhphohochiminhdanangkontumhatinhkhanhhoathanhhoahealthgialailaocaiyenbaibackanngheanlonganphuyenphuthocanthodaklakdongnainameinfovinhphucdongthapkiengiangtiengiangquangngailaichaulangsonlamdongdaknonghagiangangiangcaobangbinhduongninhthuanbinhthuanbaclieuthaibinhninhbinhbinhdinhtuyenquanghungyenbaria-vungtauthainguyendienbienbinhphuocschbizputerimagine-proxyorgcomnetedugovcloud66advisormypetsdyndnsxn--8dbq2axn--4dbgdty6cxn--5dbhl8dxn--hebda8bxn--80auxn--d1atxn--c1avgxn--o1acxn--o1achxn--90azhxn--55qx5dxn--uc0atvxn--od0algxn--wcvs22dxn--gmqw5axn--mxtq1mxn--12c1fe0brxn--h3cuzk1dixn--12co0c3b4evaxn--12cfi8ixb8lxn--o3cyx2axn--m3ch0j3axn--j1adpxn--90amcxn--90a1afxn--h1ahnxn--j1ael8bxn--h1alizxn--c1avgxn--j1aefxn--80aaa0cvacxn--41acaffeineexeopentunnelbotdashtelebitorgtmaccoagricorgmilnomwebnicngonetaltedugovlawnisschoolgrondaraccoorgmilcomschnetedugovbizinfoprg1-zeropstritonstackitlimazeropsaccoorgmilgov\u044F\u0441\u043F\u0431\u043E\u0440\u0433\u043A\u043E\u043C\u043C\u0441\u043A\u0431\u0438\u0437\u043C\u0438\u0440\u0441\u0430\u043C\u0430\u0440\u0430\u043A\u0440\u044B\u043C\u0441\u043E\u0447\u0438\u0430\u043A\u043E\u0434\u043F\u0440\u043E\u0440\u0433\u043E\u0431\u0440\u0443\u043F\u0440\u05E6\u05D4\u05DC\u05DE\u05DE\u05E9\u05DC\u05D9\u05E9\u05D5\u05D1\u05D0\u05E7\u05D3\u05DE\u05D9\u05D4\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08\u0E23\u0E31\u0E10\u0E1A\u0E32\u0E25\u0E28\u0E36\u0E01\u0E29\u0E32\u0E17\u0E2B\u0E32\u0E23\u0E40\u0E19\u0E47\u0E15\u6559\u80B2\u7DB2\u7D61\u7D44\u7E54\u516C\u53F8\u653F\u5E9C\u500B\u4EBA\uB2F7\uB137\uD55C\uAD6D\u6FB3\u95E8\u65B0\u95FB\u6FB3\u9580\u8054\u901A\u5BB6\u96FB\u5609\u91CC\u62DB\u8058\u901A\u8CA9\uB2F7\uCEF4\uC0BC\uC131\u30B3\u30E0\u10D2\u10D4\u0431\u0433\u0440\u0444\u0435\u044Eadcdbdgdidmdsdtdaebedeeegeiejekemenepereseveyegabacalamanauavapaqasazacfbfafgfnfpfwftfbgcgagggegkgngmgsgpgvgtgugilmlnlalclglplsltlhmimjmkmmmomambmcmdmfmgmzmpmsmtmgbbblbsbecccacnclcmcvctcscmhkhghchbhthphshlinikifigiaibicivisikninhnmncnbngnsnpnvntnjoionomobocoaofodorosotoptstttytatbtetgtithtmtltrusuvuaucueuguhulumunufjdjbjtjsjlkmkhkfkdkcktkukskpkgpmpnpkpjpgqaqmqiqsvtvcvbvmvlvrwpwtwzwbwcwawgwkwmwtrsrprgrfrercrbrarnrmrlrkrirhrwsusrssspsgsesbsaslsmsissxmxaxcxuypysylymykygybycyuztzsznzmzkzdzczbzaz\u03B5\u03BB\u03B5\u03C5\u4E16\u754C\u53F0\u7063\u8D2D\u7269\u516C\u76CA\u70B9\u770B\u81FA\u7063\u7F51\u7EDC\u66F8\u7C4D\u5728\u7EBF\u7F51\u7AD9\u624B\u673A\u673A\u6784\u5927\u62FF\u6E38\u620F\u4FE1\u606F\u53F0\u6E7E\u8C37\u6B4C\u6148\u5584\u5546\u6807\u9999\u6E2F\u4E2D\u56FD\u9910\u5385\u7F51\u5740\u4E2D\u570B\u5546\u57CE\u98DF\u54C1\u5FAE\u535A\u653F\u52A1\u79FB\u52A8\u96C6\u56E2\u516C\u53F8\u516B\u5366\u5546\u5E97\u5065\u5EB7\u7F51\u5E97\u653F\u5E9C\u65F6\u5C1A\u4F5B\u5C71\u4E2D\u4FE1\u5A31\u4E50\u5E7F\u4E1C\u4F01\u4E1Ahomedepotengineering\u0627\u0645\u0627\u0631\u0627\u062Arepublicankuokgroupversicherungchannelcitadelxn--pgbs0dhxn--b4w605ferdstatebankwebsitexn--mgb9awbf\u4E9A\u9A6C\u900A\u6DE1\u9A6C\u9521alibabaxn--ngbc5azdxn--mgbbh1axn--45br5cyltoshibabuildworldcloudtradeguideplacespacedancemoviephoneprimesmilebiblestyleappleazurestoreskypegripexn--l1accdrivelottehorsehouseleasechasereisestadahondaomegaaetnaamicaninjanokiamediadeltavodkaedekaosakapizzaslingemailgmailtirolshelltmallfinallegaltotalhotelamfamforumrehabmusicciticricohcoachwatchboschearthfaithirishmiamiarchidubaiguccipraxi\u307F\u3093\u306A\u30B9\u30C8\u30A2\u30BB\u30FC\u30EBcanonsalononionnikonepsonkoelngreensevencrownikanoradioaudioweiboglobopromogalloyahoociscorodeovideomangobingotokyovolvolottokyotophotosmartsportquesttrusthyattjetztadultcymrubaidutushuxn--kprw13dubankclickblackmerckgroupsharpcheapnowtvxn--h2brj9c\u05E7\u05D5\u05DD\u0570\u0561\u0575\u043E\u0440\u0433\u0441\u0440\u0431\u043C\u043E\u043D\u043A\u043E\u043C\u0431\u0435\u043B\u043C\u043A\u0434\u049B\u0430\u0437\u0440\u0443\u0441\u0443\u043A\u0440\u0645\u0635\u0631\u0642\u0637\u0631\u0639\u0631\u0628\u0643\u0648\u0645dadcfdmedwedredphdthdbidpidkrdmsdltdiceonewmeglemoerwecfageacbanbambaaaammakianraspacpaaxawtfbcgaegongingaigvigorgdogdhlmilrilonlaolloluoljllcalgalnflafltelsrlfrllplkimibmcamcombommomifmabbjcbscbwebcabnabtabmlbpubabcbbcnecincpncllcstcwtcpwcnyckfhbzhovhmoiskiobisbitcifyituipinvinwinxincbnbcnmanfangdnmenrenkpnmtnyunrunfununobiojioriohbogmofooboooooacoecoceongoproartistottnttbbtcateatlatvetpetbetnethktmitfitintjothotgotdotbotprueduicujnjyouinknhktdkappsapgapmapdnptopgopllpjmpzipvipripesqtrvdtvitvdevmovgovhivnrwlawsewnewbmwwownowhowdvrftrmtrsfrbarcartvscrseusawsupsubssbsadsddsldssasbmsmlsxxxboxfoxgmxtjxsextaxbuyflydiysoyjoyskypaydaygayxyzanzbizwebersenerpokerlameractortatarsolar\u0EA5\u0EB2\u0EA7\u0E04\u0E2D\u0E21\u0E44\u0E17\u0E22tourslocusnexuslexusgiftsbeatsboatspartspressglassswiss\u0915\u0949\u092E\u0928\u0947\u091Ftiresgivescodeshomesgamestunesshoescardswalesloansvegastoolsdealsautosparis\u30D5\u30A1\u30C3\u30B7\u30E7\u30F3workssucksrocksxeroxforexfedexpartylillymoneystudyrugbytoraytoday\u4E2D\u6587\u7F51xn--unup4y\u5929\u4E3B\u6559\u98DE\u5229\u6D66\u65B0\u52A0\u5761enterprises\u6211\u7231\u4F60\u5609\u91CC\u5927\u9152\u5E97christmasxn--fct429kholdingsxn--8y0a063axn--mgbx4cd0ablifestyleabogadoallstatenetbank\u0643\u0627\u062B\u0648\u0644\u064A\u0643xn--s9brj9cxn--gk3at1ebestbuycharityxn--55qx5dmicrosoftpropertybasketballhomegoodscorsicajewelrygallerygrocerysurgerycountrybrusselsverisignferreroxn--czr694bhdfcbankcommbanksoftbank\u067E\u0627\u0643\u0633\u062A\u0627\u0646\u067E\u0627\u06A9\u0633\u062A\u0627\u0646nextdirect\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0647\u0627\u0644\u0639\u0644\u064A\u0627\u0646xn--h2brj9c8cxn--80adxhksshikshaxn--mgbai9azgqp6jcuisinellabarclayscatholicxn--kpry57dcompanyxn--xhq521bblackfridayxn--mgba3a3ejtsandvikxn--d1acj3bacademydownload\u0645\u0644\u064A\u0633\u064A\u0627xn--j1amhxn--w4r85el8fhu5dnraipirangaathletaxn--fhbeixn--mgbqly7cvafrzuerichxn--c2br7g\u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8contractorsxn--io0a7igraphicsinsurancetemasekxn--xkc2al3hye2amotorcyclesphotographydirectoryplumbingxn--vhquvclothingtrainingcleaningwilliamhilllightingxn--mgba3a4f16ashoppingcateringeducationokinawapicturesventuresproductionsxn--9et52uwalmart\u0D2D\u0D3E\u0D30\u0D24\u0D02supportrealestatecapitalonexn--nqv7fs00emaauspostfloristdentistxn--qxamgodaddybradescobargainsmitsubishikerryhotelsxn--9dbq2axn--3pxu8kimmobilienxn--fjq720axn--mgbtx2bholidaymckinseymadridbusinessbuildersxn--4gbrim\u043C\u043E\u0441\u043A\u0432\u0430\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u0629coffeedegreelacaixapartnersalsaceofficeabbvievoyageorangegeorgeonlinechromemobilekindlegoogleoraclecircleschulesecureinsurexn--mgba7c0bbn0aestatexn--mgbc0a9azcgcruisehangoutxn--vuq861bxn--42c2d9arexrothfirestoneuniversityxn--nnx388alifeinsuranceextraspace\u043E\u043D\u043B\u0430\u0439\u043Dverm\xF6gensberatersoftwarexn--fiqs8sxn--mgbab2bdxn--w4rs40ltienda\u092D\u093E\u0930\u0924\u092E\u094Dafricatoyotaotsukasakuracameracreditcardnagoyaconsultingnetworktheatermonsterprogressivepioneerxn--55qw42gracingdatingvotingvikinglivinggivingxn--bck1b9a5dre4cbrotherweatherjoburg\u0641\u0644\u0633\u0637\u064A\u0646lplfinancialxn--clchc0ea0b2g2a9gcdfutbolschoolsocialglobaldentalwoodsidechanelairtelmatteltravelrealtorwebcamstream\u0C2D\u0C3E\u0C30\u0C24\u0C4Dunicomalstomxn--nodexn--6frz82gmuseumfurniturexn--rvc1e0am3exn--mix891faccenturexn--11b4c3dismailineustardiscountquebeccomsecclinicservicesxn--y9a3aqxn--c1avgswatchchurchsearch\u0627\u0644\u0627\u0631\u062F\u0646marketingcontacthealthmonashshoujisanofitaipeiamericanexpresssuzuki\u30A2\u30DE\u30BE\u30F3\u30AF\u30E9\u30A6\u30C9\u30DD\u30A4\u30F3\u30C8bharti\u30B0\u30FC\u30B0\u30EBxn--mgberp4a5d4armemorialxn--1qqw23alondonmormoninstitutevisionbostonnortoncouponmaisonamazonvirginberlindesigndurbanolayannissananquanxihuanhitachikaufengardenreisenbayerntechnologydatsunxn--90a3aclatinocasinostudiophysioxn--ngbe9e0apharmacytattootaobaoaramcoexpertreportabbottdirectselectimamatfairwindspictettargetmarketintuittravelersinsurancecreditdupontryukyusuppliesxn--tckwebnpparibasschmidtmerckmsdyodobashirestaurantbridgestonecricketxn--fpcrj9c3dbostikbroadwayattorneylefrakemerckxn--fiq228c5hscareersfarmerswinnersflowersxn--wgbh1cguitarsxn--54b7fta0ccxn--p1acfmakeupgalluplandroverxn--kcrx77d1x4agoldpointbauhausxn--mgbayh7gpahiphopplaystationxn--mgba3a4fraxn--eckvdtc9dhyundaixn--gckr3f0fistanbulticketsmarketsflightschintaireviewsxn--3e0b707ewindowsxn--fiqz9sfinancialxn--fzys8d69uvgm\u0627\u0628\u0648\u0638\u0628\u064Adiscoverreview\u09AC\u09BE\u0982\u09B2\u09BExn--5su34j936bgsgmoscowobserverapartments\u0434\u0435\u0442\u0438\u0627\u0631\u0627\u0645\u0643\u0648\u0441\u0430\u0439\u0442eurovisionxn--i1b6b1a6a2exn--xkc2dl3a5ee0h\u062A\u0648\u0646\u0633\u0645\u0648\u0642\u0639\u0628\u0627\u0631\u062A\u0680\u0627\u0631\u062A\u0634\u0628\u0643\u0629\u0639\u0645\u0627\u0646\u0628\u064A\u062A\u0643\u0639\u0631\u0627\u0642readkredbondlandbandfundfoodprodgoldfordtubecafesafelifeggeeieeefreefagepagegugezonewinememenamegamesaleablebikenikelikecarecbreherefiresaveloveliveblueartedatesitevotecaseluxebofamodaltdaasdatiaayogasinavanashiaasiajavabbvatevavivadatazaraarpacasavisasncfprofmaifsurfgolfdvagsongbingpingwangkpmggoogblogpohlfailcooldellcalldeallidlsarlfilmteamroomfarmimdbarabclubhdfcicbchsbcgmbhrichtechfishdishcashminiernikddiaudiwikimobitaxicitikiwidesiqponskinloanakdnwienopenporncerntownimmolimoolloinfonicofidolegosaxozeroaerovivoautovotomotofastbestresthostpostnextlgbtchatseatgiftmeetdietreitmintrentgentspotscotguruitausohumenucyoubanklinkpinkdclktalksilkbookseekworkrsvpaarpjeepshopcoophelpcamppccwshowbeerstarruhrflirweirhaircarsparsjprshausplusnewstipstoysjobskidsfanspicsdocsxboxamexsexynavycitysonyarmyallybabyplaydeliverybuzzgbizlamborghiniphilips\u0DBD\u0D82\u0D9A\u0DCF\u0CAD\u0CBE\u0CB0\u0CA4fitnessexpresslanxesspfizercenterwalterlawyersoccercareerkosherbrokerlockerdealerdoctorauthorxn--mgbqly7c0a67fbcverm\xF6gensberatungjaguarxn--pssy2uxn--hxt814eflickrrepairrogersairbusxn--mgbai9a5eva00beventsyachtsxn--t60b56a\u09AD\u09BE\u09F0\u09A4\u09AD\u09BE\u09B0\u09A4\u092D\u093E\u0930\u0924\u092D\u093E\u0930\u094B\u0924viajeshermeshughesxn--j1aef\u0938\u0902\u0917\u0920\u0928villas\u0B2D\u0B3E\u0B30\u0B24claimshotels\u0AAD\u0ABE\u0AB0\u0AA4zapposphotosjuegoscondostatamotorsgratistennis\u0A2D\u0A3E\u0A30\u0A24tkmaxxtjmaxxschaeffleryandexxn--80aswgrealtysafetybeautyluxuryxn--3ds443gsupplyfamilyxn--o3cw4hhockeysydneyxn--90aenissayalipayenergycomputeragencyxn--rovu88b\u96FB\u8A0A\u76C8\u79D1xn--gecrj9cstatefarmaccountantaquarelleolayangroup\u9999\u683C\u91CC\u62C9xn--p1ai\u7EC4\u7EC7\u673A\u6784xn--1ck2e1bxn--mgbt3dhdschwarz\u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627abudhabinowruzkomatsufujitsuhospitalxn--80asehdbxn--mgbtf8flxn--j6w193gxn--yfro4i67oprudentialxn--flw351ecruisescoursesrecipesxn--e1a4cferrarixn--ses554gxn--wgbl6awatchesstaplessinglesxn--mgbcpq6gpa1axn--otu796dpropertiescreditunionxn--mgbah1a3hjkrdstockholmhisamitsu\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629stcgroupdomainsoriginscouponsbloombergclubmedfroganslimitedxn--80aqecdr1aexposedinternationalequipmentbarclaycardxn--q7ce6axn--mgbi4ecexpprotectionassociatesconstructionxn--cck2b3bxn--45q11candroidfoundation\u05D9\u05E9\u05E8\u05D0\u05DCxn--mgbca7dzdocliniqueboutiqueengineerxn--qxa6asystemsfirmdalefashionauctionxn--nqv7finfinitirentalsreliancetradingweddingfishinghostinggentingbookingcookingxn--3hcrj9cgraingerxn--czrs0tdemocratsamsungyokohamaxn--h2breg3evexn--nyqy26alundbeckmelbournevacationssolutionsfrontierxn--vermgensberatung-pwbmanagementxn--cg4bkixn--mgb2ddeslincolnhamburgsandvikcoromantblockbusterairforcebarefootxn--4dbrk0ceinvestmentsfeedbackcommunityxn--ngbrx\u0627\u0644\u0628\u062D\u0631\u064A\u0646diamondsamsterdamhealthcareredumbrellaxn--mxtq1mxn--2scrj9cagakhanxn--mgbpl2fh\u043A\u0430\u0442\u043E\u043B\u0438\u043Acaravan\u0B9A\u0BBF\u0B99\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC2\u0BB0\u0BCDrichardlimortgageamericanfamilyxn--fzc2c9e2cscholarshipssaarlandxn--imr513nvlaanderensamsclubgoodyearkitchen\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF\u0BBEweatherchannelallfinanzxn--kput3i\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u06C3xn--90aisxn--efvy88h\u0627\u0644\u062C\u0632\u0627\u0626\u0631xn--mgbaam7a8hexchangejpmorganxn--tiq49xqyjfidelitysecurityxn--mk1bu44cwanggouxn--fiq64bxn--6qq986b3xlxn--mgbbh1a71exn--80ao21amarshallsxn--5tzm5gtravelerspanasoniclatrobeyoutubeaccountantsxn--rhqv96gxn--cckwcxetdanalyticsxn--ygbi2ammx\u0628\u0627\u0632\u0627\u0631\u0628\u06BE\u0627\u0631\u062A\u0633\u0648\u0631\u064A\u0629organicfresenius\u0633\u0648\u0631\u064A\u0627xn--9krt00axn--qcka1pmcxn--jlq480n2rgdeloittesciencefinancexn--jvr189mxn--30rr7yhomesensehotmailbaseballfootballleclercboehringerxn--q9jyb4cxn--mix082f\u0627\u0644\u064A\u0645\u0646\u0647\u0645\u0631\u0627\u0647politie\u0633\u0648\u062F\u0627\u0646\u0627\u064A\u0631\u0627\u0646\u0627\u06CC\u0631\u0627\u0646netflixyamaxunxn--lgbbat1ad8jcollegestoragecapetowncolognekerrypropertiesxn--mgbgu82axn--ogbpf8flxn--czru2dwhoswhociprianilasallexn--g2xx48cforsalebanamexaudiblexn--vermgensberater-ctbxn--zfr164bericssonvanguardxn--45brj9cindustriestheatremarriottxn--3bst00mcomparexn--mgberp4a5d4a87gcapitaldigital\u0627\u0644\u0645\u063A\u0631\u0628barcelonashangrilaxn--d1alfcalvinkleinwwwcitysapporokawasakinagoyasendaikobekitakyushuyokohamackjp";
    var rulesRoot = 658;
    var exceptionsRoot = 662;
    var numberOfNodes = nodeFlags.length;
    var numberOfEdges = edgeLength.length;
    var edgeOffset = new Uint32Array(numberOfEdges);
    var edgeHash = new Uint32Array(numberOfEdges);
    var wildcardEdge = new Int32Array(numberOfNodes).fill(-1);
    for (let node = 0, offset = 0; node < numberOfNodes; node += 1) {
      for (let edge = edgeStart[node]; edge < edgeStart[node + 1]; edge += 1) {
        edgeOffset[edge] = offset;
        const end = offset + edgeLength[edge];
        let hash = 5381;
        for (let i = end - 1; i >= offset; i -= 1) {
          hash = hash * 33 ^ labelText.charCodeAt(i);
        }
        edgeHash[edge] = hash >>> 0;
        if (edgeLength[edge] === 1 && labelText.charCodeAt(offset) === 42) {
          wildcardEdge[node] = edge;
        }
        offset = end;
      }
    }
    var matchNode = -1;
    var matchStart = 0;
    var matchEnd = 0;
    function labelEquals(edge, hostname, start, length) {
      if (edgeLength[edge] !== length) {
        return false;
      }
      const offset = edgeOffset[edge];
      for (let i = 0; i < length; i += 1) {
        if (labelText.charCodeAt(offset + i) !== hostname.charCodeAt(start + i)) {
          return false;
        }
      }
      return true;
    }
    function findEdge(node, hash, hostname, start, length) {
      let lo = edgeStart[node];
      let hi = edgeStart[node + 1];
      while (lo < hi) {
        const mid = lo + hi >>> 1;
        const value = edgeHash[mid];
        if (value < hash) {
          lo = mid + 1;
        } else if (value > hash) {
          hi = mid;
        } else {
          for (let e = mid; e >= lo && edgeHash[e] === hash; e -= 1) {
            if (labelEquals(e, hostname, start, length))
              return e;
          }
          for (let e = mid + 1; e < hi && edgeHash[e] === hash; e += 1) {
            if (labelEquals(e, hostname, start, length))
              return e;
          }
          return -1;
        }
      }
      return -1;
    }
    function walk(hostname, root, allowedMask) {
      let node = root;
      let end = hostname.length;
      let hash = 5381;
      matchNode = -1;
      for (let i = hostname.length - 1; i >= 0; i -= 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46) {
          const start = i + 1;
          let edge2 = findEdge(node, hash >>> 0, hostname, start, end - start);
          if (edge2 === -1) {
            edge2 = wildcardEdge[node];
          }
          if (edge2 === -1) {
            return matchNode !== -1;
          }
          node = edgeChild[edge2];
          if ((nodeFlags[node] & allowedMask) !== 0) {
            matchNode = node;
            matchStart = start;
            matchEnd = end;
          }
          end = i;
          hash = 5381;
        } else {
          hash = hash * 33 ^ code;
        }
      }
      let edge = findEdge(node, hash >>> 0, hostname, 0, end);
      if (edge === -1) {
        edge = wildcardEdge[node];
      }
      if (edge !== -1) {
        node = edgeChild[edge];
        if ((nodeFlags[node] & allowedMask) !== 0) {
          matchNode = node;
          matchStart = 0;
          matchEnd = end;
        }
      }
      return matchNode !== -1;
    }
    function suffixLookup(hostname, options, out) {
      if (fastPathLookup(hostname, options, out)) {
        return;
      }
      const allowedMask = (options.allowPrivateDomains ? 2 : 0) | (options.allowIcannDomains ? 1 : 0);
      if (walk(hostname, exceptionsRoot, allowedMask)) {
        out.isIcann = (nodeFlags[matchNode] & 1) !== 0;
        out.isPrivate = (nodeFlags[matchNode] & 2) !== 0;
        out.publicSuffix = hostname.slice(matchEnd + 1);
        return;
      }
      if (walk(hostname, rulesRoot, allowedMask)) {
        out.isIcann = (nodeFlags[matchNode] & 1) !== 0;
        out.isPrivate = (nodeFlags[matchNode] & 2) !== 0;
        out.publicSuffix = hostname.slice(matchStart);
        return;
      }
      out.isIcann = false;
      out.isPrivate = false;
      const lastDot = hostname.lastIndexOf(".");
      out.publicSuffix = lastDot === -1 ? hostname : hostname.slice(lastDot + 1);
    }
    var RESULT = getEmptyResult();
    function parse(url, options) {
      return parseImpl(url, 5, suffixLookup, options, getEmptyResult());
    }
    function getHostname(url, options) {
      resetResult(RESULT);
      return parseImpl(url, 0, suffixLookup, options, RESULT).hostname;
    }
    function getPublicSuffix(url, options) {
      resetResult(RESULT);
      return parseImpl(url, 2, suffixLookup, options, RESULT).publicSuffix;
    }
    function getDomain2(url, options) {
      resetResult(RESULT);
      return parseImpl(url, 3, suffixLookup, options, RESULT).domain;
    }
    function getFullDomain(url, options) {
      resetResult(RESULT);
      const result2 = parseImpl(url, 3, suffixLookup, options, RESULT);
      return result2.domain === null ? null : result2.hostname;
    }
    function getSubdomain(url, options) {
      resetResult(RESULT);
      return parseImpl(url, 4, suffixLookup, options, RESULT).subdomain;
    }
    function getDomainWithoutSuffix(url, options) {
      resetResult(RESULT);
      return parseImpl(url, 5, suffixLookup, options, RESULT).domainWithoutSuffix;
    }
    exports2.getDomain = getDomain2;
    exports2.getDomainWithoutSuffix = getDomainWithoutSuffix;
    exports2.getFullDomain = getFullDomain;
    exports2.getHostname = getHostname;
    exports2.getPublicSuffix = getPublicSuffix;
    exports2.getSubdomain = getSubdomain;
    exports2.parse = parse;
  }
});

// src/cli.ts
var import_node_fs = require("node:fs");
var import_node_net3 = require("node:net");
var import_node_util = require("node:util");

// src/input.ts
var import_node_net = require("node:net");
var import_tldts = __toESM(require_cjs(), 1);
var MAIL_USAGES = ["send-and-receive", "send-only", "receive-only", "none", "unknown"];
var InputError = class extends Error {
};
var LABEL = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/;
function normalizeHost(raw) {
  const host = raw.trim().toLowerCase().replace(/\.$/, "");
  if (host.includes("://") || host.includes("/")) throw new InputError(`"${raw}" \u306FURL\u3067\u3059\u3002\u30DB\u30B9\u30C8\u540D\u3060\u3051\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u4F8B: example.com\uFF09`);
  if (host.includes(":")) throw new InputError(`"${raw}" \u306B\u306F\u30DD\u30FC\u30C8\u3084IPv6\u30A2\u30C9\u30EC\u30B9\u3092\u542B\u3081\u3089\u308C\u307E\u305B\u3093`);
  if ((0, import_node_net.isIP)(host)) throw new InputError(`"${raw}" \u306FIP\u30A2\u30C9\u30EC\u30B9\u3067\u3059\u3002\u30DB\u30B9\u30C8\u540D\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044`);
  if (host.includes("*")) throw new InputError(`"${raw}" \u306E\u3088\u3046\u306A\u30EF\u30A4\u30EB\u30C9\u30AB\u30FC\u30C9\u306F\u6307\u5B9A\u3067\u304D\u307E\u305B\u3093`);
  if (host.length > 253) throw new InputError(`"${raw}" \u306F\u30DB\u30B9\u30C8\u540D\u3068\u3057\u3066\u9577\u3059\u304E\u307E\u3059`);
  const labels = host.split(".");
  if (labels.length < 2 || !labels.every((label) => LABEL.test(label))) {
    throw new InputError(`"${raw}" \u306F\u6709\u52B9\u306A\u30DB\u30B9\u30C8\u540D\u3067\u306F\u3042\u308A\u307E\u305B\u3093`);
  }
  if (["localhost", "local", "internal", "home.arpa", "localdomain"].some((suffix) => host === suffix || host.endsWith("." + suffix))) {
    throw new InputError(`"${raw}" \u306F\u5185\u90E8\u5411\u3051\u306E\u540D\u524D\u306E\u305F\u3081\u70B9\u691C\u3067\u304D\u307E\u305B\u3093`);
  }
  return host;
}
function organizationalDomain(host) {
  const domain = (0, import_tldts.getDomain)(host, { allowPrivateDomains: false });
  if (!domain) throw new InputError(`"${host}" \u306E\u7D44\u7E54\u30C9\u30E1\u30A4\u30F3\u3092\u5224\u5B9A\u3067\u304D\u307E\u305B\u3093\uFF08\u516C\u958B\u30B5\u30D5\u30A3\u30C3\u30AF\u30B9\u305D\u306E\u3082\u306E\u306E\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\uFF09`);
  return domain;
}
function parseMailUsage(raw) {
  if (raw === void 0) return "unknown";
  if (MAIL_USAGES.includes(raw)) return raw;
  throw new InputError(`--mail \u306F ${MAIL_USAGES.join(" / ")} \u306E\u3044\u305A\u308C\u304B\u3067\u3059`);
}
function normalizeSelector(raw) {
  const selector = raw.trim().toLowerCase();
  if (!/^[a-z0-9._-]{1,63}$/.test(selector) || selector.startsWith(".") || selector.endsWith(".")) {
    throw new InputError(`DKIM\u30BB\u30EC\u30AF\u30BF "${raw}" \u304C\u4E0D\u6B63\u3067\u3059`);
  }
  return selector;
}

// src/net/dns.ts
var import_promises = require("node:dns/promises");
var TIMEOUT_MS = 5e3;
var CAA_TAGS = ["issue", "issuewild", "iodef", "contactemail", "contactphone"];
function toCaaRecord(raw) {
  const tag = CAA_TAGS.find((name) => name in raw) ?? Object.keys(raw).find((name) => name !== "critical" && name !== "type") ?? "";
  return { critical: Number(raw.critical ?? 0), tag, value: tag ? String(raw[tag]) : "" };
}
function failureOf(error) {
  const code = error.code;
  if (code === "ENODATA") return "NODATA";
  if (code === "ENOTFOUND") return "NXDOMAIN";
  if (code === "ETIMEOUT") return "TIMEOUT";
  if (code === "ESERVFAIL") return "SERVFAIL";
  return "OTHER";
}
async function answer(query) {
  try {
    const records = await query();
    return records.length > 0 ? { ok: true, records } : { ok: false, failure: "NODATA", message: "no records" };
  } catch (error) {
    return { ok: false, failure: failureOf(error), message: error.message };
  }
}
var NodeDnsClient = class {
  source;
  resolver;
  constructor(servers) {
    this.resolver = new import_promises.Resolver({ timeout: TIMEOUT_MS, tries: 2 });
    if (servers && servers.length > 0) this.resolver.setServers(servers);
    this.source = servers && servers.length > 0 ? `\u518D\u5E30\u30EA\u30BE\u30EB\u30D0 ${servers.join(", ")}` : `\u30B7\u30B9\u30C6\u30E0\u306E\u30EA\u30BE\u30EB\u30D0 (${this.resolver.getServers().join(", ")})`;
  }
  a(name) {
    return answer(() => this.resolver.resolve4(name));
  }
  aaaa(name) {
    return answer(() => this.resolver.resolve6(name));
  }
  cname(name) {
    return answer(() => this.resolver.resolveCname(name));
  }
  mx(name) {
    return answer(() => this.resolver.resolveMx(name));
  }
  txt(name) {
    return answer(async () => (await this.resolver.resolveTxt(name)).map((chunks) => chunks.join("")));
  }
  ns(name) {
    return answer(() => this.resolver.resolveNs(name));
  }
  caa(name) {
    return answer(async () => (await this.resolver.resolveCaa(name)).map((record) => toCaaRecord(record)));
  }
};

// src/net/web.ts
var import_node_dns = require("node:dns");
var import_node_http = __toESM(require("node:http"), 1);
var import_node_https = __toESM(require("node:https"), 1);
var import_node_tls = __toESM(require("node:tls"), 1);

// src/net/address.ts
var import_node_net2 = require("node:net");
var blocked = new import_node_net2.BlockList();
for (const [network, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4]
]) {
  blocked.addSubnet(network, prefix, "ipv4");
}
for (const [network, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["64:ff9b::", 96],
  ["100::", 64],
  ["2001:db8::", 32],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8]
]) {
  blocked.addSubnet(network, prefix, "ipv6");
}
function isPublicAddress(address) {
  const family = (0, import_node_net2.isIP)(address);
  if (family === 0) return false;
  const mapped = family === 6 ? address.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/) : null;
  if (mapped) return isPublicAddress(mapped[1]);
  if (family === 6 && /^::ffff:/i.test(address)) return false;
  return !blocked.check(address, family === 4 ? "ipv4" : "ipv6");
}

// src/net/web.ts
var TIMEOUT_MS2 = 8e3;
var USER_AGENT = "domain-preflight/0.1 (read-only configuration check)";
var BlockedAddressError = class extends Error {
  code = "EBLOCKED";
};
var safeLookup = (hostname, options, callback) => {
  (0, import_node_dns.lookup)(hostname, { all: true }, (error, addresses) => {
    if (error) return callback(error, "", 0);
    const list = addresses;
    const unsafe = list.find((entry) => !isPublicAddress(entry.address));
    if (unsafe || list.length === 0) {
      return callback(new BlockedAddressError(`${hostname} \u304C\u516C\u958B\u3055\u308C\u3066\u3044\u306A\u3044\u30A2\u30C9\u30EC\u30B9 (${unsafe?.address ?? "\u306A\u3057"}) \u306B\u89E3\u6C7A\u3055\u308C\u305F\u305F\u3081\u63A5\u7D9A\u3057\u307E\u305B\u3093`), "", 0);
    }
    const wanted = typeof options === "object" && options.family ? list.filter((entry) => entry.family === options.family) : list;
    const chosen = wanted[0] ?? list[0];
    if (typeof options === "object" && options.all) return callback(null, [chosen]);
    callback(null, chosen.address, chosen.family);
  });
};
function failureOf2(error) {
  if (error.code === "EBLOCKED") return "blocked-address";
  if (error.code === "ENOTFOUND" || error.code === "EAI_AGAIN") return "dns";
  if (error.code === "ETIMEDOUT" || error.message === "timeout") return "timeout";
  if (error.code?.startsWith("ERR_TLS") || error.code?.includes("CERT") || error.code === "EPROTO") return "tls";
  if (error.code === "ECONNREFUSED" || error.code === "ECONNRESET" || error.code === "EHOSTUNREACH") return "connect";
  return "other";
}
function cn(fields) {
  if (!fields) return "";
  return Object.entries(fields).map(([key, value]) => `${key}=${Array.isArray(value) ? value.join("+") : String(value)}`).join(", ");
}
var NodeWebClient = class {
  get(url) {
    return new Promise((resolve) => {
      const module2 = url.protocol === "https:" ? import_node_https.default : import_node_http.default;
      const request = module2.request(
        url,
        {
          method: "GET",
          lookup: safeLookup,
          headers: { "user-agent": USER_AGENT, accept: "text/html,*/*;q=0.5" },
          timeout: TIMEOUT_MS2,
          // Certificate problems are reported by certificate(); here we still want the headers.
          rejectUnauthorized: false
        },
        (response) => {
          const headers = {};
          for (const [name, value] of Object.entries(response.headers)) {
            if (value !== void 0) headers[name.toLowerCase()] = Array.isArray(value) ? value.join(", ") : value;
          }
          const remoteAddress = response.socket.remoteAddress ?? "";
          response.destroy();
          resolve({ ok: true, status: response.statusCode ?? 0, headers, remoteAddress });
        }
      );
      request.on("timeout", () => request.destroy(Object.assign(new Error("timeout"), { code: "ETIMEDOUT" })));
      request.on("error", (error) => resolve({ ok: false, failure: failureOf2(error), message: error.message }));
      request.end();
    });
  }
  certificate(host) {
    return new Promise((resolve) => {
      const socket = import_node_tls.default.connect({
        host,
        port: 443,
        servername: host,
        lookup: safeLookup,
        rejectUnauthorized: false,
        timeout: TIMEOUT_MS2
      });
      socket.once("secureConnect", () => {
        const peer = socket.getPeerCertificate();
        let authorizationError = socket.authorizationError ? String(socket.authorizationError) : void 0;
        if (!authorizationError && peer && Object.keys(peer).length > 0) {
          const identityError = import_node_tls.default.checkServerIdentity(host, peer);
          if (identityError) authorizationError = identityError.code ?? identityError.message;
        }
        const issuer = peer.issuer;
        resolve({
          ok: true,
          authorized: socket.authorized && !authorizationError,
          authorizationError,
          subject: cn(peer.subject),
          issuer: cn(issuer),
          issuerOrganization: String(issuer?.O ?? issuer?.CN ?? ""),
          validFrom: peer.valid_from,
          validTo: peer.valid_to,
          subjectAltNames: (peer.subjectaltname ?? "").split(",").map((entry) => entry.trim().replace(/^DNS:/, "")).filter(Boolean),
          protocol: socket.getProtocol() ?? "",
          remoteAddress: socket.remoteAddress ?? ""
        });
        socket.end();
      });
      socket.once("timeout", () => socket.destroy(Object.assign(new Error("timeout"), { code: "ETIMEDOUT" })));
      socket.once("error", (error) => resolve({ ok: false, failure: failureOf2(error), message: error.message }));
    });
  }
};

// src/report.ts
var STATUS_LABEL = {
  pass: "\u78BA\u8A8D\u6E08\u307F",
  finding: "\u8981\u5BFE\u5FDC",
  review: "\u8981\u78BA\u8A8D",
  not_checked: "\u672A\u691C\u67FB",
  error: "\u30A8\u30E9\u30FC"
};
var STATUS_ICON = { pass: "\u2713", finding: "\u2717", review: "!", not_checked: "-", error: "?" };
var SEVERITY_ORDER = ["high", "medium", "low", "info"];
var STATUS_ORDER = ["finding", "error", "review", "not_checked", "pass"];
var byImportance = (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || SEVERITY_ORDER.indexOf(a.severity ?? "info") - SEVERITY_ORDER.indexOf(b.severity ?? "info");
function counts(checks) {
  return STATUS_ORDER.map((status) => [status, checks.filter((check) => check.status === status).length]).filter(([, count]) => count > 0).map(([status, count]) => `${STATUS_LABEL[status]} ${count}`).join(" / ");
}
function toJson(report) {
  return JSON.stringify(report, null, 2) + "\n";
}
var escapeCell = (text) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");
function toMarkdown(report) {
  const lines = [];
  lines.push(`# Domain Preflight \u30EC\u30DD\u30FC\u30C8`, "");
  lines.push(`- \u70B9\u691C\u65E5\u6642: ${report.startedAt}`);
  lines.push(`- \u5BFE\u8C61: ${report.input.hosts.join(", ")}`);
  lines.push(`- \u30E2\u30FC\u30C9: ${report.mode}\uFF08\u516C\u958B\u60C5\u5831\u306E\u307F\u3001\u8AAD\u307F\u53D6\u308A\u5C02\u7528\uFF09`);
  lines.push(`- \u30E1\u30FC\u30EB\u306E\u7528\u9014: ${report.input.mailUsage}`);
  lines.push(`- DNS\u306E\u554F\u3044\u5408\u308F\u305B\u5148: ${report.input.resolver}`);
  lines.push(`- \u30C4\u30FC\u30EB: ${report.tool.name} ${report.tool.version}\uFF08schema ${report.schemaVersion}\uFF09`, "");
  lines.push(
    "> \u300C\u78BA\u8A8D\u6E08\u307F\u300D\u306F\u3001\u3053\u306E\u30C4\u30FC\u30EB\u304C\u5B9A\u3081\u305F\u6761\u4EF6\u3092\u89B3\u6E2C\u3067\u304D\u305F\u3068\u3044\u3046\u610F\u5473\u3067\u3001\u5B89\u5168\u306E\u4FDD\u8A3C\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u300C\u672A\u691C\u67FB\u300D\u306F\u554F\u984C\u304C\u306A\u3044\u3068\u3044\u3046\u610F\u5473\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002",
    ""
  );
  for (const target of report.targets) {
    const checks = [...target.checks].sort(byImportance);
    lines.push(`## ${target.host}`, "");
    lines.push(`\u7D44\u7E54\u30C9\u30E1\u30A4\u30F3: ${target.organizationalDomain} \uFF5C ${counts(checks)}`, "");
    lines.push("| \u72B6\u614B | \u91CD\u5927\u5EA6 | \u30C1\u30A7\u30C3\u30AF | \u6982\u8981 |", "| --- | --- | --- | --- |");
    for (const check of checks) {
      lines.push(`| ${STATUS_LABEL[check.status]} | ${check.severity ?? "-"} | ${check.title} (\`${check.id}\`) | ${escapeCell(check.summary)} |`);
    }
    lines.push("");
    for (const check of checks) {
      lines.push(`### ${STATUS_ICON[check.status]} ${check.title} \u2014 ${STATUS_LABEL[check.status]}`, "");
      lines.push(check.summary, "");
      if (check.evidence.length > 0) {
        lines.push("**\u89B3\u6E2C\u7D50\u679C**", "");
        for (const item of check.evidence) lines.push(`- ${item.source}: \`${item.detail.replace(/`/g, "'")}\``);
        lines.push("");
      }
      if (check.recommendations.length > 0) {
        lines.push("**\u78BA\u8A8D\u30FB\u6539\u5584\u306E\u5019\u88DC**", "");
        for (const item of check.recommendations) lines.push(`- ${item}`);
        lines.push("");
      }
      if (check.limitations.length > 0) {
        lines.push("**\u3053\u306E\u30C1\u30A7\u30C3\u30AF\u3067\u5206\u304B\u3089\u306A\u3044\u3053\u3068**", "");
        for (const item of check.limitations) lines.push(`- ${item}`);
        lines.push("");
      }
    }
  }
  return lines.join("\n");
}
function toText(report) {
  const lines = [];
  for (const target of report.targets) {
    const checks = [...target.checks].sort(byImportance);
    lines.push(`${target.host}  (\u7D44\u7E54\u30C9\u30E1\u30A4\u30F3 ${target.organizationalDomain})  ${counts(checks)}`);
    for (const check of checks) {
      lines.push(`  ${STATUS_ICON[check.status]} ${STATUS_LABEL[check.status].padEnd(4, "\u3000")} ${check.id.padEnd(20)} ${check.summary}`);
      if (check.status === "finding" || check.status === "review") {
        for (const recommendation of check.recommendations.slice(0, 1)) lines.push(`      \u2192 ${recommendation}`);
      }
    }
    lines.push("");
  }
  lines.push("\u8A73\u7D30\u306F --format markdown \u307E\u305F\u306F --format json \u3067\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002\u300C\u78BA\u8A8D\u6E08\u307F\u300D\u306F\u5B89\u5168\u306E\u4FDD\u8A3C\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002");
  return lines.join("\n") + "\n";
}
function worstFinding(report) {
  const severities = report.targets.flatMap((target) => target.checks.filter((check) => check.status === "finding").map((check) => check.severity ?? "info"));
  return SEVERITY_ORDER.find((severity) => severities.includes(severity));
}
function meetsSeverity(found, threshold) {
  return found !== void 0 && SEVERITY_ORDER.indexOf(found) <= SEVERITY_ORDER.indexOf(threshold);
}

// src/checks/context.ts
function evidence(context, source, detail) {
  return { source, observedAt: context.now().toISOString(), detail };
}
function result(partial) {
  return { evidence: [], recommendations: [], limitations: [], ...partial };
}
function describeAnswer(answer2, format = String) {
  if (answer2.ok) return answer2.records.map(format).join(" | ");
  if (answer2.failure === "NODATA") return "\u30EC\u30B3\u30FC\u30C9\u306A\u3057";
  if (answer2.failure === "NXDOMAIN") return "\u540D\u524D\u304C\u5B58\u5728\u3057\u306A\u3044 (NXDOMAIN)";
  return `\u53D6\u5F97\u5931\u6557 (${answer2.failure}: ${answer2.message})`;
}
function isLookupError(answer2) {
  return !answer2.ok && answer2.failure !== "NODATA" && answer2.failure !== "NXDOMAIN";
}
var sendsMail = (usage) => usage === "send-and-receive" || usage === "send-only";
var receivesMail = (usage) => usage === "send-and-receive" || usage === "receive-only";

// src/checks/mail.ts
async function observeMail(context) {
  const { host, organizationalDomain: organizationalDomain2, dns } = context;
  const [mx, txt, dmarcHost, dmarcOrg, dkim] = await Promise.all([
    dns.mx(host),
    dns.txt(host),
    dns.txt(`_dmarc.${host}`),
    host === organizationalDomain2 ? Promise.resolve(void 0) : dns.txt(`_dmarc.${organizationalDomain2}`),
    Promise.all(
      context.dkimSelectors.map(async (selector) => {
        const name = `${selector}._domainkey.${host}`;
        return { selector, name, txt: await dns.txt(name) };
      })
    )
  ]);
  return { mx, txt, dmarcHost, dmarcOrg, dkim };
}
var QUOTED = /^\s*["“”']|["“”']\s*$/;
var stripQuotes = (value) => value.replace(/^\s*["“”']+|["“”']+\s*$/g, "");
var SENDERS = [
  [/amazonses\.com/i, "Amazon SES"],
  [/_spf\.google\.com/i, "Google Workspace"],
  [/spf\.protection\.outlook\.com/i, "Microsoft 365"],
  [/sendgrid\.net/i, "SendGrid"],
  [/mailgun\.org/i, "Mailgun"],
  [/spf\.mandrillapp\.com|mailchimp/i, "Mailchimp"],
  [/zoho\./i, "Zoho Mail"],
  [/_spf\.mx\.cloudflare\.net/i, "Cloudflare Email Routing"],
  [/spf\.messagingengine\.com/i, "Fastmail"]
];
var spfRecords = (txt) => txt.ok ? txt.records.filter((record) => /v=spf1\b/i.test(record)) : [];
var isNullMx = (record) => record.exchange === "" || record.exchange === ".";
function checkMailContext(context, mail) {
  const { host, mailUsage } = context;
  const signals = [];
  const items = [];
  const allMx = mail.mx.ok ? mail.mx.records.filter((record) => !isNullMx(record)) : [];
  const bounceMx = allMx.filter((record) => /^feedback-smtp\.[a-z0-9-]+\.amazonses\.com\.?$/i.test(record.exchange));
  const realMx = allMx.filter((record) => !bounceMx.includes(record));
  const nullMx = mail.mx.ok && mail.mx.records.some(isNullMx);
  if (bounceMx.length > 0) signals.push("\u9001\u4FE1: Amazon SES \u306E\u30AB\u30B9\u30BF\u30E0 MAIL FROM\uFF08\u30D0\u30A6\u30F3\u30B9\u53D7\u3051\u53D6\u308A\u7528\u306EMX\uFF09");
  if (realMx.length > 0) signals.push(`\u53D7\u4FE1: MX ${realMx.map((record) => record.exchange).join(", ")}`);
  if (nullMx) signals.push("\u53D7\u4FE1\u3057\u306A\u3044\u5BA3\u8A00: Null MX");
  for (const record of spfRecords(mail.txt)) {
    const value = stripQuotes(record);
    const senders = SENDERS.filter(([pattern]) => pattern.test(value)).map(([, name]) => name);
    if (/\s-all\b/i.test(value) && !/\s(include|a|mx|ip4|ip6|exists|redirect)[:=\s]/i.test(value)) signals.push("\u3053\u306E\u30DB\u30B9\u30C8\u540D\u3092\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u9001\u4FE1\u8005\u306B\u3057\u306A\u3044\u5BA3\u8A00: SPF -all \u306E\u307F");
    else signals.push(`\u9001\u4FE1: SPF ${senders.length > 0 ? `(${senders.join("\u3001")})` : "\u3067\u9001\u4FE1\u5143\u3092\u6307\u5B9A"}`);
  }
  for (const dkim of mail.dkim) if (dkim.txt.ok) signals.push(`\u9001\u4FE1: DKIM ${dkim.selector}`);
  items.push(evidence(context, "\u63A8\u6E2C\u306B\u4F7F\u3063\u305F\u30B7\u30B0\u30CA\u30EB", signals.length > 0 ? signals.join(" / ") : "\u306A\u3057"));
  const looksSending = signals.some((signal) => signal.startsWith("\u9001\u4FE1:"));
  const looksReceiving = realMx.length > 0;
  const declaresNone = signals.some((signal) => signal.includes("\u3057\u306A\u3044\u5BA3\u8A00"));
  const inferred = looksSending || looksReceiving ? `${looksSending ? "\u9001\u4FE1" : ""}${looksSending && looksReceiving ? "\u3068" : ""}${looksReceiving ? "\u53D7\u4FE1" : ""}\u306B\u4F7F\u3063\u3066\u3044\u308B\u53EF\u80FD\u6027` : declaresNone ? `\u30E1\u30FC\u30EB\u3092\u4F7F\u308F\u306A\u3044\u5BA3\u8A00\u304C\u516C\u958B\u3055\u308C\u3066\u3044\u307E\u3059\uFF08${[nullMx ? "Null MX" : "", signals.some((signal) => signal.includes("SPF -all")) ? "SPF -all" : ""].filter(Boolean).join("\u3001")}\uFF09` : "\u30E1\u30FC\u30EB\u7528\u9014\u306E\u624B\u304C\u304B\u308A\u306A\u3057";
  const conflict = mailUsage === "none" && (looksSending || looksReceiving) || sendsMail(mailUsage) && declaresNone && !looksSending || receivesMail(mailUsage) && nullMx;
  const limitations = [
    `${host} \u81EA\u8EAB\u306E\u30EC\u30B3\u30FC\u30C9\u3060\u3051\u3092\u898B\u3066\u3044\u307E\u3059\u3002\u30E1\u30FC\u30EB\u9001\u4FE1\u306B\u30B5\u30D6\u30C9\u30E1\u30A4\u30F3\uFF08\u4F8B: SES\u306EMAIL FROM\u7528\u306E mail.${host}\uFF09\u3092\u4F7F\u3046\u69CB\u6210\u3067\u306F\u3001\u305D\u3061\u3089\u306BMX\u30FBSPF\u304C\u3042\u308A\u307E\u3059\u3002`,
    "DKIM\u306F\u3001\u30BB\u30EC\u30AF\u30BF\u3092\u6307\u5B9A\u3057\u305F\u5834\u5408\u3060\u3051\u78BA\u8A8D\u3057\u3066\u3044\u307E\u3059\u3002",
    "SPF -all \u306F\u300C\u3053\u306E\u30DB\u30B9\u30C8\u540D\u3092\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u9001\u4FE1\u8005\uFF08MAIL FROM\uFF09\u306B\u3057\u305F\u30E1\u30FC\u30EB\u306F\u6B63\u5F53\u3067\u306A\u3044\u300D\u3068\u3044\u3046\u610F\u5473\u3067\u3059\u3002\u5DEE\u51FA\u4EBA\uFF08\u30D8\u30C3\u30C0\u30FCFrom\uFF09\u306B\u3053\u306E\u30C9\u30E1\u30A4\u30F3\u3092\u4F7F\u3044\u3001\u5225\u306EMAIL FROM\u3068DKIM\u7F72\u540D\u3067\u9001\u308B\u69CB\u6210\uFF08Amazon SES \u306A\u3069\uFF09\u3067\u306F\u3001SPF -all \u3067\u3082\u9001\u4FE1\u3067\u304D\u307E\u3059\u3002"
  ];
  if (mailUsage === "unknown") {
    return result({
      id: "mail.context",
      title: "\u30E1\u30FC\u30EB\u306E\u7528\u9014",
      status: "review",
      severity: "info",
      summary: `\u30E1\u30FC\u30EB\u306E\u7528\u9014\u306F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\u516C\u958B\u30EC\u30B3\u30FC\u30C9\u304B\u3089\u306E\u63A8\u6E2C: ${inferred}\u3002`,
      evidence: items,
      recommendations: [
        "\u30E1\u30FC\u30EB\u306E\u9001\u53D7\u4FE1\u306E\u6709\u7121\u3092 --mail \u3067\u6307\u5B9A\u3059\u308B\u3068\u3001\u7528\u9014\u306B\u5408\u3063\u305F\u78BA\u8A8D\u30FB\u63D0\u6848\u306B\u306A\u308A\u307E\u3059\u3002\u7528\u9014\u304C\u5206\u304B\u3089\u306A\u3044\u3046\u3061\u306F\u3001Null MX\u30FBSPF -all\u30FBDMARC p=reject \u306E\u3088\u3046\u306A\u5F37\u3044\u8A2D\u5B9A\u306F\u63D0\u6848\u3057\u307E\u305B\u3093\u3002"
      ],
      limitations
    });
  }
  return result({
    id: "mail.context",
    title: "\u30E1\u30FC\u30EB\u306E\u7528\u9014",
    status: conflict ? "review" : "pass",
    severity: conflict ? "medium" : "info",
    summary: conflict ? `\u6307\u5B9A\u3055\u308C\u305F\u7528\u9014\uFF08${mailUsage}\uFF09\u3068\u516C\u958B\u30EC\u30B3\u30FC\u30C9\u304C\u98DF\u3044\u9055\u3063\u3066\u3044\u307E\u3059\uFF08\u63A8\u6E2C: ${inferred}\uFF09\u3002` : `\u6307\u5B9A\u3055\u308C\u305F\u7528\u9014\uFF08${mailUsage}\uFF09\u3067\u70B9\u691C\u3057\u307E\u3059\u3002\u516C\u958B\u30EC\u30B3\u30FC\u30C9\u304B\u3089\u306E\u63A8\u6E2C: ${inferred}\u3002`,
    evidence: items,
    recommendations: conflict ? ["\u7528\u9014\u306E\u6307\u5B9A\u3068\u5B9F\u969B\u306E\u904B\u7528\u306E\u3069\u3061\u3089\u304C\u6B63\u3057\u3044\u304B\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u98DF\u3044\u9055\u3044\u3092\u89E3\u6D88\u3059\u308B\u307E\u3067\u3001\u30E1\u30FC\u30EB\u95A2\u9023\u306E\u8A2D\u5B9A\u5909\u66F4\u306F\u63A7\u3048\u3066\u304F\u3060\u3055\u3044\u3002"] : [],
    limitations
  });
}
function checkMx(context, mail) {
  const { host, mailUsage, dns } = context;
  const id = "mail.mx";
  const title = "MX\uFF08\u30E1\u30FC\u30EB\u306E\u53D7\u4FE1\u5148\uFF09";
  const items = [evidence(context, `DNS MX ${host} (${dns.source})`, describeAnswer(mail.mx, (record) => `${record.priority} ${record.exchange || "."}`))];
  if (isLookupError(mail.mx)) return result({ id, title, status: "error", summary: "MX\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002", evidence: items });
  if (mail.mx.ok) {
    const records = mail.mx.records;
    const malformed = records.filter((record) => /\s/.test(record.exchange) || /^\d+\s/.test(record.exchange));
    if (malformed.length > 0) {
      return result({
        id,
        title,
        status: "finding",
        severity: "medium",
        summary: `MX\u306E\u5024\u306E\u66F8\u5F0F\u304C\u8AA4\u3063\u3066\u3044\u307E\u3059\uFF08${malformed.map((record) => `"${record.exchange}"`).join(", ")}\uFF09\u3002\u512A\u5148\u5EA6\u304C\u5024\u306E\u4E2D\u306B\u5165\u3063\u3066\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002`,
        evidence: items,
        recommendations: ["MX\u306F\u300C\u512A\u5148\u5EA6\u300D\u3068\u300C\u30E1\u30FC\u30EB\u30B5\u30FC\u30D0\u30FC\u306E\u30DB\u30B9\u30C8\u540D\u300D\u3092\u5225\u3005\u306E\u6B04\u306B\u8A2D\u5B9A\u3057\u307E\u3059\u3002\u5024\u306B\u306F \u30DB\u30B9\u30C8\u540D\u3060\u3051\u3092\u5165\u308C\u3066\u304F\u3060\u3055\u3044\uFF08\u4F8B: \u512A\u5148\u5EA6 10\u3001\u5024 mail.example.net\uFF09\u3002"],
        limitations: ["DNS\u4E8B\u696D\u8005\u306ECSV\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306A\u3069\u3067\u306F\u512A\u5148\u5EA6\u304C\u8868\u793A\u3055\u308C\u306A\u3044\u3053\u3068\u304C\u3042\u308A\u307E\u3059\u3002\u516C\u958BDNS\u306E\u5FDC\u7B54\u3067\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"]
      });
    }
    const hasNull = records.some(isNullMx);
    if (hasNull && records.length > 1) {
      return result({
        id,
        title,
        status: "finding",
        severity: "medium",
        summary: "Null MX\uFF08\u53D7\u4FE1\u3057\u306A\u3044\u5BA3\u8A00\uFF09\u3068\u901A\u5E38\u306EMX\u304C\u540C\u6642\u306B\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u3002",
        evidence: items,
        recommendations: ["Null MX\u306F\u5358\u72EC\u3067\u4F7F\u3046\u6C7A\u307E\u308A\u3067\u3059\uFF08RFC 7505\uFF09\u3002\u53D7\u4FE1\u3059\u308B\u306A\u3089 Null MX \u3092\u524A\u9664\u3001\u53D7\u4FE1\u3057\u306A\u3044\u306A\u3089\u4ED6\u306EMX\u3092\u524A\u9664\u3057\u3066\u304F\u3060\u3055\u3044\u3002"]
      });
    }
    if (hasNull) {
      const contradicts = receivesMail(mailUsage);
      return result({
        id,
        title,
        status: contradicts ? "finding" : "pass",
        severity: contradicts ? "high" : "info",
        summary: contradicts ? "Null MX\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u304C\u3001\u7528\u9014\u306F\u30E1\u30FC\u30EB\u3092\u53D7\u4FE1\u3059\u308B\u8A2D\u5B9A\u3067\u3059\u3002\u30E1\u30FC\u30EB\u3092\u53D7\u3051\u53D6\u308C\u307E\u305B\u3093\u3002" : "Null MX \u306B\u3088\u308A\u3001\u3053\u306E\u30DB\u30B9\u30C8\u3067\u30E1\u30FC\u30EB\u3092\u53D7\u4FE1\u3057\u306A\u3044\u3053\u3068\u3092\u5BA3\u8A00\u3057\u3066\u3044\u307E\u3059\u3002",
        evidence: items,
        recommendations: contradicts ? ["\u53D7\u4FE1\u3059\u308B\u306A\u3089 Null MX \u3092\u524A\u9664\u3057\u3001\u30E1\u30FC\u30EB\u30B5\u30FC\u30D0\u30FC\u306EMX\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002"] : []
      });
    }
    const unexpected = mailUsage === "none" || mailUsage === "send-only";
    return result({
      id,
      title,
      status: unexpected ? "review" : "pass",
      severity: unexpected ? "low" : "info",
      summary: `MX\u304C${records.length}\u4EF6\u3042\u308A\u307E\u3059\uFF08${records.map((record) => record.exchange).join(", ")}\uFF09\u3002`,
      evidence: items,
      recommendations: unexpected ? ["\u7528\u9014\u306F\u53D7\u4FE1\u3057\u306A\u3044\u8A2D\u5B9A\u3067\u3059\u304C\u3001MX\u304C\u3042\u308A\u307E\u3059\u3002\u4E0D\u8981\u306A\u3089\u524A\u9664\u3092\u691C\u8A0E\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u8FF7\u60D1\u30E1\u30FC\u30EB\u306E\u53D7\u3051\u53E3\u306B\u306A\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059\uFF09\u3002"] : []
    });
  }
  if (receivesMail(mailUsage)) {
    return result({
      id,
      title,
      status: "finding",
      severity: "high",
      summary: "MX\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u3053\u306E\u30DB\u30B9\u30C8\u5B9B\u3066\u306E\u30E1\u30FC\u30EB\u3092\u78BA\u5B9F\u306B\u53D7\u4FE1\u3067\u304D\u307E\u305B\u3093\u3002",
      evidence: items,
      recommendations: ["\u30E1\u30FC\u30EB\u30B5\u30FC\u30D3\u30B9\u306E\u6848\u5185\u306B\u5F93\u3063\u3066MX\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002"],
      limitations: ["MX\u304C\u306A\u3044\u5834\u5408\u3001\u9001\u4FE1\u5074\u306FA/AAAA\u30EC\u30B3\u30FC\u30C9\u3078\u914D\u9001\u3092\u8A66\u307F\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059\uFF08\u6697\u9ED9\u306EMX\uFF09\u3002"]
    });
  }
  return result({
    id,
    title,
    status: mailUsage === "none" ? "review" : mailUsage === "send-only" ? "pass" : "review",
    severity: mailUsage === "send-only" ? "info" : "low",
    summary: "MX\u306F\u3042\u308A\u307E\u305B\u3093\u3002",
    evidence: items,
    recommendations: mailUsage === "none" ? ['\u3053\u306E\u30DB\u30B9\u30C8\u3067\u30E1\u30FC\u30EB\u3092\u4E00\u5207\u53D7\u4FE1\u3057\u306A\u3044\u3053\u3068\u304C\u78BA\u304B\u306A\u3089\u3001Null MX\uFF08\u512A\u5148\u5EA6 0\u3001\u5024 "."\uFF09\u3067\u53D7\u4FE1\u3057\u306A\u3044\u3053\u3068\u3092\u660E\u793A\u3067\u304D\u307E\u3059\u3002'] : mailUsage === "unknown" ? ["\u53D7\u4FE1\u3059\u308B\u304B\u3069\u3046\u304B\u3067\u5BFE\u5FDC\u304C\u5909\u308F\u308A\u307E\u3059\u3002\u53D7\u4FE1\u3057\u306A\u3044\u3053\u3068\u304C\u78BA\u304B\u306A\u5834\u5408\u306B\u9650\u308A\u3001Null MX \u3092\u691C\u8A0E\u3067\u304D\u307E\u3059\u3002"] : [],
    limitations: ["MX\u304C\u306A\u3044\u5834\u5408\u3001\u9001\u4FE1\u5074\u306FA/AAAA\u30EC\u30B3\u30FC\u30C9\u3078\u914D\u9001\u3092\u8A66\u307F\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059\uFF08\u6697\u9ED9\u306EMX\uFF09\u3002"]
  });
}
function checkSpf(context, mail) {
  const { host, mailUsage, dns } = context;
  const id = "mail.spf";
  const title = "SPF";
  const items = [evidence(context, `DNS TXT ${host} (${dns.source})`, describeAnswer(mail.txt, (record2) => JSON.stringify(record2)))];
  if (isLookupError(mail.txt)) return result({ id, title, status: "error", summary: "TXT\u30EC\u30B3\u30FC\u30C9\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002", evidence: items });
  const limitations = ["SPF\u306E\u69CB\u6587\u5168\u4F53\u3084DNS\u53C2\u7167\u56DE\u6570\uFF08\u4E0A\u965010\u56DE\uFF09\u306F\u691C\u67FB\u3057\u3066\u3044\u307E\u305B\u3093\u3002"];
  const records = spfRecords(mail.txt);
  if (records.length > 1) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `SPF\u30EC\u30B3\u30FC\u30C9\u304C${records.length}\u4EF6\u3042\u308A\u307E\u3059\u3002\u8907\u6570\u3042\u308B\u3068SPF\u306F\u5931\u6557\uFF08permerror\uFF09\u6271\u3044\u306B\u306A\u308A\u307E\u3059\u3002`,
      evidence: items,
      recommendations: ["1\u4EF6\u306B\u307E\u3068\u3081\u3066\u304F\u3060\u3055\u3044\uFF08include \u306A\u3069\u306E\u6307\u5B9A\u30921\u3064\u306E\u30EC\u30B3\u30FC\u30C9\u306B\u4E26\u3079\u307E\u3059\uFF09\u3002"],
      limitations
    });
  }
  const record = records[0];
  if (record !== void 0) {
    if (QUOTED.test(record) || !/^v=spf1\b/i.test(record.trim())) {
      return result({
        id,
        title,
        status: "finding",
        severity: "medium",
        summary: `SPF\u306E\u5024\u306E\u66F8\u5F0F\u304C\u8AA4\u3063\u3066\u3044\u307E\u3059: ${JSON.stringify(record)}\u3002\u5024\u306F "v=spf1" \u3067\u59CB\u307E\u308B\u5FC5\u8981\u304C\u3042\u308A\u3001\u4F59\u5206\u306A\u5F15\u7528\u7B26\u304C\u3042\u308B\u3068\u7121\u52B9\u306B\u306A\u308A\u307E\u3059\u3002`,
        evidence: items,
        recommendations: [`\u5024\u3092 ${stripQuotes(record)} \u306B\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u7BA1\u7406\u753B\u9762\u306B\u3088\u3063\u3066\u306F\u5F15\u7528\u7B26\u3092\u81EA\u52D5\u3067\u4ED8\u3051\u308B\u305F\u3081\u3001\u5165\u529B\u306B\u5F15\u7528\u7B26\u3092\u542B\u3081\u306A\u3044\u3067\u304F\u3060\u3055\u3044\uFF09\u3002`],
        limitations
      });
    }
    const all = record.match(/\s([+\-~?]?)all\b/i);
    const qualifier = all ? all[1] || "+" : void 0;
    if (qualifier === "+") {
      return result({
        id,
        title,
        status: "finding",
        severity: "high",
        summary: "SPF\u304C +all \u3067\u7D42\u308F\u3063\u3066\u3044\u307E\u3059\u3002\u3069\u306E\u30B5\u30FC\u30D0\u30FC\u304B\u3089\u306E\u9001\u4FE1\u3082\u6B63\u5F53\u3068\u6271\u308F\u308C\u307E\u3059\u3002",
        evidence: items,
        recommendations: ["\u9001\u4FE1\u5143\u3092 include / ip4 \u306A\u3069\u3067\u6307\u5B9A\u3057\u3001\u672B\u5C3E\u3092 ~all \u304B -all \u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002"],
        limitations
      });
    }
    if (qualifier === void 0 || qualifier === "?") {
      return result({
        id,
        title,
        status: "review",
        severity: "low",
        summary: qualifier === "?" ? "SPF\u304C ?all\uFF08\u4E2D\u7ACB\uFF09\u3067\u7D42\u308F\u3063\u3066\u3044\u307E\u3059\u3002" : "SPF\u306B all \u306E\u6307\u5B9A\u304C\u3042\u308A\u307E\u305B\u3093\u3002",
        evidence: items,
        recommendations: ["\u9001\u4FE1\u5143\u3092\u3059\u3079\u3066\u5217\u6319\u3067\u304D\u3066\u3044\u308B\u306A\u3089\u3001\u672B\u5C3E\u3092 ~all \u307E\u305F\u306F -all \u306B\u3059\u308B\u3053\u3068\u3092\u691C\u8A0E\u3057\u3066\u304F\u3060\u3055\u3044\u3002"],
        limitations
      });
    }
    return result({
      id,
      title,
      status: "pass",
      severity: "info",
      summary: `SPF\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\uFF08\u672B\u5C3E ${qualifier}all\uFF09\u3002`,
      evidence: items,
      limitations
    });
  }
  if (sendsMail(mailUsage)) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: "\u30E1\u30FC\u30EB\u3092\u9001\u4FE1\u3059\u308B\u7528\u9014\u3067\u3059\u304C\u3001\u3053\u306E\u30DB\u30B9\u30C8\u306BSPF\u304C\u3042\u308A\u307E\u305B\u3093\u3002",
      evidence: items,
      recommendations: [
        `\u9001\u4FE1\u306B\u4F7F\u3046\u30B5\u30FC\u30D3\u30B9\u306E\u6848\u5185\u306B\u5F93\u3063\u3066SPF\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u30A8\u30F3\u30D9\u30ED\u30FC\u30D7\u9001\u4FE1\u8005\uFF08MAIL FROM\uFF09\u306B\u5225\u306E\u30B5\u30D6\u30C9\u30E1\u30A4\u30F3\u3092\u4F7F\u3046\u30B5\u30FC\u30D3\u30B9\uFF08Amazon SES\u306E\u30AB\u30B9\u30BF\u30E0MAIL FROM\u306A\u3069\uFF09\u3067\u306F\u3001\u305D\u306E\u30B5\u30D6\u30C9\u30E1\u30A4\u30F3\u5074\u306BSPF\u304C\u5FC5\u8981\u3067\u3059\u3002`
      ],
      limitations
    });
  }
  return result({
    id,
    title,
    status: "review",
    severity: "low",
    summary: "SPF\u306F\u3042\u308A\u307E\u305B\u3093\u3002",
    evidence: items,
    recommendations: mailUsage === "none" || mailUsage === "receive-only" ? ["\u3053\u306E\u30DB\u30B9\u30C8\u304B\u3089\u30E1\u30FC\u30EB\u3092\u9001\u4FE1\u3057\u306A\u3044\u3053\u3068\u304C\u78BA\u304B\u306A\u3089\u3001v=spf1 -all \u3067\u300C\u9001\u4FE1\u3057\u306A\u3044\u300D\u3053\u3068\u3092\u660E\u793A\u3057\u3001\u306A\u308A\u3059\u307E\u3057\u3092\u9632\u3052\u307E\u3059\u3002"] : ["\u9001\u4FE1\u3059\u308B\u304B\u3069\u3046\u304B\u3067\u5BFE\u5FDC\u304C\u5909\u308F\u308A\u307E\u3059\u3002\u9001\u4FE1\u3057\u306A\u3044\u3053\u3068\u304C\u78BA\u304B\u306A\u5834\u5408\u306B\u9650\u308A v=spf1 -all \u3092\u691C\u8A0E\u3067\u304D\u307E\u3059\u3002"],
    limitations
  });
}
function parseDmarc(record) {
  const tags = {};
  for (const part of record.split(";")) {
    const [key, ...rest] = part.split("=");
    if (key && rest.length > 0) tags[key.trim().toLowerCase()] = rest.join("=").trim().toLowerCase();
  }
  return tags;
}
function checkDmarc(context, mail) {
  const { host, organizationalDomain: organizationalDomain2, mailUsage, dns } = context;
  const id = "mail.dmarc";
  const title = "DMARC";
  const items = [evidence(context, `DNS TXT _dmarc.${host} (${dns.source})`, describeAnswer(mail.dmarcHost, (record2) => JSON.stringify(record2)))];
  if (mail.dmarcOrg) items.push(evidence(context, `DNS TXT _dmarc.${organizationalDomain2} (${dns.source})`, describeAnswer(mail.dmarcOrg, (record2) => JSON.stringify(record2))));
  const limitations = ["\u516C\u958B\u30EC\u30B3\u30FC\u30C9\u3060\u3051\u3092\u898B\u3066\u3044\u307E\u3059\u3002\u5B9F\u969B\u306E\u30E1\u30FC\u30EB\u304CSPF\u30FBDKIM\u306E\u30A2\u30E9\u30A4\u30E1\u30F3\u30C8\u3092\u6E80\u305F\u3059\u304B\u306F\u3001\u9001\u4FE1\u3057\u305F\u30E1\u30FC\u30EB\u306E\u30D8\u30C3\u30C0\u30FC\u3067\u78BA\u8A8D\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002"];
  for (const answer2 of [mail.dmarcHost, mail.dmarcOrg]) {
    if (answer2 && isLookupError(answer2)) return result({ id, title, status: "error", summary: "DMARC\u30EC\u30B3\u30FC\u30C9\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002", evidence: items });
  }
  const candidates = (answer2) => answer2?.ok ? answer2.records.filter((record2) => /v\s*=\s*dmarc1/i.test(record2)) : [];
  const own = candidates(mail.dmarcHost);
  const inherited = own.length === 0 ? candidates(mail.dmarcOrg) : [];
  const records = own.length > 0 ? own : inherited;
  const where = own.length > 0 ? `_dmarc.${host}` : `_dmarc.${organizationalDomain2}`;
  if (records.length === 0) {
    const strong = mailUsage === "none";
    return result({
      id,
      title,
      status: sendsMail(mailUsage) ? "finding" : "review",
      severity: sendsMail(mailUsage) ? "medium" : "low",
      summary: `DMARC\u30EC\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093\uFF08_dmarc.${host}${mail.dmarcOrg ? ` \u3068 _dmarc.${organizationalDomain2}` : ""}\uFF09\u3002`,
      evidence: items,
      recommendations: strong ? ["\u30E1\u30FC\u30EB\u3092\u4E00\u5207\u9001\u4FE1\u3057\u306A\u3044\u3053\u3068\u304C\u78BA\u304B\u306A\u3089\u3001v=DMARC1; p=reject; \u3067\u3001\u3053\u306E\u30C9\u30E1\u30A4\u30F3\u3092\u540D\u4E57\u308B\u30E1\u30FC\u30EB\u3092\u62D2\u5426\u3059\u308B\u3088\u3046\u53D7\u4FE1\u5074\u306B\u6C42\u3081\u3089\u308C\u307E\u3059\u3002"] : sendsMail(mailUsage) ? ["\u307E\u305A v=DMARC1; p=none; rua=mailto:\uFF08\u96C6\u8A08\u30EC\u30DD\u30FC\u30C8\u306E\u53D7\u3051\u53D6\u308A\u5148\uFF09\u3067\u72B6\u6CC1\u3092\u628A\u63E1\u3057\u3001\u6B63\u898F\u306E\u30E1\u30FC\u30EB\u304CSPF\u304BDKIM\u306E\u30A2\u30E9\u30A4\u30E1\u30F3\u30C8\u3092\u6E80\u305F\u3059\u3053\u3068\u3092\u78BA\u8A8D\u3057\u3066\u304B\u3089\u3001quarantine \u2192 reject \u3068\u6BB5\u968E\u7684\u306B\u5F37\u3081\u3066\u304F\u3060\u3055\u3044\u3002"] : ["\u9001\u4FE1\u306E\u6709\u7121\u3067\u9069\u5207\u306A\u8A2D\u5B9A\u304C\u5909\u308F\u308A\u307E\u3059\u3002\u9001\u4FE1\u3057\u306A\u3044\u3053\u3068\u304C\u78BA\u304B\u306A\u5834\u5408\u306B\u9650\u308A p=reject \u3092\u691C\u8A0E\u3067\u304D\u307E\u3059\u3002"],
      limitations
    });
  }
  if (records.length > 1) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `${where} \u306BDMARC\u30EC\u30B3\u30FC\u30C9\u304C${records.length}\u4EF6\u3042\u308A\u307E\u3059\u3002\u8907\u6570\u3042\u308B\u3068DMARC\u306F\u9069\u7528\u3055\u308C\u307E\u305B\u3093\u3002`,
      evidence: items,
      recommendations: ["1\u4EF6\u306B\u307E\u3068\u3081\u3066\u304F\u3060\u3055\u3044\u3002"],
      limitations
    });
  }
  const record = records[0];
  if (QUOTED.test(record) || !/^v=DMARC1\s*(;|$)/.test(record.trim())) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `${where} \u306EDMARC\u306E\u66F8\u5F0F\u304C\u8AA4\u3063\u3066\u3044\u307E\u3059: ${JSON.stringify(record)}\u3002"v=DMARC1" \u3067\u59CB\u307E\u308B\u5FC5\u8981\u304C\u3042\u308A\u3001\u4F59\u5206\u306A\u5F15\u7528\u7B26\u304C\u3042\u308B\u3068\u53D7\u4FE1\u5074\u306B\u7121\u8996\u3055\u308C\u307E\u3059\u3002`,
      evidence: items,
      recommendations: [`\u5024\u3092 ${stripQuotes(record).replace(/^v\s*=\s*dmarc1/i, "v=DMARC1")} \u306B\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u5165\u529B\u306B\u5F15\u7528\u7B26\u3092\u542B\u3081\u306A\u3044\u3067\u304F\u3060\u3055\u3044\uFF09\u3002`],
      limitations
    });
  }
  const tags = parseDmarc(record);
  const policy = inherited.length > 0 ? tags.sp ?? tags.p : tags.p;
  const inheritedNote = inherited.length > 0 ? `\uFF08${host} \u306B\u306F\u72EC\u81EA\u306E\u30EC\u30B3\u30FC\u30C9\u304C\u306A\u304F\u3001${organizationalDomain2} \u306E${tags.sp ? " sp=" : "\u30DD\u30EA\u30B7\u30FC"}\u304C\u9069\u7528\u3055\u308C\u307E\u3059\uFF09` : "";
  if (!policy || !["none", "quarantine", "reject"].includes(policy)) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `DMARC\u306E\u30DD\u30EA\u30B7\u30FC\uFF08p=\uFF09\u304C${policy ? `\u4E0D\u6B63\u3067\u3059\uFF08${policy}\uFF09` : "\u3042\u308A\u307E\u305B\u3093"}\u3002${inheritedNote}`,
      evidence: items,
      recommendations: ["p=none / quarantine / reject \u306E\u3044\u305A\u308C\u304B\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002"],
      limitations
    });
  }
  if (policy === "none") {
    return result({
      id,
      title,
      status: "review",
      severity: "low",
      summary: `DMARC\u306F p=none\uFF08\u76E3\u8996\u306E\u307F\uFF09\u3067\u3059${inheritedNote}\u3002\u306A\u308A\u3059\u307E\u3057\u30E1\u30FC\u30EB\u306F\u62D2\u5426\u3055\u308C\u307E\u305B\u3093\u3002`,
      evidence: items,
      recommendations: [
        mailUsage === "none" ? "\u30E1\u30FC\u30EB\u3092\u9001\u4FE1\u3057\u306A\u3044\u3053\u3068\u304C\u78BA\u304B\u306A\u3089\u3001p=reject \u306B\u5F37\u3081\u3089\u308C\u307E\u3059\u3002" : "\u6B63\u898F\u306E\u30E1\u30FC\u30EB\u304CSPF\u304BDKIM\u306E\u30A2\u30E9\u30A4\u30E1\u30F3\u30C8\u3092\u6E80\u305F\u3059\u3053\u3068\u3092\uFF08\u96C6\u8A08\u30EC\u30DD\u30FC\u30C8\u3084\u30C6\u30B9\u30C8\u9001\u4FE1\u3067\uFF09\u78BA\u8A8D\u3067\u304D\u305F\u3089\u3001quarantine \u2192 reject \u3068\u6BB5\u968E\u7684\u306B\u5F37\u3081\u308B\u3053\u3068\u3092\u691C\u8A0E\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
      ],
      limitations
    });
  }
  return result({
    id,
    title,
    status: "pass",
    severity: "info",
    summary: `DMARC\u306F p=${policy} \u3067\u3059${inheritedNote}\u3002`,
    evidence: items,
    limitations
  });
}
function checkDkim(context, mail) {
  const id = "mail.dkim";
  const title = "DKIM";
  if (mail.dkim.length === 0) {
    return result({
      id,
      title,
      status: "not_checked",
      summary: "DKIM\u30BB\u30EC\u30AF\u30BF\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u305F\u3081\u3001\u78BA\u8A8D\u3057\u3066\u3044\u307E\u305B\u3093\u3002",
      limitations: ["DKIM\u306E\u516C\u958B\u9375\u306F\u30BB\u30EC\u30AF\u30BF\u540D\u304C\u5206\u304B\u3089\u306A\u3044\u3068\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3002\u9001\u4FE1\u30B5\u30FC\u30D3\u30B9\u306E\u7BA1\u7406\u753B\u9762\u3084\u3001\u53D7\u4FE1\u3057\u305F\u30E1\u30FC\u30EB\u306E DKIM-Signature \u30D8\u30C3\u30C0\u30FC\uFF08s=\uFF09\u3067\u78BA\u8A8D\u3057\u3001--dkim-selector \u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002"]
    });
  }
  const items = mail.dkim.map((entry) => evidence(context, `DNS TXT ${entry.name} (${context.dns.source})`, describeAnswer(entry.txt, (record) => record.length > 80 ? `${record.slice(0, 80)}\u2026` : record)));
  if (mail.dkim.some((entry) => isLookupError(entry.txt))) return result({ id, title, status: "error", summary: "DKIM\u30EC\u30B3\u30FC\u30C9\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002", evidence: items });
  const missing = mail.dkim.filter((entry) => !entry.txt.ok || !entry.txt.records.some((record) => /(^|;)\s*p=/i.test(record)));
  const revoked = mail.dkim.filter((entry) => entry.txt.ok && entry.txt.records.some((record) => /(^|;)\s*p=\s*(;|$)/i.test(record)));
  if (missing.length > 0) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `\u6307\u5B9A\u3057\u305F\u30BB\u30EC\u30AF\u30BF\u306EDKIM\u516C\u958B\u9375\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093: ${missing.map((entry) => entry.selector).join(", ")}\u3002`,
      evidence: items,
      recommendations: ["\u30BB\u30EC\u30AF\u30BF\u540D\u304C\u6B63\u3057\u3044\u304B\u3001\u9001\u4FE1\u30B5\u30FC\u30D3\u30B9\u304C\u6848\u5185\u3059\u308BDKIM\u30EC\u30B3\u30FC\u30C9\uFF08CNAME\u307E\u305F\u306FTXT\uFF09\u304CDNS\u306B\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u304B\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"]
    });
  }
  if (revoked.length > 0) {
    return result({
      id,
      title,
      status: "review",
      severity: "low",
      summary: `\u516C\u958B\u9375\u304C\u7A7A\uFF08\u5931\u52B9\uFF09\u306E\u30BB\u30EC\u30AF\u30BF\u304C\u3042\u308A\u307E\u3059: ${revoked.map((entry) => entry.selector).join(", ")}\u3002`,
      evidence: items,
      recommendations: ["\u4F7F\u308F\u306A\u304F\u306A\u3063\u305F\u9375\u306A\u3089\u554F\u984C\u3042\u308A\u307E\u305B\u3093\u3002\u4F7F\u3063\u3066\u3044\u308B\u5834\u5408\u306F\u9001\u4FE1\u30B5\u30FC\u30D3\u30B9\u3067\u9375\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"]
    });
  }
  return result({
    id,
    title,
    status: "pass",
    severity: "info",
    summary: `\u6307\u5B9A\u3057\u305F\u30BB\u30EC\u30AF\u30BF\uFF08${mail.dkim.map((entry) => entry.selector).join(", ")}\uFF09\u306EDKIM\u516C\u958B\u9375\u304C\u516C\u958B\u3055\u308C\u3066\u3044\u307E\u3059\u3002`,
    evidence: items,
    limitations: ["\u9375\u304C\u516C\u958B\u3055\u308C\u3066\u3044\u308B\u3053\u3068\u3060\u3051\u3092\u78BA\u8A8D\u3057\u3066\u3044\u307E\u3059\u3002\u7F72\u540D\u304C\u5B9F\u969B\u306B\u691C\u8A3C\u306B\u901A\u308B\u304B\u306F\u3001\u9001\u4FE1\u3057\u305F\u30E1\u30FC\u30EB\u3067\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"]
  });
}

// src/checks/dns.ts
var DNS_HOSTS = [
  [".ns.cloudflare.com", "Cloudflare"],
  [".nsone.net", "NS1\uFF08Netlify DNS \u306A\u3069\uFF09"],
  [".awsdns-", "Amazon Route 53"],
  [".googledomains.com", "Google"],
  [".domaincontrol.com", "GoDaddy"],
  [".vercel-dns.com", "Vercel"],
  [".dns-onamae.com", "\u304A\u540D\u524D.com"],
  [".value-domain.com", "VALUE-DOMAIN"],
  [".azure-dns.", "Azure DNS"]
];
var PLATFORMS = [
  [".pages.dev", "Cloudflare Pages"],
  [".workers.dev", "Cloudflare Workers"],
  [".netlify.app", "Netlify"],
  [".vercel-dns.com", "Vercel"],
  [".vercel.app", "Vercel"],
  [".github.io", "GitHub Pages"],
  [".herokudns.com", "Heroku"],
  [".azurewebsites.net", "Azure App Service"],
  [".cloudfront.net", "Amazon CloudFront"],
  [".s3-website", "Amazon S3"]
];
var CA_BY_ISSUER = [
  [/let's encrypt/i, ["letsencrypt.org"]],
  [/google trust services/i, ["pki.goog"]],
  [/digicert/i, ["digicert.com"]],
  [/sectigo|comodo/i, ["sectigo.com", "comodoca.com"]],
  [/amazon/i, ["amazon.com", "amazontrust.com", "awstrust.com", "amazonaws.com"]],
  [/globalsign/i, ["globalsign.com"]],
  [/ssl\.com/i, ["ssl.com"]],
  [/zerossl/i, ["sectigo.com"]]
];
var matchSuffix = (name, table) => table.find(([suffix]) => name.toLowerCase().includes(suffix))?.[1];
async function checkAddress(context) {
  const { host, dns } = context;
  const [a, aaaa, cname] = await Promise.all([dns.a(host), dns.aaaa(host), dns.cname(host)]);
  const items = [
    evidence(context, `DNS CNAME ${host} (${dns.source})`, describeAnswer(cname)),
    evidence(context, `DNS A ${host} (${dns.source})`, describeAnswer(a)),
    evidence(context, `DNS AAAA ${host} (${dns.source})`, describeAnswer(aaaa))
  ];
  const title = "\u540D\u524D\u89E3\u6C7A\uFF08A / AAAA / CNAME\uFF09";
  if (a.ok || aaaa.ok) {
    return result({
      id: "dns.address",
      title,
      status: "pass",
      severity: "info",
      summary: `${host} \u306F${cname.ok ? ` CNAME ${cname.records[0]} \u3092\u7D4C\u7531\u3057\u3066` : ""}\u30A2\u30C9\u30EC\u30B9\u306B\u89E3\u6C7A\u3055\u308C\u307E\u3059\u3002`,
      evidence: items,
      limitations: ["\u518D\u5E30\u30EA\u30BE\u30EB\u30D0\u306E\u30AD\u30E3\u30C3\u30B7\u30E5\u306E\u5F71\u97FF\u3092\u53D7\u3051\u307E\u3059\u3002\u6A29\u5A01DNS\u306E\u73FE\u5728\u5024\u3068\u306F\u7570\u306A\u308B\u5834\u5408\u304C\u3042\u308A\u307E\u3059\u3002"]
    });
  }
  if ([a, aaaa].some(isLookupError)) {
    return result({ id: "dns.address", title, status: "error", summary: "\u540D\u524D\u89E3\u6C7A\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002", evidence: items });
  }
  const missing = !a.ok && a.failure === "NXDOMAIN";
  return result({
    id: "dns.address",
    title,
    status: "review",
    severity: "low",
    summary: missing ? `${host} \u3068\u3044\u3046\u540D\u524D\u306FDNS\u306B\u5B58\u5728\u3057\u307E\u305B\u3093\u3002` : `${host} \u306B\u306F\u30A2\u30C9\u30EC\u30B9\uFF08A / AAAA\uFF09\u304C\u3042\u308A\u307E\u305B\u3093\u3002`,
    evidence: items,
    recommendations: ["Web\u30B5\u30A4\u30C8\u3068\u3057\u3066\u4F7F\u3046\u30DB\u30B9\u30C8\u306A\u3089\u3001DNS\u30EC\u30B3\u30FC\u30C9\u306E\u8A2D\u5B9A\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u30E1\u30FC\u30EB\u5C02\u7528\u306A\u3069Web\u3067\u4F7F\u308F\u306A\u3044\u540D\u524D\u306A\u3089\u554F\u984C\u3042\u308A\u307E\u305B\u3093\u3002"]
  });
}
async function checkDanglingCname(context) {
  const { host, dns } = context;
  const id = "dns.dangling-cname";
  const title = "CNAME\u306E\u53C2\u7167\u5148";
  const cname = await dns.cname(host);
  if (!cname.ok) {
    return result({
      id,
      title,
      status: isLookupError(cname) ? "error" : "not_checked",
      summary: isLookupError(cname) ? "CNAME\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002" : "CNAME\u304C\u306A\u3044\u305F\u3081\u5BFE\u8C61\u5916\u3067\u3059\u3002",
      evidence: [evidence(context, `DNS CNAME ${host} (${dns.source})`, describeAnswer(cname))]
    });
  }
  const target = cname.records[0].replace(/\.$/, "");
  const [a, aaaa] = await Promise.all([dns.a(target), dns.aaaa(target)]);
  const items = [
    evidence(context, `DNS CNAME ${host} (${dns.source})`, target),
    evidence(context, `DNS A/AAAA ${target} (${dns.source})`, `${describeAnswer(a)} / ${describeAnswer(aaaa)}`)
  ];
  const platform = matchSuffix(target, PLATFORMS);
  if (a.ok || aaaa.ok) {
    return result({ id, title, status: "pass", severity: "info", summary: `\u53C2\u7167\u5148 ${target} \u306F\u30A2\u30C9\u30EC\u30B9\u306B\u89E3\u6C7A\u3055\u308C\u307E\u3059\u3002`, evidence: items });
  }
  if ([a, aaaa].some(isLookupError)) {
    return result({ id, title, status: "error", summary: `\u53C2\u7167\u5148 ${target} \u306E\u540D\u524D\u89E3\u6C7A\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002`, evidence: items });
  }
  const nxdomain = !a.ok && a.failure === "NXDOMAIN";
  return result({
    id,
    title,
    status: nxdomain ? "finding" : "review",
    severity: nxdomain ? "high" : "medium",
    summary: nxdomain ? `CNAME\u306E\u53C2\u7167\u5148 ${target} \u304C\u5B58\u5728\u3057\u307E\u305B\u3093${platform ? `\uFF08${platform}\uFF09` : ""}\u3002\u524A\u9664\u6E08\u307F\u306E\u30B5\u30FC\u30D3\u30B9\u3092\u6307\u3057\u3066\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002` : `CNAME\u306E\u53C2\u7167\u5148 ${target} \u306B\u30A2\u30C9\u30EC\u30B9\u304C\u3042\u308A\u307E\u305B\u3093\u3002`,
    evidence: items,
    recommendations: [
      `${host} \u3092\u4F7F\u3063\u3066\u3044\u306A\u3044\u306A\u3089\u3001CNAME\u30EC\u30B3\u30FC\u30C9\u306E\u524A\u9664\u3092\u691C\u8A0E\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u53C2\u7167\u5148\u306E\u540D\u524D\u3092\u7B2C\u4E09\u8005\u304C\u53D6\u5F97\u3059\u308B\u3068\u3001\u3053\u306E\u30B5\u30D6\u30C9\u30E1\u30A4\u30F3\u3067\u4EFB\u610F\u306E\u5185\u5BB9\u3092\u914D\u4FE1\u3055\u308C\u308B\uFF08\u30B5\u30D6\u30C9\u30E1\u30A4\u30F3\u4E57\u3063\u53D6\u308A\uFF09\u304A\u305D\u308C\u304C\u3042\u308A\u307E\u3059\u3002`,
      "\u4F7F\u3063\u3066\u3044\u308B\u306A\u3089\u3001\u53C2\u7167\u5148\u306E\u30B5\u30FC\u30D3\u30B9\u5074\u3067\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u3084\u30AB\u30B9\u30BF\u30E0\u30C9\u30E1\u30A4\u30F3\u306E\u8A2D\u5B9A\u304C\u6B8B\u3063\u3066\u3044\u308B\u304B\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
    ],
    limitations: ["\u53C2\u7167\u5148\u304C\u4E00\u6642\u7684\u306B\u89E3\u6C7A\u3067\u304D\u306A\u3044\u3060\u3051\u306E\u5834\u5408\u3082\u3042\u308A\u307E\u3059\u3002\u6642\u9593\u3092\u304A\u3044\u3066\u518D\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"]
  });
}
async function checkNameServers(context) {
  const { organizationalDomain: domain, dns } = context;
  const ns = await dns.ns(domain);
  const item = evidence(context, `DNS NS ${domain} (${dns.source})`, describeAnswer(ns));
  if (!ns.ok) {
    return result({ id: "dns.ns", title: "\u30CD\u30FC\u30E0\u30B5\u30FC\u30D0\u30FC", status: "error", summary: `${domain} \u306ENS\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002`, evidence: [item] });
  }
  const operators = [...new Set(ns.records.map((name) => matchSuffix(name, DNS_HOSTS) ?? "\u4E0D\u660E"))];
  const mixed = operators.length > 1;
  return result({
    id: "dns.ns",
    title: "\u30CD\u30FC\u30E0\u30B5\u30FC\u30D0\u30FC",
    status: mixed ? "review" : "pass",
    severity: mixed ? "low" : "info",
    summary: `${domain} \u306EDNS\u306F ${operators.join("\u3001")} \u3067\u63D0\u4F9B\u3055\u308C\u3066\u3044\u307E\u3059\uFF08NS ${ns.records.length}\u4EF6\uFF09\u3002`,
    evidence: [item],
    recommendations: mixed ? ["NS\u304C\u8907\u6570\u306E\u4E8B\u696D\u8005\u306B\u5206\u304B\u308C\u3066\u3044\u307E\u3059\u3002\u610F\u56F3\u3057\u305F\u69CB\u6210\u304B\u3001\u79FB\u884C\u9014\u4E2D\u306E\u72B6\u614B\u3067\u306A\u3044\u304B\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"] : [],
    limitations: [
      "\u518D\u5E30\u30EA\u30BE\u30EB\u30D0\u304B\u3089\u898B\u305FNS\u3067\u3059\u3002\u30EC\u30B8\u30B9\u30C8\u30EA\u306B\u767B\u9332\u3055\u308C\u305F\u59D4\u4EFB\u5148\uFF08\u89AA\u30BE\u30FC\u30F3\u306ENS\uFF09\u3068\u306E\u4E00\u81F4\u306F\u78BA\u8A8D\u3057\u3066\u3044\u307E\u305B\u3093\u3002",
      "DNS\u79FB\u884C\u306E\u76F4\u5F8C\u306F\u3001TLD\u306ENS\u306E\u30AD\u30E3\u30C3\u30B7\u30E5\uFF08\u6700\u95771\u65E5\u7A0B\u5EA6\uFF09\u306B\u3088\u308A\u3001\u5229\u7528\u8005\u3054\u3068\u306B\u7570\u306A\u308BDNS\u304C\u4F7F\u308F\u308C\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059\u3002"
    ]
  });
}
async function checkCaa(context, certificate) {
  const { host, organizationalDomain: organizationalDomain2, dns } = context;
  const id = "dns.caa";
  const title = "CAA\uFF08\u8A3C\u660E\u66F8\u3092\u767A\u884C\u3067\u304D\u308BCA\uFF09";
  const names = [];
  for (let name = host; ; name = name.slice(name.indexOf(".") + 1)) {
    names.push(name);
    if (name === organizationalDomain2 || !name.includes(".")) break;
  }
  const items = [];
  for (const name of names) {
    const caa = await dns.caa(name);
    items.push(evidence(context, `DNS CAA ${name} (${dns.source})`, describeAnswer(caa, (record) => `${record.critical} ${record.tag} "${record.value}"`)));
    if (isLookupError(caa)) return result({ id, title, status: "error", summary: `${name} \u306ECAA\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002`, evidence: items });
    if (!caa.ok) continue;
    const issuers = caa.records.filter((record) => record.tag === "issue" || record.tag === "issuewild").map((record) => record.value.split(";")[0].trim().toLowerCase()).filter(Boolean);
    const forbidsAll = caa.records.some((record) => record.tag === "issue" && record.value.trim() === ";") && issuers.length === 0;
    const organization = certificate?.ok ? certificate.issuerOrganization : "";
    const expected = CA_BY_ISSUER.find(([pattern]) => pattern.test(organization))?.[1];
    if (forbidsAll) {
      return result({
        id,
        title,
        status: "review",
        severity: "medium",
        summary: `${name} \u306ECAA\u306F\u3001\u3069\u306ECA\u306B\u3082\u8A3C\u660E\u66F8\u306E\u767A\u884C\u3092\u8A31\u53EF\u3057\u3066\u3044\u307E\u305B\u3093\u3002`,
        evidence: items,
        recommendations: ["HTTPS\u3067\u4F7F\u3046\u30DB\u30B9\u30C8\u306A\u3089\u3001\u8A3C\u660E\u66F8\u306E\u66F4\u65B0\u304C\u3067\u304D\u306A\u304F\u306A\u308A\u307E\u3059\u3002\u610F\u56F3\u3057\u305F\u8A2D\u5B9A\u304B\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"]
      });
    }
    if (expected && !expected.some((domain) => issuers.includes(domain))) {
      return result({
        id,
        title,
        status: "finding",
        severity: "medium",
        summary: `\u73FE\u5728\u306E\u8A3C\u660E\u66F8\u306E\u767A\u884C\u8005\uFF08${organization}\uFF09\u304C\u3001${name} \u306ECAA\u3067\u8A31\u53EF\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\u6B21\u56DE\u306E\u8A3C\u660E\u66F8\u66F4\u65B0\u306B\u5931\u6557\u3059\u308B\u304A\u305D\u308C\u304C\u3042\u308A\u307E\u3059\u3002`,
        evidence: items,
        recommendations: [
          `CAA\u306B ${expected[0]} \u3092\u8FFD\u52A0\u3059\u308B\u304B\u3001\u8A31\u53EF\u3055\u308C\u305FCA\u3067\u8A3C\u660E\u66F8\u3092\u767A\u884C\u3059\u308B\u3088\u3046\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002CDN\uFF08Cloudflare\u7B49\uFF09\u304C\u8A3C\u660E\u66F8\u3092\u767A\u884C\u3059\u308B\u5834\u5408\u3001\u305D\u306ECDN\u304C\u4F7F\u3046CA\u3059\u3079\u3066\u3092\u8A31\u53EF\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002`
        ],
        limitations: ["\u767A\u884C\u8005\u540D\u304B\u3089CA\u306E\u30C9\u30E1\u30A4\u30F3\u3092\u63A8\u5B9A\u3057\u3066\u3044\u307E\u3059\u3002\u4E2D\u9593CA\u306E\u540D\u524D\u306B\u3088\u3063\u3066\u306F\u5224\u5B9A\u3067\u304D\u307E\u305B\u3093\u3002"]
      });
    }
    return result({
      id,
      title,
      status: "pass",
      severity: "info",
      summary: `${name} \u306ECAA\u3067\u767A\u884C\u3067\u304D\u308BCA\u304C\u5236\u9650\u3055\u308C\u3066\u3044\u307E\u3059\uFF08${[...new Set(issuers)].join("\u3001")}\uFF09\u3002${expected ? "\u73FE\u5728\u306E\u8A3C\u660E\u66F8\u306E\u767A\u884C\u8005\u3082\u8A31\u53EF\u3055\u308C\u3066\u3044\u307E\u3059\u3002" : ""}`,
      evidence: items,
      limitations: expected ? [] : ["\u73FE\u5728\u306E\u8A3C\u660E\u66F8\u306E\u767A\u884C\u8005\u3068CAA\u306E\u5BFE\u5FDC\u306F\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002"]
    });
  }
  return result({
    id,
    title,
    status: "pass",
    severity: "info",
    summary: "CAA\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u3069\u306ECA\u3067\u3082\u8A3C\u660E\u66F8\u3092\u767A\u884C\u3067\u304D\u308B\u72B6\u614B\u3067\u3059\uFF08\u591A\u304F\u306E\u30B5\u30A4\u30C8\u3068\u540C\u3058\u65E2\u5B9A\u306E\u72B6\u614B\uFF09\u3002",
    evidence: items,
    recommendations: ["\u5FC5\u9808\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u4F7F\u3046CA\u3092\u9650\u5B9A\u3057\u305F\u3044\u5834\u5408\u306BCAA\u3092\u691C\u8A0E\u3067\u304D\u307E\u3059\u3002CDN\u3092\u4F7F\u3046\u5834\u5408\u306FCDN\u304C\u4F7F\u3046CA\u3082\u8A31\u53EF\u304C\u5FC5\u8981\u3067\u3059\u3002"]
  });
}
function checkDnssec(context) {
  return result({
    id: "dns.dnssec",
    title: "DNSSEC",
    status: "not_checked",
    summary: "\u3053\u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u3067\u306FDNSSEC\u3092\u691C\u67FB\u3057\u3066\u3044\u307E\u305B\u3093\u3002",
    evidence: [],
    limitations: [
      `Node.js\u306E\u6A19\u6E96DNS API\u306FDS\u30EC\u30B3\u30FC\u30C9\u3068\u691C\u8A3C\u7D50\u679C\uFF08AD\u30D5\u30E9\u30B0\uFF09\u3092\u8FD4\u3055\u306A\u3044\u305F\u3081\u3001${context.organizationalDomain} \u306EDNSSEC\u306E\u72B6\u614B\u306F\u5224\u5B9A\u3057\u3066\u3044\u307E\u305B\u3093\u3002`,
      "DNSSEC\u306E\u6709\u52B9\u5316\u306F\u30EC\u30B8\u30B9\u30C8\u30E9\u5074\u3067\u306EDS\u30EC\u30B3\u30FC\u30C9\u767B\u9332\u304C\u5FC5\u8981\u3067\u3001\u30EC\u30B8\u30B9\u30C8\u30E9\u306B\u3088\u3063\u3066\u306F\u6709\u6599\u3067\u3059\u3002\u672A\u8A2D\u5B9A\u3067\u3042\u308B\u3053\u3068\u3060\u3051\u3067\u554F\u984C\u3068\u306F\u307F\u306A\u3057\u307E\u305B\u3093\u3002"
    ]
  });
}

// src/checks/web.ts
var MAX_REDIRECTS = 5;
var DAY = 864e5;
async function follow(context, start) {
  const hops = [];
  let url = start;
  for (let step = 0; step <= MAX_REDIRECTS; step += 1) {
    const response = await context.web.get(url);
    hops.push({ url: url.href, response });
    if (!response.ok || response.status < 300 || response.status >= 400 || !response.headers.location) break;
    let next;
    try {
      next = new URL(response.headers.location, url);
    } catch {
      break;
    }
    if (next.protocol !== "http:" && next.protocol !== "https:") break;
    url = next;
  }
  return hops;
}
async function observeWeb(context) {
  const [fromHttp, https2, certificate] = await Promise.all([
    follow(context, new URL(`http://${context.host}/`)),
    context.web.get(new URL(`https://${context.host}/`)),
    context.web.certificate(context.host)
  ]);
  return { fromHttp, https: https2, certificate };
}
var describeHop = (hop) => hop.response.ok ? `${hop.response.status}${hop.response.headers.location ? ` \u2192 ${hop.response.headers.location}` : ""}` : `\u63A5\u7D9A\u5931\u6557 (${hop.response.failure}: ${hop.response.message})`;
var noWebsite = (web) => !web.https.ok && web.https.failure === "dns";
function checkHttps(context, web) {
  const { host } = context;
  const id = "web.https";
  const title = "HTTPS \u3068 HTTP \u304B\u3089\u306E\u8EE2\u9001";
  const items = [
    ...web.fromHttp.map((hop) => evidence(context, `HTTP GET ${hop.url}`, describeHop(hop))),
    evidence(context, `HTTPS GET https://${host}/`, describeHop({ url: `https://${host}/`, response: web.https }))
  ];
  if (noWebsite(web)) {
    return result({ id, title, status: "not_checked", summary: `${host} \u306F\u30A2\u30C9\u30EC\u30B9\u306B\u89E3\u6C7A\u3055\u308C\u306A\u3044\u305F\u3081\u3001Web\u306E\u70B9\u691C\u306F\u5BFE\u8C61\u5916\u3067\u3059\u3002`, evidence: items });
  }
  if (!web.https.ok) {
    if (web.https.failure === "blocked-address") {
      return result({ id, title, status: "not_checked", summary: "\u516C\u958B\u3055\u308C\u3066\u3044\u306A\u3044\u30A2\u30C9\u30EC\u30B9\u306B\u89E3\u6C7A\u3055\u308C\u305F\u305F\u3081\u3001\u63A5\u7D9A\u3057\u3066\u3044\u307E\u305B\u3093\u3002", evidence: items });
    }
    return result({
      id,
      title,
      status: web.https.failure === "timeout" || web.https.failure === "other" ? "error" : "finding",
      severity: "high",
      summary: `https://${host}/ \u306B\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\uFF08${web.https.failure}\uFF09\u3002`,
      evidence: items,
      recommendations: ["Web\u30B5\u30A4\u30C8\u3068\u3057\u3066\u4F7F\u3046\u30DB\u30B9\u30C8\u306A\u3089\u3001HTTPS\uFF08443\u756A\uFF09\u3067\u5FDC\u7B54\u3059\u308B\u3088\u3046\u3001\u30DB\u30B9\u30C6\u30A3\u30F3\u30B0\u3084CDN\u306E\u8A2D\u5B9A\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"],
      limitations: ["\u70B9\u691C\u3057\u305F\u7AEF\u672B\u306E\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u304B\u3089\u898B\u305F\u7D50\u679C\u3067\u3059\u3002"]
    });
  }
  const first = web.fromHttp[0];
  const last = web.fromHttp[web.fromHttp.length - 1];
  const redirectsToHttps = web.fromHttp.length > 1 && last !== void 0 && new URL(last.url).protocol === "https:";
  const tooMany = web.fromHttp.length > MAX_REDIRECTS && last?.response.ok && last.response.status >= 300 && last.response.status < 400;
  const httpServes = first?.response.ok && first.response.status >= 200 && first.response.status < 300;
  const limitations = ["\u30C8\u30C3\u30D7\u30DA\u30FC\u30B8\uFF08/\uFF09\u3060\u3051\u3092\u78BA\u8A8D\u3057\u3066\u3044\u307E\u3059\u3002"];
  if (tooMany) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `http://${host}/ \u304B\u3089\u306E\u30EA\u30C0\u30A4\u30EC\u30AF\u30C8\u304C${MAX_REDIRECTS}\u56DE\u3092\u8D85\u3048\u307E\u3057\u305F\u3002\u8EE2\u9001\u304C\u30EB\u30FC\u30D7\u3057\u3066\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002`,
      evidence: items,
      recommendations: ["CDN\u306ESSL\u8A2D\u5B9A\uFF08\u4F8B: Cloudflare\u306E Flexible \u3068\u30AA\u30EA\u30B8\u30F3\u5074\u306EHTTPS\u8EE2\u9001\u306E\u7D44\u307F\u5408\u308F\u305B\uFF09\u3084\u3001\u30DB\u30B9\u30C6\u30A3\u30F3\u30B0\u5074\u306E\u8EE2\u9001\u8A2D\u5B9A\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"],
      limitations
    });
  }
  if (httpServes || first?.response.ok && !redirectsToHttps) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `https://${host}/ \u306F\u5FDC\u7B54\u3057\u307E\u3059\u304C\u3001http:// \u3067\u306E\u30A2\u30AF\u30BB\u30B9\u304CHTTPS\u3078\u8EE2\u9001\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002`,
      evidence: items,
      recommendations: ["HTTP\u306E\u30A2\u30AF\u30BB\u30B9\u3092HTTPS\u3078301\u3067\u8EE2\u9001\u3059\u308B\u8A2D\u5B9A\u3092\u6709\u52B9\u306B\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u591A\u304F\u306E\u30DB\u30B9\u30C6\u30A3\u30F3\u30B0\u30FBCDN\u306B\u8A2D\u5B9A\u9805\u76EE\u304C\u3042\u308A\u307E\u3059\uFF09\u3002"],
      limitations
    });
  }
  const serverError = web.https.status >= 500;
  return result({
    id,
    title,
    status: serverError ? "review" : "pass",
    severity: serverError ? "medium" : "info",
    summary: `https://${host}/ \u306F ${web.https.status} \u3092\u8FD4\u3057\u3001${first?.response.ok ? "http:// \u304B\u3089\u306FHTTPS\u3078\u8EE2\u9001\u3055\u308C\u307E\u3059" : "http:// \u306F\u5FDC\u7B54\u3057\u307E\u305B\u3093\uFF08HTTPS\u306E\u307F\uFF09"}\u3002`,
    evidence: items,
    recommendations: serverError ? ["\u30B5\u30FC\u30D0\u30FC\u30A8\u30E9\u30FC\u304C\u8FD4\u3063\u3066\u3044\u307E\u3059\u3002\u4E00\u6642\u7684\u306A\u969C\u5BB3\u3067\u306A\u3044\u304B\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"] : [],
    limitations
  });
}
function checkCertificate(context, web) {
  const { host } = context;
  const id = "web.certificate";
  const title = "TLS\u8A3C\u660E\u66F8";
  const cert = web.certificate;
  if (!cert.ok) {
    if (cert.failure === "dns" || cert.failure === "blocked-address") {
      return result({ id, title, status: "not_checked", summary: "HTTPS\u3067\u63A5\u7D9A\u3067\u304D\u308B\u72B6\u614B\u3067\u306A\u3044\u305F\u3081\u3001\u8A3C\u660E\u66F8\u306F\u78BA\u8A8D\u3057\u3066\u3044\u307E\u305B\u3093\u3002", evidence: [evidence(context, `TLS ${host}:443`, cert.message)] });
    }
    return result({ id, title, status: "error", summary: `TLS\u63A5\u7D9A\u306B\u5931\u6557\u3057\u307E\u3057\u305F\uFF08${cert.failure}\uFF09\u3002`, evidence: [evidence(context, `TLS ${host}:443`, cert.message)] });
  }
  const daysLeft = Math.floor((Date.parse(cert.validTo) - context.now().getTime()) / DAY);
  const items = [
    evidence(context, `TLS ${host}:443`, `\u767A\u884C\u8005: ${cert.issuer} / \u6709\u52B9\u671F\u9650: ${cert.validTo}\uFF08\u6B8B\u308A${daysLeft}\u65E5\uFF09 / SAN: ${cert.subjectAltNames.join(", ")} / ${cert.protocol}`),
    evidence(context, `TLS ${host}:443`, `\u691C\u8A3C: ${cert.authorized ? "\u6210\u529F" : `\u5931\u6557 (${cert.authorizationError})`}`)
  ];
  const limitations = ["\u70B9\u691C\u3057\u305F\u7AEF\u672B\u306E\u4FE1\u983C\u30B9\u30C8\u30A2\u3067\u691C\u8A3C\u3057\u3066\u3044\u307E\u3059\u3002\u5BFE\u5FDC\u3057\u3066\u3044\u308B\u6700\u4F4ETLS\u30D0\u30FC\u30B8\u30E7\u30F3\u306F\u78BA\u8A8D\u3057\u3066\u3044\u307E\u305B\u3093\u3002"];
  if (!cert.authorized) {
    const code = cert.authorizationError ?? "";
    const reason = /EXPIRED/.test(code) ? "\u8A3C\u660E\u66F8\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u3066\u3044\u307E\u3059" : /SELF_SIGNED/.test(code) ? "\u81EA\u5DF1\u7F72\u540D\u306E\u8A3C\u660E\u66F8\u3067\u3059" : /ALTNAME|HOSTNAME|IP_ADDRESS/.test(code) ? `\u8A3C\u660E\u66F8\u304C ${host} \u306B\u5BFE\u3057\u3066\u767A\u884C\u3055\u308C\u3066\u3044\u307E\u305B\u3093\uFF08\u540D\u524D\u306E\u4E0D\u4E00\u81F4\uFF09` : /UNABLE_TO_GET_ISSUER|UNABLE_TO_VERIFY_LEAF/.test(code) ? "\u4E2D\u9593\u8A3C\u660E\u66F8\u304C\u4E0D\u8DB3\u3057\u3066\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059" : `\u8A3C\u660E\u66F8\u3092\u691C\u8A3C\u3067\u304D\u307E\u305B\u3093\uFF08${code}\uFF09`;
    return result({
      id,
      title,
      status: "finding",
      severity: "high",
      summary: `${reason}\u3002\u30D6\u30E9\u30A6\u30B6\u3067\u8B66\u544A\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002`,
      evidence: items,
      recommendations: ["\u30DB\u30B9\u30C6\u30A3\u30F3\u30B0\u3084CDN\u3067\u3001\u3053\u306E\u30DB\u30B9\u30C8\u540D\u306E\u8A3C\u660E\u66F8\u304C\u767A\u884C\u30FB\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u308B\u304B\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"],
      limitations
    });
  }
  if (daysLeft < 14) {
    return result({
      id,
      title,
      status: "finding",
      severity: "medium",
      summary: `\u8A3C\u660E\u66F8\u306E\u6709\u52B9\u671F\u9650\u307E\u3067\u6B8B\u308A${daysLeft}\u65E5\u3067\u3059\u3002`,
      evidence: items,
      recommendations: ["\u81EA\u52D5\u66F4\u65B0\u304C\u6B62\u307E\u3063\u3066\u3044\u306A\u3044\u304B\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\uFF08DNS\u3084CAA\u306E\u5909\u66F4\u3067\u66F4\u65B0\u306B\u5931\u6557\u3059\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059\uFF09\u3002"],
      limitations
    });
  }
  return result({
    id,
    title,
    status: "pass",
    severity: "info",
    summary: `\u8A3C\u660E\u66F8\u306F\u6709\u52B9\u3067\u3059\uFF08${cert.issuerOrganization}\u3001\u6B8B\u308A${daysLeft}\u65E5\uFF09\u3002`,
    evidence: items,
    limitations: [...limitations, "\u81EA\u52D5\u66F4\u65B0\u3055\u308C\u308B\u8A3C\u660E\u66F8\uFF08Let's Encrypt \u306A\u3069\uFF09\u306F\u3001\u6B8B\u308A\u65E5\u6570\u304C\u5C11\u306A\u304F\u898B\u3048\u3066\u3082\u901A\u5E38\u306F\u554F\u984C\u3042\u308A\u307E\u305B\u3093\u3002"]
  });
}
function parseHsts(value) {
  const parts = value.split(";").map((part) => part.trim().toLowerCase());
  const maxAge = parts.find((part) => part.startsWith("max-age="));
  const seconds = maxAge ? Number(maxAge.slice(8).replace(/"/g, "")) : void 0;
  return { maxAge: Number.isFinite(seconds) ? seconds : void 0, includeSubDomains: parts.includes("includesubdomains"), preload: parts.includes("preload") };
}
function checkHsts(context, web) {
  const { host } = context;
  const id = "web.hsts";
  const title = "HSTS";
  if (!web.https.ok) {
    return result({ id, title, status: "not_checked", summary: "HTTPS\u306E\u5FDC\u7B54\u304C\u5F97\u3089\u308C\u306A\u3044\u305F\u3081\u3001\u78BA\u8A8D\u3057\u3066\u3044\u307E\u305B\u3093\u3002" });
  }
  const value = web.https.headers["strict-transport-security"];
  const items = [evidence(context, `HTTPS GET https://${host}/ \u306E\u30D8\u30C3\u30C0\u30FC`, value ? `Strict-Transport-Security: ${value}` : "Strict-Transport-Security \u306A\u3057")];
  const limitations = ["HTTPS\u306E\u30C8\u30C3\u30D7\u30DA\u30FC\u30B8\u306E\u5FDC\u7B54\u3060\u3051\u3092\u898B\u3066\u3044\u307E\u3059\u3002CDN\u306E\u30BE\u30FC\u30F3\u8A2D\u5B9A\u3068\u30B5\u30A4\u30C8\u5074\u306E\u30D8\u30C3\u30C0\u30FC\u306E\u3069\u3061\u3089\u304C\u4ED8\u3051\u3066\u3044\u308B\u304B\u306F\u533A\u5225\u3057\u3066\u3044\u307E\u305B\u3093\u3002"];
  if (!value) {
    return result({
      id,
      title,
      status: "review",
      severity: "low",
      summary: "HSTS\u306F\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002",
      evidence: items,
      recommendations: [
        "\u3053\u306E\u30DB\u30B9\u30C8\u304CHTTPS\u3067\u5B89\u5B9A\u3057\u3066\u52D5\u3044\u3066\u3044\u308B\u306A\u3089\u3001HSTS\u3067\u300C\u5E38\u306BHTTPS\u3067\u63A5\u7D9A\u3059\u308B\u300D\u3088\u3046\u30D6\u30E9\u30A6\u30B6\u306B\u6307\u793A\u3067\u304D\u307E\u3059\u3002\u6700\u521D\u306F max-age=86400\uFF081\u65E5\uFF09\u306A\u3069\u77ED\u3044\u5024\u3067\u59CB\u3081\u3001\u554F\u984C\u304C\u306A\u3051\u308C\u3070\u5EF6\u3070\u3057\u3066\u304F\u3060\u3055\u3044\u3002includeSubDomains \u3068 preload \u306F\u3001\u5168\u30B5\u30D6\u30C9\u30E1\u30A4\u30F3\u304CHTTPS\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u308B\u3053\u3068\u3092\u78BA\u8A8D\u3057\u3066\u304B\u3089\u691C\u8A0E\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
      ],
      limitations
    });
  }
  const hsts = parseHsts(value);
  if (hsts.maxAge === void 0) {
    return result({ id, title, status: "finding", severity: "medium", summary: "HSTS\u306B\u6709\u52B9\u306A max-age \u304C\u3042\u308A\u307E\u305B\u3093\u3002\u30D6\u30E9\u30A6\u30B6\u306B\u7121\u8996\u3055\u308C\u307E\u3059\u3002", evidence: items, recommendations: ["max-age=86400 \u306E\u3088\u3046\u306B\u79D2\u6570\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002"], limitations });
  }
  if (hsts.maxAge === 0) {
    return result({ id, title, status: "review", severity: "low", summary: "HSTS\u306F max-age=0 \u3067\u3001\u30D6\u30E9\u30A6\u30B6\u306B\u8A18\u61B6\u3055\u308C\u305FHSTS\u3092\u89E3\u9664\u3059\u308B\u8A2D\u5B9A\u3067\u3059\u3002", evidence: items, limitations });
  }
  const notes = [];
  if (hsts.includeSubDomains) notes.push("includeSubDomains \u304C\u4ED8\u3044\u3066\u3044\u307E\u3059\u3002\u3059\u3079\u3066\u306E\u30B5\u30D6\u30C9\u30E1\u30A4\u30F3\u304CHTTPS\u3067\u5FDC\u7B54\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002");
  if (hsts.preload) notes.push("preload \u304C\u4ED8\u3044\u3066\u3044\u307E\u3059\u3002\u30D6\u30E9\u30A6\u30B6\u306B\u7D44\u307F\u8FBC\u307E\u308C\u308B\u3068\u3001\u53D6\u308A\u6D88\u3057\u306B\u6642\u9593\u304C\u304B\u304B\u308A\u307E\u3059\u3002");
  if (hsts.maxAge < 86400) notes.push("max-age \u304C1\u65E5\u672A\u6E80\u3067\u3059\u3002\u52D5\u4F5C\u78BA\u8A8D\u4E2D\u3067\u306A\u3051\u308C\u3070\u3001\u5EF6\u3070\u3059\u3053\u3068\u3092\u691C\u8A0E\u3067\u304D\u307E\u3059\u3002");
  return result({
    id,
    title,
    status: "pass",
    severity: "info",
    summary: `HSTS\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\uFF08max-age=${hsts.maxAge}${hsts.includeSubDomains ? "\u3001includeSubDomains" : ""}${hsts.preload ? "\u3001preload" : ""}\uFF09\u3002`,
    evidence: items,
    recommendations: notes,
    limitations
  });
}
function checkHeaders(context, web) {
  const { host } = context;
  const id = "web.headers";
  const title = "\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u95A2\u9023\u30D8\u30C3\u30C0\u30FC";
  if (!web.https.ok) {
    return result({ id, title, status: "not_checked", summary: "HTTPS\u306E\u5FDC\u7B54\u304C\u5F97\u3089\u308C\u306A\u3044\u305F\u3081\u3001\u78BA\u8A8D\u3057\u3066\u3044\u307E\u305B\u3093\u3002" });
  }
  const headers = web.https.headers;
  const watched = ["x-content-type-options", "content-security-policy", "x-frame-options", "referrer-policy", "permissions-policy", "server", "cf-ray"];
  const items = [evidence(context, `HTTPS GET https://${host}/ \u306E\u30D8\u30C3\u30C0\u30FC`, watched.map((name) => `${name}: ${headers[name] ?? "(\u306A\u3057)"}`).join(" / "))];
  const nosniff = headers["x-content-type-options"]?.toLowerCase().includes("nosniff");
  const limitations = [
    "\u30D8\u30C3\u30C0\u30FC\u306E\u6709\u7121\u3068\u5024\u3060\u3051\u3092\u898B\u3066\u3044\u307E\u3059\u3002CSP\u306A\u3069\u306E\u5185\u5BB9\u304C\u30B5\u30A4\u30C8\u306B\u9069\u5207\u304B\u306F\u3001\u30B5\u30A4\u30C8\u306E\u4F5C\u308A\u306B\u3088\u3063\u3066\u5909\u308F\u308B\u305F\u3081\u5224\u5B9A\u3057\u3066\u3044\u307E\u305B\u3093\u3002",
    "\u30C8\u30C3\u30D7\u30DA\u30FC\u30B8\u306E\u5FDC\u7B54\u3060\u3051\u3092\u898B\u3066\u3044\u307E\u3059\u3002"
  ];
  const notes = [];
  if (!headers["content-security-policy"]) notes.push("Content-Security-Policy \u306F\u3042\u308A\u307E\u305B\u3093\u3002\u5FC5\u9808\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u304C\u3001\u5916\u90E8\u30B9\u30AF\u30EA\u30D7\u30C8\u3092\u8AAD\u307F\u8FBC\u3080\u30B5\u30A4\u30C8\u3067\u306F\u3001\u8AAD\u307F\u8FBC\u307F\u5143\u3092\u9650\u5B9A\u3059\u308B\u624B\u6BB5\u3068\u3057\u3066\u691C\u8A0E\u3067\u304D\u307E\u3059\u3002");
  if (!nosniff) {
    return result({
      id,
      title,
      status: "review",
      severity: "low",
      summary: "X-Content-Type-Options: nosniff \u304C\u3042\u308A\u307E\u305B\u3093\u3002",
      evidence: items,
      recommendations: ["X-Content-Type-Options: nosniff \u3092\u4ED8\u3051\u308B\u3068\u3001\u30D6\u30E9\u30A6\u30B6\u304C\u30D5\u30A1\u30A4\u30EB\u306E\u7A2E\u985E\u3092\u63A8\u6E2C\u3057\u3066\u5B9F\u884C\u3059\u308B\u3053\u3068\u3092\u9632\u3052\u307E\u3059\u3002\u591A\u304F\u306E\u30B5\u30A4\u30C8\u3067\u526F\u4F5C\u7528\u306A\u304F\u4ED8\u3051\u3089\u308C\u307E\u3059\u3002", ...notes],
      limitations
    });
  }
  return result({
    id,
    title,
    status: "pass",
    severity: "info",
    summary: "X-Content-Type-Options: nosniff \u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059\u3002",
    evidence: items,
    recommendations: notes,
    limitations
  });
}

// src/types.ts
var SCHEMA_VERSION = "0.1.0";

// src/run.ts
var VERSION = "0.1.0";
async function safely(id, title, run) {
  try {
    return await run();
  } catch (error) {
    return { id, title, status: "error", summary: `\u5185\u90E8\u30A8\u30E9\u30FC: ${error.message}`, evidence: [], recommendations: [], limitations: [] };
  }
}
async function scanHost(host, options) {
  const context = {
    host,
    organizationalDomain: organizationalDomain(host),
    mailUsage: options.mailUsage,
    dkimSelectors: options.dkimSelectors,
    dns: options.dns,
    web: options.web,
    now: options.now ?? (() => /* @__PURE__ */ new Date())
  };
  const [mail, web] = await Promise.all([observeMail(context), observeWeb(context)]);
  const checks = await Promise.all([
    safely("dns.address", "\u540D\u524D\u89E3\u6C7A", () => checkAddress(context)),
    safely("dns.dangling-cname", "CNAME\u306E\u53C2\u7167\u5148", () => checkDanglingCname(context)),
    safely("dns.ns", "\u30CD\u30FC\u30E0\u30B5\u30FC\u30D0\u30FC", () => checkNameServers(context)),
    safely("dns.caa", "CAA", () => checkCaa(context, web.certificate)),
    safely("dns.dnssec", "DNSSEC", () => checkDnssec(context)),
    safely("web.https", "HTTPS", () => checkHttps(context, web)),
    safely("web.certificate", "TLS\u8A3C\u660E\u66F8", () => checkCertificate(context, web)),
    safely("web.hsts", "HSTS", () => checkHsts(context, web)),
    safely("web.headers", "\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u95A2\u9023\u30D8\u30C3\u30C0\u30FC", () => checkHeaders(context, web)),
    safely("mail.context", "\u30E1\u30FC\u30EB\u306E\u7528\u9014", () => checkMailContext(context, mail)),
    safely("mail.mx", "MX", () => checkMx(context, mail)),
    safely("mail.spf", "SPF", () => checkSpf(context, mail)),
    safely("mail.dmarc", "DMARC", () => checkDmarc(context, mail)),
    safely("mail.dkim", "DKIM", () => checkDkim(context, mail))
  ]);
  return { host, organizationalDomain: context.organizationalDomain, checks };
}
async function scan(options) {
  const now = options.now ?? (() => /* @__PURE__ */ new Date());
  const startedAt = now().toISOString();
  const targets = [];
  for (const host of options.hosts) targets.push(await scanHost(host, { ...options, now }));
  return {
    schemaVersion: SCHEMA_VERSION,
    tool: { name: "domain-preflight", version: VERSION },
    mode: "public",
    startedAt,
    finishedAt: now().toISOString(),
    input: { hosts: options.hosts, mailUsage: options.mailUsage, dkimSelectors: options.dkimSelectors, resolver: options.dns.source },
    targets
  };
}

// src/cli.ts
var HELP = `domain-preflight ${VERSION} \u2014 DNS\u30FBHTTPS\u30FB\u30E1\u30FC\u30EB\u8A8D\u8A3C\u306E\u8AAD\u307F\u53D6\u308A\u5C02\u7528\u70B9\u691C

\u4F7F\u3044\u65B9:
  domain-preflight check <host> [<host>...] [\u30AA\u30D7\u30B7\u30E7\u30F3]

\u30AA\u30D7\u30B7\u30E7\u30F3:
  --mail <usage>          \u30E1\u30FC\u30EB\u306E\u7528\u9014: ${MAIL_USAGES.join(" | ")}\uFF08\u65E2\u5B9A unknown\uFF09
  --dkim-selector <s>     \u78BA\u8A8D\u3059\u308BDKIM\u30BB\u30EC\u30AF\u30BF\uFF08\u8907\u6570\u6307\u5B9A\u53EF\uFF09
  --format <f>            text | json | markdown\uFF08\u65E2\u5B9A text\uFF09
  --output <file>         \u30D5\u30A1\u30A4\u30EB\u306B\u66F8\u304D\u51FA\u3059\uFF08\u65E2\u5B58\u30D5\u30A1\u30A4\u30EB\u306F --force \u304C\u306A\u3044\u3068\u4E0A\u66F8\u304D\u3057\u306A\u3044\uFF09
  --force                 --output \u306E\u4E0A\u66F8\u304D\u3092\u8A31\u53EF
  --resolver <ip>         DNS\u306E\u554F\u3044\u5408\u308F\u305B\u5148\uFF08\u4F8B 1.1.1.1\u3002\u65E2\u5B9A\u306F\u30B7\u30B9\u30C6\u30E0\u306E\u30EA\u30BE\u30EB\u30D0\uFF09
  --fail-on <severity>    high | medium | low \u306E\u6240\u898B\u304C\u3042\u308C\u3070\u7D42\u4E86\u30B3\u30FC\u30C9 1\uFF08CI \u7528\uFF09
  -h, --help              \u3053\u306E\u30D8\u30EB\u30D7
  -v, --version           \u30D0\u30FC\u30B8\u30E7\u30F3

\u7D42\u4E86\u30B3\u30FC\u30C9: 0 \u5B8C\u4E86 / 1 --fail-on \u306B\u8A72\u5F53 / 2 \u5165\u529B\u304C\u4E0D\u6B63 / 3 \u4E88\u671F\u3057\u306A\u3044\u30A8\u30E9\u30FC
\u3053\u306E\u30C4\u30FC\u30EB\u306F\u8A2D\u5B9A\u3092\u5909\u66F4\u3057\u307E\u305B\u3093\u3002\u70B9\u691C\u306F\u81EA\u5206\u304C\u7BA1\u7406\u3059\u308B\u3001\u307E\u305F\u306F\u8A31\u53EF\u3092\u5F97\u305F\u30B5\u30A4\u30C8\u306B\u5BFE\u3057\u3066\u884C\u3063\u3066\u304F\u3060\u3055\u3044\u3002
`;
var SEVERITIES = ["high", "medium", "low"];
var MIN_NODE_MAJOR = 24;
async function main(argv) {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < MIN_NODE_MAJOR) throw new InputError(`Node.js ${MIN_NODE_MAJOR} \u4EE5\u4E0A\u304C\u5FC5\u8981\u3067\u3059\uFF08\u73FE\u5728 ${process.versions.node}\uFF09\u3002docs/SETUP.md \u3092\u53C2\u7167\u3057\u3066\u304F\u3060\u3055\u3044`);
  const { values, positionals } = (0, import_node_util.parseArgs)({
    args: argv,
    allowPositionals: true,
    options: {
      mail: { type: "string" },
      "dkim-selector": { type: "string", multiple: true },
      format: { type: "string", default: "text" },
      output: { type: "string" },
      force: { type: "boolean", default: false },
      resolver: { type: "string", multiple: true },
      "fail-on": { type: "string" },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false }
    }
  });
  if (values.version) {
    process.stdout.write(`${VERSION}
`);
    return 0;
  }
  const [command, ...rawHosts] = positionals;
  if (values.help || command === void 0) {
    process.stdout.write(HELP);
    return values.help ? 0 : 2;
  }
  if (command !== "check") throw new InputError(`\u4E0D\u660E\u306A\u30B3\u30DE\u30F3\u30C9 "${command}" \u3067\u3059\u3002check \u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044`);
  if (rawHosts.length === 0) throw new InputError("\u70B9\u691C\u3059\u308B\u30DB\u30B9\u30C8\u540D\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u4F8B: domain-preflight check example.com\uFF09");
  if (rawHosts.length > 20) throw new InputError("\u4E00\u5EA6\u306B\u6307\u5B9A\u3067\u304D\u308B\u30DB\u30B9\u30C8\u306F20\u4EF6\u307E\u3067\u3067\u3059");
  const hosts = [...new Set(rawHosts.map(normalizeHost))];
  const mailUsage = parseMailUsage(values.mail);
  const dkimSelectors = [...new Set((values["dkim-selector"] ?? []).map(normalizeSelector))];
  const format = values.format;
  if (format !== "text" && format !== "json" && format !== "markdown") throw new InputError("--format \u306F text / json / markdown \u306E\u3044\u305A\u308C\u304B\u3067\u3059");
  const failOn = values["fail-on"];
  if (failOn !== void 0 && !SEVERITIES.includes(failOn)) throw new InputError("--fail-on \u306F high / medium / low \u306E\u3044\u305A\u308C\u304B\u3067\u3059");
  const resolvers = values.resolver ?? [];
  for (const resolver of resolvers) if (!(0, import_node_net3.isIP)(resolver)) throw new InputError(`--resolver "${resolver}" \u306FIP\u30A2\u30C9\u30EC\u30B9\u3067\u306F\u3042\u308A\u307E\u305B\u3093`);
  if (values.output && (0, import_node_fs.existsSync)(values.output) && !values.force) throw new InputError(`${values.output} \u306F\u65E2\u306B\u5B58\u5728\u3057\u307E\u3059\u3002\u4E0A\u66F8\u304D\u3059\u308B\u306B\u306F --force \u3092\u4ED8\u3051\u3066\u304F\u3060\u3055\u3044`);
  const report = await scan({ hosts, mailUsage, dkimSelectors, dns: new NodeDnsClient(resolvers), web: new NodeWebClient() });
  const rendered = format === "json" ? toJson(report) : format === "markdown" ? toMarkdown(report) : toText(report);
  if (values.output) {
    (0, import_node_fs.writeFileSync)(values.output, rendered);
    process.stderr.write(`${values.output} \u306B\u66F8\u304D\u51FA\u3057\u307E\u3057\u305F\u3002
`);
  } else {
    process.stdout.write(rendered);
  }
  return failOn && meetsSeverity(worstFinding(report), failOn) ? 1 : 0;
}
main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (error) => {
    if (error instanceof InputError || error.code?.startsWith("ERR_PARSE_ARGS")) {
      process.stderr.write(`\u30A8\u30E9\u30FC: ${error.message}
`);
      process.exit(2);
    }
    process.stderr.write(`\u4E88\u671F\u3057\u306A\u3044\u30A8\u30E9\u30FC: ${error.message}
`);
    process.exit(3);
  }
);
