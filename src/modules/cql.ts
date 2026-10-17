export interface FilterField {
    name: string;
    type: string;
    localType?: string;
    nillable?: boolean;
}

export interface Condition {
    field: string;
    operator: string;
    value1: string;
    value2: string;
    logic?: 'AND' | 'OR';
}

export const isGeometryField = (field: FilterField): boolean => {
    const name = (field.name || '').toLowerCase();
    const type = (field.type || '').toLowerCase();
    const localType = (field.localType || '').toLowerCase();
    if (
        name === 'the_geom' ||
        name === 'geom' ||
        name === 'geometry' ||
        name === 'shape' ||
        name === 'wkb_geometry'
    ) {
        return true;
    }
    if (
        type.includes('gml:') ||
        type.includes('geometrypropertytype') ||
        type.includes('geometry')
    ) {
        return true;
    }
    if (localType.includes('geometry')) {
        return true;
    }
    return false;
};

export const getFieldType = (
    field: FilterField
): 'text' | 'number' | 'date' | 'datetime' | 'boolean' => {
    const type = (field.type || field.localType || '').toLowerCase();
    if (type.includes('date') && type.includes('time')) return 'datetime';
    if (type.includes('date')) return 'date';
    if (
        type.includes('int') ||
        type.includes('long') ||
        type.includes('short') ||
        type.includes('decimal') ||
        type.includes('double') ||
        type.includes('float') ||
        type.includes('number')
    )
        return 'number';
    if (type.includes('boolean')) return 'boolean';
    return 'text';
};

export const getOperators = (fieldType: string): string[] => {
    const base = ['=', '!=', 'IS NULL', 'IS NOT NULL'];
    if (fieldType === 'text')
        return ['=', '!=', 'LIKE', 'ILIKE', ...base.slice(2)];
    if (
        fieldType === 'number' ||
        fieldType === 'date' ||
        fieldType === 'datetime'
    )
        return ['=', '!=', '>', '<', '>=', '<=', 'BETWEEN', ...base.slice(2)];
    if (fieldType === 'boolean') return ['=', '!=', ...base.slice(2)];
    return base;
};

export const escapeCqlString = (val: string): string => {
    return val.replace(/'/g, "''");
};

/**
 * `datetime-local` inputs can omit the seconds, ECQL documents the literal
 * with them, so they are filled in before writing the filter.
 */
const withSeconds = (value: string): string =>
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? `${value}:00` : value;

const buildTerm = (cond: Condition, fields: FilterField[]): string | null => {
    if (!cond.field) return null;
    const field = fields.find((f) => f.name === cond.field);
    const type = field ? getFieldType(field) : 'text';
    const op = cond.operator;

    if (op === 'IS NULL' || op === 'IS NOT NULL') {
        return `${cond.field} ${op}`;
    }
    if (op === 'BETWEEN') {
        if (!cond.value1 || !cond.value2) return null;
        if (type === 'number') {
            return `${cond.field} BETWEEN ${cond.value1} AND ${cond.value2}`;
        }
        if (type === 'date' || type === 'datetime') {
            const v1 =
                type === 'datetime' ? withSeconds(cond.value1) : cond.value1;
            const v2 =
                type === 'datetime' ? withSeconds(cond.value2) : cond.value2;
            return `${cond.field} BETWEEN '${v1}' AND '${v2}'`;
        }
        return `${cond.field} BETWEEN '${escapeCqlString(cond.value1)}' AND '${escapeCqlString(cond.value2)}'`;
    }
    if (op === 'LIKE' || op === 'ILIKE') {
        if (!cond.value1) return null;
        // The modal searches by contains, a pattern written by hand keeps
        // its own wildcards
        const pattern = cond.value1.includes('%')
            ? cond.value1
            : `%${cond.value1}%`;
        return `${cond.field} ${op} '${escapeCqlString(pattern)}'`;
    }
    if (type === 'number') {
        return `${cond.field} ${op} ${cond.value1}`;
    }
    if (type === 'boolean') {
        return `${cond.field} ${op} ${cond.value1.toLowerCase()}`;
    }
    if (type === 'date') {
        return `${cond.field} ${op} '${cond.value1}'`;
    }
    if (type === 'datetime') {
        return `${cond.field} ${op} '${withSeconds(cond.value1)}'`;
    }
    return `${cond.field} ${op} '${escapeCqlString(cond.value1)}'`;
};

/**
 * Serializes the conditions of the modal into a CQL filter.
 * Each condition joins the previous one with its own `logic` connector,
 * the first condition never carries one.
 *
 * @returns The CQL string or `null` when there is nothing to filter
 * @public
 */
export const buildCql = (
    conditions: Condition[],
    fields: FilterField[]
): string | null => {
    const texts: string[] = [];
    const logics: string[] = [];

    for (const cond of conditions) {
        const text = buildTerm(cond, fields);
        if (text) {
            texts.push(text);
            logics.push(cond.logic === 'OR' ? 'OR' : 'AND');
        }
    }

    if (texts.length === 0) return null;

    let cql = texts[0];
    for (let i = 1; i < texts.length; i++) {
        cql += ` ${logics[i]} ${texts[i]}`;
    }
    return cql;
};

const isIdentChar = (ch: string): boolean => /[A-Za-z0-9_.$]/.test(ch);

const isWordStart = (s: string, i: number): boolean =>
    isIdentChar(s[i]) && (i === 0 || !isIdentChar(s[i - 1]));

const readQuotedEnd = (s: string, start: number): number => {
    let i = start + 1;
    while (i < s.length) {
        if (s[i] === "'") {
            if (s[i + 1] === "'") {
                i += 2;
                continue;
            }
            return i;
        }
        i++;
    }
    return -1;
};

const readValue = (s: string): { raw: string; rest: string } | null => {
    const t = s.replace(/^\s+/, '');
    if (t.startsWith("'")) {
        const end = readQuotedEnd(t, 0);
        if (end < 0) return null;
        return { raw: t.slice(0, end + 1), rest: t.slice(end + 1) };
    }
    const m = /^\S+/.exec(t);
    if (!m) return null;
    return { raw: m[0], rest: t.slice(m[0].length) };
};

const unquote = (v: string): string =>
    v.length >= 2 && v.startsWith("'") && v.endsWith("'")
        ? v.slice(1, -1).replace(/''/g, "'")
        : v;

interface SplitResult {
    parts: string[];
    logics: ('AND' | 'OR')[];
}

/**
 * Splits a CQL filter on the `AND` / `OR` connectors of the top level,
 * keeping quotes and the `AND` used by `BETWEEN` out of the way.
 * Any parenthesis means the filter cannot be represented by the modal.
 */
const splitTopLevel = (s: string): SplitResult | null => {
    const parts: string[] = [];
    const logics: ('AND' | 'OR')[] = [];
    let buf = '';
    let between = 0;
    let i = 0;

    while (i < s.length) {
        const ch = s[i];

        if (ch === "'") {
            const end = readQuotedEnd(s, i);
            if (end < 0) return null;
            buf += s.slice(i, end + 1);
            i = end + 1;
            continue;
        }

        if (ch === '(') {
            return null;
        }

        if (isWordStart(s, i)) {
            let j = i;
            while (j < s.length && isIdentChar(s[j])) j++;
            const word = s.slice(i, j);
            const up = word.toUpperCase();

            if (up === 'AND' || up === 'OR') {
                if (between > 0) {
                    between--;
                    buf += word;
                    i = j;
                    continue;
                }
                parts.push(buf);
                logics.push(up);
                buf = '';
                i = j;
                continue;
            }
            if (up === 'BETWEEN') between++;
            buf += word;
            i = j;
            continue;
        }

        buf += ch;
        i++;
    }

    parts.push(buf);
    return { parts, logics };
};

const normalizeValue = (raw: string, type: string): string | null => {
    let v = unquote(raw);

    if (type === 'datetime') {
        const idx = v.indexOf(' ');
        if (idx >= 0) v = v.slice(0, idx) + 'T' + v.slice(idx + 1);
    }
    if (type === 'boolean') v = v.toLowerCase();
    if (type === 'number') {
        if (v === '' || isNaN(Number(v))) return null;
    }
    if (type !== 'text' && v === '') return null;

    return v;
};

const resolveField = (
    name: string,
    fields: FilterField[]
): { field: FilterField; type: string } | null => {
    const field = fields.find((f) => f.name === name);
    if (!field || isGeometryField(field)) return null;
    return { field, type: getFieldType(field) };
};

const makeCondition = (
    name: string,
    operator: string,
    value1: string,
    value2: string,
    fields: FilterField[]
): Condition | null => {
    const resolved = resolveField(name, fields);
    if (!resolved) return null;
    if (!getOperators(resolved.type).includes(operator)) return null;
    return { field: name, operator, value1, value2 };
};

const parseTerm = (term: string, fields: FilterField[]): Condition | null => {
    const s = term.trim();
    if (!s) return null;

    // field LIKE 'pattern' | field ILIKE 'pattern'
    const like =
        /^([A-Za-z_][A-Za-z0-9_.$]*)\s+(LIKE|ILIKE)\s+([\s\S]+)$/i.exec(s);
    if (like) {
        const value = readValue(like[3]);
        if (!value || value.rest.trim() !== '') return null;

        // The wildcards are kept as they were written
        const pattern = unquote(value.raw);
        if (!pattern) return null;

        return makeCondition(
            like[1],
            like[2].toUpperCase(),
            pattern,
            '',
            fields
        );
    }

    // field IS [NOT] NULL
    const isNull = /^([A-Za-z_][A-Za-z0-9_.$]*)\s+IS\s+(NOT\s+)?NULL$/i.exec(s);
    if (isNull) {
        return makeCondition(
            isNull[1],
            isNull[2] ? 'IS NOT NULL' : 'IS NULL',
            '',
            '',
            fields
        );
    }

    // field BETWEEN value1 AND value2
    const between = /^([A-Za-z_][A-Za-z0-9_.$]*)\s+BETWEEN\s+([\s\S]+)$/i.exec(
        s
    );
    if (between) {
        const name = between[1];
        const resolved = resolveField(name, fields);
        if (!resolved) return null;

        const first = readValue(between[2]);
        if (!first) return null;
        const afterFirst = first.rest.replace(/^\s+/, '');
        const andMatch = /^AND\s+([\s\S]+)$/i.exec(afterFirst);
        if (!andMatch) return null;
        const second = readValue(andMatch[1]);
        if (!second || second.rest.trim() !== '') return null;

        const v1 = normalizeValue(first.raw, resolved.type);
        const v2 = normalizeValue(second.raw, resolved.type);
        if (v1 === null || v2 === null) return null;

        return makeCondition(name, 'BETWEEN', v1, v2, fields);
    }

    // field <operator> value
    const cmp =
        /^([A-Za-z_][A-Za-z0-9_.$]*)\s*(<>|!=|>=|<=|=|>|<)\s*([\s\S]+)$/.exec(
            s
        );
    if (!cmp) return null;

    const name = cmp[1];
    const operator = cmp[2] === '<>' ? '!=' : cmp[2];
    const resolved = resolveField(name, fields);
    if (!resolved) return null;

    const value1 = normalizeValue(cmp[3].trim(), resolved.type);
    if (value1 === null) return null;

    return makeCondition(name, operator, value1, '', fields);
};

/**
 * Reads a CQL filter back into the conditions used by the modal.
 * Handles the subset the modal generates plus any hand written filter built
 * with `= != <> < > <= >= BETWEEN LIKE ILIKE IS NULL IS NOT NULL` joined by
 * `AND` / `OR` connectors, without parentheses.
 *
 * @returns The conditions or `null` when the filter cannot be represented
 * @public
 */
export const parseCql = (
    cql: string,
    fields: FilterField[]
): Condition[] | null => {
    const raw = (cql || '').trim();
    if (!raw) return null;

    const split = splitTopLevel(raw);
    if (!split) return null;

    const conditions: Condition[] = [];
    for (let i = 0; i < split.parts.length; i++) {
        const cond = parseTerm(split.parts[i], fields);
        if (!cond) return null;
        if (i > 0) cond.logic = split.logics[i - 1];
        conditions.push(cond);
    }

    return conditions.length > 0 ? conditions : null;
};
