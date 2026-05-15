/**
 * .NET / ba'zi serverlar JSON ni ba'zan PascalCase kalitlar bilan yuboradi.
 * `GET /auth/me` javobini ikkala uslubdan ham o‘qish.
 */
export function readMeField(
  me: object,
  camel: string,
  pascal: string,
): unknown {
  const r = me as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(r, camel) && r[camel] !== undefined) {
    return r[camel];
  }
  if (Object.prototype.hasOwnProperty.call(r, pascal) && r[pascal] !== undefined) {
    return r[pascal];
  }
  return undefined;
}

export function readMeBool(me: object, camel: string, pascal: string): boolean {
  const v = readMeField(me, camel, pascal);
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v.toLowerCase() === 'true';
  if (typeof v === 'number') return v !== 0;
  return false;
}
