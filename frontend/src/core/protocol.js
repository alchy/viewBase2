export const PROTOCOL_VERSION = 1;

/** `sid` = session id z localStorage (viz core/session.js). Server ho buď
 *  potvrdí, nebo (neznámé/vypršelé) přidělí nové a pošle v `init`. */
export function hello(sid = null) {
  return sid ? { type: 'hello', protocol: PROTOCOL_VERSION, sid }
    : { type: 'hello', protocol: PROTOCOL_VERSION };
}

export function encode(message) {
  return JSON.stringify(message);
}

export function decode(raw) {
  const message = JSON.parse(raw);
  if (!message || typeof message !== 'object' || !message.type) {
    throw new Error('Neplatná zpráva protokolu');
  }
  return message;
}
