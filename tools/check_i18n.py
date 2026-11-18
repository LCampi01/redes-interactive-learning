# Revisa las traducciones de una o varias lecciones.
#   python -I tools/check_i18n.py <leccion-id> [<leccion-id> ...]      (sin argumentos: todas)
# Compara i18n/es/<id>.json (original) con i18n/en/<id>.json (traducción): misma cantidad de textos,
# mismas etiquetas HTML, mismos saltos de línea, y avisa si una etiqueta corta quedó mucho más larga.
import io, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAG = re.compile(r'</?[a-zA-Z][^>]*>')
SPANISH = re.compile(r'\b(que|los|las|una|del|para|está|están|cada|entre|pero|también|más|cuando|porque|según|así|hacia|desde|sólo|solo)\b', re.I)


def load(path):
    return json.loads(io.open(path, encoding='utf-8').read())


def check(lid):
    errs, warns = [], []
    pe, pn = os.path.join(ROOT, 'i18n', 'es', lid + '.json'), os.path.join(ROOT, 'i18n', 'en', lid + '.json')
    if not os.path.exists(pe):
        return ['no existe i18n/es/%s.json' % lid], []
    if not os.path.exists(pn):
        return ['falta i18n/en/%s.json' % lid], []
    es = load(pe)
    try:
        en = load(pn)
    except Exception as e:
        return ['JSON inválido en i18n/en/%s.json: %s' % (lid, e)], []
    if not isinstance(en, list) or len(en) != len(es):
        return ['tiene %s textos y el original %d (deben coincidir uno a uno, en el mismo orden)' % (len(en) if isinstance(en, list) else '?', len(es))], []
    for i, (a, b) in enumerate(zip(es, en)):
        where = '[%d] %s' % (i, json.dumps(a[:60], ensure_ascii=False))
        if not isinstance(b, str) or not b.strip():
            errs.append(where + ' → traducción vacía o no es texto')
            continue
        if TAG.findall(a) != TAG.findall(b):
            errs.append(where + ' → las etiquetas HTML no coinciden con el original')
        if a.count('\n') != b.count('\n'):
            errs.append(where + ' → distinta cantidad de saltos de línea (\\n)')
        if len(SPANISH.findall(b)) >= 2:
            warns.append(where + ' → parece seguir en español: ' + json.dumps(b[:70], ensure_ascii=False))
        if '<' not in a and len(a) <= 30 and len(b) > len(a) + max(4, int(len(a) * .3)):
            warns.append(where + ' → etiqueta más larga que el original (%d → %d): %s' % (len(a), len(b), json.dumps(b, ensure_ascii=False)))
    return errs, warns


def main():
    ids = sys.argv[1:] or sorted(f[:-5] for f in os.listdir(os.path.join(ROOT, 'i18n', 'es')) if f.endswith('.json'))
    bad = 0
    out = []
    for lid in ids:
        errs, warns = check(lid)
        bad += 1 if errs else 0
        out.append('%s %s  (%d errores, %d avisos)' % ('ERROR ' if errs else 'OK    ', lid, len(errs), len(warns)))
        out += ['    ERROR ' + e for e in errs] + ['    aviso ' + w for w in warns]
    out.append('')
    out.append('RESULTADO: ' + ('%d lecciones con errores' % bad if bad else 'sin errores'))
    sys.stdout.buffer.write('\n'.join(out).encode('utf-8'))
    sys.exit(1 if bad else 0)


main()
